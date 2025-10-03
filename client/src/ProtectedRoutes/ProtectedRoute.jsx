import { Navigate, Outlet } from "react-router-dom";
import apiStore from "../components/Store/apiStores";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const { verifyLogIn, makeUserNull } = apiStore();
  const [isVerified, setIsVerified] = useState(null); 

  useEffect(() => {
    const checkLogin = async () => {
     try {
      const response = await verifyLogIn();
      if (response && response.success) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
        makeUserNull()
      }
    } catch (error) {
      console.log(error)
      makeUserNull()
     }
    };

    checkLogin();
  }, [verifyLogIn]);

  if (isVerified === null) {
    return <div>Loading...</div>; //TODO: Add a spinner
  }

  return isVerified ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
