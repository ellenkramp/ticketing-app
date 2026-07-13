import React, { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors, loading } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <div className="gttx-panel">
      <form onSubmit={onSubmit}>
        <h1>Sign In</h1>
        <div className="form-group mb-3">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errors}
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default Signin;
