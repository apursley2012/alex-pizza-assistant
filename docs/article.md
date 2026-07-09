# Translating My Pizza Ordering Chatbot From Python to the Browser

This project started as a Python console chatbot named Alex. The original version walked the user through a pizza order one question at a time, then used the answers to calculate the final cost. I kept that step-by-step idea, but updated the order flow so the browser version feels closer to a real pizza ordering chatbot instead of stopping after one basic set of inputs.

The app now collects the user's name, pizza size, toppings, crust type, quantity, and order method. After the method is chosen, Alex asks whether the user wants to order a different pizza or add another one. If the user says yes, the pizza questions repeat and the new pizza is added to the same receipt. If the user says no, the app moves into checkout.

The input validation is still one of the most important parts of the project. The code checks that required answers are not blank, the pizza size is small, medium, or large, the quantity is a number greater than zero, the order method is carry out or delivery, and the payment method is cash or card. Those checks keep the program from trying to calculate an order from missing or unusable information.

I also updated the checkout logic. Cash orders show different instructions based on whether the order is delivery or carry out. For delivery, Alex tells the customer that the driver will collect payment upon delivery. For carry out, Alex tells the customer to pay when picking up the order. Card orders use a simulated credit/debit card flow with a card number, expiration date, and security code. This is only demo logic, not a real payment system, but it makes the order process feel more complete.

For delivery orders paid by card, the app asks whether the customer would like to add a driver tip. The prompt also includes the note that 100% of tips are kept by the driver. That tip is added to the final total along with the pizza subtotal, sales tax, and delivery fee.

The pricing logic is still straightforward. A small pizza costs $8.99, a medium pizza costs $14.99, and a large pizza costs $17.99. Delivery adds a $5 fee, and the app applies 10% sales tax to the pizza subtotal. After checkout, the app shows the final total and the same coupon message based on whether the order reaches $50.

The biggest change is the presentation. Instead of a terminal window, the static version uses a chat-style order screen, a live receipt panel, and an itemized pizza list. That makes the project easier to test and easier to understand at a glance, while still showing the original beginner programming concepts: variables, loops, validation, conditionals, arrays, calculations, type conversion, and formatted output.
