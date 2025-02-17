import styled from 'styled-components'

import Typography from '@l3-lib/ui-core/dist/Typography'
import Doc from '@l3-lib/ui-core/dist/icons/Doc'
import IconButton from '@l3-lib/ui-core/dist/IconButton'
import Close from '@l3-lib/ui-core/dist/icons/Close'

type UploadedFileProps = {
  onClick: (id?: string) => void
  id?: string
  name: string
  hasDeleteIcon?: boolean
}

const UploadedFile = ({ id, name, onClick, hasDeleteIcon = false }: UploadedFileProps) => {
  return (
    <StyledUploadedFile onClick={() => onClick(id)}>
      <StyledIconWrapper>
        <Doc />
      </StyledIconWrapper>
      <StyledTextWrapper>
        <Typography
          value={name}
          type={Typography.types.LABEL}
          size={Typography.sizes.xss}
          customColor={'#000'}
        />
      </StyledTextWrapper>
      {hasDeleteIcon && (
        <IconButton
          size={IconButton.sizes.XS}
          icon={() => <Close />}
          kind={IconButton.kinds.TERTIARY}
          ariaLabel='Delete'
        />
      )}
    </StyledUploadedFile>
  )
}

export default UploadedFile

const StyledUploadedFile = styled.div`
  min-width: 120px;
  width: fit-content;
  height: 30px;
  background: #e6e6e6;
  border-radius: 8px;

  display: flex;
  align-items: center;
  cursor: pointer;
`

const StyledTextWrapper = styled.div`
  width: 100%;
  min-width: fit-content;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0px 5px;
`

const StyledIconWrapper = styled.div`
  background-color: #9b9b9b;
  color: #fff;
  height: 100%;
  min-width: 30px;
  width: 30px;

  border-radius: 8px 0px 0px 8px;

  display: flex;
  align-items: center;
  justify-content: center;
`
