const userDb = require("../Schema/userSchema");
const orderDb = require("../Schema/ordersSchema");
const productDb = require("../Schema/productSchema");
const throwError = require("../utils/errorHandler");
const productValidationSchema = require("../validators/productValidator")


//Product ID generator
 function generateProductID() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789";
      let productID = "";
      for (let i = 0; i < 10 ; i++) {
        productID += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return productID;
    };

//Fetch all products
exports.fetchAllProduct = async (req, res) => {
  try {
    const allProducts = await productDb.find();
    

    res
      .status(200)
      .json({
        success: true,
        products: allProducts,
        message: "All products fetched",
      });
  } catch (error) {
    return res
      .status(error.status || 400)
      .json({
        success: false,
        message: error.message || "Error fetching user",
      });
  }
};

//Fetch a single product
exports.fetchOneProduct = async (req, res) => {
  try {
    const { productName } = req.body;

    const findTheProduct = await productDb.find({ title: productName });

    if(!findTheProduct){
        throwError("Product Not Found", 404)
    }

    res.status(302).json({success: true, message: "Product Found", product: findTheProduct})

  } catch (error) {
    return res
      .status(error.status || 400)
      .json({
        success: false,
        message: error.message || "Error finding the product",
      });
  }
};

//Add product
exports.addProduct = async(req, res)=>{
    try {
        const {productData} = req.body;

        const productID = generateProductID();

        const { error } = productValidationSchema.validate(productData,{
          abortEarly: false
        });

        if(error){
          return res.status(400).json({
            success: false,
            message: "Validation failed",
            details: error.details.map((e) => e.message),
          });
        }

        const newProduct = new productDb({
            ...productData,
            productID
        })

        await newProduct.save();
        res.status(201).json({success: true, message: "Product Added Successfully", product: newProduct});

    } catch (error) {
        return res
        .status(error.status || 400)
        .json({
          success: false,
          message: error.message || "Error adding product",
        });
    }
}

//Update a product
exports.updateProduct = async(req, res)=>{
    try {
        const {updatedProduct} = req.body;

        const {productID, updatedFields} = updatedProduct;

        const finalProduct = await productDb.findOneAndUpdate(
            {productID},
            {$set: updatedFields},
            {new: true}
        )

        await finalProduct.save()

        res.status(201).json({success: true, message: "Product updated successfully", product: finalProduct});

    } catch (error) {
        return res.status(error.status || 400).json({success: false, message: error.message || "Error updating the product"});
    }
}


//Delete a product
exports.deleteProduct = async(req, res)=>{
  try {
    const {productID} = req.body;

    const findTheProduct = await productDb.findOne({productID});

    if(!findTheProduct){
      throwError("Product Not Found", 404);
    }

    await findTheProduct.deleteOne({productID});

  } catch (error) {
    return res.status(error.status || 400).json({success: false, message: error.message || "Error deleting product"});
  }
}