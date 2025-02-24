import {
    connectListView,
    ListViewComponent,
} from '../../core/framework/ListView'
import { filter } from 'lodash'
import { useCreateRecordMutation } from '../../app/api'
import { formatDate } from '../../core/datetime'
import { CategoryCircle } from '../../categories/CategoryCircle'
import React from 'react'
import {
    Box,
    Card,
    CardActions,
    CardContent,
    Grid,
    Typography,
} from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { ProgressButton } from '../../core/ProgressButton'
import { AmountDisplay } from '../../core/AmountDisplay'
import {Contract, RecordType} from "../../app/types";

const ContractCard = ({ object }: { object: Contract }) => {
    const [createRecord, { isLoading, isError, isSuccess }] =
        useCreateRecordMutation()

    const onCreateClick = () => {
        createRecord({
            subject: object.name,
            amount: object.amount,
            date: formatDate(object.next_payment_date),
            contract: object.id,
            category: object.category,
            account: object.account,
        })
            .unwrap()
            .catch((error) => {
                enqueueSnackbar(error, { variant: 'error' })
            })
    }

    return (
        <Card variant={'outlined'}>
            <CardContent sx={{ pb: 0 }}>
                <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                >
                    {dayjs(object.next_payment_date).format('DD.MM.')}
                </Typography>
                <Typography variant="h5" component="div">
                    <AmountDisplay value={object.amount} />
                </Typography>
                <Typography color="text.secondary">
                    <CategoryCircle id={object.category} /> {object.name}
                </Typography>
            </CardContent>
            <CardActions>
                <ProgressButton
                    onClick={onCreateClick}
                    size={'small'}
                    loading={isLoading}
                    success={isSuccess}
                    error={isError}
                >
                    Speichern
                </ProgressButton>
            </CardActions>
        </Card>
    )
}

interface ContractPaymentViewProps extends ListViewComponent<Contract> {
    records: RecordType[]
}

const ContractPaymentView = ({
    objects,
    records,
}: ContractPaymentViewProps) => {
    const activeContracts = filter(objects, 'is_active')
    const contractsNextPayment = filter(
        activeContracts,
        (c) => c.next_payment_date !== null,
    )
    const contractsNotPayed = filter(contractsNextPayment, (c) =>
        records.every((r) => r.contract !== c.id),
    )

    if (contractsNotPayed.length === 0) return null
    else {
        return (
            <Box sx={{ mb: 4 }}>
                <Typography variant={'h6'}>Nächste Zahlungen</Typography>

                <Grid container spacing={2}>
                    {contractsNotPayed.map((object) => (
                        <Grid item key={object.id} xs={12} sm={4}>
                            <ContractCard object={object} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        )
    }
}

export default connectListView(ContractPaymentView, { model: 'Contract' })
