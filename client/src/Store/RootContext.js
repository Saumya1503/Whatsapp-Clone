import React, {createContext, useContext} from "react";
import UserState from "./State/UserState";
import RootState from "./State/RootState";

export const RootContext = createContext(new RootState());

export const useStore = () => useContext(RootContext);
