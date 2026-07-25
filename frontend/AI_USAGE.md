# AI Usage Documentation — LuxeScent

## Which AI tools were used

1. **Custom AI Recommendation Engine** (Node.js + MongoDB aggregation)
2. **Intent-based Conversational AI** (Rule-based NLP + product search)
3. **AI Review Summarization** (Statistical + keyword analysis)

No external paid API (OpenAI/Gemini) is required for core features — making it free, fast, and privacy-friendly for the assessment.

---

## Where they were used

| Feature | Location | Endpoint |
|---------|----------|----------|
| AI Product Recommendations | Product Details page | `GET /api/ai/recommendations` |
| AI Chat Assistant | Floating widget (all pages) | `POST /api/ai/chat` |
| AI Review Summarization | Product Details → Reviews | `GET /api/ai/reviews/summary/:id` |

---

## Why they were chosen

### 1. AI Product Recommendations
- Uses category/brand similarity, ratings, best-seller flags, and user purchase history
- Meaningful for e-commerce conversion
- Works offline without third-party API costs

### 2. AI Chat Assistant
- Helps users find products, track orders, understand shipping/returns
- Intent detection for recommendations, budget, gender preferences, coupons
- Improves UX and reduces support load
- Shows clickable product cards in chat

### 3. AI Review Summarization
- Aggregates ratings + extracts common keywords from reviews
- Gives buyers a quick sentiment overview
- Useful when many reviews exist

---

## How to test

1. Open any product → scroll to **AI Recommended**
2. Click 🤖 chat button → try: "recommend a perfume", "best sellers", "track order"
3. On product with reviews → see **AI Review Summary**