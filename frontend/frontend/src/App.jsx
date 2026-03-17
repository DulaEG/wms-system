import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Warehouses from "./pages/Warehouses";
import StockMovements from "./pages/StockMovements";
import Inventory from "./pages/Inventory";
import PurchaseOrders from "./pages/PurchaseOrders";
import SalesOrders from "./pages/SalesOrders";
import CreateSalesOrder from "./pages/CreateSalesOrder";
import SalesOrderDetails from "./pages/SalesOrderDetails";
import Customers from "./pages/Customers";
import InventoryReport from "./pages/InventoryReport";
import CreateWarehouse from "./pages/CreateWarehouse";
import Login from "./pages/Login";
import Suppliers from "./pages/Suppliers";
import CreateSupplier from "./pages/CreateSupplier";
import CreateGRN from "./pages/CreateGRN";
import StockTransfer from "./pages/StockTransfer";

import Returns from "./pages/Returns";
import CreateReturn from "./pages/CreateReturn";

function App() {
  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* MAIN LAYOUT */}
        <Route path="/" element={<Layout />}>

          <Route index element={<Dashboard />} />

          <Route path="products" element={<Products />} />

          <Route path="warehouses" element={<Warehouses />} />
          <Route path="warehouses/create" element={<CreateWarehouse />} />

          <Route path="inventory" element={<Inventory />} />

          <Route path="stock-movements" element={<StockMovements />} />

          <Route path="stock-transfer" element={<StockTransfer />} />

          <Route path="purchase-orders" element={<PurchaseOrders />} />

          <Route path="sales-orders" element={<SalesOrders />} />
          <Route path="sales-orders/create" element={<CreateSalesOrder />} />
          <Route path="sales-orders/:id" element={<SalesOrderDetails />} />

          <Route path="customers" element={<Customers />} />

          <Route path="inventory-report" element={<InventoryReport />} />

          <Route path="suppliers" element={<Suppliers />} />
          <Route path="suppliers/create" element={<CreateSupplier />} />

          <Route path="create-grn" element={<CreateGRN />} />

          {/* RETURNS */}
          <Route path="returns" element={<Returns />} />
          <Route path="returns/create" element={<CreateReturn />} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;
