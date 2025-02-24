import {Category} from "../app/types";

export const getCategorySubTree = (category: Category, categories: Category[]) => {
    const children = categories.filter(c => c.parent === category.id)
    let nodes = [category]
    children.forEach(child => {
        nodes = [...nodes, ...getCategorySubTree(child, categories)]
    })
    return nodes
}