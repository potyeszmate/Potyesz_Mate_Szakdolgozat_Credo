import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataContextType {
  data: any[]; 
  updateData: (newData: any[]) => void; 
}

const defaultData: DataContextType = {
  data: [],
  updateData: () => {}
};

//TOD: Delete if not using anymore
const DataContext = createContext<DataContextType>(defaultData);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any[]>([]); 

  const updateData = (newData: any[]) => { 
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
