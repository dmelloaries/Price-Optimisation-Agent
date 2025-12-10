import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import MyProducts from "./pages/products/MyProducts";
import Promotions from "./pages/promotions/Promotions";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/products" replace />} />
          <Route path="products" element={<MyProducts />} />
          <Route path="promotions" element={<Promotions />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
