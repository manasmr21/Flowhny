import adminApis from "../../components/Store/adminApi"
import {useNavigate} from "react-router-dom"

function Dashboard() {

  const {adminLogout} = adminApis()
  const navigate = useNavigate()
  
  const handleLogout = async()=>{
    const response = await adminLogout()

    if(response.success){
      navigate("/");
    }
  }

  return (
    <>
        This is a dashboard 

        <button
        className="cursor-pointer border bg-themegreen p-3 rounded w-[30%] m-auto hover:scale-[105%] active:scale-[95%] transition"
         onClick={handleLogout}>Logout</button>
    </>
  )
}

export default Dashboard
