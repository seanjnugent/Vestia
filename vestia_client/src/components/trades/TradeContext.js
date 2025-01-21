import React, { createContext, useContext, useReducer } from "react";

const TradeContext = createContext();

const initialState = {
  account: null,
  tradeType: null, // 'buy' or 'sell'
  selectedAssets: [],
  inputType: "amount", // 'amount' or 'units'
  tradeMode: "VALUE", // 'VALUE' or 'UNITS'
  stage: 0, // Current step in the trade journey
};

const tradeReducer = (state, action) => {
  switch (action.type) {
    case "SET_ACCOUNT":
      return { ...state, account: action.payload };
    case "SET_TRADE_TYPE":
      return { ...state, tradeType: action.payload };
    case "SET_SELECTED_ASSETS":
      return { ...state, selectedAssets: action.payload };
    case "SET_INPUT_TYPE":
      return { 
        ...state, 
        inputType: action.payload,
        tradeMode: action.payload === 'amount' ? 'VALUE' : 'UNITS'
      };
    case "SET_TRADE_MODE":
      return { ...state, tradeMode: action.payload };
    case "NEXT_STAGE":
      return { ...state, stage: state.stage + 1 };
    case "PREV_STAGE":
      return { ...state, stage: state.stage - 1 };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
};

export const TradeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tradeReducer, initialState);

  return (
    <TradeContext.Provider value={{ state, dispatch }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrade = () => useContext(TradeContext);