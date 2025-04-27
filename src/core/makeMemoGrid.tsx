import React from 'react'
import {GridDensity, GridFilterModel, GridPaginationModel, GridSortModel} from "@mui/x-data-grid-premium";
import {GridCallbackDetails} from "@mui/x-data-grid/models/api";
import {GridColumnVisibilityModel} from "@mui/x-data-grid/hooks/features/columns/gridColumnsInterfaces";
import {DataGridPremiumProps} from "@mui/x-data-grid-premium/models/dataGridPremiumProps";

type InputProps = Pick<DataGridPremiumProps,
    "sortModel"
    | "filterModel"
    | "paginationModel"
    | "density"
    | "columnVisibilityModel"
    | "initialState">

type GridCallbacks = Pick<DataGridPremiumProps,
    'onFilterModelChange'
    | 'onPaginationModelChange'
    | 'onSortModelChange'
    | 'onColumnVisibilityModelChange'
    | 'onDensityChange'>

// TODO: Add rowSelectionModel
// TODO: Add detailPanelExpandedRowIds (https://mui.com/x/react-data-grid/master-detail/)

export function makeMemoGrid<T extends InputProps & GridCallbacks>(DataGridComponent: React.ComponentType<T>) {
    return React.forwardRef<any, Omit<T, keyof GridCallbacks>>((props, ref) => {
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
            if (props.sortModel) {
                return props.sortModel
            } else {
                return getModel("sortModel", props.initialState?.sorting?.sortModel)
            }
        }

        const getInitialFilterModel = () => {
            if (props.filterModel) {
                return props.filterModel
            } else {
                return getModel("filterModel", props.initialState?.filter?.filterModel)
            }
        }

        const getInitialPaginationModel = () => {
            if (props.paginationModel) {
                return props.paginationModel
            } else {
                return getModel("paginationModel", props.initialState?.pagination?.paginationModel)
            }
        }

        const getInitialColumnVisibilityModel = () => {
            if (props.columnVisibilityModel) {
                return props.columnVisibilityModel
            } else {
                return getModel("columnVisibilityModel", props.initialState?.columns?.columnVisibilityModel ?? {})
            }
        }

        const getInitialDensity = () => {
            if (props.density) {
                return props.density
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
            // @ts-ignore
            <DataGridComponent
                {...props}
                ref={ref}
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
            />
        )
    })
}
