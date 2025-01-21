// NewTrade.js
import React from "react";
import { TradeProvider } from "../components/trades/TradeContext";
import TradeJourney from "../components/trades/TradeJourney";

const NewTrade = () => {
  return (
    <TradeProvider>
      <TradeJourney />
    </TradeProvider>
  );
};

export default NewTrade;