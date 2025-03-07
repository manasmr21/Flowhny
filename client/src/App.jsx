import {BrowserRouter as Routers, Routes, Route} from "react-router-dom";

import "./index.css"
import Navbar from "./components/Navbar/Navbar"
import Home from "./components/Homepage/Home"
import ProductPage from "./components/Product page/ProductPage";



function App() {

  return (
    <div className="">
    <Routers>
      <Navbar/>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/products" element = {<ProductPage/>} />
      </Routes>
    </Routers>
    </div>
  )
}

export default App
