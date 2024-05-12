import en from '../languages/en.json';
import de from '../languages/de.json';
import hu from '../languages/hu.json';

export const languages: any = {
    English: en,
    German: de,
    Hungarian: hu,
  };

export const getCurrencySymbol = (currencyCode: string) => {
    
    switch (currencyCode) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'HUF':
        return 'HUF';
      case 'AUD':
        return '$';
      case 'CAD':
        return '$';
      case 'GBP':
        return '£';
      default:
        return ''; 
    }
  };