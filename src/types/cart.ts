export type CartItem = {
  id: string;
  title: string;
  label: string;
  price: number;
  quantity: number;
  source: string;
};

export type CartItemPayload = Omit<CartItem, "quantity">;

export type CheckoutDetails = {
  name: string;
  phone: string;
  email: string;
  institute: string;
};

export type OrderSummary = {
  subtotal: number;
  gst: number;
  total: number;
};
