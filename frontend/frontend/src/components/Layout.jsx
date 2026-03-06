import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white p-5">

        <h2 className="text-2xl font-bold mb-10">WMS</h2>

        <nav className="space-y-4">

<Link to="/" className="block hover:text-blue-400">
Dashboard
</Link>

<Link to="/products" className="block hover:text-blue-400">
Products
</Link>

<Link to="/warehouses" className="block hover:text-blue-400">
Warehouses
</Link>

<Link to="/inventory" className="block hover:text-blue-400">
Inventory
</Link>

<Link to="/stock-movements" className="block hover:text-blue-400">
Stock Movements
</Link>

<Link to="/purchase-orders" className="block hover:text-blue-400">
Purchase Orders
</Link>

<Link to="/sales-orders" className="block hover:text-blue-400">
Sales Orders
</Link>

<Link to="/customers" className="block hover:text-blue-400">
Customers
</Link>

<Link to="/inventory-report" className="block hover:text-blue-400">
Inventory Report
</Link>

</nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>

    </div>
  );
}

export default Layout;