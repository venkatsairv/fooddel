import api from "./api";

export const placeOrder = async (restaurantId, items, totalAmount, address) => {
  const { data } = await api.post("/orders", { restaurantId, items, totalAmount, address });
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get("/orders/my");
  return data;
};