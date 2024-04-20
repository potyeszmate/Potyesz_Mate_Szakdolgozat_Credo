import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataContextType {
  data: any[]; // Change 'any' to the type of your data array
  updateData: (newData: any[]) => void; // Change 'any' to the type of your data array
}

const defaultData: DataContextType = {
  data: [],
  updateData: () => {}
};

const DataContext = createContext<DataContextType>(defaultData);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any[]>([]); // Change 'any' to the type of your data array

  const updateData = (newData: any[]) => { // Change 'any' to the type of your data array
    setData(newData);
  };

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
