import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaCheckCircle, FaIdBadge } from "react-icons/fa";
import apiStore from "../Store/apiStores";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { userData,logoutUser } = apiStore();
  const tabs = ["Details", "Orders", "Address"];
  const [activeTab, setActiveTab] = useState("Details");
  const navigate = useNavigate();

  useEffect(()=>{
    if(!userData){
      navigate("/")
    }
  },[userData])

  return (
    <div className="min-h-screen py-10 px-4 bg-white dark:bg-themedark text-gray-800 dark:text-white">
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
                <p>{userData?.username}</p>
              </div>

              <div className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg shadow">
                <div className="flex items-center gap-3 text-themegreen mb-2">
                  <FaEnvelope />
                  <span className="font-semibold">Email</span>
                </div>
                <p>{userData?.useremail}</p>
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

          {activeTab === "Address" && (
            <div>
              {userData?.addresses?.length > 0 ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userData.addresses.map((address, index) => (
                    <div
                      key={address._id || index}
                      className="bg-white dark:bg-[#2a2a2a] rounded-xl shadow p-6 space-y-2 text-sm border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-themegreen">
                          {address.fullName}
                        </h3>
                        {address.isDefault && (
                          <span className="text-xs bg-themegreen text-white px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="font-semibold text-themegreen ">
                        {address.phone}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {address.addressLine1}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {address.addressLine2}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {address.city}, {address.state}
                      </p>
                      <p>{address.postalCode}</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {address.country}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-300">
                  No addresses found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center flex-wrap justify-evenly w-[300px] m-auto mt-6">
        <button className="border m-4 border-themegreen px-3 cursor-pointer hover:bg-transparent hover:text-themegreen transition py-2 font-medium bg-themegreen rounded-md"
          onClick={logoutUser}
        >
          Sign Out
        </button>
        <button className="border m-4 border-[red] px-3 cursor-pointer hover:bg-transparent hover:text-[red] transition py-2 font-medium bg-[red] rounded-md">Delete Account</button>
      </div>
    </div>
  );
}

export default Profile;
