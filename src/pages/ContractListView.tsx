import React from 'react'
import { Page } from '../common/shared/Page'
import {
    connectListView,
    ListViewComponent,
} from '../common/framework/ListView'
import { Contract } from '../finance/app/types'
import { filter, round, sortBy, sumBy } from 'lodash'
import { CategoryCircle } from '../CategoryCircle'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material'
import red from '@mui/material/colors/red'
import WarningIcon from '@mui/icons-material/Warning'
import dayjs from 'dayjs'
import { ContractGrid } from '../views/ContractGrid'
import { GridFilterModel } from '@mui/x-data-grid'

const ContractAutoRenewalListItem = ({ object }: { object: Contract }) => {
    const navigate = useNavigate()

    const onClick = () => navigate(`/contracts/${object.id}/`)

    const cancelation_date = dayjs(object.next_cancelation_date).format(
        'DD.MM.YY',
    )

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={onClick}>
                <ListItemIcon>
                    <CategoryCircle id={object.category} />
                </ListItemIcon>
                <ListItemText
                    primary={object.name}
                    secondary={`Kündigung bis ${cancelation_date}`}
                />
            </ListItemButton>
        </ListItem>
    )
}

const ContractListView = ({ objects }: ListViewComponent<Contract>) => {
    const activeContracts = filter(objects, 'is_active')

    const contractsExpense = sortBy(
        filter(activeContracts, (c) => c.amount < 0),
        'name',
    )
    const contractsExpendingShortly = filter(
        contractsExpense,
        'is_cancelation_shortly',
    )

    const expensePerMonth = Math.abs(
        round(sumBy(contractsExpense, 'amount_per_year') / 12.0),
    )

    const initialFilterModel: GridFilterModel = {
        items: [
            {
                field: 'is_active',
                operator: 'is',
                value: true,
            },
        ],
    }

    return (
        <Page title={'Verträge'} addUrl={`add/`}>
            <Box sx={{ mb: 5 }}>
                <p className={'display-3 mb-0'}>{expensePerMonth} €</p>
                <p className={'text-small'}>&empty; monatliche Ausgaben</p>
            </Box>

            {contractsExpendingShortly.length > 0 && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant={'h6'}>
                        <WarningIcon sx={{ color: red[500] }} /> Verlängerungen
                    </Typography>
                    <List>
                        {contractsExpendingShortly.map((contract) => (
                            <ContractAutoRenewalListItem
                                key={contract.id}
                                object={contract}
                            />
                        ))}
                    </List>
                </Box>
            )}

            <ContractGrid filterModel={initialFilterModel} />
        </Page>
    )
}

export default connectListView(ContractListView, {
    model: 'Contract',
})
