import {CategorySelect} from '../categories/CategorySelect'
import {AmountInput} from '../core/forms/AmountInput'
import {PaymentCycleInput} from './PaymentCycleInput'
import React, {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import {Checkbox, FormControlLabel, TextField, ThemeProvider,} from '@mui/material'
import {theme} from '../index'
import {AccountSelect} from '../core/forms/AccountSelect'
import {DatePicker} from '@mui/x-date-pickers'
import {ProgressButton} from '../core/ProgressButton'
import {ApiError} from '../core/ApiError'
import {Contract} from "../app/types";

export interface ContractFormProps {
    onSubmit: (value: Partial<Contract>) => void
    initial?: Contract
    isError: boolean
    isLoading: boolean
    isSuccess: boolean
    error: any
    buttonCaption?: string
}

export const ContractForm = ({
                                 onSubmit,
                                 initial,
                                 isError,
                                 error,
                                 buttonCaption,
                                 ...queryState
                             }: ContractFormProps) => {
    const [account, setAccount] = useState('')
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [isActive, setIsActive] = useState(true)
    const [date, setDate] = useState(dayjs())
    const [cancellationPeriod, setCancellationPeriod] = useState('')
    const [minDuration, setMinDuration] = useState('')
    const [renewDuration, setRenewDuration] = useState('')
    const [amount, setAmount] = useState<number | ''>('')
    const [paymentCycle, setPaymentCycle] = useState('')
    const [paymentDate, setPaymentDate] = useState(dayjs())

    /*
     * Set initial value
     */
    useEffect(() => {
        if (initial) setInitial(initial)
    }, [initial])

    const setInitial = (initial: Contract) => {
        setAccount(initial.account.toString())
        setName(initial.name)
        setCategory(initial.category.toString())
        setIsActive(initial.is_active)
        setDate(dayjs(initial.date_start))
        setCancellationPeriod(initial.cancelation_period?.toString() ?? '')
        setMinDuration(initial.minimum_duration?.toString() ?? '')
        setRenewDuration(initial.renewal_duration?.toString() ?? '')
        setAmount(initial.amount)
        setPaymentCycle(initial.payment_cycle)
        setPaymentDate(dayjs(initial.payment_date))
    }

    const onSubmitClick = () => {
        const payload = {
            account: account === '' ? null : parseInt(account),
            name: name,
            category: category === '' ? null : parseInt(category),
            is_active: isActive,
            date_start: date.format('DD.MM.YYYY'),
            cancelation_period:
                cancellationPeriod === '' ? null : parseInt(cancellationPeriod),
            minimum_duration: minDuration === '' ? null : parseInt(minDuration),
            renewal_duration:
                renewDuration === '' ? null : parseInt(renewDuration),
            amount: amount === '' ? null : amount,
            payment_cycle: paymentCycle,
            payment_date: paymentDate.format('DD.MM.YYYY'),
        }
        onSubmit(payload)
    }

    return (
        <ThemeProvider theme={theme}>
            {isError && <ApiError error={error}/>}

            <AccountSelect
                value={account}
                onChange={setAccount}
                required={true}
                label={"Konto"}
            />

            <TextField
                label={'Name'}
                value={name}
                onChange={(evt) => setName(evt.target.value)}
            />

            <CategorySelect
                value={category}
                onChange={setCategory}
                disableMain={true}
                label={'Kategorie'}
                required
            />

            <FormControlLabel
                control={<Checkbox checked={isActive}/>}
                onChange={(_, checked) => setIsActive(checked)}
                label={'Aktiv'}
            />

            <DatePicker label="Start" onChange={setDate} value={date}/>

            <TextField
                label={'Kündigungsfrist (Monate)'}
                value={cancellationPeriod}
                onChange={(evt) => setCancellationPeriod(evt.target.value)}
            />

            <TextField
                label={'Mindestvertragslaufzeit (Monate)'}
                value={minDuration}
                onChange={(evt) => setMinDuration(evt.target.value)}
            />

            <TextField
                label={'Verlängerungszeitraum (Monate)'}
                value={renewDuration}
                onChange={(evt) => setRenewDuration(evt.target.value)}
            />

            <AmountInput
                value={amount}
                onChange={setAmount}
                label={'Betrag'}
                required
            />

            <PaymentCycleInput
                label={'Turnus'}
                value={paymentCycle}
                onChange={setPaymentCycle}
            />

            <DatePicker
                label="Abbuchungstag"
                onChange={setPaymentDate}
                value={paymentDate}
            />

            <ProgressButton
                isError={isError}
                {...queryState}
                onClick={onSubmitClick}
            >
                {buttonCaption ? buttonCaption : 'Speichern'}
            </ProgressButton>
        </ThemeProvider>
    )
}
