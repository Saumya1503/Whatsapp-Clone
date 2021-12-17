import React from "react";
import RootState from "./State/RootState";
import { RootContext } from "./RootContext";

export const Store = new RootState();

const StoreProvider = ({ children }) => {
    return <RootContext.Provider value={Store}>{children}</RootContext.Provider>;
};

export default StoreProvider;
