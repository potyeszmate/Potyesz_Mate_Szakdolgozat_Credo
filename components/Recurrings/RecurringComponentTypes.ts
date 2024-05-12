export type RecurringTransactionInputProps = {
    onAddRecurringTransaction: (newRecurringTransaction: any) => void;
    initialRecurringTransaction?: any;
    currency: string,
    conversionRate: number; 
    selectedLanguage: string;
    onDeleteRecurringTransaction?: (newRecurringTransaction: any) => void;
    onClose: () => void  
  }
