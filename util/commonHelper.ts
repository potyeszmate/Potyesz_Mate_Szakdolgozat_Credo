export const getCurrencySymbol = (currencyCode: any): string => {
    const symbols: { [key: string]: string } = {
        'USD': '$', 
        'EUR': '€', 
        'HUF': 'Ft', 
        'AUD': '$', 
        'CAD': '$', 
        'GBP': '£'
    };
    return symbols[currencyCode] || '';
};

// TODO: Move all common methods here