"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString();
};

const MyOrders = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", {
        credentials: "include",
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch orders: ${text}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON but got: ${text}`);
      }

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch orders");

      setOrders(data.orders || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch orders");
      setOrders([]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      setDeletingId(orderId);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to delete order");
      }

      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      toast.success("Order deleted successfully");
    } catch (error) {
      toast.error("Error deleting order: " + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-wrapper flex flex-col justify-between min-h-screen px-6 md:px-16 lg:px-32 py-6">
      <div className="page-header space-y-5">
        <h2 className="text-lg font-medium mt-6">My Orders</h2>

        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-20">You have no orders yet.</p>
        ) : (
          <div className="orders-container w-full border-t border-gray-300 text-sm">
            {orders.map((order) => (
              <div
                key={order._id}
                className="order-card relative flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300 w-full"
                aria-label={`Order placed on ${formatDate(order.orderDate)}`}
              >
                <div className="order-product flex-1 flex gap-5 max-w-80">
                  <Image
                    className="max-w-16 max-h-16 object-cover"
                    src={assets.box_icon}
                    alt="Order Icon"
                    width={64}
                    height={64}
                  />
                  <p className="flex flex-col gap-3">
                    <span className="font-medium text-base">
                      Order #{order.orderId || order._id.slice(-8)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {order.products && order.products.length > 0
                        ? order.products.map((item) => `${item.name} x ${item.quantity}`).join(", ")
                        : "No products"}
                    </span>
                    <span>Items: {order.products?.length || 0}</span>
                  </p>
                </div>

                <div className="order-address">
                  <p>
                    <span className="font-medium">{order.address?.fullName || "N/A"}</span>
                    <br />
                    <span>{order.address?.area || ""}</span>
                    <br />
                    <span>{order.address?.city || ""}</span>
                    <br />
                    <span>{order.address?.phoneNumber || ""}</span>
                  </p>
                </div>

                <div className="order-status">
                  <p className="flex flex-col">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.orderStatus?.toUpperCase() || 'PENDING'}
                    </span>
                  </p>
                </div>

                <p className="order-total font-medium my-auto">
                  {currency}
                  {(order.totalAmount || 0).toFixed(2)}
                </p>

                <div className="order-payment">
                  <p className="flex flex-col">
                    <span>Method: {order.paymentMethod || "COD"}</span>
                    <span>Date: {formatDate(order.orderDate)}</span>
                    <span>Payment: {order.paymentStatus || "Pending"}</span>
                  </p>
                </div>

                <button
                  disabled={deletingId === order._id}
                  onClick={() => handleDelete(order._id)}
                  aria-label="Delete Order"
                  className="text-red-600 hover:text-red-800 ml-4 self-center disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;