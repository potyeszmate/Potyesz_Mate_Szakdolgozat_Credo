const apiKey = '20pxfp55CRF4QFeF0P1uQXdppypX7nk8';

export const getStocks = async () => {
    try {
      console.log("CALLED THE getStocks API with IDS: ")
      //   https://api.polygon.io/v3/reference/tickers?active=true&limit=20&apiKey=20pxfp55CRF4QFeF0P1uQXdppypX7nk8
      const apiUrl = `https://api.polygon.io/v3/reference/tickers?active=true&limit=20&apiKey=${apiKey}`;
  
      const response = await fetch(apiUrl, {
        // headers: {
        //   'X-CMC_PRO_API_KEY': apiKey,
        // },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data: any = await response.json();
    //   console.log(`STOCKS: `, data);
      return data;
    } catch (error: any) {
      console.error(error);
      throw new Error(`Error fetching conversion rates: ${error.message}`);
    }
};


  //https://api.polygon.io/v3/reference/tickers/AAPL?apiKey=20pxfp55CRF4QFeF0P1uQXdppypX7nk8

  export const getCompanyInfo = async (stock: string) => {
    try {
      console.log("CALLED THE getCompanyInfo API with IDS: ")
      //   https://api.polygon.io/v3/reference/tickers?active=true&limit=20&apiKey=20pxfp55CRF4QFeF0P1uQXdppypX7nk8
      const apiUrl = `https://api.polygon.io/v3/reference/tickers/${stock}?apiKey=${apiKey}`;
  
      const response = await fetch(apiUrl, {
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data: any = await response.json();
    //   console.log(`STOCKS: `, data);
      return data;
    } catch (error: any) {
      console.error(error);
      throw new Error(`Error fetching conversion rates: ${error.message}`);
    }
  };

  export const getStockPrice = async (stock: string) => {
    try {
      console.log("CALLED THE getStockPrice API with symbol: ", stock)
      //   https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/AAPL?apiKey=20pxfp55CRF4QFeF0P1uQXdppypX7nk8
      //   https://api.polygon.io/v2/aggs/ticker/AAPL/prev?adjusted=true&apiKey=20pxfp55CRF4QFeF0P1uQXdppypX7nk8
      // https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/AAPL?apiKey=20pxfp55CRF4QFeF0P1uQXdppypX7nk8
      const apiUrl = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${stock}?apiKey=${apiKey}`;
  
      const response = await fetch(apiUrl, {
      });

  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data: any = await response.json();
    //   console.log(`STOCKS: `, data);
      return data;
    } catch (error: any) {
      console.error(error);
      throw new Error(`Error fetching conversion rates: ${error.message}`);
    }
  };

  export const getStockChartData = async (symbol: string, startDate: any, endDate: any, interval: any) => {
    try {
      console.log("CALLED THE getStockChartData API with IDS: ", symbol)
  
  
      const apiKey = '012d681fe88749e3964a547eeab622d8';
      const apiUrl = `https://api.twelvedata.com/time_series?&start_date=${startDate}&end_date=${endDate}&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;
  
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data: any = await response.json();
      console.log(`Chart data: : `, data); 
      return data;
    } catch (error: any) {
      console.error(error);
      throw new Error(`Error fetching conversion rates: ${error.message}`);
    }
  };
  

  // AE0Q8NM4Y338D9UM
  //https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/AAPL?apiKey=20pxfp55CRF4QFeF0P1uQXdppypX7nk8
