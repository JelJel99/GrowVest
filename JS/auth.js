// Authentication utilities
class AuthManager {
  constructor() {
    this.init()
  }

  init() {
    // Initialize demo user if not exists
    this.ensureDemoUser()

    // Check authentication on page load
    if (this.isAuthPage()) {
      this.redirectIfAuthenticated()
    } else {
      this.requireAuthentication()
    }
  }

  isAuthPage() {
    const authPages = ["index.html", "register.html"]
    const currentPage = window.location.pathname.split("/").pop()
    return authPages.includes(currentPage) || currentPage === ""
  }

  ensureDemoUser() {
    const users = this.getUsers()
    const demoUser = users.find((u) => u.email === "demo@growvest.com")

    if (!demoUser) {
      const demo = {
        id: "demo-user",
        name: "Demo User",
        email: "demo@growvest.com",
        password: "demo123",
        createdAt: new Date().toISOString(),
      }
      users.push(demo)
      localStorage.setItem("growvest-users", JSON.stringify(users))
    }
  }

  getUsers() {
    const users = localStorage.getItem("growvest-users")
    return users ? JSON.parse(users) : []
  }

  getCurrentUser() {
    const session = localStorage.getItem("growvest-session")
    return session ? JSON.parse(session) : null
  }

  isAuthenticated() {
    return this.getCurrentUser() !== null
  }

  login(email, password) {
    const users = this.getUsers()
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      throw new Error("Email atau password tidak valid")
    }

    const session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      loginTime: new Date().toISOString(),
    }

    localStorage.setItem("growvest-session", JSON.stringify(session))

    // Initialize demo data if demo user
    if (user.email === "demo@growvest.com") {
      this.initializeDemoData()
    }

    return session
  }

  register(userData) {
    const users = this.getUsers()

    // Check if email already exists
    if (users.find((u) => u.email === userData.email)) {
      throw new Error("Email sudah terdaftar")
    }

    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("growvest-users", JSON.stringify(users))

    // Auto login
    return this.login(userData.email, userData.password)
  }

  logout() {
    localStorage.removeItem("growvest-session")
    window.location.href = "index.html"
  }

  requireAuthentication() {
    if (!this.isAuthenticated()) {
      window.location.href = "index.html"
    }
  }

  redirectIfAuthenticated() {
    if (this.isAuthenticated()) {
      window.location.href = "home.html"
    }
  }

  initializeDemoData() {
    // Demo transactions
    if (!localStorage.getItem("growvest-transactions")) {
      const demoTransactions = [
        {
          id: "demo-1",
          type: "income",
          amount: 5000000,
          description: "Gaji Bulanan",
          category: "Gaji",
          date: "2024-01-15",
        },
        {
          id: "demo-2",
          type: "expense",
          amount: 500000,
          description: "Belanja Bulanan",
          category: "Makanan",
          date: "2024-01-16",
        },
        {
          id: "demo-3",
          type: "expense",
          amount: 200000,
          description: "Bensin Motor",
          category: "Transportasi",
          date: "2024-01-17",
        },
        {
          id: "demo-4",
          type: "income",
          amount: 1000000,
          description: "Freelance Project",
          category: "Freelance",
          date: "2024-01-18",
        },
      ]
      localStorage.setItem("growvest-transactions", JSON.stringify(demoTransactions))
    }

    // Demo savings goals
    if (!localStorage.getItem("growvest-goals")) {
      const demoGoals = [
        {
          id: "demo-goal-1",
          name: "Liburan ke Bali",
          target: 10000000,
          current: 3500000,
          category: "Liburan",
          deadline: "2024-12-31",
          reminderEnabled: true,
        },
        {
          id: "demo-goal-2",
          name: "Dana Darurat",
          target: 15000000,
          current: 7500000,
          category: "Dana Darurat",
          deadline: "2024-06-30",
          reminderEnabled: true,
        },
      ]
      localStorage.setItem("growvest-goals", JSON.stringify(demoGoals))
    }

    // Demo group savings
    if (!localStorage.getItem("growvest-group-savings")) {
      const demoGroupSavings = [
        {
          id: "demo-group-1",
          name: "Liburan Keluarga",
          description: "Tabungan untuk liburan keluarga ke Yogyakarta",
          target: 8000000,
          current: 4500000,
          deadline: "2024-08-17",
          members: [
            { id: "demo-user", name: "Demo User", email: "demo@growvest.com", contribution: 2000000 },
            { id: "user-2", name: "Sarah", email: "sarah@email.com", contribution: 1500000 },
            { id: "user-3", name: "Ahmad", email: "ahmad@email.com", contribution: 1000000 },
          ],
          createdBy: "demo-user",
          inviteCode: "DEMO01",
        },
      ]
      localStorage.setItem("growvest-group-savings", JSON.stringify(demoGroupSavings))
    }

    // Default settings
    if (!localStorage.getItem("growvest-balance-locked")) {
      localStorage.setItem("growvest-balance-locked", JSON.stringify(false))
    }
  }

  updateUserMenu() {
    const user = this.getCurrentUser()
    if (!user) return

    const userNameEl = document.getElementById("userName")
    const userEmailEl = document.getElementById("userEmail")
    const userInitialsEl = document.getElementById("userInitials")

    if (userNameEl) userNameEl.textContent = user.name
    if (userEmailEl) userEmailEl.textContent = user.email
    if (userInitialsEl) {
      const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
      userInitialsEl.textContent = initials
    }
  }

  setupUserMenu() {
    const userMenuBtn = document.getElementById("userMenuBtn")
    const userDropdown = document.getElementById("userDropdown")
    const logoutBtn = document.getElementById("logoutBtn")

    if (userMenuBtn && userDropdown) {
      userMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        userDropdown.classList.toggle("show")
      })

      document.addEventListener("click", () => {
        userDropdown.classList.remove("show")
      })

      userDropdown.addEventListener("click", (e) => {
        e.stopPropagation()
      })
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault()
        this.logout()
      })
    }

    this.updateUserMenu()
  }
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("IDR", "Rp")
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID")
}

// Initialize auth manager
const authManager = new AuthManager()

// Setup user menu if elements exist
document.addEventListener("DOMContentLoaded", () => {
  authManager.setupUserMenu()
})

document.addEventListener("DOMContentLoaded", () => {
    const burgerBtn = document.getElementById("burgerBtn");
    const mobileNav = document.getElementById("mobileNav");

    burgerBtn.addEventListener("click", () => {
      mobileNav.classList.toggle("hidden");
    });
  });
