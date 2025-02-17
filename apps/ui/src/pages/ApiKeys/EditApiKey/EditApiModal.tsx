import React, { useEffect, useState } from 'react'

import withRenderModal from 'hocs/withRenderModal'
import Modal from '@l3-lib/ui-core/dist/Modal'
import ModalFooter from '@l3-lib/ui-core/dist/ModalFooter'
import ModalContent from '@l3-lib/ui-core/dist/ModalContent'
import Tags from '@l3-lib/ui-core/dist/Tags'
import { useTranslation } from 'react-i18next'

import { FormikProvider } from 'formik'
import useEditApiKey from './useEditApiKey'

// import Button from 'oldComponents/atoms/Button'
import Button from '@l3-lib/ui-core/dist/Button'
import DropDown from '@l3-lib/ui-core/dist/Dropdown'
// import TextField from '@l3-lib/ui-core/dist/TextField'
// import TextArea from '@l3-lib/ui-core/dist/Textarea'
import Heading from '@l3-lib/ui-core/dist/Heading'
// import DatePickerField from 'oldComponents/atoms/DatePickerField'
import Typography from '@l3-lib/ui-core/dist/Typography'
import info from '../../../assets/images/info.png'
import FormikTextField from 'components/TextFieldFormik/TextFieldFormik'
import TextareaFormik from 'components/TextareaFormik'

import styled from 'styled-components'
import TypographySecondary from 'components/Typography/Secondary'

// import { StyledFormSection } from '../ApiKeysStyle'

type EditApiModalProps = {
  closeModal: () => void
  data: { id: string; refetchApiList: any }
  callback: (games: any[]) => void // <-- add this line
}
// type OptionRendererProps = {
//   label: string
//   text?: string
//   onDelete: (option: { label: string; value: string }) => void
// }

const EditApiModal = ({ closeModal, data, callback }: EditApiModalProps) => {
  const { t } = useTranslation()
  const { formik, gamesOptions } = useEditApiKey(data)
  const { setFieldValue } = formik

  const selectedGameIds = formik.initialValues.games
  const filteredGamesOptions = gamesOptions?.filter((game: { value: any }) =>
    selectedGameIds?.includes(game.value),
  )
  const [selectedOptions, setSelectedOptions] = useState(filteredGamesOptions)

  const onDropdownChange = (event: any) => {
    if (event === null) {
      setSelectedOptions([])
      // console.log('setSelectedOptions', setSelectedOptions([]))
      setFieldValue('games', [])
      // console.log("setFieldValue('games', [])", setFieldValue('games', []))
    } else {
      setSelectedOptions(event)
      const values = event?.map((option: any) => option.value)
      // console.log('values:::', values)
      setFieldValue('games', values)
    }
  }

  // console.log('selectedOptions', selectedOptions)
  useEffect(() => {
    const updatedSelectedOptions = gamesOptions?.filter((game: { value: any }) =>
      formik.values.games?.includes(game.value),
    )
    setSelectedOptions(updatedSelectedOptions)
  }, [formik.values.games, gamesOptions])

  // const onOptionRemove = (item: any) => {
  //   // console.error('onOptionRemove called with item', item)
  //   const newValues = selectedOptions?.filter(
  //     (option: any) => option.label !== item.label && option.value !== item.value,
  //   )
  //   setSelectedOptions(newValues)
  //   // console.log('newValues', newValues)
  //   const filteredNewValues = newValues?.map((option: any) => option.value)
  //   setFieldValue('games', filteredNewValues || [])
  //   // console.log('filteredNewValues', filteredNewValues)
  // }

  // const OptionRenderer = ({ label, text, onDelete }: OptionRendererProps) => {
  //   const handleDelete = () => {
  //     onDelete({ label, value: label })
  //   }

  //   return (
  //     <StyledNewCategory>
  //       {text && (
  //         <Typography
  //           value={text}
  //           type={Typography.types.LABEL}
  //           size={Typography.sizes.lg}
  //           customColor={'#FFF'}
  //         />
  //       )}
  //       <Tags
  //         key={label}
  //         label={label}
  //         readOnly
  //         outlined={true}
  //         color={Tags.colors.white}
  //         onDelete={handleDelete}
  //       />
  //     </StyledNewCategory>
  //   )
  // }

  return (
    <>
      <StyledRoot>
        <FormikProvider value={formik}>
          <StyledEditModal
            onClose={closeModal}
            show
            title={
              <StyledModalHeading
                type={Heading.types.h1}
                size={Heading.sizes.md}
                value='Edit API keys'
              />
            }
            backgroundColor='dark'
          >
            <ModalContent>
              <StyledCreateModalForm>
                <StyledNameTextWrapper>
                  <TypographySecondary
                    value='Name'
                    type={Typography.types.P}
                    size={Typography.sizes.md}
                  />
                </StyledNameTextWrapper>
                <FormikTextField field_name='name' />
                <StyledTextFieldDate>
                  <StyledExpirationTextWrapper>
                    <TypographySecondary
                      value='Expiration'
                      type={Typography.types.LABEL}
                      size={Typography.sizes.lg}
                    />
                  </StyledExpirationTextWrapper>
                  <FormikTextField type='date' field_name='expiration' />
                </StyledTextFieldDate>

                <StyledTextWrapper>
                  <TypographySecondary
                    value='Choose games'
                    type={Typography.types.LABEL}
                    size={Typography.sizes.lg}
                  />
                  <StyledImgWrapper>
                    <img src={info} alt='info' />
                  </StyledImgWrapper>
                </StyledTextWrapper>
                <DropDown
                  placeholder='Select'
                  multi
                  multiLine
                  options={gamesOptions}
                  onChange={onDropdownChange}
                  value={selectedOptions}
                  defaultValue={selectedOptions}
                  // onOptionRemove={onOptionRemove}
                  // optionRenderer={(props: any) => (
                  //   <OptionRenderer {...props} onDelete={onOptionRemove} />
                  // )}
                />
                <StyledTextWrapper>
                  <TypographySecondary
                    value='Note'
                    type={Typography.types.LABEL}
                    size={Typography.sizes.lg}
                  />
                </StyledTextWrapper>
                <StyledTextAreaWrapper>
                  <TextareaFormik
                    color='#FFFFFF'
                    field_name='note'
                    placeholder='An optional description of what this webhook endpoint is used for.'
                  />
                </StyledTextAreaWrapper>
              </StyledCreateModalForm>
            </ModalContent>
            <StyledModalFooter>
              <StyledActionsContainer>
                <Button
                  onClick={closeModal}
                  kind={Button.kinds.TERTIARY}
                  size={Button.sizes.MEDIUM}
                >
                  <StyledLabelTypography value='Cancel' type={Typography.types.P} />
                </Button>

                <Button
                  type={Button.types.SUBMIT}
                  onClick={formik.handleSubmit}
                  kind={Button.kinds.PRIMARY}
                  size={Button.sizes.MEDIUM}
                >
                  <StyledLabelTypography value='Update' type={Typography.types.P} />
                </Button>
              </StyledActionsContainer>
            </StyledModalFooter>
          </StyledEditModal>
        </FormikProvider>
      </StyledRoot>
    </>
  )
}

