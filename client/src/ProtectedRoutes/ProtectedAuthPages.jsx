import { Outlet, Navigate } from "react-router-dom";
import apiStore from "../components/Store/apiStores";
import { useEffect, useState } from "react";

const ProtectedAuthPages = () => {
  const { verifyLogIn } = apiStore();
  const [loggedin, setLoggedin] = useState(false);

  const verifyUserLogin = async () => {
    try {
      const response = await verifyLogIn();

      if (response && response.success) {
        setLoggedin(true);
      } else {
        setLoggedin(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(()=>{
    verifyUserLogin();
  },[verifyLogIn])

  return !loggedin ? <Outlet /> : <Navigate to={"/"} />;
};

export default ProtectedAuthPages;
