const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

function checkLocalStorage() {
  const storage = localStorage.getItem("transactions");
  if (!storage || storage.length === 0) return;
  displayTransactions();
}

function addToLocalStorage(text, amount) {
  let transactions = [];
  if (!localStorage.getItem("transactions")) {
    transactions = [{ type: amount >= 0 ? "income" : "expense", text, amount }];
  } else {
    transactions = JSON.parse(localStorage.getItem("transactions"));
    transactions.push({
      type: amount >= 0 ? "income" : "expense",
      text,
      amount,
    });
  }
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function removeFromLocalStorage(text) {
  const transactions = JSON.parse(localStorage.getItem("transactions"));
  const editedTransactions = transactions.filter((transaction) => {
    return transaction.text !== text;
  });
  localStorage.setItem("transactions", JSON.stringify(editedTransactions));
}

function formatAmount(amount) {
  let formattedAmount;
  if (amount > 0) {
    formattedAmount = `+$${amount.toFixed(2).toLocaleString("en-US")}`;
  } else if (amount < 0) {
    formattedAmount = `-$${Math.abs(amount)
      .toFixed(2)
      .toLocaleString("en-US")}`;
  } else {
    formattedAmount = "$0";
  }
  return formattedAmount;
}

function updateStats(transactions) {
  const expenses = transactions.reduce((acc, curr) => {
    if (curr.type === "expense") {
      return acc + +curr.amount;
    }
    return acc;
  }, 0);
  const income = transactions.reduce((acc, curr) => {
    if (curr.type === "income") {
      return acc + +curr.amount;
    }
    return acc;
  }, 0);
  const calculatedBalance = income + expenses;
  moneyMinus.textContent = formatAmount(expenses);
  moneyPlus.textContent = formatAmount(income);
  balance.textContent = formatAmount(calculatedBalance);
}

function displayTransactions() {
  const transactions = JSON.parse(localStorage.getItem("transactions"));
  list.innerHTML = transactions
    .map(
      (transaction) =>
        `<li class="${transaction.type === "expense" ? "minus" : "plus"}">
    ${transaction.text} <span>${formatAmount(
          transaction.amount
        )}</span><button class="delete-btn">x</button>
    </li>`
    )
    .join("");
  updateStats(transactions);
}

function handleSubmit(e) {
  e.preventDefault();
  if (!text.value.trim() || !amount.value.trim())
    return alert("Please fill out text and amount of transaction!");
  addToLocalStorage(text.value.trim(), +amount.value.trim());
  text.value = "";
  amount.value = "";
  displayTransactions();
}

function handleClick(e) {
  if (e.target.classList.contains("delete-btn")) {
    removeFromLocalStorage(
      e.target.previousSibling.previousSibling.textContent.trim()
    );
    displayTransactions();
  }
}

document.addEventListener("DOMContentLoaded", checkLocalStorage);
form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);
