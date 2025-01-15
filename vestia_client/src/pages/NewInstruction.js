import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AssetSelection from '../components/AssetSelection';
import AssetAllocation from '../components/AssetAllocation';
import InstructionReview from '../components/InstructionReview';

const NewInstruction = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Account ID from the URL
  const [frequency, setFrequency] = useState('');
  const [amount, setAmount] = useState('');
  const [bankAccountId, setBankAccountId] = useState('');
  const [firstDate, setFirstDate] = useState('');
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [step, setStep] = useState(1); // Step 1: Basic details, Step 2: Asset Selection, Step 3: Allocation, Step 4: Review

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate amount
    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount < 10) {
      alert('Amount must be a round number and at least 10.');
      return;
    }

    // Handle dates
    const today = new Date();
    const nextRunDateValue = firstDate || today.toISOString().split('T')[0]; // Default to today if not set

    const instructionDetails = {
      frequency,
      amount: parsedAmount,
      bankAccountId,
      firstDate,
      nextRunDate: nextRunDateValue,
    };

    const allocation = {
      assets: selectedAssets.map(asset => ({
        asset_id: asset.asset_id,
        allocation_amount: asset.allocation_amount,
      })),
    };

    try {
      const response = await fetch('http://localhost:5000/api/payments/postNewInstruction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: id,
          instruction_type: 'RegularDeposit',
          instruction_details: instructionDetails,
          allocation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Instruction created successfully.');
        navigate('/accounts'); // Redirect to the accounts page or any other page
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating instruction:', error);
      alert('Failed to create instruction.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">New Regular Deposit Instruction</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select Frequency</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full pl-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                style={{ MozAppearance: 'textfield' }} // Remove arrows in the amount input box
              />
              <p className="text-xs text-gray-500 mt-1">Amount must be a round number and at least 10.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Account ID</label>
              <input
                type="text"
                value={bankAccountId}
                onChange={(e) => setBankAccountId(e.target.value)}
                className="mt-1 block w-full pl-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">First Date</label>
              <input
                type="date"
                value={firstDate}
                onChange={(e) => setFirstDate(e.target.value)}
                className="mt-1 block w-full pl-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-[#38d6b7] text-white rounded-md hover:bg-[#2bb29b] transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <AssetSelection
              selectedAssets={selectedAssets}
              setSelectedAssets={setSelectedAssets}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 bg-[#38d6b7] text-white rounded-md hover:bg-[#2bb29b] transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <AssetAllocation
              selectedAssets={selectedAssets}
              setSelectedAssets={setSelectedAssets}
              amount={amount}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(4)} // Move to Step 4 (Review)
                className="px-4 py-2 bg-[#38d6b7] text-white rounded-md hover:bg-[#2bb29b] transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <InstructionReview
              frequency={frequency}
              amount={amount}
              bankAccountId={bankAccountId}
              firstDate={firstDate}
              selectedAssets={selectedAssets}
            />
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setStep(3)} // Go back to Step 3 (Allocation)
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                Back
              </button>
              <button
                type="submit" // Submit the form
                className="px-4 py-2 bg-[#38d6b7] text-white rounded-md hover:bg-[#2bb29b] transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                Review & Submit
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default NewInstruction;
