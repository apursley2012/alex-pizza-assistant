# Translating My Pizza Ordering Chatbot From Python to the Browser

This project started as a Python console chatbot named Alex. The original program walks the user through a pizza order by asking one question at a time. It collects the user's name, pizza size, toppings, crust type, quantity, and whether the order is carry out or delivery.

The most important part of the project is the input validation. The original code checks that the name is not blank, the pizza size is small, medium, or large, the quantity is numeric, and the order method is either carry out or delivery. Those checks make the program feel more complete because the user cannot accidentally skip required information or enter values the program cannot use.

The pricing logic is also straightforward. A small pizza costs $8.99, a medium pizza costs $14.99, and a large pizza costs $17.99. Delivery adds a $5 fee. The program uses a 10% sales tax, then prints the final cost.

I kept that same logic in the static web version. The browser page still moves through the order step by step, validates each response, calculates the total, and shows the same coupon message based on whether the total is at least $50.

The biggest change is the presentation. Instead of a terminal window, the static version uses a chat-style order screen and a receipt panel. That makes the project easier to test and easier to understand at a glance, while still showing the original beginner programming concepts: variables, loops, validation, conditionals, type conversion, and formatted output.
