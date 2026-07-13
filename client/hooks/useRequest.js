import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const doRequest = async (props = {}) => {
    try {
      setLoading(true);
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      const messages =
        err?.response?.data?.errors?.map((e) => e.message) ||
        (err?.message ? [err.message] : ["Something went wrong"]);

      setErrors(
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Oops...</h4>
          <ul className="my-0">
            {messages.map((message, index) => (
              <li key={`${message}-${index}`}>{message}</li>
            ))}
          </ul>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  return { doRequest, errors, loading };
};

export default useRequest;
