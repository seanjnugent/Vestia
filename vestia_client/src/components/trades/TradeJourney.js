import React from "react";
import ProgressTracker from "../ProgressTracker";
import AccountSelection from "../AccountSelection";
import TradeTypeSelection from "./TradeTypeSelection";
import TradeSelection from "./TradeSelection";
import TradeAllocation from "./TradeAllocation";
import TradeReview from "./TradeReview";
import { useTrade } from "./TradeContext";

const steps = ["Account", "Trade Type", "Trade", "Allocation", "Review"];

const TradeJourney = () => {
  const { state, dispatch } = useTrade();
  const { stage, account, tradeType, selectedAssets, inputType, tradeMode } = state;

  // Function to handle account selection
  const handleSetSelectedAccount = (selectedAccount) => {
    dispatch({ type: "SET_ACCOUNT", payload: selectedAccount });
  };

  // Function to handle trade type selection
  const handleSetTradeType = (type) => {
    dispatch({ type: "SET_TRADE_TYPE", payload: type });
  };

  // Function to handle asset selection
  const handleSetSelectedAssets = (assets) => {
    dispatch({ type: "SET_SELECTED_ASSETS", payload: assets });
  };

  // Function to handle input type (amount/units)
  const handleSetInputType = (type) => {
    dispatch({ type: "SET_INPUT_TYPE", payload: type });
  };

  // Function to move to the next stage
  const handleContinue = () => {
    dispatch({ type: "NEXT_STAGE" });
  };

  // Function to handle trade confirmation
  const handleConfirmTrade = () => {
    // Add logic to submit the trade
    alert("Trade submitted successfully!");
    dispatch({ type: "RESET_STATE" }); // Reset the trade journey
  };

  // Function to handle going back to the previous stage
  const handleBack = () => {
    dispatch({ type: "PREV_STAGE" });
  };

  const renderStageContent = () => {
    switch (stage) {
      case 0:
        return (
          <AccountSelection
            selectedAccount={account}
            setSelectedAccount={handleSetSelectedAccount}
            onContinue={handleContinue}
          />
        );
      case 1:
        return (
          <TradeTypeSelection
            tradeType={tradeType}
            setTradeType={handleSetTradeType}
            onContinue={handleContinue}
          />
        );
      case 2:
        return (
          <TradeSelection
            selectedAssets={selectedAssets}
            setSelectedAssets={handleSetSelectedAssets}
            tradeType={tradeType}
            onContinue={handleContinue}
          />
        );
      case 3:
        return (
          <TradeAllocation
            selectedAssets={selectedAssets}
            setSelectedAssets={handleSetSelectedAssets}
            amount={account?.total_account_value || 0}
            inputType={inputType}
            setInputType={handleSetInputType}
            onNext={handleContinue}
            tradeMode={tradeMode}
          />
        );
      case 4:
        return (
          <TradeReview
            account={account}
            tradeType={tradeType}
            tradeData={{ selectedAssets, inputType }} // Pass tradeData
            onConfirm={handleConfirmTrade}
            onBack={handleBack}
            tradeMode={tradeMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <ProgressTracker currentStep={stage + 1} steps={steps} />
      {renderStageContent()}
    </div>
  );
};

export default TradeJourney;