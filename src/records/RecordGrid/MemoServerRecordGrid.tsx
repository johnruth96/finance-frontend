import React from 'react'
import {GridDensity, GridFilterModel, GridPaginationModel, GridSortModel} from "@mui/x-data-grid-premium";
import {GridCallbackDetails} from "@mui/x-data-grid/models/api";
import {ServerRecordGrid, ServerRecordGridProps} from "./ServerRecordGrid";
import {GridColumnVisibilityModel} from "@mui/x-data-grid/hooks/features/columns/gridColumnsInterfaces";

const getFilterModel = (): GridFilterModel | undefined => {
    const model = sessionStorage.getItem("filterModel")
    if (model === null) {
        return undefined
    } else {
        return JSON.parse(model)
    }
}

const getPaginationModel = (): GridPaginationModel | undefined => {
    const model = sessionStorage.getItem("paginationModel")
    if (model === null) {
        return undefined
    } else {
        return JSON.parse(model)
    }
}

const getColumnVisibilityModel = (): GridColumnVisibilityModel | undefined => {
    const model = sessionStorage.getItem("columnVisibilityModel")
    if (model === null) {
        return undefined
    } else {
        return JSON.parse(model)
    }
}

const getDensity = (): GridDensity | undefined => {
    const model = sessionStorage.getItem("density")
    if (model === null) {
        return undefined
    } else {
        return model as GridDensity
    }
}

type MemoServerRecordGridProps = Omit<ServerRecordGridProps,
    'paginationModel'
    | 'filterModel'
    | 'columnVisibilityModel'
    | 'density'
    | 'onFilterModelChange'
    | 'onPaginationModelChange'
    | 'onSortModelChange'
    | 'onColumnVisibilityModelChange'
    | 'onDensityChange'>

// TODO: Add other models
// TODO: Make memo a property for opt-out
export const MemoServerRecordGrid = ({sortModel, ...props}: MemoServerRecordGridProps) => {
    const getInitialSortModel = () => {
        if (sortModel) {
            return sortModel
        } else {
            const model = sessionStorage.getItem("sortModel")
            if (model === null) {
                return props.initialState?.sorting?.sortModel
            } else {
                return JSON.parse(model)
            }
        }
    }

    const [filterModel, setFilterModel] = React.useState<GridFilterModel | undefined>(getFilterModel)
    const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel | undefined>(getPaginationModel)
    const [finalSortModel, setSortModel] = React.useState<GridSortModel | undefined>(getInitialSortModel)
    const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel | undefined>(getColumnVisibilityModel)
    const [density, setDensity] = React.useState<GridDensity | undefined>(getDensity)

    const onFilterModelChange = (model: GridFilterModel, _: GridCallbackDetails<'filter'>) => {
        sessionStorage.setItem("filterModel", JSON.stringify(model))
        setFilterModel(model)
    }

    const onPaginationModelChange = (model: GridPaginationModel, _: GridCallbackDetails) => {
        sessionStorage.setItem("paginationModel", JSON.stringify(model))
        setPaginationModel(model)
    }

    const onSortModelChange = (model: GridSortModel, _: GridCallbackDetails) => {
        sessionStorage.setItem("sortModel", JSON.stringify(model))
        setSortModel(model)
    }

    const onColumnVisibilityModelChange = (model: GridColumnVisibilityModel, _: GridCallbackDetails) => {
        sessionStorage.setItem("columnVisibilityModel", JSON.stringify(model))
        setColumnVisibilityModel(model)
    }

    const onDensityChange = (model: GridDensity) => {
        sessionStorage.setItem("density", model)
        setDensity(model)
    }

    /*
     * Render
     */
    return (
        <ServerRecordGrid
            filterModel={filterModel}
            paginationModel={paginationModel}
            sortModel={finalSortModel}
            columnVisibilityModel={columnVisibilityModel}
            density={density}
            onFilterModelChange={onFilterModelChange}
            onPaginationModelChange={onPaginationModelChange}
            onSortModelChange={onSortModelChange}
            onColumnVisibilityModelChange={onColumnVisibilityModelChange}
            onDensityChange={onDensityChange}
            {...props}
        />
    )
}
