from sqlalchemy import Column, String, Boolean, UUID, func, or_, ForeignKey, Index, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship, joinedload, foreign
from models.base_model import BaseModel
import uuid
from typings.account import AccountOutput
from typings.chat import ChatInput
from models.user import UserModel
from exceptions import ChatNotFoundException

class ChatModel(BaseModel):
    """
    Model representing a chat message.

    Attributes:
        parent_id: The ID of the human message which AI message answers to.
    """

    __tablename__ = 'chat'

    id = Column(UUID, primary_key=True, index=True, default=uuid.uuid4)    
    session_id = Column(String, nullable=False, index=True)
    name = Column(String)
    agent_id = Column(UUID, ForeignKey('agent.id', ondelete='CASCADE'), index=True)
    team_id = Column(UUID, ForeignKey('team.id', ondelete='CASCADE'), index=True)
    user_id = Column(UUID,  ForeignKey('user.id', ondelete='CASCADE'), nullable=True, index=True)
    account_id = Column(UUID, ForeignKey('account.id', ondelete='CASCADE'), nullable=False, index=True)
    max_chat_messages = Column(Integer, nullable=True)
    
    
    agent = relationship("AgentModel", back_populates="chat")
    team = relationship("TeamModel", back_populates="chat")
    configs = relationship("ConfigModel", lazy='select')
    chat_messages = relationship("ChatMessage", back_populates="chat", lazy='select')
        
    created_by = Column(UUID, ForeignKey('user.id', name='fk_created_by', ondelete='CASCADE'), nullable=True, index=True)
    modified_by = Column(UUID, ForeignKey('user.id', name='fk_modified_by', ondelete='CASCADE'), nullable=True, index=True)
    creator = relationship("UserModel", foreign_keys=[user_id], lazy='select')

    @classmethod
    def get_chat_by_id(cls, db, chat_id: UUID, account: AccountOutput):
        """
            Get Chat message from chat_id

            Args:
                session: The database session.
                chat_id(UUID) : Unique identifier of an Chat message.

            Returns:
                Chat message: Chat message object is returned.
        """
        return (
            db.session.query(ChatModel)
            .filter(ChatModel.id == chat_id, ChatModel.account_id == account.id)
            .first()
        )
    
    @classmethod
    def create_chat(cls, db, chat: ChatInput, user, account):
        """
        Creates a new agent with the provided configuration.

        Args:
            db: The database object.
            agent_with_config: The object containing the agent and configuration details.

        Returns:
            Agent: The created agent.

        """
        db_chat = ChatModel(
                         created_by=user.id, 
                         account_id=account.id,
                         )
        cls.update_model_from_input(db_chat, chat)
        db.session.add(db_chat)
        db.session.flush()  # Flush pending changes to generate the agent's ID
        db.session.commit()

        return db_chat
    
    @classmethod
    def update_model_from_input(cls, chat_model: 'ChatModel', chat_input: ChatInput):
        for field in ChatInput.__annotations__.keys():
            if hasattr(chat_input, field):
                setattr(chat_model, field, getattr(chat_input, field))
    
    @classmethod
    def get_chats(cls, db, account):
        return (
            db.session.query(ChatModel)
            .join(UserModel, ChatModel.created_by == UserModel.id)
            .filter(
                ChatModel.account_id == account.id,
                or_(
                    or_(
                        ChatModel.is_deleted == False, ChatModel.is_deleted is None
                    ),
                    ChatModel.is_deleted is None,
                ),
            )
            .options(joinedload(ChatModel.creator))
            .all()
        )
    
    @classmethod
    def delete_by_id(cls, db, agent_id, account):
        db_agent = db.session.query(ChatModel).filter(ChatModel.id == agent_id, ChatModel.account_id==account.id).first()

        if not db_agent or db_agent.is_deleted:
            raise ChatNotFoundException("Agent not found")

        db_agent.is_deleted = True
        db.session.commit()
    
    def to_dict(self):
        """
        Converts the current SQLAlchemy ORM object to a dictionary representation.

        Returns:
            A dictionary mapping column names to their corresponding values.
        """
        data = {column.name: getattr(self, column.name) for column in self.__table__.columns}

        if self.agent:
            data['agent'] = self.agent.to_dict()

        if self.team:
            data['team'] = self.team.to_dict()

        if self.parent:
            data['parent'] = self.parent.to_dict()

        if self.creator:
            data['creator'] = self.creator.to_dict()

        return data