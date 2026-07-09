*
  Pizza Ordering Chatbot
  Static browser adaptation of the original Python console order flow.
*/

const prices = {
  small: 8.99,
  medium: 14.99,
  large: 17.99
};

const TAX_RATE = 0.1;
const DELIVERY_FEE = 5;

const order = {
  userName: "",
  pizzas: [],
  currentPizza: createBlankPizza(),
  addAnother: "",
  method: "",
  paymentMethod: "",
  cardLastFour: "",
  tip: 0,
  subtotal: 0,
  tax: 0,
  deliveryFee: 0,
  total: 0
};

const steps = [
  { id: "userName", label: "Enter your name:", validate: (value) => value.length > 0, error: "Name cannot be blank." },
  { id: "size", label: "What size pizza do you want? Enter small, medium, or large:", validate: (value) => ["small", "medium", "large"].includes(value.toLowerCase()), error: "Please enter small, medium, or large." },
  { id: "toppings", label: "Enter any toppings you want on your pizza. If you would like more than one, separate them with spaces:", validate: (value) => value.length > 0, error: "Toppings cannot be blank. If you do not want any toppings, simply enter cheese." },
  { id: "crustType", label: "Enter the type of crust you want: thin, thick, pan, or deep dish:", validate: (value) => value.length > 0, error: "Crust type cannot be blank." },
  { id: "quantity", label: "How many of these pizzas do you want to order? Enter a numeric value:", validate: (value) => /^\d+$/.test(value) && Number(value) > 0, error: "Please enter a numeric value greater than 0." },
  { id: "addAnother", label: "Would you like to order a different pizza or add another one?", validate: (value) => ["yes", "y", "no", "n"].includes(value.toLowerCase()), error: "Please enter yes or no." },
  { id: "method", label: "Is this carry out or delivery?", validate: (value) => ["carry out", "carryout", "pickup", "pick up", "delivery"].includes(value.toLowerCase()), error: "Please enter carry out or delivery." },
  { id: "paymentMethod", label: "Will you be paying with cash or card?", validate: (value) => ["cash", "card", "credit", "debit", "credit card", "debit card"].includes(value.toLowerCase()), error: "Please enter cash or card." },
  { id: "cardNumber", label: "Enter your credit/debit card number for this demo payment:", validate: (value) => /^\d{13,19}$/.test(value.replace(/[\s-]/g, "")), error: "Please enter a card number using 13 to 19 digits." },
  { id: "cardExpiration", label: "Enter the card expiration date as MM/YY:", validate: (value) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value), error: "Please enter the expiration date as MM/YY." },
  { id: "cardCvv", label: "Enter the 3 or 4 digit security code:", validate: (value) => /^\d{3,4}$/.test(value), error: "Please enter a 3 or 4 digit security code." },
  { id: "tip", label: "Would you like to add a tip for your delivery driver? Enter a dollar amount, or enter 0 for no tip. 100% of tips are kept by the driver.", validate: (value) => isValidMoney(value), error: "Please enter a valid tip amount, like 3, 3.50, or 0." }
];

let currentStep = 0;

const chatFeed = document.querySelector("#chatFeed");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const questionLabel = document.querySelector("#questionLabel");
const validation = document.querySelector("#validationMessage");
const orderStatus = document.querySelector("#orderStatus");
const newOrderBtn = document.querySelector("#newOrder");

chatForm.addEventListener("submit", handleSubmit);
newOrderBtn.addEventListener("click", resetOrder);

function handleSubmit(event) {
  event.preventDefault();

  const step = steps[currentStep];
  const rawValue = chatInput.value.trim();

  if (!step.validate(rawValue)) {
    validation.textContent = step.error;
    return;
  }

  validation.textContent = "";
  const value = normalizeValue(step.id, rawValue);
  saveAnswer(step.id, value);

  addBubble(rawValue, "user");
  respondToAnswer(step.id, value);
  calculateTotals();
  updateReceipt();

  advanceStep(step.id, value);
}

