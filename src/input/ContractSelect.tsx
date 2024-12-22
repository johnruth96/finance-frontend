import {
    createModelSelect,
    ModelSelect,
} from '../common/forms/createModelSelect'
import { Contract } from '../finance/app/types'

export const ContractSelect = createModelSelect<Contract>(
    'Contract',
    ModelSelect,
)
