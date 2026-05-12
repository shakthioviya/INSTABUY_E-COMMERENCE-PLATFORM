import { BrowserRouter, Routes, Route } from "react-router-dom";

import Onboarding from "./pages/Onboarding";
import MainDashboard from "./pages/MainDashboard";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DealerProfile from "./pages/DealerProfile";
import ProductsPage from "./pages/ProductsPage";
import LowStockPage from "./pages/LowStockPage";
import OrderPage from "./pages/OrderPage";

function App() {
  return (
    

   
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<MainDashboard />} />
        <Route path="/products" element={<ProductsPage />} />
<Route path="/lowstock" element={<LowStockPage />} />
<Route path="/profile" element={<DealerProfile />} />
<Route path="/orders" element={<OrderPage />} />
<Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;