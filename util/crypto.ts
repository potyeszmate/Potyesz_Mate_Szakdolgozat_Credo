
import apiKeys from './../apiKeys.json';

export const getCryptoInfo = async (id: any) => {
    try {
      
      const apiUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${id}`;
  
      const response = await fetch(apiUrl, {
        headers: {
          'X-CMC_PRO_API_KEY': apiKeys.cryptoApiKey,
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data: any = await response.json();
      return data;
    } catch (error: any) {
      console.error(error);
      throw new Error(`Error fetching conversion rates: ${error.message}`);
    }
};
  
export const getCryptoValues = async (id: any) => {

  try {
    
    const cryptoValuesApiKey = '9b94857e-1638-4cab-8642-42aa59df086e';
    const apiUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${id}`;

    const response = await fetch(apiUrl, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKeys.cryptoApiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: any = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    throw new Error(`Error fetching conversion rates: ${error.message}`);
  }
};

export const getCryptoChartData = async (symbol: string, startDate: any, endDate: any, interval: any) => {
  try {
    const apiUrl = `https://api.twelvedata.com/time_series?&start_date=${startDate}&end_date=${endDate}&symbol=${symbol}/USD&interval=${interval}&apikey=${apiKeys.chartsApiKey}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: any = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    throw new Error(`Error fetching conversion rates: ${error.message}`);
  }
};
