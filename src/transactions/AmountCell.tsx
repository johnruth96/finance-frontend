import {GridRenderCellParams} from '@mui/x-data-grid/models/params/gridCellParams'
import {Amount} from './Amount'
import React from 'react'

export const AmountCell = ({value}: GridRenderCellParams) => {
    return <Amount value={value}/>
}
