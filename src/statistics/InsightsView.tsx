import React, {useMemo, useState} from 'react'
import {Page} from '../core/Page'
import dayjs from 'dayjs'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import {Grid} from '@mui/material'
import {DatePicker} from '@mui/x-date-pickers'
import StatisticsView from './StatisticsView/StatisticsView'

export const InsightsView = ({}) => {
    const [account, setAccount] = useState('all')
    const [dateStart, setDateStart] = useState(dayjs.utc().subtract(1, 'year'))
    const [dateEnd, setDateEnd] = useState(dayjs.utc())

    const searchParams = useMemo(
        () => ({
            date_start: dateStart.format('YYYY-MM-DD'),
            date_end: dateEnd.format('YYYY-MM-DD'),
        }),
        [dateStart, dateEnd],
    )

    const menu = [
        {
            label: 'Aktueller Monat',
            onClick: () => {
                setDateStart(dayjs.utc().startOf('month'))
                setDateEnd(dayjs.utc().endOf('month'))
            },
        },
        {
            label: 'Aktuelles Jahr',
            onClick: () => {
                setDateStart(dayjs.utc().startOf('year'))
                setDateEnd(dayjs.utc().endOf('year'))
            },
        },
        {
            label: 'Letzter Monat',
            onClick: () => {
                setDateStart(dayjs.utc().subtract(1, 'month').startOf('month'))
                setDateEnd(dayjs.utc().subtract(1, 'month').endOf('month'))
            },
        },
        {
            label: 'Letztes Jahr',
            onClick: () => {
                setDateStart(dayjs.utc().subtract(1, 'year').startOf('year'))
                setDateEnd(dayjs.utc().subtract(1, 'year').endOf('year'))
            },
        },
    ]

    return (
        <Page title={'Insights'} back menu={menu}>
            {/* Input */}
            <Grid container spacing={2} sx={{mb: 3}}>
                <Grid item xs={12} sm>
                    <TextField
                        label={'Konto'}
                        value={account}
                        onChange={(evt) => setAccount(evt.target.value)}
                        select
                        disabled
                    >
                        <MenuItem value={'all'}>Alle</MenuItem>
                        <MenuItem value={'default'}>Privat</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={6} sm>
                    <DatePicker
                        label={'Beginn'}
                        value={dateStart}
                        onChange={(value) => setDateStart(value)}
                    />
                </Grid>
                <Grid item xs={6} sm>
                    <DatePicker
                        label={'Ende'}
                        value={dateEnd}
                        onChange={(value) => setDateEnd(value)}
                    />
                </Grid>
            </Grid>

            <StatisticsView searchParams={searchParams}/>
        </Page>
    )
}
