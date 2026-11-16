import React from "react";
import Link from "next/link";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

const CancelButton = ({ orderId }) => {
  const { doRequest, errors, loading } = useRequest({
    url: `/api/orders/${orderId}`,
    method: "delete",
    body: {},
    onSuccess: () => Router.reload(),
  });

  return (
    <>
      {errors}
      <button
        className="btn btn-sm btn-outline-danger"
        disabled={loading}
        onClick={() => doRequest()}
      >
        {loading ? "Canceling..." : "Cancel"}
      </button>
    </>
  );
};

const Orders = ({ orders }) => {
  return (
    <div className="gttx-panel">
      <h1>My orders</h1>
      {orders.length === 0 ? (
        <div className="gttx-empty">You have no orders yet.</div>
      ) : (
        <div>
          {orders.map((order) => {
            const statusClass = `gttx-status gttx-status-${String(order.status)
              .toLowerCase()
              .replace(/\s+/g, "-")}`;
            const canCancel =
              order.status === "created" || order.status === "Created";

            return (
              <div className="gttx-order-row" key={order.id}>
                <div>
                  <Link href={`/orders/${order.id}`}>
                    <strong>{order.ticket.title}</strong>
                  </Link>
                  <div>
                    <span className={statusClass}>{order.status}</span>
                  </div>
                </div>
                <div className="gttx-actions">
                  <Link
                    className="btn btn-sm btn-outline-secondary"
                    href={`/orders/${order.id}`}
                  >
                    View
                  </Link>
                  {canCancel && <CancelButton orderId={order.id} />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

Orders.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser) {
    if (typeof window === "undefined") {
      context.res.writeHead(302, { Location: "/auth/signin" });
      context.res.end();
    } else {
      Router.push("/auth/signin");
    }
    return { orders: [] };
  }

  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default Orders;
