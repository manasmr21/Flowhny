const userDb = require("../Schema/userSchema");
const orderDb = require("../Schema/ordersSchema");
const productDb = require("../Schema/productSchema");
const throwError = require("../utils/errorHandler");
const productValidationSchema = require("../validators/productValidator");
const path = require("path");
const fs = require("fs");

//Product ID generator
function generateProductID() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789";
  let productID = "";
  for (let i = 0; i < 10; i++) {
    productID += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return productID;
}

//Fetch all products
exports.fetchAllProduct = async (req, res) => {
  try {
    const allProducts = await productDb.find();

    res.status(200).json({
      success: true,
      products: allProducts,
      message: "All products fetched",
    });
  } catch (error) {
    return res.status(error.status || 400).json({
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

    if (!findTheProduct) {
      throwError("Product Not Found", 404);
    }

    res.status(302).json({
      success: true,
      message: "Product Found",
      product: findTheProduct,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error finding the product",
    });
  }
};

//Add product
exports.addProduct = async (req, res) => {
  try {
    const productData = req.body;
    const thumbnail = req.files.thumbnail[0];
    const productImages = req.files.images;

    const productID = generateProductID();
    
    const thumbnailFilePath = path.join(__dirname, "..", "uploads/thumbnails",thumbnail.filename)


    const images = [];
    productImages?.map((img) => {
      images.push({
        typeName: img.fieldname,
        filename: img.filename,
        displayPath: path.join(__dirname, "..", "uploads/images", img.filename),
        mimetype: img.mimetype,
        originalname: img.originalname,
        size: img.size,
      });
    });

    const newProduct = new productDb({
      ...productData,
      availabilityStatus: productData.stock > 0 ? true : false,
      productID,
      thumbnail: {
        typeName: thumbnail.fieldname,
        filename: thumbnail.filename,
        displayPath: thumbnailFilePath,
        mimetype: thumbnail.mimetype,
        originalname: thumbnail.originalname,
        size: thumbnail.size,
      },
      images,
    });

    await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error adding product",
    });
  }
};

//Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { updatedProduct } = req.body;

    const { productID, updatedFields } = updatedProduct;

    const finalProduct = await productDb.findOneAndUpdate(
      { productID },
      { $set: updatedFields },
      { new: true }
    );

    await finalProduct.save();

    res.status(201).json({
      success: true,
      message: "Product updated successfully",
      product: finalProduct,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error updating the product",
    });
  }
};

//Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { productID } = req.body;

    const findTheProduct = await productDb.findOne({ productID });

    if (!findTheProduct) {
      throwError("Product Not Found", 404);
    }

    await findTheProduct.deleteOne({ productID });

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error deleting product",
    });
  }
};

//Multer test api
exports.testMulter = async (req, res) => {
  console.log(req.file);
  console.log(req.files);

  const fileNames = [];

  req.files.map((img) => {
    fileNames.push({ fileName: `${img.filename}` });
  });

  console.log(fileNames);

  res.status(200).json({ message: "Successful" });
};

//get the image to show in frontend
exports.showImage = async (req, res) => {
  try {
    const fileName = req.params.fileName;

    if (!fileName) throwError("No file name found", 404);

    if (fileName.includes("thumbnail_")) {
      const filePath = path.join(
        __dirname,
        "..",
        "uploads/thumbnails",
        fileName
      );
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        throwError("Can't find the image", 404);
      }
    } else {
      throwError("Can't find the image you are looking for.", 404);
    }

    if (fileName.includes("product-image_")) {
      const productImage = path.join(
        __dirname,
        "..",
        "uploads/images",
        fileName
      );
      if (fs.existsSync(productImage)) {
        res.sendFile(productImage);
      } else {
        throwError("Can't find the image", 404);
      }
    } else {
      throwError("Can't find the image you are looking for.", 404);
    }
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Image not found",
    });
  }
};
