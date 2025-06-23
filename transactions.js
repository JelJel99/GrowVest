document.addEventListener("DOMContentLoaded", () => {
  loadTransactionsData()

  setupEventListeners()

  updateBalanceLockToggle()
})

function setupEventListeners() {
  const addTransactionBtn = document.getElementById("addTransactionBtn")
  const addFirstTransaction = document.getElementById("addFirstTransaction")
  const closeModal = document.getElementById("closeModal")
  const transactionModal = document.getElementById("transactionModal")
  const transactionForm = document.getElementById("transactionForm")
  const transactionType = document.getElementById("transactionType")
  const balanceLock = document.getElementById("balanceLock")
  

  addTransactionBtn.addEventListener("click", () => showTransactionModal())
  if (addFirstTransaction) {
    addFirstTransaction.addEventListener("click", () => showTransactionModal())
  }

  closeModal.addEventListener("click", () => hideTransactionModal())
  transactionModal.addEventListener("click", (e) => {
    if (e.target === transactionModal) {
      hideTransactionModal()
    }
  })

  transactionForm.addEventListener("submit", handleTransactionSubmit)
  transactionType.addEventListener("change", updateCategoryOptions)
  balanceLock.addEventListener("change", toggleBalanceLock)
  updateCategoryOptions()
}

function formatCurrency(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const options = { year: "numeric", month: "long", day: "numeric" }
  return date.toLocaleDateString("id-ID", options)
}

function loadTransactionsData() {
  const transactions = getTransactions()
  const isBalanceLocked = getBalanceLockStatus()

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const currentBalance = totalIncome - totalExpense

  document.getElementById("currentBalance").textContent = formatCurrency(currentBalance)
  document.getElementById("totalIncome").textContent = formatCurrency(totalIncome)
  document.getElementById("totalExpense").textContent = formatCurrency(totalExpense)

  const balanceStatus = document.getElementById("balanceStatus")
  if (isBalanceLocked) {
    balanceStatus.style.display = "flex"
  } else {
    balanceStatus.style.display = "none"
  }

  document.getElementById("transactionCount").textContent = transactions.length

  loadTransactionsList(transactions)
}

function loadTransactionsList(transactions) {
  const container = document.getElementById("transactionsList")

  if (transactions.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Belum ada transaksi</p>
        <button id="addFirstTransaction" class="btn btn-primary">
          <i class="fas fa-plus"></i>
          Tambah Transaksi Pertama
        </button>
      </div>
    `
    const addFirstTransaction = document.getElementById("addFirstTransaction")
    if (addFirstTransaction) {
      addFirstTransaction.addEventListener("click", () => showTransactionModal())
    }
  } else {
    const sortedTransactions = transactions.slice().reverse()
    container.innerHTML = sortedTransactions
      .map(
        (transaction) => `
      <div class="transaction-item">
        <div class="transaction-left">
          <div class="transaction-type ${transaction.type}"></div>
          <div class="transaction-info">
            <h4>${transaction.description}</h4>
            <div class="transaction-meta">
              ${transaction.category} • ${formatDate(transaction.date)}
            </div>
          </div>
        </div>
        <div class="transaction-right">
          <div class="transaction-amount ${transaction.type}">
            ${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}
          </div>
          <button class="delete-btn" onclick="deleteTransaction('${transaction.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `,
      )
      .join("")
  }
}

function showTransactionModal() {
  const modal = document.getElementById("transactionModal")
  modal.classList.add("show")
  document.body.style.overflow = "hidden"
}

function hideTransactionModal() {
  const modal = document.getElementById("transactionModal")
  modal.classList.remove("show")
  document.body.style.overflow = "auto"

  document.getElementById("transactionForm").reset()
  updateCategoryOptions()
}

function updateCategoryOptions() {
  const transactionType = document.getElementById("transactionType").value
  const categorySelect = document.getElementById("category")

  const categories = {
    income: ["Gaji", "Freelance", "Investasi", "Bonus", "Lainnya"],
    expense: ["Makanan", "Transportasi", "Belanja", "Tagihan", "Hiburan", "Kesehatan", "Pendidikan", "Lainnya"],
  }

  categorySelect.innerHTML = '<option value="">Pilih kategori</option>'
  categories[transactionType].forEach((category) => {
    categorySelect.innerHTML += `<option value="${category}">${category}</option>`
  })
}

function handleTransactionSubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const isBalanceLocked = getBalanceLockStatus()

  if (isBalanceLocked && formData.get("type") === "expense") {
    console.error("Saldo terkunci! Tidak dapat menambah pengeluaran.")
    return
  }

  const newTransaction = {
    id: Date.now().toString(),
    type: formData.get("type"),
    amount: Number.parseFloat(formData.get("amount")),
    description: formData.get("description"),
    category: formData.get("category"),
    date: formData.get("transactionDate"),
  }

  const transactions = getTransactions()
  transactions.push(newTransaction)
  localStorage.setItem("growvest-transactions", JSON.stringify(transactions))

  loadTransactionsData()
  hideTransactionModal()
}

function deleteTransaction(id) {
  const transactions = getTransactions()
  const filteredTransactions = transactions.filter((t) => t.id !== id)
  localStorage.setItem("growvest-transactions", JSON.stringify(filteredTransactions))
  loadTransactionsData()
}

function updateBalanceLockToggle() {
  const balanceLock = document.getElementById("balanceLock")
  const lockIcon = document.getElementById("lockIcon")
  const isLocked = getBalanceLockStatus()

  balanceLock.checked = isLocked

  if (isLocked) {
    lockIcon.className = "fas fa-lock locked"
  } else {
    lockIcon.className = "fas fa-unlock"
  }
}

function toggleBalanceLock() {
  const balanceLock = document.getElementById("balanceLock")
  const lockIcon = document.getElementById("lockIcon")
  const isLocked = balanceLock.checked

  localStorage.setItem("growvest-balance-locked", JSON.stringify(isLocked))

  if (isLocked) {
    lockIcon.className = "fas fa-lock locked"
  } else {
    lockIcon.className = "fas fa-unlock"
  }

  loadTransactionsData()
}

function getTransactions() {
  const transactions = localStorage.getItem("growvest-transactions")
  return transactions ? JSON.parse(transactions) : []
}

function getBalanceLockStatus() {
  const status = localStorage.getItem("growvest-balance-locked")
  return status ? JSON.parse(status) : false
}
