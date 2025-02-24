import {Box, Button, Container, IconButton, Menu, MenuItem, SxProps, Typography,} from '@mui/material'
import React, {PropsWithChildren, ReactNode, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import {isString} from 'lodash'
import {baseApi} from '../app/api'
import {formatError} from './ApiError'

interface MenuItemType {
    icon?: React.ReactNode
    label?: React.ReactNode
    to?: string
    onClick?: () => void
}

interface PageProps extends PropsWithChildren {
    title?: ReactNode
    pageTitle?: string
    addUrl?: string
    updateUrl?: string
    back?: boolean
    menu?: MenuItemType[]
    deleteModel?: {
        model: string
        id: number
    }
    sx?: SxProps
}

const NavigationMenu = ({items}: { items: MenuItemType[] }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const navigate = useNavigate()

    return (
        <div>
            <IconButton size="small" onClick={handleMenu} color="primary">
                <MoreHorizIcon/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {items.map(({icon, label, to, onClick}) => {
                    const onItemClick = () =>
                        onClick ? onClick() : to ? navigate(to) : undefined
                    return (
                        <MenuItem onClick={onItemClick} key={label}>
                            {icon} {label}
                        </MenuItem>
                    )
                })}
            </Menu>
        </div>
    )
}

export const Page = ({
                         title = '',
                         pageTitle,
                         children,
                         addUrl,
                         updateUrl,
                         deleteModel,
                         back,
                         menu = [],
                         ...props
                     }: PageProps) => {
    const navigate = useNavigate()

    useEffect(() => {
        if (isString(title)) document.title = title
        else if (pageTitle) document.title = pageTitle
    }, [title, pageTitle])

    const items: MenuItemType[] = [...menu]
    /*
     Add Menu Item
     */
    if (addUrl) {
        items.push({
            icon: <AddCircleIcon/>,
            label: 'Hinzufügen',
            to: addUrl,
        })
    }

    /*
     Update Menu Item
     */
    if (updateUrl) {
        items.push({
            label: 'Bearbeiten',
            to: updateUrl,
        })
    }

    /*
     Delete Menu Item
     */
    if (deleteModel) {
        const deleteHookName = `useDelete${deleteModel.model}Mutation`
        const deleteHook = baseApi[deleteHookName]

        const [deleteModelTrigger] = deleteHook()

        items.push({
            label: 'Löschen',
            onClick: () => {
                if (
                    confirm(`${deleteModel.model} ${deleteModel.id} löschen?`)
                ) {
                    deleteModelTrigger(deleteModel.id)
                        .unwrap()
                        .then(() => {
                            navigate(-1)
                        })
                        .catch((error) => {
                            alert(formatError(error))
                        })
                }
            },
        })
    }

    let inlineNavigation
    if (items.length === 1) {
        const item = items[0]
        if (item.icon && !item.label) {
            inlineNavigation = (
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => (item.to ? navigate(item.to) : undefined)}
                >
                    {item.icon}
                </IconButton>
            )
        } else {
            inlineNavigation = (
                <Button
                    color="inherit"
                    onClick={() => (item.to ? navigate(item.to) : undefined)}
                >
                    {item.icon} {item.label}
                </Button>
            )
        }
    } else if (items.length > 1) {
        inlineNavigation = <NavigationMenu items={items}/>
    }

    return (
        <Box>
            <Box sx={{display: "flex", justifyContent: "space-between", mb:3}}>
                <Box>
                    {isString(title) ? (
                        <Typography variant="h2">{title}</Typography>
                    ) : (
                        title
                    )}
                </Box>

                {inlineNavigation}
            </Box>

            <Box {...props}>
                {children}
            </Box>
        </Box>
    )
}
