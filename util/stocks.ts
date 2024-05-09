import apiKeys from './../apiKeys.json';

  export const getStocks = async () => {
      try {
        const apiUrl = `https://api.polygon.io/v3/reference/tickers?active=true&limit=20&apiKey=${apiKeys.StocksApiKey}`;
    
        const response = await fetch(apiUrl, {

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

  export const getCompanyInfo = async (stock: string) => {
    try {
      const apiUrl = `https://api.polygon.io/v3/reference/tickers/${stock}?apiKey=${apiKeys.StocksApiKey}`;
  
      const response = await fetch(apiUrl, {
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

  export const getStockPrice = async (stock: string) => {
    try {
    
      const apiUrl = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${stock}?apiKey=${apiKeys.StocksApiKey}`;
  
      const response = await fetch(apiUrl, {
      });

  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      console.log(response)
      const data: any = await response.json();

      return data;
    } catch (error: any) {
      console.error(error);
      throw new Error(`Error fetching conversion rates: ${error.message}`);
    }
  };

  export const getStockChartData = async (symbol: string, startDate: any, endDate: any, interval: any) => {
    try {
      const apiUrl = `https://api.twelvedata.com/time_series?&start_date=${startDate}&end_date=${endDate}&symbol=${symbol}&interval=${interval}&apikey=${apiKeys.chartsApiKey}`;
  
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
  