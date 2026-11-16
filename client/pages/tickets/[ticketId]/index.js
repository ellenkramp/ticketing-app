import React from "react";
import Link from "next/link";
import Router from "next/router";
import useRequest from "../../../hooks/useRequest";

const Ticket = ({ ticket, currentUser }) => {
  const { doRequest, errors, loading } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      Router.push(`/orders/${order.id}`);
    },
  });

  const isOwner = currentUser && currentUser.id === ticket.userId;
  const isReserved = Boolean(ticket.orderId);

  return (
    <div className="gttx-panel">
      <h1>{ticket.title}</h1>
      <h4>Price ${Number(ticket.price).toFixed(2)}</h4>
      {isReserved && (
        <p className="text-muted">This ticket is currently reserved.</p>
      )}
      {errors}
      <div className="gttx-actions">
        {currentUser && !isOwner && !isReserved && (
          <button
            onClick={() => doRequest()}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Purchasing..." : "Purchase"}
          </button>
        )}
        {!currentUser && (
          <Link className="btn btn-primary" href="/auth/signin">
            Sign in to purchase
          </Link>
        )}
        {isOwner && !isReserved && (
          <Link
            className="btn btn-outline-secondary"
            href={`/tickets/${ticket.id}/edit`}
          >
            Edit ticket
          </Link>
        )}
        <Link className="btn btn-outline-secondary" href="/">
          Back
        </Link>
      </div>
    </div>
  );
};

Ticket.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default Ticket;
