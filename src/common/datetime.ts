import { parseInt } from 'lodash'

export const formatDateTime = (value: string | Date) => {
    const date_obj = new Date(value)
    return date_obj.toLocaleTimeString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export const formatDate = (value: string | Date) => {
    const date_obj = new Date(value)
    return date_obj.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

export const formatDateUS = (value: string | Date) => {
    const date_obj = new Date(value)
    const year = date_obj.getFullYear()
    const month = date_obj.getMonth() + 1
    const day = date_obj.getDate()
    return `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`
}

export const parseDate = (value: string): Date => {
    const [dayStr, monthStr, yearStr] = value.split('.')
    return new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr))
}

export const isDate = (date: any): date is Date => {
    if (!date.toString().includes('.') && !date.toString().includes('-'))
        return false

    return (
        new Date(date).toString() !== 'Invalid Date' && !isNaN(new Date(date))
    )
}
