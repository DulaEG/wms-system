import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

function SalesOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 5;

  const fetchOrders = async () => {
    try {

      const statusParam =
        statusFilter === "ALL" ? "" : `?status=${statusFilter}`;

      const res = await API.get(`/sales-orders${statusParam}`);

      setOrders(res.data);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
  fetchOrders();
// eslint-disable-next-line
}, [statusFilter]);

  const dispatchOrder = async (id) => {

    if (!window.confirm("Dispatch this order?")) return;

    try {

      await API.put(`/sales-orders/dispatch/${id}`);

      fetchOrders();

    } catch (err) {

      alert(err.response?.data?.message);

    }
  };

  const cancelOrder = async (id) => {

    if (!window.confirm("Cancel this order?")) return;

    try {

      await API.put(`/sales-orders/cancel/${id}`);

      fetchOrders();

    } catch (err) {

      alert(err.response?.data?.message);

    }
  };

  const filteredOrders = orders.filter(order =>
    order.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / perPage);

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * perPage,
    page * perPage
  );

  if (loading) return <p>Loading...</p>;

  return (

    <div>

      {/* HEADER */}
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


      {/* FILTERS */}

      <div className="flex gap-4 mb-4">

        <input
          type="text"
          placeholder="Search customer..."
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >

          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="DISPATCHED">Dispatched</option>
          <option value="CANCELLED">Cancelled</option>

        </select>

      </div>


      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">Order No</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {paginatedOrders.map((order) => {

              const orderNumber =
                `SO-${order.id.toString().padStart(4, "0")}`;

              return (

                <tr key={order.id} className="border-t">

                  <td className="p-3 font-medium">
                    {orderNumber}
                  </td>

                  <td className="p-3">
                    {order.customer_name}
                  </td>

                  <td className="p-3">
                    {order.items}
                  </td>

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

              );

            })}

          </tbody>

        </table>

      </div>


      {/* PAGINATION */}

      <div className="flex gap-2 mt-4">

        {Array.from({ length: totalPages }, (_, i) => (

          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded
              ${page === i + 1 ? "bg-blue-500 text-white" : ""}
            `}
          >
            {i + 1}
          </button>

        ))}

      </div>

    </div>
  );
}

export default SalesOrders;