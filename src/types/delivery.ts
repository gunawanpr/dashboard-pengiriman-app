export interface DeliveryOrder {
  do_no: string;
  do_id: string;
  goods_name: string;
  goods_qty: number;
  goods_unit: string;
  goods_qty_ton: number;
  order_type: string;
  order_type_name: string;
  origin_name: string;
  destination_name: string;
  destination_address: string;
  status: string;
  ref_no: string;
  updated_at: string;
}

export type TabType =
  | "all"
  | "planning"
  | "scheduled"
  | "in_transit"
  | "arrived";

export interface FilterState {
  origins: string[];
  destinations: string[];
}

export interface FilterOption {
  name: string;
  code: string;
}
