import { CreateOrderPage } from './pages/CreateOrderPage/CreateOrderPage';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import { EthProvider } from './contexts/EthContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <EthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/create-order" element={<CreateOrderPage />} />
          <Route path="/" element={<OrdersPage />} />
        </Routes>
      </BrowserRouter>
    </EthProvider>
  );
}

export default App;
