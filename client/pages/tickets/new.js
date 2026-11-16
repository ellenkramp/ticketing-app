import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

const NewTicket = ({ currentUser }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors, loading } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push("/"),
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
      <h1>Create a ticket</h1>
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
          {loading ? "Creating..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

NewTicket.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser) {
    if (typeof window === "undefined") {
      context.res.writeHead(302, { Location: "/auth/signin" });
      context.res.end();
    } else {
      Router.push("/auth/signin");
    }
  }
  return {};
};

export default NewTicket;
