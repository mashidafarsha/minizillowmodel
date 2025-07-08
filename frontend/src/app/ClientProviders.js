"use client";

import { Provider } from "react-redux";
import store from "../store/index"; // adjust path here

export default function ClientProviders({ children }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

