import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name avatar")
      .sort("-createdAt");
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    // Check if user has purchased this product (delivered / paid order)
    const hasOrdered = await Order.findOne({
      user: req.user._id,
      "items.product": productId,
      orderStatus: { $in: ["delivered", "processing", "shipped", "pending"] },
      paymentStatus: { $in: ["paid", "pending"] },
    });

    if (!hasOrdered) {
      return res.status(403).json({
        success: false,
        message: "You can only review products you have ordered",
      });
    }

    // Multiple reviews allowed - no unique check
    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    // Update product average rating
    const allReviews = await Review.find({ product: productId });
    const avg =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(productId, {
      ratings: {
        average: Math.round(avg * 10) / 10,
        count: allReviews.length,
      },
    });

    const populated = await Review.findById(review._id).populate(
      "user",
      "name avatar"
    );

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const productId = review.product;
    await review.deleteOne();

    const allReviews = await Review.find({ product: productId });
    const avg =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    await Product.findByIdAndUpdate(productId, {
      ratings: {
        average: Math.round(avg * 10) / 10,
        count: allReviews.length,
      },
    });

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};