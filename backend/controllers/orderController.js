import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod = "COD",
      couponCode,
      couponDiscount = 0,
      shippingCharge = 0,
      tax = 0,
    } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0] || "",
      size: item.size,
      price: item.price,
      quantity: item.quantity,
    }));

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const total = Math.max(0, subtotal - couponDiscount + shippingCharge + tax);

    // Stock reduce
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      const sizeIndex = product.sizes.findIndex((s) => s.size === item.size);
      if (sizeIndex > -1) {
        product.sizes[sizeIndex].stock -= item.quantity;
        await product.save();
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "pending",
      orderStatus: "pending",
      subtotal,
      couponCode,
      couponDiscount,
      shippingCharge,
      tax,
      total,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Only owner or admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort("-createdAt");
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel Order (Customer)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Only pending / processing cancel ho sakta hai
    if (!["pending", "processing"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.orderStatus = "cancelled";
    if (order.paymentStatus === "paid") {
      order.paymentStatus = "refunded";
    }
    await order.save();

    // Stock restore
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        const sizeIdx = product.sizes.findIndex((s) => s.size === item.size);
        if (sizeIdx > -1) {
          product.sizes[sizeIdx].stock += item.quantity;
          await product.save();
        }
      }
    }

    res.json({ success: true, data: order, message: "Order cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Simple HTML invoice
    const html = `
      <html>
        <head><title>Invoice - ${order._id}</title></head>
        <body style="font-family: Arial; padding: 40px;">
          <h1>LuxeScent Invoice</h1>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Customer:</strong> ${order.user?.name} (${order.user?.email})</p>
          <hr/>
          <h3>Items</h3>
          <ul>
            ${order.items
              .map(
                (i) =>
                  `<li>${i.name} (${i.size}) × ${i.quantity} — ₹${i.price * i.quantity}</li>`
              )
              .join("")}
          </ul>
          <hr/>
          <p>Subtotal: ₹${order.subtotal}</p>
          <p>Discount: ₹${order.couponDiscount}</p>
          <p>Shipping: ₹${order.shippingCharge}</p>
          <p>Tax: ₹${order.tax}</p>
          <h2>Total: ₹${order.total}</h2>
        </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, update, {
      new: true,
    }).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};