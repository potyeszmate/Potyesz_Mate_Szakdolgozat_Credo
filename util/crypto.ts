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

export const getCryptoInfo = async (ids: any) => {
    try {
      console.log("CALLED THE INFOS API with IDS: ", ids)
      
      const apiKey = '9b94857e-1638-4cab-8642-42aa59df086e';
      const apiUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${ids.join(',')}`;
  
      const response = await fetch(apiUrl, {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data: any = await response.json();
      console.log(`Infos: `, data);
      return data;
    } catch (error: any) {
      console.error(error);
      throw new Error(`Error fetching conversion rates: ${error.message}`);
    }
  };
  

  // https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=0.15&symbol=BTC
  // https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=1
  