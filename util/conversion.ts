const apiKey = '153624bb29801d186d0b1db3';
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest`;

export const convertCurrencyToCurrency = async (fromCurrency: any, toCurrency: any) => {
    console.log("fromCurrency " + fromCurrency  + "toCurrency: "+ toCurrency)
    try {
      console.log("FETCHING CURRENCY API");
      console.log("toCurrency: ", toCurrency)
      const response = await fetch(`${apiUrl}/${fromCurrency}`);
      const data = await response.json();
      const rate = data.conversion_rates[toCurrency];
      if (rate) {
        console.log(`Conversion rate from ${fromCurrency} to ${toCurrency} is ${rate}`);

        return rate;
      } else {
        throw new Error(`Conversion rate from ${fromCurrency} to ${toCurrency} not found`);
      }
    } catch (error: any) {
      throw new Error(`Error fetching conversion rates: ${error.message}`);
    }
  };