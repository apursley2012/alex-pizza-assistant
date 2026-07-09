# Case Study: Pizza Ordering Chatbot Static App

## Project Overview

The Pizza Ordering Chatbot is a static browser version of my Python console ordering program. The original project used terminal prompts to collect pizza order details and calculate the final cost. I translated that flow into a small web app so the ordering logic is easier to interact with, then expanded the flow so it works more like a real order chatbot.

## What the Program Does

The chatbot introduces a virtual assistant named Alex. Alex asks for:

- the user's name
- pizza size
- pizza toppings
- crust type
- quantity
- carry out or delivery
- whether the user wants to order another pizza
- cash or card payment
- card details for simulated card checkout
- an optional driver tip for delivery orders paid by card

The app can now build an order with more than one pizza. Each completed pizza is added to the receipt, and the user can keep adding different pizzas before checkout.

## Validation and User Input

The original console version used `while` loops to keep asking for a value until the user entered something valid. That matters because the order calculation depends on the input being usable. The static version keeps that same idea with browser-side validation.

If the user leaves a required answer blank or enters a value the app cannot recognize, the page shows a message and does not continue until the response is fixed. The browser version validates pizza size, toppings, crust, quantity, order method, yes/no responses, payment method, card number length, expiration format, security code length, and tip amount.

## Order Flow Logic

The main logic change is that the app no longer assumes the customer only wants one pizza. After the first pizza is added and the order method is chosen, Alex asks whether the user wants to order a different pizza or add another one.

If the answer is yes, the app clears the temporary pizza fields and repeats the pizza questions. If the answer is no, the app moves to payment. The order method is only selected once, so every pizza in the order stays under the same carry out or delivery choice.

## Payment Logic

The checkout flow now branches based on payment method.

For cash payments:

- delivery orders show a message that the driver will collect payment upon delivery
- carry out orders show a message telling the customer to pay when picking up the order

For card payments:

- the app asks for a credit/debit card number
- the app asks for an expiration date in `MM/YY` format
- the app asks for a 3 or 4 digit security code
- the app displays a simulated approval message using the last four digits of the card number

This is only a front-end demo. It does not process real payments or store card data.

## Tip Logic

If the order is delivery and the payment method is card, Alex asks whether the customer wants to add a tip for the delivery driver. The prompt includes the disclaimer that 100% of tips are kept by the driver. The tip amount is added to the final total.

The tip question is skipped for carry out orders and for cash delivery orders because the cash payment message already explains that the driver will collect payment upon delivery.

## Pricing Logic

The pricing logic is based on the project values:

- small pizza: $8.99
- medium pizza: $14.99
- large pizza: $17.99
- delivery fee: $5.00
- sales tax: 10%
- coupon threshold: $50.00

The updated formula is:

`total = subtotal + tax + deliveryFee + tip`

The subtotal is calculated by adding each pizza item together:

`subtotal = sum(pizzaPrice * quantity for each pizza)`

After the total is calculated, the app checks whether the order is at least $50. If it is, the user receives a coupon message. If not, the app tells the user that orders over $50 receive the coupon.

## Static Version Design

I designed the static version like a small pizza-ordering chat app. The chat area follows the prompt sequence, and the receipt panel shows the order as it is being built. The itemized pizza list makes the multi-pizza logic easier to see because every added pizza stays visible before checkout.

The app is still intentionally static. It works on GitHub Pages without a backend, database, build step, or real payment processor.

## What I Would Improve Next

If I expanded this project again, I would add menu buttons for common toppings, an order review screen before checkout, and a clearer breakdown for subtotal, tax, delivery fee, tip, and final total. I would also move all menu and fee values into one shared data source so the pricing values only need to be updated in one place.
