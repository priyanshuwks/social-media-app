import React, { useEffect } from "react";
import { axiosClient } from "../../utils/axiosClient";

function Home() {
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // console.log("sending the request");
      const response = await axiosClient.get("http://localhost:4000/post/all");
      // console.log("response received");
      console.log("got the response", response);
    } catch (err) {
      console.log(err);
    }
  }
  return <div>Home</div>;
}

export default Home;
