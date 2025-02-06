"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Swal from "sweetalert2";
import ProtectedRoute from "@/app/components/ProtectedRoute";

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: "Pending" | "Success";
}

// Define the expected API response structure
interface OrderResponse {
  _id: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status?: "Pending" | "Success";
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    client
      .fetch<OrderResponse[]>(
        `*[_type == "order"]{
          _id,
          customerFirstName,
          customerLastName,
          customerEmail,
          customerPhone,
          items,
          totalAmount,
          status
        }`
      )
      .then((data) =>
        setOrders(
          data.map((order) => ({
            _id: order._id,
            customer: {
              firstName: order.customerFirstName,
              lastName: order.customerLastName,
              email: order.customerEmail,
              phone: order.customerPhone,
            },
            items: order.items,
            totalAmount: order.totalAmount,
            status: order.status || "Pending",
          }))
        )
      )
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      Swal.fire("Deleted!", "Order has been removed.", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire("Error!", "Failed to delete order.", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: "Pending" | "Success") => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
      );
      Swal.fire("Updated!", "Order status has been updated.", "success");
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error!", "Failed to update status.", "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <nav className="bg-blue-600 text-white p-5 shadow-md flex justify-between">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        </nav>
        <div className="p-6 flex flex-col items-center w-full">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Orders</h2>
          <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4">
            {orders.length === 0 ? (
              <p className="text-center text-gray-500">No orders available.</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="border-b border-gray-200 py-4 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => toggleOrderDetails(order._id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{order.customer.firstName} {order.customer.lastName}</p>
                      <p className="text-sm text-gray-500">{order.customer.email}</p>
                      <p className="text-sm text-gray-500">{order.customer.phone}</p>
                    </div>
                    <p className={`font-bold text-lg ${order.status === "Pending" ? "text-yellow-500" : "text-green-600"}`}>{order.status}</p>
                    <select
                      className="border p-1 rounded"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value as "Pending" | "Success")}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Success">Success</option>
                    </select>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(order._id);
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                  {selectedOrderId === order._id && (
                    <div className="bg-gray-50 p-4 mt-2 rounded-md">
                      <h3 className="font-semibold text-gray-800">Order Details</h3>
                      <ul className="mt-2 text-sm text-gray-600">
                        {order.items.map((item, index) => (
                          <li key={`${order._id}-${index}`}>
                            {item.productName} - ${item.price} x {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
