import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  let [errors, setErrors] = useState(null);
  let doRequest = async (props = {}) => {
    try {
      setErrors(null);
      let response = await axios[method](url, { ...body, ...props });
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Oops...</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => {
              return <li key={err.message}>{err.message}</li>;
            })}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
