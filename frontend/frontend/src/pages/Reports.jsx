import { useEffect, useState } from "react";
import API from "../api";

function Reports() {

  const [returnsReport, setReturnsReport] = useState([]);

  const fetchReport = async () => {

    try {

      const res = await API.get("/reports/returns");
      setReturnsReport(res.data);

    } catch (error) {
      console.error("Report fetch error:", error);
    }

  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Returns Report
      </h1>

      <div className="bg-white shadow-lg rounded-xl border overflow-hidden">

        <table className="w-full table-auto">

          <thead className="bg-gray-100">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Total Returns</th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {returnsReport.length === 0 ? (

              <tr>
                <td className="px-6 py-4 text-gray-500" colSpan="2">
                  No return data available
                </td>
              </tr>

            ) : (

              returnsReport.map((r, i) => (

                <tr key={i} className="hover:bg-gray-50">

                  <td className="px-6 py-3">
                    {r.product}
                  </td>

                  <td className="px-6 py-3 font-semibold">
                    {r.total_returns}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );
}

export default Reports;