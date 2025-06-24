'use client';

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import { Trash2 } from "lucide-react";

const Orders = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/order");
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      setDeletingId(orderId);

      const res = await fetch(`/api/order/${orderId}`, {
        method: "DELETE",
      });

      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        throw new Error(`Unexpected server response: ${text}`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete order");
      }

      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (error) {
      alert("Error deleting order: " + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 h-screen overflow-auto flex flex-col justify-between text-sm bg-gray-50">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5 max-w-6xl mx-auto w-full">
          <h2 className="text-lg font-medium mb-4">Orders</h2>

          <div className="rounded-md border border-gray-300 divide-y divide-gray-300 bg-white shadow-sm">
            {orders.length === 0 ? (
              <p className="p-4 text-center text-gray-600">No orders found.</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 items-center"
                >
                  <Image
                    className="max-w-16 max-h-16 object-cover rounded"
                    src={assets.box_icon}
                    alt="Order Icon"
                    width={64}
                    height={64}
                  />

                  <div className="flex-1 flex flex-col gap-1 min-w-[200px]">
                    <span className="font-medium text-gray-900">
                      {order.products?.length > 0
                        ? order.products
                            .map((item) => `${item.name} x ${item.quantity}`)
                            .join(", ")
                        : "No products"}
                    </span>
                    <span className="text-gray-600">
                      Items: {order.products?.length || 0}
                    </span>
                  </div>

                  <div className="text-gray-700 min-w-[180px]">
                    <p>
                      <span className="font-medium">User ID:</span> {order.userId || "N/A"}
                      <br />
                      <span className="font-medium">Date:</span>{" "}
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      <br />
                      <span className="font-medium">Payment Status:</span>{" "}
                      {order.status || "Pending"}
                    </p>
                  </div>

                  <p className="font-semibold text-indigo-600 text-lg my-auto min-w-[80px] text-right">
                    {currency}
                    {order.totalAmount?.toFixed(2) || "0.00"}
                  </p>

                  <button
                    onClick={() => handleDelete(order._id)}
                    disabled={deletingId === order._id}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                    title="Delete Order"
                  >
                    {deletingId === order._id ? "Deleting..." : <Trash2 className="w-6 h-6" />}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Orders;
