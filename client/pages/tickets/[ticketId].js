import React from "react";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

const Ticket = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      Router.push("/orders/[orderId]", `/orders/${order.id}`);
    },
  });
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price ${ticket.price}.00</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

Ticket.getInitialProps = async (context, client, currentUser) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`api/tickets/${ticketId}`);

  return { ticket: data };
};

export default Ticket;
