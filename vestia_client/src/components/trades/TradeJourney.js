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
    // Note: SET_TRADE_MODE is now handled in the reducer
  };
  


  // Function to handle trade confirmation
  const handleConfirmTrade = async () => {
    try {
      const assets = selectedAssets.map(asset => ({
        asset_id: asset.asset_id,
        ...(state.tradeMode === 'VALUE'
          ? { value: asset.allocation?.allocation_amount || 0 }
          : { units: asset.allocation?.allocation_amount || 0 }
        ),
        quote_price: asset.latest_price
      }));
  
      const payload = {
        account_id: account.account_id,
        trade_type: tradeType.toLowerCase(),
        trade_mode: state.tradeMode,
        assets: JSON.stringify(assets),
        currency_code: 'USD',
        trade_note: 'Automated trade submission'
      };
  
      console.log('Debug - Final payload:', payload);
  
      // Send the payload to the API
      const response = await fetch('http://localhost:5000/api/trades/postNewTrade/new-trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert('Trade submitted successfully!');
        dispatch({ type: "RESET_STATE" }); // Reset the trade journey
      } else {
        throw new Error(result.message || 'Trade submission failed');
      }
    } catch (error) {
      console.error('Error submitting trade:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Function to move to the next stage
  const handleContinue = () => {
    dispatch({ type: "NEXT_STAGE" });
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
            account={account} // Pass the selected account
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
            tradeData={{ selectedAssets, inputType }}
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