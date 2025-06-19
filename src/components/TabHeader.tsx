import React from "react";
import { Truck, Calendar, Clock, Package, MapPin } from "lucide-react";
import { TabType } from "@/types/delivery";

interface TabHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabHeader: React.FC<TabHeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: "all" as TabType,
      label: "Semua DO",
      icon: Package,
      count: 156,
    },
    {
      id: "planning" as TabType,
      label: "Sedang Dijadwalkan",
      icon: Clock,
      count: 23,
    },
    {
      id: "scheduled" as TabType,
      label: "Terjadwal",
      icon: Calendar,
      count: 45,
    },
    {
      id: "in_transit" as TabType,
      label: "Dalam Pengiriman",
      icon: Truck,
      count: 67,
    },
    {
      id: "arrived" as TabType,
      label: "Tiba di Muat",
      icon: MapPin,
      count: 21,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center justify-between gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 grow
              ${
                isActive
                  ? "bg-emerald-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            <span className="flex gap-2 items-center">
              <Icon size={16} />
              <span className="whitespace-nowrap">{tab.label}</span>
            </span>
            <span
              className={`
              px-2 py-0.5 rounded-full text-xs font-semibold
              ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-gray-600"
              }
            `}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TabHeader;
