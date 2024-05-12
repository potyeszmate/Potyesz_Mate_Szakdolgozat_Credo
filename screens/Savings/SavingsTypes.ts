export type Crypto = {
    id: number;
    name: string;
    symbol: string;
    price: number;
    logo: string;
    percent_change_24h: number;
    description: string;
    amount: number;
  };

  
export type Stock = {
  id: number;
  symbol: string;
  name: string;
  price: number;
  logo: string;
  todaysChangePerc: number;
  amount: number;
}

export type SavingsParams = {
  symbol: string;
  selectedLanguage: string;
  conversionRate: number;
  currency: string;
}
