const button = document.getElementById("btnCheckout");
button.addEventListener("click", async () => {
  // console.log("Checkout");
  const checkoutUrl = "http://localhost:3000/create-checkout-session"; // Use express URL to simulate a separate server that hosts static and server files
  try {
    // The checkoutUrl on the server will initiate a session with Stripe payment and return the page url, that the client will redirect to
    const response = await fetch(checkoutUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        /*
        It is not required that these items/products are setup in Stripe. 
        The keys and structure of these items can change, as long as you have a defined contract between your client and server
        But it's important that these ID's match ID's of the catalog maintained on your server
        */
        items: [
          { id: 1001, qty: 1 },
          { id: 2003, qty: 2 },
          { id: 2021, qty: 1 },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Error returned from URL ${checkoutUrl} ${response.status} : ${response.message}`
      );
    }
    const json = await response.json();
    // console.log(json);
    // Redirect to the checkout url from stripe, fetched by your server
    window.location = json.url;
  } catch (error) {
    console.error(error.message);
  }
});
