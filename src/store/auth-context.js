import React, { createContext, useState } from 'react';

export const AuthContext = createContext({
  isAuth: false,
  login: () => {},
});

// the states and logic for the context is managed in the Provider component
const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginHandler = () => {
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{ login: loginHandler, isAuth: isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

// notes to Context
// 1) create the context, with a default value -- line 3
// 2) create a HOC component that will provide the context
// 3) create the logic in the provider component
// 4) initialize the value prop of the provider with the specific logic and state

// 5) Wrap App with the provider in index.js
// 6) use the hook useContext(The-default-context-value(1))) in the components that need those states
