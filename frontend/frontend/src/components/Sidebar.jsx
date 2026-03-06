import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">📦 WMS</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/" className="hover:text-blue-400">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/products" className="hover:text-blue-400">
            Products
          </Link>
          <Link to="/stock-movements">
            Stock Movements
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;