import React, {createContext, useContext, useState} from 'react';

const TabVisibilityContext = createContext();

export const TabVisibilityProvider = ({children}) => {
  const [isThirdTabVisible, setIsThirdTabVisible] = useState(true);

  const toggleThirdTabVisibility = () => {
    setIsThirdTabVisible(prev => !prev);
  };

  return (
    <TabVisibilityContext.Provider
      value={{isThirdTabVisible, toggleThirdTabVisibility}}>
      {children}
    </TabVisibilityContext.Provider>
  );
};

export const useTabVisibility = () => {
  const context = useContext(TabVisibilityContext);
  if (!context) {
    throw new Error(
      'useTabVisibility must be used within a TabVisibilityProvider',
    );
  }
  return context;
};
