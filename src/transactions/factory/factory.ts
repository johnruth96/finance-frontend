/*
 DO NOT COMMIT
 */

import {Category, Contract, RecordType} from "../../app/types";
import dayjs from "dayjs";
import {Transaction} from "../types";

// TODO: #2 Add Rule Interface and serialization
export class RecordFactory {
    private categories: Category[] = [];
    private contracts: Contract[] = [];

    // private rules: TransformRule[] = [];

    createRecord(transaction: Transaction): Omit<RecordType, "id"> {
        const subjectCandidates = [transaction.creditor, transaction.purpose, transaction.transaction_type, "<empty>"]

        return {
            subject: subjectCandidates.find(s => s !== "") as string,
            date: dayjs(transaction.value_date).format("YYYY-MM-DD"),
            amount: transaction.amount,
            account: 1, // FIXME
            transactions: [transaction.id],
            category: 50,
            contract: null,
            counter_booking: null,
        }
    }

    /* setRules(rules: TransformRule[]) {
        this.rules = rules
    }*/

    setCategories(categories: Category[]) {
        this.categories = categories
    }

    setContracts(contracts: Contract[]) {
        this.contracts = contracts
    }

    private getCategoryId(name: string): number | null {
        return this.categories.find((cat) => cat.name === name)?.id ?? null
    }

    private getContractId(name: string): number | null {
        return this.contracts.find((con) => con.name === name)?.id ?? null
    }
}



