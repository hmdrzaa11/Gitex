import buildClient from "../api/buildClient";
let LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You're not signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  let client = buildClient(context);
  let { data } = await client.get("/api/users/currentuser");
  return data;
};

export default LandingPage;
