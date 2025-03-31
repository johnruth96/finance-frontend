import {GridRenderCellParams} from '@mui/x-data-grid/models/params/gridCellParams'
import React from 'react'
import {AmountDisplay} from "../core/AmountDisplay";

export const AmountCell = ({value}: GridRenderCellParams) => {
    return <AmountDisplay value={value}/>
}
