import React from 'react'
import {Page} from '../../core/Page'
import {getPaymentCycleDisplay} from '../PaymentCycleInput'
import {AmountDisplay} from '../../core/AmountDisplay'
import {CategoryDisplayContainer} from '../../categories/CategoryDisplay'
import {ValueDisplay} from '../ValueDisplay'
import {Box, Typography} from '@mui/material'
import {GridFilterModel} from '@mui/x-data-grid'
import {Contract} from "../../app/types";
import {ServerRecordGrid} from "../../records/RecordGrid/ServerRecordGrid";
import {QueryProvider} from "../../core/QueryProvider";
import {useParams} from "react-router-dom";
import {useGetContractQuery} from "../../app/api";

interface ContractDetailViewProps {
    object: Contract
}

const ContractDetailView = ({object}: ContractDetailViewProps) => {
    const filterModel: GridFilterModel = {
        items: [
            {
                field: 'contract',
                operator: 'is',
                value: object.id,
            },
        ],
    }

    return (
        <Page
            title={object.name}
            back
            updateUrl={`update/`}
            deleteModel={{model: 'Contract', id: object.id}}
        >
            <Box sx={{mb: 3}}>
                <ValueDisplay label={'Name'} value={object.name}/>

                <ValueDisplay
                    label={'Status'}
                    value={object.is_active}
                    type={'boolean'}
                    yesLabel={'Aktiv'}
                    noLabel={'Inaktiv'}
                />

                <ValueDisplay label={'Kategorie'}>
                    <CategoryDisplayContainer id={object.category}/>
                </ValueDisplay>

                <ValueDisplay
                    label={'Vertragsbeginn'}
                    value={object.date_start}
                    type={'date'}
                />

                {object.minimum_duration !== null && (
                    <ValueDisplay
                        label={'Mindestlaufzeit'}
                        value={`${object.minimum_duration} Monate`}
                    />
                )}

                <ValueDisplay
                    label={'Kündigungsfrist'}
                    value={
                        object.cancelation_period !== null
                            ? `${object.cancelation_period} Monate`
                            : 'keine'
                    }
                />

                {object.next_extension_date !== null && (
                    <ValueDisplay
                        label={'Automatische Verlängerung'}
                        value={object.next_extension_date}
                        type={'date'}
                    />
                )}

                {object.next_cancelation_date !== null && (
                    <ValueDisplay
                        label={'Kündigung bis'}
                        value={object.next_cancelation_date}
                        type={'date'}
                    />
                )}
            </Box>

            <Box sx={{mb: 3}}>
                <Typography variant={'h6'}>Zahlung</Typography>

                <ValueDisplay
                    label={'Betrag'}
                    value={<AmountDisplay value={object.amount}/>}
                />

                <ValueDisplay
                    label={'Turnus'}
                    value={getPaymentCycleDisplay(object.payment_cycle)}
                />

                <ValueDisplay
                    label={'Datum'}
                    value={object.payment_date}
                    type={'date'}
                />
            </Box>

            <Box>
                <Typography variant={'h6'}>Buchungen</Typography>
                <ServerRecordGrid filterModel={filterModel}/>
            </Box>
        </Page>
    )
}

export default () => {
    const params = useParams()
    const {data, ...hookResult} = useGetContractQuery(params.id ? parseInt(params.id) : -1)

    return <QueryProvider {...hookResult}>
        <ContractDetailView object={data as Contract}/>
    </QueryProvider>
}
