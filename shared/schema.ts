import { z } from "zod";

export const categorySchema = z.enum(["thaalis", "loataas", "diyaas", "crafts"]);

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: categorySchema,
  imageBase64: z.string(),
  stock: z.number(),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  featured: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const orderStatusSchema = z.enum(["pending", "shipped", "delivered", "cancelled"]);

export const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  imageBase64: z.string(),
});

export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  customerPhone: z.string().optional(),
  shippingAddress: z.string(),
  items: z.array(orderItemSchema),
  totalAmount: z.number(),
  status: orderStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertOrderSchema = orderSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const cartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  imageBase64: z.string(),
  stock: z.number(),
});

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  isAdmin: z.boolean().optional(),
});

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = z.infer<typeof orderSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type User = z.infer<typeof userSchema>;
export type Category = z.infer<typeof categorySchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