function saveAnswer(id, value) {
  if (["size", "toppings", "crustType", "quantity"].includes(id)) {
    order.currentPizza[id] = value;
    return;
  }

  if (id === "cardNumber") {
    order.cardLastFour = value.slice(-4);
    return;
  }

  if (id !== "cardExpiration" && id !== "cardCvv") {
    order[id] = value;
  }
}

function respondToAnswer(id, value) {
  if (id === "userName") {
    if (["alysha pursley", "alysha"].includes(value.toLowerCase())) {
      addBubble(`My creator, ${value}. Pleasure to serve you!`, "bot");
    } else {
      addBubble(`Hi, ${value}. Nice to meet you!`, "bot");
    }
  }

  if (id === "quantity") {
    addCurrentPizzaToOrder();
    const latestPizza = order.pizzas[order.pizzas.length - 1];
    addBubble(`Added ${latestPizza.quantity} ${latestPizza.size} pizza(s) with ${latestPizza.toppings} and ${latestPizza.crustType} crust.`, "bot");
  }

  if (id === "paymentMethod" && value === "cash") {
    if (order.method === "delivery") {
      addBubble("Your driver will collect your cash payment upon delivery.", "bot");
    } else {
      addBubble("Please pay for your order when you pick it up.", "bot");
    }
  }

  if (id === "cardCvv") {
    addBubble(`Card payment approved for the card ending in ${order.cardLastFour}.`, "bot");
  }
}

function advanceStep(id, value) {
  if (id === "quantity") {
    currentStep = getStepIndex("addAnother");
  } else if (id === "addAnother") {
    if (value === "yes") {
      order.currentPizza = createBlankPizza();
      order.addAnother = "";
      currentStep = getStepIndex("size");
    } else {
      currentStep = getStepIndex("method");
    }
  } else if (id === "method") {
    currentStep = getStepIndex("paymentMethod");
  } else if (id === "paymentMethod") {
    if (value === "card") {
      currentStep = getStepIndex("cardNumber");
    } else {
      finishOrder();
      return;
    }
  } else if (id === "cardCvv") {
    if (order.method === "delivery") {
      currentStep = getStepIndex("tip");
    } else {
      finishOrder();
      return;
    }
  } else if (id === "tip") {
    finishOrder();
    return;
  } else {
    currentStep += 1;
  }

  showCurrentStep();
}

function normalizeValue(id, value) {
  const normalized = value.toLowerCase().trim();

  if (id === "size") return normalized;
  if (id === "method") {
    if (["carryout", "pickup", "pick up"].includes(normalized)) return "carry out";
    return normalized;
  }
  if (id === "quantity") return Number(value);
  if (id === "addAnother") return ["yes", "y"].includes(normalized) ? "yes" : "no";
  if (id === "paymentMethod") return normalized.includes("card") || ["credit", "debit"].includes(normalized) ? "card" : "cash";
  if (id === "cardNumber") return value.replace(/[\s-]/g, "");
  if (id === "tip") return Number(value.replace("$", ""));
  return value;
}

function showCurrentStep() {
  const step = steps[currentStep];
  questionLabel.textContent = step.label;
  chatInput.value = "";
  chatInput.focus();
  orderStatus.textContent = `Step ${currentStep + 1} of ${steps.length}`;
}

function finishOrder() {
  calculateTotals();
  updateReceipt();

  addBubble(`Thank you, ${order.userName}, for your order.`, "bot");
  addBubble(`Your order total is ${formatMoney(order.total)}.`, "result");

  if (order.paymentMethod === "card") {
    addBubble("Your card payment has been processed for this demo order.", "bot");
  }

  if (order.total >= 50) {
    addBubble("Congratulations! You've been awarded a $10 off coupon for your next order.", "bot");
  } else {
    addBubble("Orders over $50 receive a free $10 off coupon.", "bot");
  }

  runFastEta();

  chatInput.disabled = true;
  chatForm.querySelector("button").disabled = true;
  questionLabel.textContent = "Order complete. Start over if you want to place another order.";
  orderStatus.textContent = "Complete";
}

