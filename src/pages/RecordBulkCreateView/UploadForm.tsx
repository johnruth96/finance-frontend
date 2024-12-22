import React, { useState } from 'react'
import { PredictionResult, usePredictCategoriesMutation } from '../../finance/app/api'
import { RecordType } from '../../finance/app/types'
import { map, zip } from 'lodash'
import { Box } from '@mui/material'
import { BasicFormGroup } from '../../common/forms/FormGroup'
import { FormText, Input } from 'reactstrap'
import { ProgressButton } from '../../common/shared/ProgressButton'

interface UploadFormProps {
    onUpload: (records: RecordType[]) => void
}

export const UploadForm = ({ onUpload }: UploadFormProps) => {
    const [file, setFile] = useState<File | null>(null)

    const [predictCategories, predictionQueryState] =
        usePredictCategoriesMutation()

    const onUploadClick = () => {
        if (file && file.type === 'text/csv') {
            const fileReader = new FileReader()

            fileReader.onload = (evt) => {
                if (typeof evt.target?.result === 'string') {
                    const lines = evt.target.result.split('\n')
                    const records: RecordType[] = []

                    lines.forEach((line, index) => {
                        let [date, subject, amountStr] = line.split(';', 3)
                        const amount = parseFloat(amountStr.replace(',', '.'))

                        const entity: RecordType = {
                            id: index,
                            subject: subject.trim(),
                            category: null,
                            contract: null,
                            amount: amount,
                            date: new Date(date),
                        }

                        records.push(entity)
                    })

                    // Prediction
                    const subjects = map(records, 'subject')

                    predictCategories(subjects)
                        .unwrap()
                        .then((predictions: PredictionResult[]) => {
                            const enhancedRecords = zip(
                                records,
                                predictions,
                            ).map(([record, prediction]) => {
                                if (prediction) {
                                    return {
                                        ...record,
                                        ...prediction,
                                    } as RecordType
                                } else {
                                    return record as RecordType
                                }
                            })

                            onUpload(enhancedRecords)
                        })
                }
            }
            fileReader.readAsText(file)
        } else {
            alert('Datei ist anscheinend keine CSV-Datei.')
        }
    }

    return (
        <Box sx={{ mb: 3 }}>
            <BasicFormGroup label={'CSV'}>
                <Input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <FormText>
                    Die CSV muss drei Spalten haben: Datum (YYYY-MM-DD), Betreff
                    und Betrag (Dezimal)
                </FormText>
            </BasicFormGroup>

            <ProgressButton
                onClick={onUploadClick}
                loading={predictionQueryState.isLoading}
                error={predictionQueryState.isError}
                success={predictionQueryState.isSuccess}
                disabled={file === null}
            >
                Importieren
            </ProgressButton>
        </Box>
    )
}
