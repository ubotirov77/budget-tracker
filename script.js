// -------------------------------
// LOAD DATA FIRST
// -------------------------------
let incomeData = JSON.parse(localStorage.getItem("incomeData")) || [];
let expenseData = JSON.parse(localStorage.getItem("expenseData")) || [];

function saveData() {
  localStorage.setItem("incomeData", JSON.stringify(incomeData));
  localStorage.setItem("expenseData", JSON.stringify(expenseData));
}

// -------------------------------
// ELEMENTS
// -------------------------------
const els = {
  totalIncome: document.getElementById("total-income"),
  totalExpenses: document.getElementById("total-expenses"),
  totalBalance: document.getElementById("total-balance"),
  incomeList: document.getElementById("income-list"),
  expenseTableBody: document.getElementById("expense-table-body"),
  expenseCount: document.getElementById("expense-count"),
  incomeForm: document.getElementById("income-form"),
  incomeSource: document.getElementById("income-source"),
  incomeAmount: document.getElementById("income-amount"),
  expenseForm: document.getElementById("expense-form"),
  expenseDesc: document.getElementById("expense-desc"),
  expenseCategory: document.getElementById("expense-category"),
  expenseAmount: document.getElementById("expense-amount")
};

// -------------------------------
// SUMMARY
// -------------------------------
function renderSummary() {
  const totalIncome = incomeData.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenseData.reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpenses;

  els.totalIncome.textContent = totalIncome.toLocaleString();
  els.totalExpenses.textContent = totalExpenses.toLocaleString();
  els.totalBalance.textContent = balance.toLocaleString();
}

// -------------------------------
// INCOME LIST
// -------------------------------
function renderIncomeList() {
  els.incomeList.innerHTML = "";

  incomeData.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.source}</span>
      <span>${item.amount.toLocaleString()}</span>
      <button class="delete-btn">✖</button>
    `;

    li.querySelector("button").onclick = () => {
      incomeData.splice(index, 1);
      saveData();
      renderIncomeList();
      renderSummary();
    };

    els.incomeList.appendChild(li);
  });
}

// -------------------------------
// EXPENSE TABLE
// -------------------------------
function renderExpenseTable() {
  els.expenseTableBody.innerHTML = "";

  expenseData.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.date}</td>
      <td>${item.desc}</td>
      <td>${item.category}</td>
      <td>${item.amount.toLocaleString()}</td>
      <td><button class="delete-btn">✖</button></td>
    `;

    tr.querySelector("button").onclick = () => {
      expenseData.splice(index, 1);
      saveData();
      renderExpenseTable();
      renderSummary();
    };

    els.expenseTableBody.appendChild(tr);
  });

  els.expenseCount.textContent = expenseData.length + " items";
}

// -------------------------------
// INCOME FORM
// -------------------------------
els.incomeForm.addEventListener("submit", e => {
  e.preventDefault();

  const source = els.incomeSource.value.trim();
  const amount = Number(els.incomeAmount.value);

  if (!source || amount <= 0) return;

  incomeData.push({ source, amount });
  saveData();

  els.incomeSource.value = "";
  els.incomeAmount.value = "";

  renderIncomeList();
  renderSummary();
});

// -------------------------------
// EXPENSE FORM
// -------------------------------
els.expenseForm.addEventListener("submit", e => {
  e.preventDefault();

  const desc = els.expenseDesc.value.trim();
  const category = els.expenseCategory.value;
  const amount = Number(els.expenseAmount.value);

  if (!desc || amount <= 0) return;

  const today = new Date().toISOString().slice(0, 10);

  expenseData.push({ date: today, desc, category, amount });
  saveData();

  els.expenseDesc.value = "";
  els.expenseAmount.value = "";

  renderExpenseTable();
  renderSummary();
});

// -------------------------------
// INITIAL RENDER
// -------------------------------
renderIncomeList();
renderExpenseTable();
renderSummary();
