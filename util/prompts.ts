// TODO: Move the prompts, and basic message string to here from chatbot.tsx 

export const prompts = {
    analyzeSpendingHabits: "Analyze the user's spending habits based on their transaction history. Highlight any significant spending patterns, like frequent purchases in a particular category or unusually large transactions. Consider seasonal variations or monthly trends.",
    categorizeExpenses: "Categorize the user's expenses from the provided transaction list. Identify which categories have the highest spending and offer a summary. Suggest potential areas for cost-saving based on common expense reduction strategies.",
    provideFinancialAdviceBySpendings: "Based on the user's spending transactions, provide personalized financial advice. Look for indications of overspending, underutilizing discounts, or subscriptions that the user might not be aware of. Offer budgeting tips and strategies for managing expenses more effectively.",
    savingTipsBasedOnExpenses: "Offer budgeting and saving tips tailored to the user's spending patterns. Highlight any categories where the user may save money and propose a simple budget plan for the next month. Include a percentage of income to be set aside as savings.",
    financialHealthByExpenses: "Perform a financial health check using the user's spending transactions. Assess if the user is living within their means, if they are saving enough for emergencies, and if their spending aligns with their financial goals. Provide feedback and actionable steps to improve financial health."
};

export const getSystemPromptForSpending = (userInput: any) => {
    if (userInput.includes('analyze my spending')) {
      return prompts.analyzeSpendingHabits;
    } else if (userInput.includes('categorize my expenses')) {
      return prompts.categorizeExpenses;
    } else if (userInput.includes('financial advice')) {
      return prompts.provideFinancialAdviceBySpendings;
    } else if (userInput.includes('save money')) {
      return prompts.savingTipsBasedOnExpenses;
    } else if (userInput.includes('financial health')) {
      return prompts.financialHealthByExpenses;
    } else {
      return "Provide insights and actionable advice based on the user's spending transactions included in this message.";
    }
  };

export const basicMessages = {
    initialGreeting: "Hello! My name is CredoBot! First please select a topic that you want to ask questions from me!",
    selectFromTopics: "Select a topic again that you want to ask questions about.",
    askNewQuestonCheck: "Chatbot: Do you want to ask another question about Spendings? Type either 'yes' or 'no' please!"
}

export const models = {
    gpt4Turbo	: "gpt-4-turbo",
    gpt3_5Turbo: "gpt-3.5-turbo",
    gpt4TurboOld: "gpt-4-turbo-2024-04-09"
}

export default prompts;