export default withRenderModal('edit-api-keys-modal')(EditApiModal)

export const StyledEditModal = styled(Modal)`
  width: 480px;
  height: 664px;
  margin-left: 0;
`
export const StyledEditModalHeading = styled(Heading)`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
`

export const StyledActionsContainer = styled.div`
  display: flex;
  position: relative;
  justify-items: flex-end;
  gap: 42px;
`

export const StyledCreateModal = styled(Modal)`
  width: 480px;
  height: 664px;
  margin-left: 0;
`
export const StyledCreateModalForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 24px;
  width: 100%;
  color: rgba(255, 255, 255, 0.8);
`
export const StyledTextFieldDate = styled.div`
  width: 199px;
  margin-top: 24px;
  color: rgba(255, 255, 255, 0.8);
`
export const StyledTextWrapper = styled.div`
  width: 296px;
  height: 24px;
  margin-top: 24px;
  margin-bottom: 10px;
`
export const StyledImgWrapper = styled.div`
  margin-top: -20px;
  margin-left: 125px;
`

export const StyledNameTextWrapper = styled.div`
  width: 296px;
  height: 24px;
  margin-bottom: 10px;
`
export const StyledExpirationTextWrapper = styled.div`
  width: 296px;
  height: 24px;
  margin-bottom: 10px;
`

export const StyledTextAreaWrapper = styled.div`
  height: 130px;
`

export const StyledModalFooter = styled(ModalFooter)`
  display: grid;
  position: relative;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  top: 40px;
`
export const StyledModalHeading = styled(Typography)`
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
`

export const StyledLabelTypography = styled(Typography)`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
`

export const StyledRoot = styled.div<{ leftSide?: boolean }>`
  margin-top: 30px;
  margin-bottom: 50px;

  ${({ leftSide }) =>
    !leftSide &&
    `
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  `};
`
