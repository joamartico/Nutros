import { useState, createContext } from 'react';

export const Context = createContext();

const ContextComponent = props => {
  const [food, setFood] = useState()
  


  return (
    <Context.Provider
      value={{
        food,
        setFood
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default ContextComponent;
