import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

function SalesOrderDetails() {

  const { id } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
  }, []);

  const fetchOrder = async () => {
    const res = await API.get(`/sales-orders/${id}`);
    setOrder(res.data);
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Sales Order #{order.id}
      </h1>

      <p className="mb-4">
        Customer: <b>{order.customer_name}</b>
      </p>

      <p className="mb-6">
        Status: {order.status}
      </p>

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Warehouse</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Qty</th>
            </tr>
          </thead>

          <tbody>

            {order.items.map((item) => (

              <tr key={item.id} className="border-t">

                <td className="p-3">{item.product_name}</td>

                <td className="p-3">{item.warehouse_id}</td>

                <td className="p-3">{item.location_id}</td>

                <td className="p-3">{item.quantity}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default SalesOrderDetails;