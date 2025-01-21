import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const BankAccounts = () => {
  const accounts = [
    { id: 1, country: 'UK', type: 'Bank Account', details: { sortCode: '12-34-56', accountNumber: '78901234' } },
    { id: 2, country: 'US', type: 'Debit Card', details: { cardNumber: '****1234', expiry: '12/25' } },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-[#00836f]">Linked Bank Accounts</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-[#00836f] text-white">
            <tr>
              <th className="py-3 px-6 text-left">Country</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Details</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {accounts.map(account => (
              <tr key={account.id} className="border-b border-gray-200">
                <td className="py-4 px-6">{account.country}</td>
                <td className="py-4 px-6">{account.type}</td>
                <td className="py-4 px-6">
                  {account.type === 'Bank Account' ? 
                    `Sort Code: ${account.details.sortCode}, Account Number: ${account.details.accountNumber}` 
                    : 
                    `Card Number: ${account.details.cardNumber}, Expiry: ${account.details.expiry}`
                  }
                </td>
                <td className="py-4 px-6 text-center">
                  <Link to={`/edit-account/${account.id}`} className="inline-block text-[#00836f] mx-1"><Pencil /></Link>
                  <button onClick={() => console.log(`Delete account ${account.id}`)} className="inline-block text-red-500 mx-1"><Trash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/new-bank-account" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00836f] hover:bg-[#00695b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00836f]">
        Add New Bank Account
      </Link>
    </div>
  );
};

export default BankAccounts;