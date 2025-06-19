type Payload = {
  keyword: string;
  filter: {
    order_status: string[];
    origin_code: string[];
    destination_code: string[];
  };
  page: number;
};

export async function fetchOrderList(payload: Payload) {
  const res = await fetch("/data/orderList.json");
  const allData = await res.json();

  const filtered = allData.filter((item: any) => {
    const keyword = payload.keyword.toLowerCase();

    const matchKeyword =
      keyword === "" || item.goods_name.toLowerCase().includes(keyword);

    const orderStatus = payload.filter.order_status;
    const matchStatus = orderStatus.includes(item.status);

    const matchOrigin =
      payload.filter.origin_code.length === 0 ||
      payload.filter.origin_code.includes(item.origin_code);

    const matchDestination =
      payload.filter.destination_code.length === 0 ||
      payload.filter.destination_code.includes(item.destination_code);

    return matchKeyword && matchStatus && matchOrigin && matchDestination;
  });

  const pageSize = 10;
  const start = (payload.page - 1) * pageSize;
  const paginatedData = filtered.slice(start, start + pageSize);

  return {
    data: paginatedData,
    total: filtered.length,
  };
}
