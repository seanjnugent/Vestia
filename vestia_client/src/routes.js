import Home from './pages/Home';
import Accounts from './pages/Accounts';
import Account from './pages/Account';
import Trades from './pages/Trades';
import BankAccounts from './pages/BankAccounts';
import NewPayment from './pages/NewPayment';
import NewTrade from './pages/NewTrade';
import NewAccount from './pages/NewAccount';
import Profile from './pages/Profile';
import Payments from './pages/Payments';
import Research from './pages/Research';
import ResearchStocks from './pages/ResearchStocks';
import ResearchCrypto from './pages/ResearchCrypto';
import ResearchFunds from './pages/ResearchFunds';
import Documents from './pages/Documents';
import Register from './pages/Register';
import NewRegularPayment from './pages/NewRegularPayment';
import NewInstruction from './pages/NewInstruction';
import NewDeposit from './pages/NewDeposit';
import NewBankAccount from './pages/NewBankAccount';
import InstructionDetails from './pages/InstructionDetails';

const routes = [
  { path: '/home', element: <Home /> },
  { path: '/accounts', element: <Accounts /> },
  { path: '/account/:id', element: <Account /> },
  { path: '/bank-accounts', element: <BankAccounts /> },
  { path: '/trades', element: <Trades /> },
  { path: '/new-trade', element: <NewTrade /> },
  { path: '/new-account', element: <NewAccount /> },
  { path: '/profile', element: <Profile /> },
  { path: '/payments', element: <Payments /> },
  {
    path: '/research',
    element: <Research />,
    children: [
      { path: 'stocks', element: <ResearchStocks /> },
      { path: 'crypto', element: <ResearchCrypto /> },
      { path: 'funds', element: <ResearchFunds /> },
    ],
  },
  { path: '/documents', element: <Documents /> },
  { path: '/register', element: <Register /> },
  { path: '/new-regular-payment', element: <NewRegularPayment /> },
  { path: '/new-instruction/:id', element: <NewInstruction /> },
  { path: '/instruction-details/:id', element: <InstructionDetails /> },
  { path: '/new-payment', element: <NewPayment /> },
  { path: '/new-deposit/:id', element: <NewDeposit /> },
  { path: '/new-bank-account', element: <NewBankAccount /> },

];

export default routes;
