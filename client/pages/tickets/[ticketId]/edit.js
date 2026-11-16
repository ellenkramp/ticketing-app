import { useState } from "react";
import Router from "next/router";
import useRequest from "../../../hooks/useRequest";

const EditTicket = ({ ticket }) => {
  const [title, setTitle] = useState(ticket.title);
  const [price, setPrice] = useState(Number(ticket.price).toFixed(2));

  const { doRequest, errors, loading } = useRequest({
    url: `/api/tickets/${ticket.id}`,
    method: "put",
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push(`/tickets/${ticket.id}`),
  });

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <div className="gttx-panel">
      <h1>Edit ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
};

EditTicket.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser) {
    if (typeof window === "undefined") {
      context.res.writeHead(302, { Location: "/auth/signin" });
      context.res.end();
    } else {
      Router.push("/auth/signin");
    }
    return { ticket: { title: "", price: 0 } };
  }

  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  if (data.userId !== currentUser.id) {
    if (typeof window === "undefined") {
      context.res.writeHead(302, { Location: `/tickets/${ticketId}` });
      context.res.end();
    } else {
      Router.push(`/tickets/${ticketId}`);
    }
  }

  return { ticket: data };
};

export default EditTicket;
