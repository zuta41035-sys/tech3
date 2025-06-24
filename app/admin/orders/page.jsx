"use client";

import React, { useState, useEffect } from "react";
import { Eye, RefreshCw, Filter, ChevronLeft, ChevronRight } from "lucide-react";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [currentPage, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/orders/admin/all?page=${currentPage}&status=${statusFilter}&limit=10`
      );
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      } else {
        console.error("Failed to load orders:", data.message);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

    const viewOrder = async (orderId) => {
    try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();

        if (data.success) {
        setSelectedOrder(data.order);
        setShowModal(true);
        } else {
        alert("Failed to load order details");
        }
    } catch (error) {
        console.error("Error fetching order details:", error);
        alert("Error loading order details");
    }
    };


  const updateOrderStatus = async (orderId, currentStatus) => {
    const newStatus = prompt(
      `Current status: ${currentStatus}\n\nEnter new status (pending, confirmed, processing, shipped, delivered, cancelled):`
    );

    if (
      newStatus &&
      ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].includes(
        newStatus.toLowerCase()
      )
    ) {
      try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderStatus: newStatus.toLowerCase() }),
        });

        const data = await response.json();

        if (data.success) {
          alert("Order status updated successfully!");
          loadOrders();
        } else {
          alert("Failed to update order status: " + data.message);
        }
      } catch (error) {
        console.error("Error updating order:", error);
        alert("Error updating order status");
      }
    } else if (newStatus) {
      alert(
        "Invalid status. Please use: pending, confirmed, processing, shipped, delivered, or cancelled"
      );
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-gray-100 text-gray-800",
      delivered: "bg-teal-100 text-teal-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const OrderModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900">Order ID</h3>
                <p className="text-gray-600">{selectedOrder.orderId}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Order Date</h3>
                <p className="text-gray-600">
                  {new Date(selectedOrder.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Status</h3>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    selectedOrder.orderStatus
                  )}`}
                >
                  {selectedOrder.orderStatus.toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Total Amount</h3>
                <p className="text-gray-600 font-semibold">
                  ${selectedOrder.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <span className="font-medium">Name:</span> {selectedOrder.customerInfo.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {selectedOrder.customerInfo.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {selectedOrder.customerInfo.phone}
                </p>
                {selectedOrder.customerInfo.address && (
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {selectedOrder.customerInfo.address.street}
                  </p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                      <th className="px-4 py-2 text-left">Price</th>
                      <th className="px-4 py-2 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{item.productName}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-2">${item.totalPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900">Payment Method</h3>
                <p className="text-gray-600 capitalize">
                  {selectedOrder.paymentMethod?.replace("_", " ")}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Payment Status</h3>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    selectedOrder.paymentStatus
                  )}`}
                >
                  {selectedOrder.paymentStatus?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Notes */}
            {selectedOrder.notes && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedOrder.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">View Orders</h1>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={loadOrders}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{order.customerInfo.name}</div>
                        <div className="text-gray-500">{order.customerInfo.email}</div>
                        <div className="text-gray-500">{order.customerInfo.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="text-gray-900 py-1 border-b border-gray-100 last:border-b-0"
                          >
                            {item.productName} × {item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewOrder(order.orderId)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.orderId, order.orderStatus)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && <OrderModal />}
    </div>
  );
};

export default ViewOrders;
