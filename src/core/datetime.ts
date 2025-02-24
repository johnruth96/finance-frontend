import { parseInt } from 'lodash'


export const formatDate = (value: string | Date) => {
    const date_obj = new Date(value)
    return date_obj.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}
