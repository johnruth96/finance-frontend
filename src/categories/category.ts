import {Category} from "../app/types";

export const getCategorySubTree = (category: Category, categories: Category[]) => {
    const children = categories.filter(c => c.parent === category.id)
    let nodes = [category]
    children.forEach(child => {
        nodes = [...nodes, ...getCategorySubTree(child, categories)]
    })
    return nodes
}

export const getCategoryOptions = (categories: Category[]) => {
    const groups: Array<{ items: Category[], label: string }> = []
    const mainCategories = categories.filter((obj) => obj.parent === null)

    mainCategories.forEach((root) => {
        const subTree = getCategorySubTree(root, categories)
        groups.push({
            label: root.name,
            items: subTree.slice(1),
        })
    })

    return groups
}