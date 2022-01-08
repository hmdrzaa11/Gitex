import axios from "axios";

let LandingPage = ({ currentUser }) => {
  // console.log(currentUser);
  return <h1>Landing page </h1>;
};

LandingPage.getInitialProps = async () => {
  // let response = await axios.get("/api/users/currentuser");
  console.log("I was executed ....");
  // return response.data;
  return {};
};

export default LandingPage;
