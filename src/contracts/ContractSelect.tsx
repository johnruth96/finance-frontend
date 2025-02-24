import {
    createModelSelect,
    ModelSelect,
} from '../core/forms/createModelSelect'

import {Contract} from "../app/types";

export const ContractSelect = createModelSelect<Contract>(
    'Contract',
    ModelSelect,
)
