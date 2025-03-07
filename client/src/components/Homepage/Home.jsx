import "./home.css"
import farmImage from "../../assets/farming.jpg";
import { FaSearch } from "react-icons/fa";
import Products from "./FeauredProducts/Products";
import ServicesPage from "./Services/Services";

function Home() {

  

  return (
    <>
      <div className="home-page w-full h-[100dvh] relative">
        <img src={farmImage} alt="" className="w-full h-full absolute" />
        <div className="absolute w-full h-full bg-[#181818b3] grid place-items-center  px-4 md:px-20">
          <div className="search-items w-full">
            <h1 className="text-center">
              <p className="text-white text-[1.5rem] md:text-[2.5rem] font-bold great-vibes-regular">Welcome to</p>
              <p className="text-themegreen dm-serif-text-regular text-[3rem] md:text-[5rem]">flowhny.</p>
            </h1>
            <p className=" text-center patrick-hand-regular text-[wheat] text-[1.5rem] md:text-[2rem] font-medium">
              "Rooted in nature, Grown with care"
            </p>
            <div className=" search-content m-auto flex justify-center items-center mt-10 md:mt-12 bg-white rounded-3xl w-full lg:w-[45%] overflow-hidden pl-3">
              <label htmlFor="search-bar"></label>
              <input
                type="text"
                name="search-bar"
                id="search-bar"
                className="w-full pl-3 text-themegreen"
                placeholder="Search product..."
                style={{ outline: "none", border: "none" }}
              />
              <button tabIndex={0} className=" bg-themegreen py-3.5 px-6 cursor-pointer transition hover:bg-[transparent] border-l border-themegreen hover:border-themegreen hover:text-themegreen">
                <FaSearch />
              </button>
            </div>
            <div className="btn-nav flex justify-center  items-center mt-10">
              <button className=" cursor-pointer ml-5 rounded-md py-2 px-3 hover:bg-transparent transition border border-themegreen hover:border-themegreen font-medium  hover:text-themegreen text-white bg-themegreen ">
                Explore
              </button>
              <button className=" cursor-pointer ml-5 rounded-md py-2 px-3 hover:bg-transparent transition border border-themegreen hover:border-themegreen font-medium  hover:text-themegreen text-white bg-themegreen ">
                About us
              </button>
            </div>
          </div>
        </div>
      </div>
      <Products/>
      <ServicesPage/>
    </>
  );
}

export default Home;
