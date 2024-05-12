import axios from "axios";

export  const handleSend = async (params: any) => {

    const {
        userInput, conversation, currentTopic, transactions, incomes, subscriptions, loansAndDebts, bills, cryptocurrencies, stocks, goals,
        setConversation, setUserInput, setShowTopics, setCurrentTopic, basicMessages, api, models, apiKeys, selectedLanguage
    } = params;

    if (!userInput.trim()) return;
  
    const isAwaitingFollowUp = conversation.length > 0 && conversation[conversation.length - 1].includes("Do you want to ask another question about");

    if (isAwaitingFollowUp) {
      const userResponse = userInput.trim().toLowerCase();
      if (userResponse === 'yes') {
        setConversation((prev: string[]) => [...prev, `You: ${userInput}`, `Chatbot: What else would you like to know about ${currentTopic}?`]);
        setUserInput(''); 
      } else if (userResponse === 'no') {
        setShowTopics(true); 
        setConversation((prev: string[]) => [...prev, `You: ${userInput}`, basicMessages[selectedLanguage].selectFromTopics]);
        setCurrentTopic(''); 
        setUserInput(''); 
      } else {
        setConversation((prev: string[]) => [...prev, `You: ${userInput}`, `Chatbot: I didn't really catch that, can you answer again with 'yes' or 'no', please?`]);
        setUserInput(''); 
        return; 
      }
    } 
    else {
      setConversation((prev: string[]) => [...prev, `You: ${userInput}`]);
      setUserInput('');
      let systemMessageContent = "";

      if (currentTopic === 'Spendings') {
        if (transactions.length > 0) {
        // @ts-ignore
        const formattedTransactions = transactions.map(transaction => {
            const dateOptions: any = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(transaction.date.seconds * 1000).toLocaleDateString('en-US', dateOptions);
            return `Date: ${date.replace(/ /g, ' ')} - Name: ${transaction.name} - Category: (${transaction.category}) Spent ammount: $${transaction.value}`;
          }).join(", ");
          
        systemMessageContent = `The user's incomes and earnings are the following earning transactions: ${formattedTransactions}`;
        }
      else {
        systemMessageContent = "The user has no recent transactions.";
      }

      try {
        const response = await axios.post(api, {
          model: models.gpt4Turbo,
          messages: [
            { role: "system", content: "You are a helpful assistant, skilled in finance management and transaction analysis." },
            { role: "user", content: userInput },
            { role: "system", content: systemMessageContent }
          ],
          max_tokens: 700,
        }, {
          headers: {
            'Authorization': `Bearer ${apiKeys.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        setConversation((prev: string[]) => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        setConversation((prev: string[]) => [...prev, basicMessages[selectedLanguage].askNewQuestonCheck]);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        setConversation((prev: string[]) => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
      }
    
      setUserInput('');
      }
      if (currentTopic === 'Incomes') {
        if (incomes.length > 0) {
            // @ts-ignore
          const formattedIncomes = incomes.map(transaction => {
            const dateOptions: any = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(transaction.date.seconds * 1000).toLocaleDateString('en-US', dateOptions);
            return `Date: ${date.replace(/ /g, ' ')} - Name: ${transaction.name} - Earned amount: $${transaction.value}`;
          }).join(", ");
          
          systemMessageContent = `The user's incomes and earnings are the following earning transactions: ${formattedIncomes}`;
        } else {
          systemMessageContent = "The user has no recorded income transactions. Let the user know he has no income yet.";
        }

      try {

        const response = await axios.post(api, {
          model: models.gpt3_5Turbo,
          messages: [
            { role: "system", content: "You are a helpful assistant, skilled in finance management, income and expense analysis." },
            { role: "user", content: userInput },
            { role: "system", content: systemMessageContent }
          ],
          headers: {
            'Authorization': `Bearer ${apiKeys.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        setConversation((prev: string[]) => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        setConversation((prev: string[]) => [...prev, basicMessages[selectedLanguage].askNewQuestonCheck]);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        setConversation((prev: string[]) => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
      }
    
      setUserInput('');
      }
      if (currentTopic === 'Subscriptions') {
        let formattedSubscriptions = "";
        try {
          if (subscriptions.length > 0) {
            // @ts-ignore
            formattedSubscriptions = subscriptions.map(subscription => {
              const dateOptions: any = { year: 'numeric', month: 'long', day: 'numeric' };
              const date = new Date(subscription.Date.seconds * 1000).toLocaleDateString('en-US', dateOptions);
              const value = Math.trunc(subscription.value);
              return `Date: ${date.replace(/ /g, ' ')} - Name: ${subscription.name} - Importance: ${subscription.Importance} - Value: $${value} - Frequency: ${subscription.category}`;
            }).join(", ");
            systemMessageContent = `The user's subscriptions details are as follows: ${formattedSubscriptions}`;
          }
          else{
            systemMessageContent = "The user has no recorded subscriptions yet. Let the user know he has no subscription yet.";

          }
        } catch (error) {

          console.error("Error formatting subscriptions: ", error);
        }

      try {
        const response = await axios.post(api, {
          model: models.gpt4Turbo,
          messages: [
            { role: "system", content: "You are a helpful assistant, skilled in subscription management and analysis. You can identify subscription patterns, suggest optimizations, and advise on managing recurring payments or answer other questions." },
            { role: "user", content: userInput },
            { role: "system", content: systemMessageContent }
          ],
          max_tokens: 1000,
        }, {
          headers: {
            'Authorization': `Bearer ${apiKeys.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        setConversation((prev: string[]) => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        setConversation((prev: string[]) => [...prev, basicMessages[selectedLanguage].askNewQuestonCheck]);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        setConversation((prev: string[]) => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
      }
    
      setUserInput('');
      }
      if (currentTopic === 'Loans') {
        let formattedLoansAndDebts = "";
        try {
          if (loansAndDebts.length > 0) {
            // @ts-ignore
            formattedLoansAndDebts = loansAndDebts.map(loan => {
              const dateOptions: any = { year: 'numeric', month: 'long', day: 'numeric' };
              const createDate = loan.Date && typeof loan.Date.seconds === 'number' 
                                 ? new Date(loan.Date.seconds * 1000).toLocaleDateString('en-US', dateOptions) 
                                 : 'No creation date provided';
              const dueDate = loan.dueDate && typeof loan.dueDate.seconds === 'number'
                              ? new Date(loan.dueDate.seconds * 1000).toLocaleDateString('en-US', dateOptions)
                              : 'No due date provided';
              const value = Math.trunc(loan.value);
              return `Creation Date: ${createDate} - Due Date: ${dueDate} - Name: ${loan.name} - Value: $${value} - Frequency: ${loan.category}`;
            }).join(", ");
            systemMessageContent = `The user's loans and debts details are as follows: ${formattedLoansAndDebts}`;
          }
          else{
            systemMessageContent = "The user has no recorded loans or debts yet. Let the user know he has no loans or debts yet so he is lucky.";

          }
        } catch (error) {

          console.error("Error formatting loans: ", error);
        }

      try {
        const response = await axios.post(api, {
          model: models.gpt4Turbo,
          messages: [
            { role: "system", content: "You are a helpful assistant, skilled in loans and debt management and analysis. You can identify patterns, suggest optimizations, and advise on managing debts or answer other related questions." },
            { role: "user", content: userInput },
            { role: "system", content: systemMessageContent }
          ],
          max_tokens: 400,
        }, {
          headers: {
            'Authorization': `Bearer ${apiKeys.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        setConversation((prev: string[]) => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        setConversation((prev: string[]) => [...prev, basicMessages[selectedLanguage].askNewQuestonCheck]);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        setConversation((prev: string[]) => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
      }
    
      setUserInput('');
      }
      if (currentTopic === 'Bills') {
        let formattedBills = "";
        try {
          if (bills.length > 0) {
            // @ts-ignore
            formattedBills = bills.map(bill => {
              const dateOptions: any = { year: 'numeric', month: 'long', day: 'numeric' };
              const date = bill.Date && typeof bill.Date.seconds === 'number' 
                           ? new Date(bill.Date.seconds * 1000).toLocaleDateString('en-US', dateOptions) 
                           : 'No date provided';
              const value = Math.trunc(bill.value);
              return `Date: ${date} - Name: ${bill.name} bill - Value: $${value}`;
            }).join(", ");
            systemMessageContent = `The user's bills are detailed below, providing insights into upcoming dues and financial commitments: ${formattedBills}`;
          }
          else{
            systemMessageContent = "The user has no recorded bills yet. Let the user know he has no bills yet so he is lucky.";

          }
        } catch (error) {

          console.error("Error formatting loans: ", error);
        }

      try {
        const response = await axios.post(api, {
          model: models.gpt4Turbo,
          messages: [
            { role: "system", content: "You are a helpful assistant, skilled in bill management and analysis. You can suggest payment strategies, and help prioritize bills and answer other questions" },
            { role: "user", content: userInput },
            { role: "system", content: systemMessageContent }
          ],
          max_tokens: 400,
        }, {
          headers: {
            'Authorization': `Bearer ${apiKeys.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        setConversation((prev: string[]) => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        setConversation((prev: string[]) => [...prev, basicMessages[selectedLanguage].askNewQuestonCheck]);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        setConversation((prev: string[]) => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
      }
    
      setUserInput('');
      }
      if (currentTopic === 'Cryptos') {
        let formattedCryptos = "";
        try {
          if (cryptocurrencies.length > 0) {
            // @ts-ignore
            formattedCryptos = cryptocurrencies.map(crypto => {
              const amountFormatted = crypto.amount.toFixed(3);
              return `Cryptocurrency Name: ${crypto.name} - Share amount: ${amountFormatted}`;
            }).join(", ");
            systemMessageContent = `The user's cryptocurrency portfolio is detailed below: ${formattedCryptos}. Please provide the current value analysis based on these holdings.`;
          }
          else{
            systemMessageContent = "The user has no cryptos yet. Let the user know he has no cryptocurrencies yet.";

          }
        } catch (error) {

          console.error("Error formatting loans: ", error);
        }

      try {
        const response = await axios.post(api, {
          model: models.gpt4Turbo,
          messages: [
            { role: "system", content: "You are a helpful assistant, skilled in cryptocurrency portfolio management and valuation analysis. You can count how much money the user has in his owned crypto based on his share of that crypto" },
            { role: "user", content: userInput },
            { role: "system", content: systemMessageContent }
          ],
          max_tokens: 400,
        }, {
          headers: {
            'Authorization': `Bearer ${apiKeys.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        setConversation((prev: string[]) => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        setConversation((prev: string[]) => [...prev, basicMessages[selectedLanguage].askNewQuestonCheck]);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        setConversation((prev: string[]) => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
      }
    
      setUserInput('');
      }
      if (currentTopic === 'Stocks') {
        let formattedStocks  = "";
        try {
          if (stocks.length > 0) {
            // @ts-ignore
            formattedStocks = stocks.map(stock => {
              const amountFormatted = stock.amount.toFixed(3);
              return `Stock Name: ${stock.name} - Share amount: ${amountFormatted}`;
            }).join(", ");
            systemMessageContent = `The user's stock portfolio is detailed below: ${formattedStocks}. Please provide the current value analysis based on these holdings.`;
          }
          else{
            systemMessageContent = "The user has no cryptos yet. Let the user know he has no cryptocurrencies yet.";

          }
        } catch (error) {

          console.error("Error formatting loans: ", error);
        }

      try {
        const response = await axios.post(api, {
          model: models.gpt4Turbo,
          messages: [
            { role: "system", content: "You are a helpful assistant, skilled in stock portfolio management and valuation analysis. You can count how much money the user has in his owned stock based on his share of that stock" },
            { role: "user", content: userInput },
            { role: "system", content: systemMessageContent }
          ],
          max_tokens: 400,
        }, {
          headers: {
            'Authorization': `Bearer ${apiKeys.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        setConversation((prev: string[]) => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        setConversation((prev: string[]) => [...prev, basicMessages[selectedLanguage].askNewQuestonCheck]);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        setConversation((prev: string[]) => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
      }
    
      setUserInput('');
      }
      if (currentTopic === 'Goals') {
        let formattedGoals = "";
        const today = new Date();
        const dateOptions: any = { year: 'numeric', month: 'long', day: 'numeric' };
        const todayFormatted = today.toLocaleDateString('en-US', dateOptions);
        try {
          if (goals.length > 0) {
            // @ts-ignore
            formattedGoals = goals.map(goal => {
              const dateOptions: any = { year: 'numeric', month: 'long', day: 'numeric' };
              const dueDate = goal.Date && typeof goal.Date.seconds === 'number' 
                             ? new Date(goal.Date.seconds * 1000).toLocaleDateString('en-US', dateOptions)
                             : 'No due date provided';
              return `| Goal Name: ${goal.Name} - Already saved amount: $${goal.Current_Ammount.toFixed(0)} - Needed amount: $${goal.Total_Ammount.toFixed(0)} - Approximately  Due Date: ${dueDate} |`;
            }).join(", ");
            systemMessageContent = `As of today, ${todayFormatted}, the user's financial goals are detailed below: ${formattedGoals}. Please provide advice on how the user can efficiently meet these goals based on their current progress and the timelines.`;
          }

          else{
            systemMessageContent = "The user has no financial goals set up yet. Let the user know he has  no financial goals yet.";

          }
        } catch (error) {

          console.error("Error formatting goals: ", error);
        }

      try {
        const response = await axios.post(api, {
          model: models.gpt3_5Turbo,
          messages: [
            { role: "system", content: "You are a helpful assistant, skilled in financial goal planning and advising on saving strategies." },
            { role: "user", content: userInput },
            { role: "system", content: systemMessageContent }
          ],
          max_tokens: 800,
        }, {
          headers: {
            'Authorization': `Bearer ${apiKeys.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        
        setConversation((prev: string[]) => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        setConversation((prev: string[]) => [...prev, basicMessages[selectedLanguage].askNewQuestonCheck]);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        setConversation((prev: string[]) => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
      }
    
      setUserInput('');
      }
    
    setUserInput('');

  };
}