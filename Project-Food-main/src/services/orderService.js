import api from "./api";

export const placeOrder = async (restaurantId, items, totalAmount) => {
  // 1. Backend manages the Cart. We need to add all items to backend cart first.
  for (const item of items) {
    await api.post("/cart/add", {
      menuItemId: item._id,   
      quantity: item.quantity
    });
  }

  // 2. Place the order which evaluates the current user's backend cart
  const { data } = await api.post("/order/place");
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

export const getOrderById = async (id) => {
  // Backend doesn't have GET /orders/{id}. Just return null for now.
  return null; 
};