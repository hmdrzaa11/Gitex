import { useEffect, useState } from "react";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";

let OrderShow = ({ order, currentUser }) => {
  let [timeLeft, setTimeLeft] = useState(0);
  let { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    let findTimeLeft = () => {
      let msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    let timerId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, []);

  if (timeLeft < 0) return <div>OrderExpired</div>;

  return (
    <div>
      <h4>{timeLeft} seconds left to until order expires </h4>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51H4WtuBX7fdeFqamvMt2pXeTZAxx8NoVTsMSaK7xJYfyLSZv3pxVemwbsWKNDEhq1tpXPMPqKMFgybbmT1F54wxF00RT5zTcy5"
        amount={order.price}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  let { orderId } = context.query;
  let { data } = await client.get(`/api/orders/${orderId}`);
  return {
    order: data,
  };
};

export default OrderShow;
