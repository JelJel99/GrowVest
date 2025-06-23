document.addEventListener("DOMContentLoaded", () => {
  loadDashboardData()

  updateBalanceLockIndicator()
})

function loadDashboardData() {
  const transactions = getTransactions()
  const savingsGoals = getSavingsGoals()
  const isBalanceLocked = getBalanceLockStatus()

  // Calculate totals
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const currentBalance = totalIncome - totalExpense

  const totalSavingsTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0)
  const totalSavingsCurrent = savingsGoals.reduce((sum, goal) => sum + goal.current, 0)
  const savingsProgress = totalSavingsTarget > 0 ? (totalSavingsCurrent / totalSavingsTarget) * 100 : 0

  // Update stats
  document.getElementById("currentBalance").textContent = formatCurrency(currentBalance)
  document.getElementById("totalIncome").textContent = formatCurrency(totalIncome)
  document.getElementById("totalExpense").textContent = formatCurrency(totalExpense)
  document.getElementById("savingsProgress").textContent = `${Math.round(savingsProgress)}%`

  // Update balance status
  const balanceStatus = document.getElementById("balanceStatus")
  if (isBalanceLocked) {
    balanceStatus.textContent = "Saldo terkunci"
  } else {
    balanceStatus.textContent = "Tersedia untuk digunakan"
  }

  // Load recent transactions
  loadRecentTransactions(transactions)

  // Load savings goals
  loadSavingsGoals(savingsGoals)
}

function loadRecentTransactions(transactions) {
  const container = document.getElementById("recentTransactions")
  const viewAllBtn = document.getElementById("viewAllTransactions")

  if (transactions.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Belum ada transaksi</p>
        <a href="transactions.html" class="btn btn-primary">Tambah Transaksi Pertama</a>
      </div>
    `
    viewAllBtn.style.display = "none"
  } else {
    const recentTransactions = transactions.slice(-5).reverse()
    container.innerHTML = recentTransactions
      .map(
        (transaction) => `
      <div class="transaction-item">
        <div class="transaction-info">
          <h4>${transaction.description}</h4>
          <p>${transaction.category}</p>
        </div>
        <div class="transaction-amount ${transaction.type}">
          ${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}
        </div>
      </div>
    `,
      )
      .join("")

    viewAllBtn.style.display = "block"
  }
}

function loadSavingsGoals(savingsGoals) {
  const container = document.getElementById("savingsGoals")
  const manageBtn = document.getElementById("manageSavings")

  if (savingsGoals.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Belum ada target tabungan</p>
        <a href="savings.html" class="btn btn-primary">Buat Target Pertama</a>
      </div>
    `
    manageBtn.style.display = "none"
  } else {
    const displayGoals = savingsGoals.slice(0, 3)
    container.innerHTML = displayGoals
      .map((goal) => {
        const progress = (goal.current / goal.target) * 100
        return `
        <div class="savings-goal">
          <div class="goal-header">
            <span class="goal-name">${goal.name}</span>
            <span class="goal-amount">${formatCurrency(goal.current)} / ${formatCurrency(goal.target)}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
          </div>
        </div>
      `
      })
      .join("")

    manageBtn.style.display = "block"
  }
}

function updateBalanceLockIndicator() {
  const indicator = document.getElementById("balanceLockIndicator")
  const isLocked = getBalanceLockStatus()

  if (isLocked) {
    indicator.classList.remove("hidden")
  } else {
    indicator.classList.add("hidden")
  }
}

// Utility functions
function getTransactions() {
  const transactions = localStorage.getItem("growvest-transactions")
  return transactions ? JSON.parse(transactions) : []
}

function getSavingsGoals() {
  const goals = localStorage.getItem("growvest-goals")
  return goals ? JSON.parse(goals) : []
}

function getBalanceLockStatus() {
  const status = localStorage.getItem("growvest-balance-locked")
  return status ? JSON.parse(status) : false
}

function formatCurrency(number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number)
}
