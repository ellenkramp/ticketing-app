import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";

const Order = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const { doRequest, errors, loading } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  const {
    doRequest: cancelOrder,
    errors: cancelErrors,
    loading: cancelLoading,
  } = useRequest({
    url: `/api/orders/${order.id}`,
    method: "delete",
    body: {},
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order.expiresAt]);

  if (timeLeft === null) {
    return <div className="gttx-panel">Loading...</div>;
  }

  if (timeLeft <= 0) {
    return (
      <div className="gttx-panel">
        <h1>Order expired</h1>
        <p>This reservation is no longer available.</p>
        <div className="gttx-actions">
          <Link className="btn btn-primary" href="/">
            Browse tickets
          </Link>
          <Link className="btn btn-outline-secondary" href="/orders">
            My orders
          </Link>
        </div>
      </div>
    );
  }

  const canCancel = order.status === "created" || order.status === "Created";
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY || "";

  return (
    <div className="gttx-panel">
      <h1>{order.ticket.title}</h1>
      <p>
        <strong>${Number(order.ticket.price).toFixed(2)}</strong> · {timeLeft}{" "}
        seconds until this order expires
      </p>
      {errors}
      {cancelErrors}
      <div className="gttx-actions">
        {stripeKey ? (
          <StripeCheckout
            token={({ id }) => doRequest({ token: id })}
            stripeKey={stripeKey}
            amount={order.ticket.price * 100}
            email={currentUser?.email}
          />
        ) : (
          <div className="alert alert-warning" role="alert">
            Stripe publishable key is not configured.
          </div>
        )}
        {canCancel && (
          <button
            className="btn btn-outline-danger"
            disabled={cancelLoading || loading}
            onClick={() => cancelOrder()}
          >
            {cancelLoading ? "Canceling..." : "Cancel order"}
          </button>
        )}
      </div>
    </div>
  );
};

Order.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser) {
    if (typeof window === "undefined") {
      context.res.writeHead(302, { Location: "/auth/signin" });
      context.res.end();
    } else {
      Router.push("/auth/signin");
    }
    return { order: { ticket: {}, expiresAt: new Date().toISOString() } };
  }

  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default Order;
