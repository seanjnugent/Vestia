import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/TopNav';
import Login from './pages/Login';
import Home from './pages/Home';
import Accounts from './pages/Accounts';
import Account from './pages/Account';
import Trades from './pages/Trades';
import NewPayment from './pages/NewPayment';
import NewTrade from './pages/NewTrade';
import Profile from './pages/Profile';
import Payments from './pages/Payments';
import NewAccount from './pages/NewAccount';
import Research from './pages/Research';
import ResearchCrypto from './pages/ResearchCrypto';
import ResearchFunds from './pages/ResearchFunds';
import ResearchStocks from './pages/ResearchStocks';
import Documents from './pages/Documents';
import Register from './components/Register';
import NewRegularPayment from './pages/NewRegularPayment';
import NewInstruction from './pages/NewInstruction';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token'); // Check for token
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Login Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              {/* Top Navigation Layout */}
              <div className="flex flex-col h-screen bg-gray-100">
                {/* Sidebar becomes the Top Nav */}
                <Sidebar />

                {/* Main Content Section */}
                <main className="flex-1 p-6 overflow-auto">
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/account/:id" element={<Account />} />
                    <Route path="/trades" element={<Trades />} />
                    <Route path="/new-payment" element={<NewPayment />} />
                    <Route path="/new-trade" element={<NewTrade />} />
                    <Route path="/new-account" element={<NewAccount />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="/research/stocks" element={<ResearchStocks />} />
                    <Route path="/research/crypto" element={<ResearchCrypto />} />
                    <Route path="/research/funds" element={<ResearchFunds />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/new-regular-payment" element={<NewRegularPayment />} />
                    <Route path="/new-instruction/:id" element={<NewInstruction />} />
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

