import { Timestamp } from "firebase/firestore";

export type RecurringTransactions = {
    Date: Timestamp,
    category: string
    name: string;
    uid: string;
    value: number;
    Importance?: string;
    dueDate?: Timestamp;
  }