function runFastEta() {
  const readyMessage = order.method === "delivery" ? "Your driver is on the way!" : "Order is ready for pickup!";
  const messages = [
    "Order received. ETA 3 minutes!",
    "3 minutes remaining...",
    "2 minutes remaining...",
    "1 minute remaining...",
    readyMessage
  ];

  messages.forEach((message, index) => {
    setTimeout(() => addBubble(message, "bot"), index * 450);
  });
}

function resetOrder() {
  Object.assign(order, {
    userName: "",
    pizzas: [],
    currentPizza: createBlankPizza(),
    addAnother: "",
    method: "",
    paymentMethod: "",
    cardLastFour: "",
    tip: 0,
    subtotal: 0,
    tax: 0,
    deliveryFee: 0,
    total: 0
  });

  currentStep = 0;
  chatFeed.innerHTML = "";
  addBubble("Hello, my name is Alex, your virtual assistant. I will help you order a pizza!", "bot");
  addBubble("I am going to ask you a few questions. After typing an answer, press continue.", "bot");
  chatInput.disabled = false;
  chatForm.querySelector("button").disabled = false;
  updateReceipt();
  showCurrentStep();
}

function createBlankPizza() {
  return {
    size: "",
    toppings: "",
    crustType: "",
    quantity: ""
  };
}

function addCurrentPizzaToOrder() {
  const pizza = { ...order.currentPizza };
  order.pizzas.push(pizza);
}

function calculateTotals() {
  order.subtotal = order.pizzas.reduce((sum, pizza) => {
    return sum + prices[pizza.size] * pizza.quantity;
  }, 0);
  order.tax = order.subtotal * TAX_RATE;
  order.deliveryFee = order.method === "delivery" ? DELIVERY_FEE : 0;
  order.total = order.subtotal + order.tax + order.deliveryFee + Number(order.tip || 0);
}

function addBubble(text, type) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${type}`;
  bubble.textContent = text;
  chatFeed.appendChild(bubble);
  chatFeed.scrollTop = chatFeed.scrollHeight;
}

function updateReceipt() {
  document.querySelector("#rName").textContent = order.userName || "â";
  document.querySelector("#rMethod").textContent = order.method || "â";
  document.querySelector("#rPayment").textContent = getPaymentLabel();
  document.querySelector("#rSubtotal").textContent = formatMoney(order.subtotal || 0);
  document.querySelector("#rTax").textContent = formatMoney(order.tax || 0);
  document.querySelector("#rDeliveryFee").textContent = formatMoney(order.deliveryFee || 0);
  document.querySelector("#rTip").textContent = formatMoney(order.tip || 0);
  document.querySelector("#rTotal").textContent = formatMoney(order.total || 0);
  document.querySelector("#rItems").innerHTML = getPizzaSummary();
}

function getPizzaSummary() {
  if (order.pizzas.length === 0) return "<p>No pizzas added yet.</p>";

  return order.pizzas.map((pizza, index) => {
    const unitPrice = prices[pizza.size];
    const itemTotal = unitPrice * pizza.quantity;
    return `
      <div class="receipt-item">
        <div>
          <strong>Pizza ${index + 1}</strong>
          <span>${pizza.quantity} Ã ${pizza.size} pizza</span>
        </div>
        <p><strong>Toppings:</strong> ${pizza.toppings}</p>
        <p><strong>Crust:</strong> ${pizza.crustType}</p>
        <p><strong>Unit price:</strong> ${formatMoney(unitPrice)}</p>
        <p class="receipt-line-total"><strong>Item total:</strong> ${formatMoney(itemTotal)}</p>
      </div>`;
  }).join("");
}

function getPaymentLabel() {
  if (!order.paymentMethod) return "â";
  if (order.paymentMethod === "card" && order.cardLastFour) return `card ending in ${order.cardLastFour}`;
  return order.paymentMethod;
}

function isValidMoney(value) {
  return /^\$?\d+(\.\d{1,2})?$/.test(value.trim());
}

function getStepIndex(id) {
  return steps.findIndex((step) => step.id === id);
}

function formatMoney(value) {
  return `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

showCurrentStep();
updateReceipt();
