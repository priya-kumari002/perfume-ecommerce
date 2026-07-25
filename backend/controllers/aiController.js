import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";

// ---------- AI Product Recommendations ----------
export const getRecommendations = async (req, res) => {
  try {
    const { productId, limit = 4 } = req.query;
    let recommendations = [];

    if (productId) {
      // Similar products (same category/brand + high rated)
      const product = await Product.findById(productId);
      if (product) {
        recommendations = await Product.find({
          _id: { $ne: productId },
          isActive: { $ne: false },
          $or: [
            { category: product.category },
            { brand: product.brand },
          ],
        })
          .populate("brand", "name")
          .populate("category", "name")
          .sort({ "ratings.average": -1, isBestSeller: -1 })
          .limit(Number(limit));
      }
    }

    // If logged in → based on order history
    if (req.user && recommendations.length < limit) {
      const orders = await Order.find({
        user: req.user._id,
        orderStatus: { $nin: ["cancelled"] },
      }).limit(10);

      const boughtIds = orders.flatMap((o) =>
        o.items.map((i) => i.product?.toString())
      );

      const more = await Product.find({
        _id: {
          $nin: [...boughtIds, productId].filter(Boolean),
        },
        isActive: { $ne: false },
      })
        .populate("brand", "name")
        .sort({ isBestSeller: -1, "ratings.average": -1 })
        .limit(Number(limit) - recommendations.length);

      recommendations = [...recommendations, ...more];
    }

    // Fallback → best sellers / featured
    if (recommendations.length < limit) {
      const fallback = await Product.find({
        _id: { $nin: recommendations.map((p) => p._id) },
        isActive: { $ne: false },
        $or: [{ isBestSeller: true }, { isFeatured: true }],
      })
        .populate("brand", "name")
        .limit(Number(limit) - recommendations.length);

      recommendations = [...recommendations, ...fallback];
    }

    res.json({
      success: true,
      data: recommendations.slice(0, limit),
      message: "AI-powered recommendations based on similarity, ratings & trends",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- AI Chat Assistant ----------
export const chatAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ success: false, message: "Message required" });
    }

    const msg = message.toLowerCase().trim();
    let reply = "";
    let products = [];

    // Intent detection (rule-based AI logic)
    if (
      msg.includes("recommend") ||
      msg.includes("suggest") ||
      msg.includes("best perfume") ||
      msg.includes("best seller")
    ) {
      products = await Product.find({
        isActive: { $ne: false },
        $or: [{ isBestSeller: true }, { isFeatured: true }],
      })
        .populate("brand", "name")
        .limit(3);

      reply = `Based on popularity and ratings, here are my top picks for you:\n${products
        .map(
          (p, i) =>
            `${i + 1}. ${p.name} by ${p.brand?.name || "LuxeScent"} — ₹${
              p.sizes?.[0]?.price || "N/A"
            }`
        )
        .join("\n")}\n\nWould you like something for men, women, or unisex?`;
    } else if (
      msg.includes("order") ||
      msg.includes("track") ||
      msg.includes("delivery") ||
      msg.includes("shipping")
    ) {
      reply =
        "You can track your orders from the **My Orders** page. Typical delivery takes 3–5 business days. Free shipping on orders above ₹999. Need help with a specific order ID?";
    } else if (
      msg.includes("return") ||
      msg.includes("refund") ||
      msg.includes("cancel")
    ) {
      reply =
        "You can cancel orders that are still Pending or Processing from My Orders. For returns/refunds on delivered items, please contact support within 7 days. Refunds are processed within 5–7 business days.";
    } else if (
      msg.includes("price") ||
      msg.includes("cost") ||
      msg.includes("cheap") ||
      msg.includes("budget")
    ) {
      products = await Product.find({ isActive: { $ne: false } })
        .populate("brand", "name")
        .sort({ "sizes.price": 1 })
        .limit(3);

      reply = `Looking for value? Here are some great options:\n${products
        .map(
          (p, i) =>
            `${i + 1}. ${p.name} — from ₹${p.sizes?.[0]?.price || "N/A"}`
        )
        .join("\n")}`;
    } else if (
      msg.includes("hello") ||
      msg.includes("hi") ||
      msg.includes("hey")
    ) {
      reply =
        "Hello! 👋 I'm LuxeScent AI Assistant. I can help you with:\n• Product recommendations\n• Order tracking\n• Shipping & returns\n• Finding the perfect scent\n\nWhat are you looking for today?";
    } else if (msg.includes("men") || msg.includes("male") || msg.includes("him")) {
      products = await Product.find({
        isActive: { $ne: false },
        $or: [
          { tags: { $in: ["men", "male", "him"] } },
          { name: { $regex: /men|male|him|sauvage|bleu/i } },
        ],
      })
        .populate("brand", "name")
        .limit(3);

      if (products.length === 0) {
        products = await Product.find({ isBestSeller: true })
          .populate("brand", "name")
          .limit(3);
      }

      reply = `Great choice! Here are some popular picks often preferred for men:\n${products
        .map((p, i) => `${i + 1}. ${p.name} by ${p.brand?.name || ""}`)
        .join("\n")}`;
    } else if (
      msg.includes("women") ||
      msg.includes("female") ||
      msg.includes("her") ||
      msg.includes("lady")
    ) {
      products = await Product.find({ isFeatured: true })
        .populate("brand", "name")
        .limit(3);

      reply = `Elegant picks for a refined feminine scent profile:\n${products
        .map((p, i) => `${i + 1}. ${p.name} by ${p.brand?.name || ""}`)
        .join("\n")}`;
    } else if (msg.includes("coupon") || msg.includes("discount") || msg.includes("offer")) {
      reply =
        "Check the cart page to apply coupon codes. We often run offers like LUXE10 for 10% off. Free shipping above ₹999!";
    } else {
      // Search products by message keywords
      products = await Product.find({
        isActive: { $ne: false },
        $or: [
          { name: { $regex: msg.split(" ")[0], $options: "i" } },
          { description: { $regex: msg.split(" ")[0], $options: "i" } },
        ],
      })
        .populate("brand", "name")
        .limit(3);

      if (products.length > 0) {
        reply = `I found these related products:\n${products
          .map(
            (p, i) =>
              `${i + 1}. ${p.name} — ₹${p.sizes?.[0]?.price || "N/A"}`
          )
          .join("\n")}\n\nYou can also browse all products or ask me for recommendations!`;
      } else {
        reply =
          "I'm here to help with product recommendations, orders, shipping, and more. Try asking:\n• \"Recommend a perfume\"\n• \"Best sellers\"\n• \"Track my order\"\n• \"Budget options\"";
      }
    }

    res.json({
      success: true,
      data: {
        reply,
        products: products.map((p) => ({
          _id: p._id,
          name: p.name,
          slug: p.slug,
          brand: p.brand?.name,
          price: p.sizes?.[0]?.price,
          image: p.images?.[0],
        })),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- AI Review Summarization ----------
export const summarizeReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).limit(50);

    if (reviews.length === 0) {
      return res.json({
        success: true,
        data: {
          summary: "No reviews yet for this product.",
          sentiment: "neutral",
          count: 0,
        },
      });
    }

    const avg =
      reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    const positive = reviews.filter((r) => r.rating >= 4).length;
    const negative = reviews.filter((r) => r.rating <= 2).length;

    let sentiment = "mixed";
    if (avg >= 4) sentiment = "positive";
    else if (avg <= 2.5) sentiment = "negative";

    // Keyword extraction from comments
    const allText = reviews.map((r) => r.comment.toLowerCase()).join(" ");
    const keywords = ["long lasting", "fresh", "sweet", "strong", "mild", "packaging", "value", "quality", "scent", "smell"];
    const found = keywords.filter((k) => allText.includes(k));

    const summary = `Based on ${reviews.length} reviews, customers rate this product ${avg.toFixed(1)}/5 overall (${sentiment} sentiment). ${positive} positive and ${negative} critical reviews. ${
      found.length
        ? `Frequently mentioned: ${found.slice(0, 4).join(", ")}.`
        : ""
    }`;

    res.json({
      success: true,
      data: {
        summary,
        sentiment,
        average: Math.round(avg * 10) / 10,
        count: reviews.length,
        positive,
        negative,
        keywords: found.slice(0, 5),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};