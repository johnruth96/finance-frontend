import {Category, Contract, RecordType} from "../../app/types";
import dayjs from "dayjs";
import {Transaction} from "../types";

export interface RecordDraft extends Partial<Omit<RecordType, 'category' | 'contract'>> {
    category?: string | number | null
    contract?: string | number | null
}

export interface EqualsCondition {
    field: keyof Transaction
    operator: "equals"
    value: string | number | boolean
}

export interface ContainsCondition {
    field: keyof Transaction
    operator: "icontains"
    value: string
}

export interface StartsWithCondition {
    field: keyof Transaction
    operator: "startsWith"
    value: string
}

export type Condition = EqualsCondition | StartsWithCondition | ContainsCondition

export interface TransformRule {
    conditions: Condition[]
    action: RecordDraft | ((transaction: Transaction) => RecordDraft)
}

const matchTransaction = (transaction: Transaction, rule: TransformRule) => {
    return rule.conditions.every(cond => {
        if (cond.operator === "equals") {
            return transaction[cond.field] === cond.value
        } else if (cond.operator === "startsWith") {
            const value = transaction[cond.field]
            return typeof value === "string" ? value.startsWith(cond.value) : false
        } else {
            const value = transaction[cond.field]
            return typeof value === "string" ? value.toLowerCase().includes(cond.value.toLowerCase()) : false
        }
    })
}

const applyRule = (rule: TransformRule, transaction: Transaction): RecordDraft => {
    if (typeof rule.action === "function") {
        return rule.action(transaction)
    } else {
        return rule.action
    }
}

export class RecordFactory {
    private categories: Category[] = [];
    private contracts: Contract[] = [];
    private rules: TransformRule[] = [];

    prepareRecord(transaction: Transaction): RecordDraft {
        const subjectCandidates = [transaction.creditor, transaction.purpose, transaction.transaction_type, "<empty>"]
        const subject = subjectCandidates.find(s => s !== "") as string
        const date = dayjs(transaction.value_date).format("YYYY-MM-DD")

        return {
            subject: subject,
            date: date,
            amount: transaction.amount,
            account: 1, // FIXME
            transactions: [transaction.id],
            category: null,
            contract: null,
            counter_booking: null,
        }
    }

    createRecord(transaction: Transaction): Omit<RecordType, "id"> {
        const record = this.prepareRecord(transaction)
        console.debug("Prepare record:", record)

        for (const rule of this.rules) {
            if (matchTransaction(transaction, rule)) {
                const draft = applyRule(rule, transaction)
                console.debug("Rule match:", rule)
                console.debug("Draft:", draft)

                for (const [attribute, value] of Object.entries(draft)) {
                    if (attribute === "category") {
                        if (typeof value === "string") {
                            record.category = this.getCategoryId(value)
                        } else {
                            record.category = value
                        }

                    } else if (attribute === "contract") {
                        if (typeof value === "string") {
                            record.contract = this.getContractId(value)
                        } else {
                            record.contract = value
                        }
                    } else {
                        // @ts-ignore
                        record[attribute] = value
                    }
                }
            }
        }

        return record as RecordType
    }

    setRules(rules: TransformRule[]) {
        this.rules = rules
    }

    setCategories(categories: Category[]) {
        this.categories = categories
    }

    setContracts(contracts: Contract[]) {
        this.contracts = contracts
    }

    private getCategoryId(name: string): number | null {
        const id = this.categories.find((cat) => cat.name === name)?.id
        if (id === undefined) {
            console.error(`No category with name '${name}' found.`)
            console.debug("Available categories:", this.categories)
            return null
        } else {
            return id
        }
    }

    private getContractId(name: string): number | null {
        const id = this.contracts.find((cat) => cat.name === name)?.id
        if (id === undefined) {
            console.error(`No contract with name '${name}' found.`)
            console.debug("Available contracts:", this.contracts)
            return null
        } else {
            return id
        }
    }
}



