from __future__ import annotations

from typing import Union

import json
from langchain.agents import AgentOutputParser
from langchain.agents.conversational_chat.prompt import FORMAT_INSTRUCTIONS
from langchain.output_parsers.json import parse_json_markdown
from langchain.schema import AgentAction, AgentFinish, OutputParserException


# Define a class that parses output for conversational agents
class ConvoOutputParser(AgentOutputParser):
    """Output parser for the conversational agent."""

    def get_format_instructions(self) -> str:
        """Returns formatting instructions for the given output parser."""
        return FORMAT_INSTRUCTIONS

    def parse(self, text: str) -> Union[AgentAction, AgentFinish]:
        """Attempts to parse the given text into an AgentAction or AgentFinish.

        Raises:
             OutputParserException if parsing fails.
        """
        try:
            # Attempt to parse the text into a structured format (assumed to be JSON
            # stored as markdown)
            response = parse_json_markdown(text)

            if "action" not in response or "action_input" not in response:
                # If the necessary keys aren't present in the response, raise an
                # exception
                raise OutputParserException(
                    f"Missing 'action' or 'action_input' in LLM output: {text}"
                )
            action, action_input = response["action"], response["action_input"]

            if action == "Final Answer":
                return AgentFinish({"output": action_input}, text)
                    # Otherwise, return an AgentAction with the specified action and
                    # input

                    # if action input is list or dict then convert it to string to avoid Langchain's single parameter error
            if isinstance(action_input, (list, dict)):
                action_input = json.dumps(action_input)

            return AgentAction(action, action_input, text)
        except Exception as e:
            # If any other exception is raised during parsing, also raise an
            # OutputParserException
            raise OutputParserException(f"Could not parse LLM output: {text}") from e

    @property
    def _type(self) -> str:
        return "conversational_chat"
