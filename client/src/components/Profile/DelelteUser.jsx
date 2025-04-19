import { useState } from "react";
import apiStore from "../Store/apiStores";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';


function DelelteUser( {userID, setDeleteOpt} ) {
  const [password, setPassword] = useState("");

  const {deleteUser} = apiStore()

  const navigate = useNavigate()

  const handleDeleteUser = async()=>{
    try {
      const response = await deleteUser(password, userID); 

      if(response.success){
        alert("User deleted successfuully");
        navigate("/")
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="fixed bg-[#00000051] top-0 left-0 right-0 bottom-0 grid place-items-center">
        <div className="flex flex-col bg-themedark p-10 md:p-20 rounded-md ">
          <div className="">
            <label htmlFor="password">Enter Your password to confirm:</label>
            <input
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full border-themegreen border rounded p-2 mt-3"
              name="password"
            />
          </div>
          <div className="mt-5">
            <button className=" cursor-pointer block bg-[red] rounded p-2 w-full mt-3 hover:scale-[105%] active:scale-[95%] transition"
              onClick={handleDeleteUser}
            >
              Confirm Delete
            </button>
            <button className=" cursor-pointer block bg-themegreen rounded p-2 w-full mt-3 hover:scale-[105%] active:scale-[95%] transition"
              onClick={()=> setDeleteOpt(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

DelelteUser.propTypes = {
  userID : PropTypes.string.isRequired,
  setDeleteOpt : PropTypes.bool.isRequired
}

export default DelelteUser;
