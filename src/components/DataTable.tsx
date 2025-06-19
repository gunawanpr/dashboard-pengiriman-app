import React, { useRef, useEffect } from "react";
import { DeliveryOrder } from "@/types/delivery";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface DataTableProps {
  orders: DeliveryOrder[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const DataTable: React.FC<DataTableProps> = ({
  orders,
  loading,
  hasMore,
  onLoadMore,
}) => {
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!tableRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (isNearBottom && hasMore && !loading) {
        onLoadMore();
      }
    };

    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener("scroll", handleScroll);
      return () => tableElement.removeEventListener("scroll", handleScroll);
    }
  }, [hasMore, loading, onLoadMore]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number = 30) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      planning: "bg-gray-100 text-gray-800",
      scheduled: "bg-blue-100 text-blue-800",
      in_transit: "bg-yellow-100 text-yellow-800",
      arrived: "bg-green-100 text-green-800",
    };

    const statusLabels = {
      planning: "Sedang Dijadwalkan",
      scheduled: "Terjadwal",
      in_transit: "Dalam Pengiriman",
      arrived: "Tiba",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColors[status as keyof typeof statusColors] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  return (
    <div className="overflow-hidden">
      <div ref={tableRef} className="max-h-[26rem] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DO/No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DO/ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Goods
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Goods in Ton
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Type Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Origin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destination Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referensi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr
                key={`${order.do_id}-${index}`}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex gap-4 justify-between items-center">
                  <span>{order.do_no}</span>

                  <Popover>
                    <PopoverTrigger className="text-xs font-semibold border px-4 py-2 rounded-lg hover:bg-slate-400 hover:text-white transition-colors">
                      Kelola
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-2 rounded-xl">
                      <button
                        className="flex items-center gap-1 px-3 py-1 rounded-md"
                        onClick={() =>
                          console.log("Delete order:", order.do_id)
                        }
                      >
                        <span className="text-xs px-4 py-2 text-white bg-red-500 hover:bg-red-700 transition-colors rounded-xl">
                          Hapus
                        </span>
                      </button>
                    </PopoverContent>
                  </Popover>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.do_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span title={order.goods_name} className="cursor-help">
                    {truncateText(order.goods_name)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.goods_qty}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.goods_unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.goods_qty_ton}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.order_type_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.origin_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    title={order.destination_address}
                    className="cursor-help"
                  >
                    {order.destination_name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.ref_no}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.updated_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}

        {!hasMore && orders.length > 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No more orders to load
          </div>
        )}

        {orders.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">No orders found</div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
