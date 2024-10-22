import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Initialize stripe with API key
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

// Server static files via express
app.use("/", express.static("./static")); // The catalog or main page can be served from static root
app.use("/checkout", express.static("./static/checkout")); // The /checkout pages can be served from static/checkout directory

// Required to read the json content from client. The json content from the request is parsed and added to req.body for you to use
app.use(express.json());

app.get("/create-checkout-session", (req, res) => {
  res.send("GET not implemented");
});

// Master catalog of all items. Can be retrieved from a DB or another source
const storeCatalog = new Map([
  [1001, { priceInCents: 200000, name: "Standard Hosting Package" }],
  [2003, { priceInCents: 100000, name: "Standalone Hosting Server" }],
  [2021, { priceInCents: 50000, name: "TLS Certificate" }],
  [2042, { priceInCents: 50000, name: "Hosted Email" }],
]);

/**
 *  Creates a Stripe payment session and returns the URL for the page
 */
app.post("/create-checkout-session", async (req, res) => {
  try {
    // console.log(req.body);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Only credit card payment for now. Other options are bank transfer, etc.
      mode: "payment", // Use payment for one time payment, and subscription for a scheduled subscription payment
      line_items: req.body.items.map((item) => {
        // map() through the input and create a JSON output that is compatible for Stripe to use
        const storeItem = storeCatalog.get(item.id);
        // Checkout README.md for link to Stripe's checkout line_items payload
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.qty,
          adjustable_quantity: {
            // Optional, allows user to adjust quantity during checkout
            enabled: true,
          },
        };
      }),
      success_url: `${process.env.SERVER_URL}/checkout/success.html`, // The URL that stripe payment session will redirect to after the payment is successful
      cancel_url: `${process.env.SERVER_URL}/checkout`, //  The URL that stripe payment session will redirect to upon canceling payment
    });
    // console.log(session);
    // Return the session.url back to client to load and start accepting payment
    res.json({ url: session.url });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
