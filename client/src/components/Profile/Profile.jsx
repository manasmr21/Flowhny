import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaCheckCircle,
  FaIdBadge,
  FaEdit,
  FaTrashAlt,
  FaPlus,
} from "react-icons/fa";
import { RxCheckCircled, RxCrossCircled } from "react-icons/rx";
import apiStore from "../Store/apiStores";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Otp from "./otp";
import DelelteUser from "./delelteUser";
import AddressField from "./AddressField";

function Profile() {
  const { userData, logoutUser, updateUsername, deleteAddress } = apiStore();
  const [editUsername, setEditUsername] = useState(false);
  const [editUseremail, setEditUseremail] = useState(false);
  const tabs = ["Details", "Orders", "Address"];
  const [activeTab, setActiveTab] = useState("Details");
  const navigate = useNavigate();
  const [name, setName] = useState(userData?.username);
  const [showOTPField, setShowOTPField] = useState(false);
  const [chageMailCode, setChangeMailCode] = useState(false);
  const [deleteOpt, setDeleteOpt] = useState(false);
  const [showAddressField, setShowAddressField] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [addressID, setAddressID] = useState(null)

  const [newData, setNewData] = useState({
    newMail: "",
    code: "",
  });

  const AUTHAPI = import.meta.env.VITE_AUTHAPI_URL;

  useEffect(() => {


    if (userData) {
      setName(userData?.username);
    }
  }, [userData]);

  const handleLogout = async()=>{
    try {
      const response = await logoutUser();

      if(response.success){
        navigate("/");
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  //Update user name Function
  const handleChangeName = async () => {
    try {
      const response = await updateUsername({ username: name });

      if (response.success) {
        setEditUsername(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //Send code for email update
  const sendCodeToOldMail = async () => {
    try {

      const response = await axios.patch(
        `${AUTHAPI}/update-email`,
        {
          oldMail: userData.useremail,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setChangeMailCode(true);
      }
    } catch (error) {
      console.log(error.response.data.message || error.message);
    }
  };

  //Insert username data
  const handleNewData = (e) => {
    const { name, value } = e.target;

    setNewData({
      ...newData,
      [name]: value,
    });
  };

  //Update user email
  const handleEmailChange = async () => {
    try {
      const response = await axios.patch(
        `${AUTHAPI}/update-email`,
        {
          oldMail: userData?.useremail,
          newMail: newData.newMail,
          code: newData.code,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setShowOTPField(true);
        setChangeMailCode(false);
      }
    } catch (error) {
      console.log(error.response.data.message || error.message);
    }
  };

  //Delete an existing Address
  const handleDeletingAddress = async (addressId) => {
    try {
      const response = await deleteAddress(addressId);

      console.log(addressID)

      if(response.success){
        alert(response.message)
      }

    } catch (error) {
      console.log(error)
    }

   
  };

  return (
    <div className="relative min-h-screen py-10 px-4 bg-white dark:bg-themedark text-gray-800 dark:text-white">
      <div className="max-w-5xl mx-auto bg-gray-100 dark:bg-[#1e1e1e] shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-themegreen mb-6">
          Your Account
        </h1>

        {/* User Summary */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold">{userData?.username}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {userData?.useremail}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-10 border-b border-gray-300 dark:border-gray-600">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`pb-2 text-lg font-medium transition-all duration-200 ${
                activeTab === item
                  ? "text-themegreen border-b-4 border-themegreen"
                  : "text-gray-500 dark:text-gray-300 hover:text-themegreen"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid gap-6">
          {activeTab === "Details" && (
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg shadow">
                <div className="flex items-center gap-3 text-themegreen mb-2">
                  <FaUser />
                  <span className="font-semibold">Username</span>
                </div>
                <input
                  type="text"
                  className={`${
                    editUsername
                      ? "border border-themegreen rounded text-center"
                      : ""
                  }`}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!editUsername}
                  value={name}
                />
                <span>
                  <FaEdit
                    onClick={() => setEditUsername(true)}
                    className={`${
                      editUsername ? "hidden" : "inline"
                    } float-right cursor-pointer hover:text-[red]`}
                  />

                  <div
                    className={`${
                      !editUsername ? "hidden" : "flex"
                    } float-right`}
                  >
                    <RxCheckCircled
                      className="cursor-pointer text-themegreen text-xl mx-1"
                      onClick={handleChangeName}
                    />
                    <RxCrossCircled
                      className="cursor-pointer text-red-600 text-xl mx-1"
                      onClick={() => setEditUsername(false)}
                    />
                  </div>
                </span>
              </div>

              <div className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg shadow">
                <div className="flex items-center gap-3 text-themegreen mb-2">
                  <FaEnvelope />
                  <span className="font-semibold">Email</span>
                </div>
                <div className="flex justify-between">
                  <input
                    type="email"
                    className={`${
                      editUseremail
                        ? "border border-themegreen rounded text-center px-3"
                        : ""
                    } w-full`}
                    value={userData?.useremail}
                    disabled={!editUseremail}
                  />
                  <span>
                    <FaEdit
                      className={`${
                        editUseremail ? "hidden" : "inline"
                      } float-right cursor-pointer hover:text-[red]`}
                      onClick={sendCodeToOldMail}
                    />

                    <div
                      className={`${
                        !editUseremail ? "hidden" : "flex"
                      } float-right`}
                    >
                      <RxCheckCircled className="cursor-pointer text-themegreen text-xl mx-1" />
                      <RxCrossCircled
                        className="cursor-pointer text-red-600 text-xl mx-1"
                        onClick={() => {
                          setEditUseremail(false);
                        }}
                      />
                    </div>
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg shadow">
                <div className="flex items-center gap-3 text-themegreen mb-2">
                  <FaIdBadge />
                  <span className="font-semibold">User ID</span>
                </div>
                <p>{userData?.userID}</p>
              </div>

              <div className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg shadow">
                <div className="flex items-center gap-3 text-themegreen mb-2">
                  <FaCheckCircle />
                  <span className="font-semibold">Verified</span>
                </div>
                <p>{userData?.verified ? "Yes" : "No"}</p>
              </div>

              <div className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg shadow md:col-span-2">
                <div className="flex items-center gap-3 text-themegreen mb-2">
                  <span className="font-semibold">Account Created</span>
                </div>
                <p>{new Date(userData?.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}

          {activeTab === "Orders" && (
            <div className="text-center text-lg text-gray-600 dark:text-gray-300">
              {userData?.orders?.length > 0 ? (
                <p>You have {userData.orders.length} order(s).</p>
              ) : (
                <p>No orders found.</p>
              )}
            </div>
          )}

          {/* Address Section */}
          {activeTab === "Address" && (
            <div className="relative">
              {userData?.addresses?.length > 0 ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userData.addresses.map((address, index) => (
                    <div
                      key={address?._id || index}
                      className="bg-white relative dark:bg-[#2a2a2a] rounded-xl shadow p-6 space-y-2 text-sm border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-themegreen">
                          {address?.fullName}
                        </h3>
                        {address?.isDefault && (
                          <span className="text-xs bg-themegreen text-white px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="font-semibold text-themegreen ">
                        {address?.phoneNumber}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {address?.addressLine1}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {address?.addressLine2}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {address?.city}, {address?.state}
                      </p>
                      <p>{address?.postalCode}</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {address?.country}
                      </p>

                      <p className="flex right-2 bottom-3 absolute">
                        <button
                          className="mx-2 cursor-pointer"
                          onClick={() => {
                            setShowAddressField(true);
                            setEditAddress(true);
                            setAddressID(address?._id)
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="cursor-pointer mx-2 text-[red]"
                          onClick={() => {
                            handleDeletingAddress(address?._id);
                          }}
                        >
                          <FaTrashAlt />
                        </button>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-300">
                  No addresses found.
                </p>
              )}

              <button
                className="border border-themegreen float-right mt-10 grid place-items-center rounded-4xl bg-themegreen text-white text-2xl cursor-pointer w-[40px] h-[40px] hover:scale-[110%] transition active:scale-[95%]"
                onClick={() => setShowAddressField(true)}
              >
                <FaPlus />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center flex-wrap justify-evenly w-[300px] m-auto mt-6">
        <button
          className="border m-4 border-themegreen px-3 cursor-pointer hover:bg-transparent hover:text-themegreen transition py-2 font-medium bg-themegreen rounded-md"
          onClick={handleLogout}
        >
          Sign Out
        </button>
        <button
          className="border m-4 border-[red] px-3 cursor-pointer hover:bg-transparent hover:text-[red] transition py-2 font-medium bg-[red] rounded-md"
          onClick={() => setDeleteOpt(true)}
        >
          Delete Account
        </button>
      </div>

      {showOTPField && (
        <div className="fixed top-0 bottom-0 left-0 right-0">
          <Otp
            newMail={newData.newMail}
            editUseremail={editUseremail}
            setEditUseremail={setEditUseremail}
            showOTPField={showOTPField}
            setShowOTPField={setShowOTPField}
          />
        </div>
      )}

      {chageMailCode && (
        <div className="fixed top-0 bottom-0 bg-[#00000051] left-0 right-0 flex flex-col justify-center items-center">
          <div className=" dark:bg-themedark p-12 rounded-md shadow-black">
            <div className="mt-3">
              <label htmlFor="oldMail">Current Email:</label>
              <input
                type="email"
                className="w-full border border-themegreen p-2 rounded"
                value={userData?.useremail}
                disabled
              />
            </div>
            <div className="mt-3">
              <label htmlFor="code">OTP for current email:</label>
              <input
                type="number"
                className="w-full border border-themegreen p-2 rounded"
                name="code"
                onChange={handleNewData}
              />
            </div>
            <div className="mt-3">
              <label htmlFor="newMail">New Email:</label>
              <input
                type="email"
                className="w-full border border-themegreen p-2 rounded"
                name="newMail"
                value={newData.newMail}
                onChange={handleNewData}
              />
            </div>
            <div>
              <button
                className="bg-themegreen block w-full rounded mt-3 py-2 cursor-pointer active:scale-[95%] transition hover:scale-[105%]"
                onClick={handleEmailChange}
              >
                save
              </button>
              <button
                className="bg-[red] block w-full rounded mt-3 py-2 cursor-pointer active:scale-[95%] transition hover:scale-[105%]"
                onClick={() => setChangeMailCode(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteOpt && (
        <div className="deleteUser">
          <DelelteUser userID={userData?.userID} setDeleteOpt={setDeleteOpt} />
        </div>
      )}

      {showAddressField && (
        <div>
          <AddressField
            setShowAddressField={setShowAddressField}
            name={userData?.username}
            editAddress={editAddress}
            setEditAddress={setEditAddress}
            userAddress={userData.addresses.filter(item=> item._id.toString() === addressID.toString())[0]}
          />
        </div>
      )}
    </div>
  );
}

export default Profile;
