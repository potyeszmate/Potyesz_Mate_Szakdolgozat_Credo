import { Timestamp } from "firebase/firestore"

export type Balance = {
    id: string,
    balance: number,
    uid: string,
}

export type Income = {
    id: string,
    category: string,
    date: Timestamp,
    name: string,
    uid: string,
    value: number,
    notes?: string,
}

export type Transaction = {
    id: string,
    category: string,
    date: Timestamp,
    name: string,
    uid: string,
    value: number,
    notes?: string,
}

export type MonthlyIncomes = {
    id: string,
    income: string,
    uid: string,
}

export type Points = {
    id: string,
    bronzeBadgeNumber: number,
    goldBadgeNumber: number,
    platinumBadgeNumber: number,
    silverBadgeNumber: number,
    level: number,
    rank: string,
    score: number,
    total: number,
    uid: string,
}