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
                    <Route path="/home" element={<Home />} />
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/account/:id" element={<Account />} />
                    <Route path="/trades" element={<Trades />} />
                    <Route path="/manage-cash" element={<ManageCash />} />
                    <Route path="/new-trade" element={<NewTrade />} />
                    <Route path="/new-account" element={<NewAccount />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/payments" element={<Payments />} />
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
