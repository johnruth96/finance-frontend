import {
    createModelSelect,
    ModelSelect,
} from '../common/forms/createModelSelect'

import {Contract} from "../app/types";

export const ContractSelect = createModelSelect<Contract>(
    'Contract',
    ModelSelect,
)
