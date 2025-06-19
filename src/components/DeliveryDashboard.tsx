import React, { useState, useEffect } from "react";
import TabHeader from "./TabHeader";
import SearchBar from "./SearchBar";
import FilterPopover from "./FilterPopover";
import DataTable from "./DataTable";
import { DeliveryOrder, TabType, FilterState } from "@/types/delivery";
import { fetchOrderList } from "@/utils/fetchOrderList";

interface Payload {
  keyword: string;
  filter: {
    order_status: string[];
    origin_code: string[];
    destination_code: string[];
  };
  page: number;
}

const DeliveryDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    origins: [],
    destinations: [],
  });
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [payload, setPayload] = useState<Payload>({
    keyword: "",
    filter: {
      order_status: ["planning", "scheduled", "in_transit", "arrived"],
      origin_code: [],
      destination_code: [],
    },
    page: 1,
  });

  const handleFilterApply = async () => {
    setLoading(true);
    const result = await fetchOrderList(payload);
    setLoading(false);

    return result;
  };

  const fetchOrders = async (reset = false) => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentPage = reset ? 1 : page;
    const newOrders = (await handleFilterApply()).data;

    if (reset) {
      setOrders(newOrders);
      setPage(2);
    } else {
      setOrders((prev) => [...prev, ...newOrders]);
      setPage((prev) => prev + 1);
    }

    setHasMore(currentPage < 5);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders(true);
  }, [activeTab, searchQuery, filters]);

  const handleTabChange = (tab: TabType) => {
    setOrders([]);

    let allTab = [];
    if (tab === "all") {
      allTab = ["planning", "scheduled", "in_transit", "arrived"];
    } else {
      allTab = [tab];
    }

    setPayload({
      keyword: payload.keyword,
      filter: {
        order_status: [...allTab],
        origin_code: [...payload.filter.origin_code],
        destination_code: [...payload.filter.destination_code],
      },
      page: 1,
    });

    setActiveTab(tab);
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchOrders(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (
      searchQuery &&
      !order.goods_name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.origins.length > 0 &&
      !filters.origins.includes(order.origin_name)
    ) {
      return false;
    }

    if (
      filters.destinations.length > 0 &&
      !filters.destinations.includes(order.destination_name)
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Dashboard Pengiriman
            </h1>

            <TabHeader activeTab={activeTab} onTabChange={handleTabChange} />

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="flex-1">
                <SearchBar value={searchQuery} onChange={handleSearchChange} />
              </div>
              <FilterPopover
                filters={filters}
                onFiltersChange={handleFilterChange}
              />
            </div>
          </div>

          <DataTable
            orders={filteredOrders}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
