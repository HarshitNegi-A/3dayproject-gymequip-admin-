import React, { Fragment, useEffect, useState } from "react";
import classes from "./Orders.module.css"; // CSS file for styling
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Orders = () => {
  const [orders, setOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // state to store selected order details
  const navigate = useNavigate();

  // Fetching orders from Firebase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "https://zepto-kind-default-rtdb.firebaseio.com/orders.json"
        );
        const data = await response.json();
        const groupedOrders = {};

        // Looping through each user in the database and grouping orders by user email
        for (const userEmail in data) {
          const userOrders = [];
          for (const orderId in data[userEmail]) {
            userOrders.push({
              orderId,
              ...data[userEmail][orderId],
            });
          }
          groupedOrders[userEmail] = userOrders;
        }

        setOrders(groupedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to change the order status
  const handleChangeStatus = async (orderId, newStatus, userEmail) => {
    try {
      const updatedOrder = {
        ...orders[userEmail].find((order) => order.orderId === orderId),
        status: newStatus,
      };

      await fetch(
        `https://zepto-kind-default-rtdb.firebaseio.com/orders/${userEmail}/${orderId}.json`,
        {
          method: "PATCH",
          body: JSON.stringify(updatedOrder),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update the local state with the new status
      setOrders((prevOrders) => ({
        ...prevOrders,
        [userEmail]: prevOrders[userEmail].map((order) =>
          order.orderId === orderId
            ? { ...order, status: newStatus }
            : order
        ),
      }));
    } catch (error) {
      console.error("Error changing order status:", error);
    }
  };

  // Handle clicking on an order to show detailed info
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  // Close the order detail view
  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <Fragment>
        <Header/>
    <div className={classes.ordersContainer}>
      <h2>Admin Orders Management</h2>
      {Object.keys(orders).length === 0 ? (
        <p>No orders found.</p>
      ) : (
        Object.keys(orders).map((userEmail) => (
          <div key={userEmail}>
            <h3>User Email: {userEmail}</h3>
            <table className={classes.ordersTable}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Total Price</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders[userEmail].map((order) => {
                  const address = order.address ? Object.values(order.address) : [];

                  // Ensure totalPrice is a valid number
                  const totalPrice = order.totalPrice && !isNaN(order.totalPrice)
                    ? order.totalPrice
                    : 0;

                  return (
                    <tr
                      key={order.orderId}
                       // Make order row clickable
                      className={classes.orderRow}
                    >
                      <td onClick={() => handleOrderClick(order)} className={classes.orderid}>{order.orderId}</td>
                      <td>${totalPrice.toFixed(2)}</td>
                      <td>{order.items.length} items</td>
                      <td>{order.status}</td>
                      <td>
                        <button
                          onClick={() =>
                            handleChangeStatus(order.orderId, "Confirmed", userEmail)
                          }
                        >
                          Confirmed
                        </button>
                        <button
                          onClick={() =>
                            handleChangeStatus(order.orderId, "Shipped", userEmail)
                          }
                        >
                          Shipped
                        </button>
                        <button
                          onClick={() =>
                            handleChangeStatus(order.orderId, "Delivered", userEmail)
                          }
                        >
                          Delivered
                        </button>
                        <button
                          onClick={() =>
                            handleChangeStatus(order.orderId, "Failed", userEmail)
                          }
                        >
                          Failed
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className={classes.orderDetailsModal}>
          <div className={classes.modalContent}>
            <button onClick={handleCloseOrderDetails} className={classes.closeButton}>
              X
            </button>
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
            <p><strong>User Name:</strong> {selectedOrder.address ? selectedOrder.address.name : "Unknown"}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Total Price:</strong> ${selectedOrder.totalPrice.toFixed(2)}</p>
            <p><strong>Items:</strong></p>
            <ul>
              {selectedOrder.items.map((item, index) => (
                <li key={index}>
                  <strong>{item.name}</strong> (x{item.quantity}) - ${item.price} each
                  <br />
                  <small>{item.description}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
    </Fragment>
  );
};

export default Orders;
