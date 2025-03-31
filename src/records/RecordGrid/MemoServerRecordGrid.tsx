import React from 'react'
import {GridDensity, GridFilterModel, GridPaginationModel, GridSortModel} from "@mui/x-data-grid-premium";
import {GridCallbackDetails} from "@mui/x-data-grid/models/api";
import {ServerRecordGrid, ServerRecordGridProps} from "./ServerRecordGrid";
import {GridColumnVisibilityModel} from "@mui/x-data-grid/hooks/features/columns/gridColumnsInterfaces";


type MemoServerRecordGridProps = Omit<ServerRecordGridProps,
    'onFilterModelChange'
    | 'onPaginationModelChange'
    | 'onSortModelChange'
    | 'onColumnVisibilityModelChange'
    | 'onDensityChange'>

// TODO: Add rowSelectionModel
// TODO: Add detailPanelExpandedRowIds (https://mui.com/x/react-data-grid/master-detail/)

/**
 * MemoServerRecordGrid adds as storage layer to ServerRecordGrid.
 * DataGrid state is stored in the session storage.
 *
 * The component prioritizes each model value in the following way:
 * 1. The model provided in the props
 * 2. The model stored in the sessionStorage
 * 3. The value in initialState
 * 4. undefined
 */
export const MemoServerRecordGrid = ({
                                         sortModel,
                                         filterModel,
                                         paginationModel,
                                         density,
                                         columnVisibilityModel,
                                         ...props
                                     }: MemoServerRecordGridProps) => {
    /**
     * Get prefix for the sessionStorage to support this component on multiple pages.
     *
     * Caution: This allows only one MemoServerRecordGrid per page
     */
    const getPrefix = () => {
        return window.location.pathname
    }

    /**
     * Deserialize model from sessionStoge
     * @param key
     * @param defaultValue
     */
    const getModel = (key: string, defaultValue: any = null) => {
        const sessionKey = `${getPrefix()}_${key}`
        const model = sessionStorage.getItem(sessionKey)
        if (model === null) {
            return defaultValue
        } else {
            return JSON.parse(model)
        }
    }

    /**
     * Serialize model to sessionStore
     * @param key
     * @param value
     */
    const setModel = (key: string, value: any) => {
        const sessionKey = `${getPrefix()}_${key}`
        sessionStorage.setItem(sessionKey, JSON.stringify(value))
    }

    const getInitialSortModel = () => {
        if (sortModel) {
            return sortModel
        } else {
            return getModel("sortModel", props.initialState?.sorting?.sortModel)
        }
    }

    const getInitialFilterModel = () => {
        if (filterModel) {
            return filterModel
        } else {
            return getModel("filterModel", props.initialState?.filter?.filterModel)
        }
    }

    const getInitialPaginationModel = () => {
        if (paginationModel) {
            return paginationModel
        } else {
            return getModel("paginationModel", props.initialState?.pagination?.paginationModel)
        }
    }

    const getInitialColumnVisibilityModel = () => {
        if (columnVisibilityModel) {
            return columnVisibilityModel
        } else {
            return getModel("columnVisibilityModel", props.initialState?.columns?.columnVisibilityModel ?? {})
        }
    }

    const getInitialDensity = () => {
        if (density) {
            return density
        } else {
            return getModel("density", props.initialState?.density)
        }
    }

    const [finalFilterModel, setFilterModel] = React.useState<GridFilterModel | undefined>(getInitialFilterModel)
    const [finalPaginationModel, setFinalPaginationModel] = React.useState<GridPaginationModel | undefined>(getInitialPaginationModel)
    const [finalSortModel, setSortModel] = React.useState<GridSortModel | undefined>(getInitialSortModel)
    const [finalColumnVisibilityModel, setFinalColumnVisibilityModel] = React.useState<GridColumnVisibilityModel | undefined>(getInitialColumnVisibilityModel)
    const [finalDensity, setFinalDensity] = React.useState<GridDensity | undefined>(getInitialDensity)

    const onFilterModelChange = (model: GridFilterModel, _: GridCallbackDetails<'filter'>) => {
        setModel("filterModel", model)
        setFilterModel(model)
    }

    const onPaginationModelChange = (model: GridPaginationModel, _: GridCallbackDetails) => {
        setModel("paginationModel", model)
        setFinalPaginationModel(model)
    }

    const onSortModelChange = (model: GridSortModel, _: GridCallbackDetails) => {
        setModel("sortModel", model)
        setSortModel(model)
    }

    const onColumnVisibilityModelChange = (model: GridColumnVisibilityModel, _: GridCallbackDetails) => {
        setModel("columnVisibilityModel", model)
        setFinalColumnVisibilityModel(model)
    }

    const onDensityChange = (model: GridDensity) => {
        setModel("density", model)
        setFinalDensity(model)
    }

    /*
     * Render
     */
    return (
        <ServerRecordGrid
            filterModel={finalFilterModel}
            sortModel={finalSortModel}
            paginationModel={finalPaginationModel}
            columnVisibilityModel={finalColumnVisibilityModel}
            density={finalDensity}
            onFilterModelChange={onFilterModelChange}
            onPaginationModelChange={onPaginationModelChange}
            onSortModelChange={onSortModelChange}
            onColumnVisibilityModelChange={onColumnVisibilityModelChange}
            onDensityChange={onDensityChange}
            {...props}
        />
    )
}
