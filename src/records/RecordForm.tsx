import React, {useEffect, useState} from 'react'
import {useGetContractsQuery} from '../app/api'
import {ContractSelect} from '../contracts/ContractSelect'
import {CategorySelect} from '../categories/CategorySelect'
import AmountInput from '../core/forms/AmountInput'
import SubjectInput from '../core/forms/SubjectInput'
import {DatePicker} from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import {ProgressButton} from '../core/ProgressButton'
import {Alert, TextField, ThemeProvider} from '@mui/material'
import {AccountSelect} from '../core/forms/AccountSelect'
import {theme} from '../index'
import {ApiError} from '../core/ApiError'
import {Contract, RecordType} from "../app/types";

export interface RecordFormProps {
    onSubmit: (value: Partial<RecordType>) => void
    initial?: RecordType
    isError: boolean
    isLoading: boolean
    isSuccess: boolean
    error: any
    buttonCaption?: string
}

export const RecordForm = ({
                               onSubmit,
                               initial,
                               buttonCaption,
                               isError,
                               error,
                               isSuccess,
                               isLoading,
                           }: RecordFormProps) => {
    const [amount, setAmount] = useState<number | ''>('')
    const [subject, setSubject] = useState('')
    const [date, setDate] = useState(dayjs())
    const [category, setCategory] = useState('')
    const [contract, setContract] = useState('')
    const [account, setAccount] = useState('')
    const [counterBooking, setCounterBooking] = useState('')

    const onSubjectChange = (
        value:
            | string
            | { subject: string; category: number; contract: number | null },
    ) => {
        if (typeof value === 'string') {
            setSubject(value)
        } else {
            setSubject(value.subject)
            setCategory(value.category.toString())
            setContract(value.contract ? value.contract.toString() : '')
        }
    }

    /*
     * Set category after selecting a contract
     */
    const {data: contracts} = useGetContractsQuery()
    useEffect(() => {
        const contractObj = contracts?.find(
            (obj: Contract) => obj.id === parseInt(contract),
        )
        if (contractObj) {
            setCategory(contractObj.category)
            if (subject === '') setSubject(contractObj.name)
            if (amount === '') {
                setAmount(contractObj.amount)
            }
        }
    }, [contracts, contract])

    /*
     * Set initial value
     */
    useEffect(() => {
        if (initial) setInitial(initial)
    }, [initial])

    const setInitial = (initial: RecordType) => {
        setAccount(initial.account.toString())
        setAmount(initial.amount)
        setSubject(initial.subject)
        setDate(dayjs(initial.date))
        setCategory(initial.category.toString())

        setContract(initial.contract?.toString() ?? '')
        setCounterBooking(initial.counter_booking?.toString() ?? '')
    }

    /*
     * Clear form after submission
     */
    useEffect(() => {
        if (isSuccess) {
            setAmount('')
            setSubject('')
            setCategory('')
            setContract('')
            setCounterBooking('')
        }
    }, [isSuccess])

    const onSubmitClick = () => {
        const payload = {
            amount: amount === '' ? null : amount,
            subject: subject.trim(),
            date: date.format('DD.MM.YYYY'),
            category: category === '' ? null : parseInt(category),
            contract: contract === '' ? null : parseInt(contract),
            account: account === '' ? null : parseInt(account),
            counter_booking:
                counterBooking === '' ? null : parseInt(counterBooking),
        }
        onSubmit(payload)
    }

    return (
        <ThemeProvider theme={theme}>
            {isError && <ApiError error={error}/>}

            {isSuccess && <Alert severity={"success"}>Buchung erfolgreich gespeichert.</Alert>}

            <AccountSelect value={account} onChange={setAccount}/>

            <AmountInput
                value={amount}
                onChange={setAmount}
                autoFocus
                isError={isError}
                error={error?.data?.amount}
                label={'Betrag'}
                required
            />

            <SubjectInput value={subject} onChange={onSubjectChange}/>

            <DatePicker label="Datum" onChange={setDate} value={date}/>

            <CategorySelect
                value={category}
                onChange={setCategory}
                isError={isError}
                error={error?.data?.category}
                disableMain={true}
                label={'Kategorie'}
                required
            />

            <ContractSelect
                value={contract}
                onChange={setContract}
                isError={isError}
                error={error?.data?.contract}
                allowEmpty={true}
                label={'Vertrag (optional)'}
            />

            <TextField
                label={'Gegenbuchung (optional)'}
                value={counterBooking}
                onChange={(evt) => setCounterBooking(evt.target.value)}
            />

            <ProgressButton
                error={isError}
                success={isSuccess}
                loading={isLoading}
                onClick={onSubmitClick}
            >
                {buttonCaption ? buttonCaption : 'Speichern'}
            </ProgressButton>
        </ThemeProvider>
    )
}
