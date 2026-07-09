# Case Study: Pizza Ordering Chatbot Static App

## Project Overview

The Pizza Ordering Chatbot is a static browser version of my original Python console ordering program. The original project used terminal prompts to collect pizza order details and calculate the final cost. I translated that flow into a small web app so the ordering logic is easier to interact with.

## What the Original Program Did

The Python version introduced a virtual assistant named Alex. Alex asked for:

- the user's name
- pizza size
- pizza toppings
- crust type
- quantity
- carry out or delivery

The program then calculated the total using the selected pizza size, quantity, sales tax multiplier, and delivery fee.

## Validation and User Input

The original program used `while` loops to keep asking for a value until the user entered something valid. That matters because the order calculation depends on the input being usable. The static version keeps that same idea with browser-side validation.

If the user leaves a required answer blank or enters a value the app cannot recognize, the page shows a message and does not continue until the response is fixed.

## Pricing Logic

The pricing logic is based on the original code:

- small pizza: $8.99
- medium pizza: $14.99
- large pizza: $17.99
- delivery fee: $5.00
- sales tax: 10%

The formula is:

`total = (pizzaCost * quantity) * salesTax + deliveryFee`

After the total is calculated, the app checks whether the order is at least $50. If it is, the user receives a coupon message. If not, the app tells the user that orders over $50 receive the coupon.

## Static Version Design

I designed the static version like a small pizza-ordering chat app. The chat area follows the original prompt sequence, and the receipt panel shows the order as it is being built. That makes the original console behavior more visible without adding unrelated features.

## What I Would Improve Next

If I expanded this project, I would add real menu buttons, optional toppings, and a way to review the order before submitting it. I would also split the pricing data into a larger menu file if the project grew beyond the original assignment logic.
