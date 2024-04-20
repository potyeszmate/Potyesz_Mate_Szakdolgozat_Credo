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
      console.log("CALLED THE getStockPrice API with IDS: ")
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

  //https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/AAPL?apiKey=20pxfp55CRF4QFeF0P1uQXdppypX7nk8
