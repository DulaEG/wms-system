import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

function SalesOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/sales-orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const dispatchOrder = async (id) => {
    try {
      await API.put(`/sales-orders/dispatch/${id}`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const cancelOrder = async (id) => {
    try {
      await API.put(`/sales-orders/cancel/${id}`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>

      <div className="flex justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Sales Orders
        </h1>

        <Link
          to="/sales-orders/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Order
        </Link>

      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {orders.map((order) => (

              <tr key={order.id} className="border-t">

                <td className="p-3">{order.id}</td>

                <td className="p-3">{order.customer_name}</td>

                <td className="p-3">

                  {order.status === "PENDING" && (
                    <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded">
                      Pending
                    </span>
                  )}

                  {order.status === "DISPATCHED" && (
                    <span className="bg-green-200 text-green-800 px-3 py-1 rounded">
                      Dispatched
                    </span>
                  )}

                  {order.status === "CANCELLED" && (
                    <span className="bg-red-200 text-red-800 px-3 py-1 rounded">
                      Cancelled
                    </span>
                  )}

                </td>

                <td className="p-3">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>

                <td className="p-3 space-x-2">

  {/* VIEW BUTTON */}
  <Link
    to={`/sales-orders/${order.id}`}
    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
  >
    View
  </Link>

  {order.status === "PENDING" && (
    <>
      <button
        onClick={() => dispatchOrder(order.id)}
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        Dispatch
      </button>

      <button
        onClick={() => cancelOrder(order.id)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Cancel
      </button>
    </>
  )}

</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default SalesOrders;