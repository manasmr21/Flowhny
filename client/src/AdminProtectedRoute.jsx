import { useEffect, useState } from "react";
import adminApi from "./components/Store/adminApi";
import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {
  const { verifyAdminLogin, makeAdminNull } = adminApi();
  const [verified, setVerified] = useState(null);

  const checkAdminLogin = async () => {
    try {
      const response = await verifyAdminLogin();

      if (response && response.success) {
        setVerified(true);
      }else{
        setVerified(false);
        makeAdminNull()
      }
    } catch (error) {
      console.log(error);
      verified(false);
      makeAdminNull();
    }
  };

  useEffect(() => {
    checkAdminLogin();
  }, [verifyAdminLogin]);

  if(verified === null){
    return <>
        <p>Loading...</p>
    </>
  }

  return verified ? <Outlet/> : <Navigate to={"/"} /> 
}

export default AdminProtectedRoute;
