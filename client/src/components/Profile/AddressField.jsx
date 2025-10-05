import { useState } from "react";
import apiStore from "../Store/apiStores";
import PropTypes from "prop-types";
import csc from "countries-states-cities";

function AddressField({
  setShowAddressField,
  name,
  editAddress,
  setEditAddress,
  userAddress,
}) {
  const { addAddress, updateAddress } = apiStore();
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const [address, setAddress] = useState({
    fullName: name,
    phoneNumber: editAddress ? userAddress.phoneNumber : "",
    addressLine1: editAddress ? userAddress.addressLine1 : "",
    addressLine2: editAddress ? userAddress.addressLine2 : "",
    city: editAddress ? userAddress.city : city,
    state: editAddress ? userAddress.state : state,
    country: editAddress ? userAddress.country : "India",
    postalCode: editAddress ? userAddress.postalCode : "",
    isDefault: editAddress ? userAddress.isDefault : false,
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setAddress({
      ...address,
      [name]: value,
    });
  };

  const handleAddingAddress = async () => {
    try {
      const response = await addAddress(address);

      if (response.success) {
        alert(response.message);
        setShowAddressField(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdatingAddress = async () => {
    try {
      const response = await updateAddress(userAddress._id, address);

      if (response.success) {
        alert(response.message);
        setShowAddressField(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 grid place-items-center bg-[#00000089] z-50 overflow-y-auto">
      <div className="dark:bg-themedark bg-white w-[95%] sm:w-[85%] md:w-[600px] p-3 md:p-6 mt-6 md:mt-16 rounded-lg shadow-lg">
        <h2 className="text-center text-themegreen text-base md:text-lg font-semibold mb-2">
          Add Address
        </h2>

        <form className="space-y-2 text-sm">
          <div>
            <label htmlFor="phoneNumber" className="block">
              Phone number:
            </label>
            <input
              className="w-full border border-themegreen rounded p-1"
              type="number"
              name="phoneNumber"
              value={address.phoneNumber}
              onChange={handleFormChange}
            />
          </div>

          <div>
            <label htmlFor="addressLine1" className="block">
              Address Line 1:
            </label>
            <input
              className="w-full border border-themegreen rounded p-1"
              type="text"
              name="addressLine1"
              value={address.addressLine1}
              onChange={(e) =>
                setAddress({ ...address, addressLine1: e.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="addressLine2" className="block">
              Address Line 2:
            </label>
            <input
              className="w-full border border-themegreen rounded p-1"
              type="text"
              name="addressLine2"
              value={address.addressLine2}
              onChange={(e) =>
                setAddress({ ...address, addressLine2: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label htmlFor="city" className="block">
                City:
              </label>
              <select
                className="w-full border border-themegreen rounded p-1"
                value={city}
                disabled={state == "" ? true : false}
                onChange={(e) => {
                  setCity(e.target.value)
                  setAddress({
                    ...address,
                    city: e.target.value
                  })
                }}
              >
                <option className="dark:bg-lighterthemedark">
                  --Select City--
                </option>
                {state && csc
                  .getCitiesOfState(
                    csc.getStatesOfCountry(101).filter((st) => {
                      return st.name === state;
                    })[0].id
                  )
                  .map((city) => {
                    return (
                      <option
                        key={city.id}
                        className=" dark:bg-lighterthemedark"
                      >
                        {city.name}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div>
              <label htmlFor="state" className="block">
                State:
              </label>
              <select
                className="w-full border border-themegreen rounded p-1"
                value={state}
                onChange={(e) => {
                  setState(e.target.value)
                  setAddress({
                    ...address,
                    state: e.target.value
                  });
                }}
              >
                <option value="" className="dark:bg-lighterthemedark">
                  --Select state--
                </option>
                {csc.getStatesOfCountry(101).map((state) => {
                  return (
                    <option
                      key={state.id}
                      className=" dark:bg-lighterthemedark"
                      value={state.name}
                    >
                      {state.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label htmlFor="country" className="block">
                Country:
              </label>
              <p className="w-full border text-gray-400 border-themegreen rounded p-1">
                {csc.getCountryById(101).name}
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="postalCode" className="block">
              Postal Code:
            </label>
            <input
              className="w-full border border-themegreen rounded p-1"
              type="number"
              name="postalCode"
              value={address.postalCode}
              onChange={handleFormChange}
            />
          </div>

          <div className="flex items-center mt-1">
            <input
              type="checkbox"
              name="isDefault"
              checked={address.isDefault}
              onChange={(e) =>
                setAddress({ ...address, isDefault: e.target.checked })
              }
              className="mr-2 cursor-pointer"
            />
            <label htmlFor="isDefault">Default Address</label>
          </div>
        </form>

        <div className="text-center mt-5">
          {!editAddress ? (
            <button
              className=" mx-3 bg-themegreen text-white p-2 rounded w-[30%] hover:scale-[105%] active:scale-[95%] transition cursor-pointer"
              onClick={handleAddingAddress}
            >
              Save
            </button>
          ) : (
            <button
              className=" mx-3 bg-themegreen text-white p-2 rounded w-[30%] hover:scale-[105%] active:scale-[95%] transition cursor-pointer"
              onClick={handleUpdatingAddress}
            >
              Update
            </button>
          )}
          <button
            className=" mx-3 text-white bg-[red] p-2 rounded w-[30%] hover:scale-[105%] active:scale-[95%] transition cursor-pointer"
            onClick={() => {
              setShowAddressField(false);
              setEditAddress(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

AddressField.propTypes = {
  setShowAddressField: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  editAddress: PropTypes.bool,
  setEditAddress: PropTypes.func,
  userAddress: PropTypes.object,
};

export default AddressField;
