import { useEffect, useState } from "react";
import adminApi from "../components/Store/adminApi";
import apiStore from "../components/Store/apiStores";
import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {
  const { verifyAdminLogin, makeAdminNull } = adminApi();
  const { verifyLogIn} = apiStore();
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
      setVerified(false);
      makeAdminNull();
    }
  };

  const verifyUserLogin = async()=>{
    try {

      const response = await verifyLogIn();

      if(response && response.success){
        setVerified(false)
      }else{
        setVerified(true)
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    checkAdminLogin();
    verifyUserLogin();
  }, [verifyAdminLogin]);

  if(verified === null){
    return <>
        <p>Loading...</p>
    </>
  }

  return verified ? <Outlet/> : <Navigate to={"/"} /> 
}

export default AdminProtectedRoute;
