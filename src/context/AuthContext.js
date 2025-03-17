import { createContext, useContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  isLoading: localStorage.getItem("user") === null ? false : true,
  role: JSON.parse(localStorage.getItem("isLoggedIn")) || null,
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  user:
    localStorage.getItem("user") === undefined
      ? null
      : JSON.parse(localStorage.getItem("user")) || null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(state.isLoggedIn));
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        role: state.role,
        isLoading: state.isLoading,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
