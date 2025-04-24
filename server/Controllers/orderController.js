const userDb = require("../Schema/userSchema");
const orderDb = require("../Schema/ordersSchema");
const productDb = require("../Schema/productSchema");
const throwError = require("../utils/errorHandler");
const orderValidationSchema = require("../validators/orderValidators");


//Generate a orderID
function generateOrderID() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); 
    return `ORD-${timestamp}-${randomPart}`;
  }
  

//Place Order 
exports.makeOrder = async (req, res) => {
  try {
    const userID = req._id;

    const { orderDetails } = req.body;

    const findProducts = await Promise.all(
      orderDetails.items.map(async (item)=>{
        return await productDb.findOne({productID : item.productID})
      })
    )

    const findUser = await userDb.findOne({_id: userID});

    const deliveryDate = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))

    const estimatedDeliveryDate = deliveryDate.toLocaleDateString("en-IN", {
      timeZone : "Asia/Kolkata"
    })

    const order = new orderDb({
      orderID: generateOrderID(),
      userID : findUser.userID,
      user: userID,
      totalPrice: orderDetails.totalPrice,
      paymenetStatus: "Cash On Delivery",
      orderStatus: "processing",
      shippingAddress: findUser.addresses[0],
      shippingDate: orderDetails.shippingDate,
      orderDate: Date.now(),
      estimatedDeliveryDate
    })

    order.items = findProducts.map((item, index)=>{
      return {product: item._id,
              productID: item.productID,
              quantity: orderDetails.items[index].quantity
      }
    })

    await order.save();

    res.status(201).json({success : true, message: "Order successful", order})

  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error making order.",
    });
  }
};

//Cancel Order
exports.cancelOrder = async(req, res)=>{
  try {
    const userID = req._id;
    const {orderID} = req.body;

    const findUser = await userDb.findOne({_id: userID});

    if(!findUser){
      throwError("Unauthorized access. Please log in.", 401);
    }

    const findOrder = await orderDb.findOne({orderID});

    if(!findOrder){
      throwError("Order is not available check again.", 404);
    }

    findOrder.orderStatus = "cancelled";
    findOrder.shippingDate = "N/A"
    findOrder.paymentStatus = "refunded"
    findOrder.estimatedDeliveryDate = "N/A"

    await findOrder.save()

    res.status(200).json({success: true, message: "Order cancelled.", order: findOrder});


  } catch (error) {
    return res.status(error.status || 400).json({success: false, message: error.message || "Error canceling order."});
  }
}

//Get all orders - only for admin
exports.getOrder = async(req, res)=>{ 
  try {

    const orders = await orderDb.find();

    res.status(302).json({success: true, message: "All order fetched successfully", orders});


  } catch (error) {
    return res.status(error.status || 400).json({success: false, message : error.message || "Error fetching orders"});
  }
}