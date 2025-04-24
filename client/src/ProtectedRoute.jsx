import { Navigate, Outlet } from "react-router-dom";
import apiStore from "./components/Store/apiStores";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const { verifyLogIn } = apiStore();
  const [isVerified, setIsVerified] = useState(null); // null = loading

  useEffect(() => {
    const checkLogin = async () => {
      const response = await verifyLogIn();
      if (response && response.success) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    };

    checkLogin();
  }, [verifyLogIn]);

  if (isVerified === null) {
    return <div>Loading...</div>; // Or a spinner
  }

  return isVerified ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
