import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Home from './pages/Home';
import Accounts from './pages/Accounts';
import Account from './pages/Account';
import Trades from './pages/Trades';
import ManageCash from './pages/ManageCash';
import NewTrade from './pages/NewTrade';
import Profile from './pages/Profile';
import Payments from './pages/Payments';
import NewAccount from './pages/NewAccount';
import NewClient from './pages/NewClient';
import NewAsset from './pages/NewAsset';

import Research from './pages/Research';
import ResearchCrypto from './pages/ResearchCrypto';
import ResearchFunds from './pages/ResearchFunds';
import ResearchStocks from './pages/ResearchStocks';
import Documents from './pages/Documents';
import Register from './components/Register';
import RegularPayments from './pages/RegularPayments';
import ManagedPortfolios from './pages/ManagedPortfolios';
import NewManagedPortfolio from './pages/NewManagedPortfolio';
import Clients from './pages/Clients';
import Client from './pages/Client';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token'); // Check for token
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <main className="flex-1 p-6">
                  <Routes>
                    <Route path="/client/:id" element={<Client />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/account/:id" element={<Account />} />
                    <Route path="/trades" element={<Trades />} />
                    <Route path="/manage-cash" element={<ManageCash />} />
                    <Route path="/new-trade" element={<NewTrade />} />
                    <Route path="/new-account" element={<NewAccount />} />
                    <Route path="/new-client" element={<NewClient />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="/research/stocks" element={<ResearchStocks />} />
                    <Route path="/research/crypto" element={<ResearchCrypto />} />
                    <Route path="/research/funds" element={<ResearchFunds />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/regular-payments" element={<RegularPayments />} />
                    <Route path="/managed-portfolios" element={<ManagedPortfolios />} />
                    <Route path="/new-managed-portfolio" element={<NewManagedPortfolio />} />
                    <Route path="/new-asset" element={<NewAsset />} />

                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
