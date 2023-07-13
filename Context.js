import { useState, createContext } from 'react';

export const Context = createContext();

const ContextComponent = props => {
  const [food, setFood] = useState()
  const [shouldGoBack, setShouldGoBack] = useState()
  


  return (
    <Context.Provider
      value={{
        food,
        setFood,
        shouldGoBack,
        setShouldGoBack,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default ContextComponent;
