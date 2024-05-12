import { Timestamp } from "firebase/firestore";

export type Profile = {
    id: string,
    birthday: Timestamp;
    firstName: string;
    lastName: string
    mobile: number;
    gender: string;
    profilePicture: string;
    amount: number;
    uid: string;
    isPremiumUser: boolean,
    currency: string,
    language: string
  }