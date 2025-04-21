import {GridFilterModel} from "@mui/x-data-grid";
import {
    getGridBooleanOperators,
    getGridDateOperators,
    getGridNumericOperators,
    getGridSingleSelectOperators,
    getGridStringOperators,
    GridPaginationModel,
    GridSortModel
} from "@mui/x-data-grid-premium";

export interface DataGridFilter {
    paginationModel: GridPaginationModel,
    filterModel?: string, // JSON string (because Redux can't serialize GridFilterModel)
    sortModel?: GridSortModel,
}

const parseFilterModel = (filterModel: GridFilterModel) => {
    const searchParams = new URLSearchParams()

    filterModel.items
        .filter(item => item.value !== undefined)
        .forEach(item => {
            let value = item.value

            // Parse date to YYYY-MM-DD
            const dateMatch = item.value.toString().match(/\d{4}-\d{2}-\d{2}/)
            if (dateMatch !== null) {
                value = dateMatch[0]
            }

            switch (item.operator) {
                case "equals":
                case "is":
                case "=":
                    searchParams.append(item.field, value)
                    break
                case "contains":
                    searchParams.append(`${item.field}__icontains`, value)
                    break
                case "startsWith":
                    searchParams.append(`${item.field}__istartswith`, value)
                    break
                case "endsWith":
                    searchParams.append(`${item.field}__iendswith`, value)
                    break
                case "after":
                case ">":
                    searchParams.append(`${item.field}__gt`, value)
                    break
                case "before":
                case "<":
                    searchParams.append(`${item.field}__lt`, value)
                    break
                case "onOrAfter":
                case ">=":
                    searchParams.append(`${item.field}__gte`, value)
                    break
                case "onOrBefore":
                case "<=":
                    searchParams.append(`${item.field}__lte`, value)
                    break
            }
        })

    // Quick filter
    if (Array.isArray(filterModel.quickFilterValues)) {
        searchParams.append("q", filterModel.quickFilterValues.join(" "))
    }

    console.log(filterModel, searchParams)

    return searchParams
}

const parseSortModel = (sortModel: GridSortModel) => {
    const searchParams = new URLSearchParams()

    sortModel.forEach(item => {
        const key = item.sort === "desc" ? "-" : ""
        searchParams.append("sortBy", `${key}${item.field}`)
    })

    return searchParams
}

const parsePaginationModel = (paginationModel: GridPaginationModel) => {
    const searchParams = new URLSearchParams()

    searchParams.set("page", (paginationModel.page + 1).toString())
    searchParams.set("pageSize", paginationModel.pageSize.toString())

    return searchParams
}

export const prepareSearchParams = (params: DataGridFilter) => {
    const filterModel: GridFilterModel = params.filterModel ? JSON.parse(params.filterModel) : {
        items: []
    }

    const pageParams = parsePaginationModel(params.paginationModel)
    const filterParams = parseFilterModel(filterModel)
    const sortParams = parseSortModel(params.sortModel ?? [])

    return new URLSearchParams([...pageParams, ...filterParams, ...sortParams])
}

export const getGridStringFilterOperators = () => {
    return getGridStringOperators().filter(op => [
        "contains",
        "equals",
        "startsWith",
        "endsWith",
    ].includes(op.value))
}

export const getGridNumericFilterOperators = () => {
    return getGridNumericOperators().filter(op => [
        "=",
        "<",
        "<=",
        ">",
        ">=",
    ].includes(op.value))
}

export const getGridBooleanFilterOperators = () => {
    return getGridBooleanOperators()
}

export const getGridDateFilterOperators = (showTime?: boolean) => {
    return getGridDateOperators(showTime).filter(op => [
        "is",
        "after",
        "onOrAfter",
        "before",
        "onOrBefore",
    ].includes(op.value))
}

export const getGridSingleSelectFilterOperators = () => {
    return getGridSingleSelectOperators().filter(op => op.value === "is")
}