import React, { useState, useRef, useEffect } from "react";
import { Filter, Search, RotateCcw, X } from "lucide-react";
import { FilterState, FilterOption } from "@/types/delivery";

interface FilterPopoverProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"origin" | "destination">(
    "origin"
  );
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);
  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  const originOptions: FilterOption[] = [
    { name: "Bandung", code: "BDG" },
    { name: "Jakarta", code: "JKT" },
    { name: "Surabaya", code: "SBY" },
    { name: "Denpasar", code: "DPS" },
    { name: "Malang", code: "MLG" },
  ];

  const destinationOptions: FilterOption[] = [
    { name: "Medan", code: "MDN" },
    { name: "Banjarmasin", code: "BJM" },
    { name: "Pekanbaru", code: "PKU" },
    { name: "Palembang", code: "PLB" },
    { name: "Balikpapan", code: "BPN" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setTempFilters(filters);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, filters]);

  const handleCheckboxChange = (
    type: "origins" | "destinations",
    value: string,
    checked: boolean
  ) => {
    setTempFilters((prev) => ({
      ...prev,
      [type]: checked
        ? [...prev[type], value]
        : prev[type].filter((item) => item !== value),
    }));
  };

  const handleApply = () => {
    onFiltersChange(tempFilters);
    setIsOpen(false);
  };

  const handleResetAll = () => {
    setTempFilters({ origins: [], destinations: [] });
  };

  const hasChanges = JSON.stringify(tempFilters) !== JSON.stringify(filters);
  const totalSelected =
    tempFilters.origins.length + tempFilters.destinations.length;

  const filteredOrigins = originOptions.filter((option) =>
    option.name.toLowerCase().includes(originSearch.toLowerCase())
  );

  const filteredDestinations = destinationOptions.filter((option) =>
    option.name.toLowerCase().includes(destinationSearch.toLowerCase())
  );

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter size={16} />
        <span>Filter</span>
        {totalSelected > 0 && (
          <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
            {totalSelected}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-[26rem] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 flex">
            <div className="border-r border-gray-200 w-3/5 mr-4 pr-4">
              <button
                onClick={() => setActiveTab("origin")}
                className={`block px-4 py-2 mb-4 text-sm font-medium transition-all ${
                  activeTab === "origin"
                    ? "text-white bg-emerald-600 rounded-lg"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Origin{" "}
                {tempFilters.origins.length > 0 &&
                  `(${tempFilters.origins.length})`}
              </button>

              <button
                onClick={() => setActiveTab("destination")}
                className={`block px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === "destination"
                    ? "text-white bg-emerald-600 rounded-lg"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Destination{" "}
                {tempFilters.destinations.length > 0 &&
                  `(${tempFilters.destinations.length})`}
              </button>
            </div>

            {activeTab === "origin" && (
              <div className="space-y-3 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search origins..."
                    value={originSearch}
                    onChange={(e) => setOriginSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                  {originSearch && (
                    <button
                      onClick={() => setOriginSearch("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {filteredOrigins.map((option) => (
                    <label
                      key={option.code}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={tempFilters.origins.includes(option.name)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "origins",
                            option.name,
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">
                        {option.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({option.code})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "destination" && (
              <div className="space-y-3 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={destinationSearch}
                    onChange={(e) => setDestinationSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                  {destinationSearch && (
                    <button
                      onClick={() => setDestinationSearch("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {filteredDestinations.map((option) => (
                    <label
                      key={option.code}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={tempFilters.destinations.includes(option.name)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "destinations",
                            option.name,
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">
                        {option.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({option.code})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-4 flex gap-4 justify-end">
            <button
              onClick={handleResetAll}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              disabled={!hasChanges}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                hasChanges
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPopover;
