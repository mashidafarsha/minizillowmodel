"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "../store/index"; // ✅ your store path
import { loadFromStorage } from "../store/authSlice"; // ✅ adjust if needed

// Wrapper to run dispatch on mount
const ReduxInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  return children;
};

export default function ClientProviders({ children }) {
  return (
    <Provider store={store}>
      <ReduxInitializer>
        {children}
      </ReduxInitializer>
    </Provider>
  );
}
