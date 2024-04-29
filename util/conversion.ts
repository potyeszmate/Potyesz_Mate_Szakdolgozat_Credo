
import apiKeys from './../apiKeys.json';

const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKeys.currencyConversionApiKey}/latest`;

export const convertCurrencyToCurrency = async (fromCurrency: any, toCurrency: any) => {
    try {
      const response = await fetch(`${apiUrl}/${fromCurrency}`);
      const data = await response.json();
      const rate = data.conversion_rates[toCurrency];
      if (rate) {
        return rate;
      } else {
        throw new Error(`Conversion rate from ${fromCurrency} to ${toCurrency} not found`);
      }
    } catch (error: any) {
      throw new Error(`Error fetching conversion rates: ${error.message}`);
    }
  };