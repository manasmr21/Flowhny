import { useEffect, useState } from "react";
import adminApis from "../../components/Store/adminApi";
import { useRef } from "react";

function AdminRoute() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const {adminRouteRequest} = adminApis()

  const hasRun = useRef(false);

  const sendAdminRoute = async()=>{
   try {
    const response = await adminRouteRequest()

    if(response.success){
        setSuccess(true)
        setLoading(false)
        alert(response.message)
    }
   } catch (error) {    
    console.log(error)
   }

  }


  useEffect(() => {
    if(!hasRun.current){
      hasRun.current = true
      sendAdminRoute()
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-lighterthemedark p-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-themegreen border-opacity-50 mb-6"></div>
          <p className="text-lg font-semibold dark:text-gray-300">Processing...</p>
        </div>
      ) : (
        <div className="text-center flex flex-col items-center">
          {/* Tick inside circle */}
          <div className="mb-6">
            <svg
              className="w-20 h-20 text-green-500 animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2l4-4M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
            The route to admin log in page has been sent to your email!
          </h1>
        </div>
      )}
    </div>
  );
}

export default AdminRoute;
