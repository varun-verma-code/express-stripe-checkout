# express-stripe-checkout

Stripe checkout demo using express and node.js.  
Create a docker image and run the server code within a Docker container.  
Setup .dockerignore file  
Setup Dockerfile  
Push the docker image to the retistry.  
Run docker container and pass the environment file that isn't checked into code or docker image

## Dependencies

- express
- dotenv
- cors
- stripe

## .env properties

PORT=3000  
STATIC_SERVER_URL=http://localhost:5500  
STRIPE_PRIVATE_KEY=YOUR_PRIVATE_KEY

## References

- [Stripe Checkout Sessions API Guide](https://docs.stripe.com/api/checkout/sessions/create)
- [Stripe Account Dashboard](https://dashboard.stripe.com/login)

## Building the docker image

```
docker build -t dockervarver/express-stripe-checkout-server .
```

## Publishing the image to the registry

```
docker push dockervarver/express-stripe-checkout-server
```

## Running the Docker container for the express-server

```
docker run -d -p 3000:3000 --env-file .env dockervarver/express-stripe-checkout-server
```

## Test Credit Card

Card Number: 4242 4242 4242 4242  
Expiration: Any date in future  
CVC: 424  
(Enter any test data in other fields)
