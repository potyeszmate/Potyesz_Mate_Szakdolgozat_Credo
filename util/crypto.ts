// export const convertCurrencyToCurrency = async () => {
//     try {
//       const apiKey = '9b94857e-1638-4cab-8642-42aa59df086e'; // Replace 'YOUR_API_KEY' with your actual API key
//       const apiUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=1000&convert=USD`;
  
//       const response = await fetch(apiUrl, {
//         headers: {
//           'X-CMC_PRO_API_KEY': apiKey,
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
  
//       const data: any = await response.json();
//       console.log(`Top 20 cryptos: `, data);
//       return data;
//     } catch (error: any) {
//       throw new Error(`Error fetching conversion rates: ${error.message}`);
//     }
//   };

export const getCryptoInfo = async (id: any) => {
    try {
      console.log("CALLED THE INFOS API with IDS: ", id)
      
      const apiKey = '9b94857e-1638-4cab-8642-42aa59df086e';
      const apiUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${id}`;
  
      const response = await fetch(apiUrl, {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data: any = await response.json();
      console.log(`Infos: `, data);  // Logo: logosResponse.data[crypto.id].logo,
      return data;
    } catch (error: any) {
      console.error(error);
      throw new Error(`Error fetching conversion rates: ${error.message}`);
    }
};
  
export const getCryptoValues = async (id: any) => {
  try {
    console.log("CALLED THE INFOS API with IDS: ", id)
    
    const apiKey = '9b94857e-1638-4cab-8642-42aa59df086e';
    const apiUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${id}`;

    const response = await fetch(apiUrl, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: any = await response.json();
    console.log(`Infos: `, data);  // Logo: logosResponse.data[crypto.id].logo,
    return data;
  } catch (error: any) {
    console.error(error);
    throw new Error(`Error fetching conversion rates: ${error.message}`);
  }
};

export const getCryptoChartData = async (symbol: string, startDate: any, endDate: any, interval: any) => {
  try {
    console.log("CALLED THE INFOS API with getCryptoChartData: ", symbol)

    //start date examble format: 2020-01-06
    //end date examble format: 2020-06-06
    //Intervals that can be added: '1month' or 1week' or '1day' or '1month' or '1hour'


    const apiKey = '012d681fe88749e3964a547eeab622d8';
    const apiUrl = `https://api.twelvedata.com/time_series?&start_date=${startDate}&end_date=${endDate}&symbol=${symbol}/USD&interval=${interval}&apikey=${apiKey}`;

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


// https://api.twelvedata.com/time_series?&start_date=2020-01-06&end_date=2020-05-06&symbol=aapl&interval=1day&apikey=xxx
// 012d681fe88749e3964a547eeab622d8

// https://api.twelvedata.com/time_series?&start_date=2024-01-01&end_date=2024-04-22&symbol=FIL/USD&interval=1month&apikey=012d681fe88749e3964a547eeab622d8


  // https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=0.15&symbol=BTC
  // https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=1
  