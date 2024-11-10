export const expenseCategories = [
  'Food & Drinks',
  'Shopping',
  'Transport',
  'Housing',
  'Entertainment',
  'Healthcare',
  'Education',
  'Utilities',
  'Travel',
  'Insurance',
  'Personal Care',
  'Gifts',
  'Investments',
  'Other'
];

export const incomeCategories = [
  'Salary',
  'Business',
  'Investments',
  'Freelance',
  'Gifts',
  'Rental',
  'Refunds',
  'Other'
];

// Helper function to get categories based on transaction type
export const getCategoriesByType = (type: 'income' | 'expense' | 'all') => {
  switch (type) {
    case 'income':
      return incomeCategories;
    case 'expense':
      return expenseCategories;
    case 'all':
      return [...new Set([...incomeCategories, ...expenseCategories])];
    default:
      return [];
  }
}; 