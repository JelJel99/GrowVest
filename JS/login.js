document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const togglePassword = document.getElementById("togglePassword")
  const passwordInput = document.getElementById("password")
  const useDemoBtn = document.getElementById("useDemoBtn")
  const errorMessage = document.getElementById("errorMessage")
  const loginBtn = document.getElementById("loginBtn")
  const loginText = document.getElementById("loginText")

  // Toggle password visibility
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
      passwordInput.setAttribute("type", type)

      const icon = togglePassword.querySelector("i")
      icon.className = type === "password" ? "fas fa-eye" : "fas fa-eye-slash"
    })
  }

  // Use demo account
  if (useDemoBtn) {
    useDemoBtn.addEventListener("click", () => {
      document.getElementById("email").value = "demo@growvest.com"
      document.getElementById("password").value = "demo123"
    })
  }

  // Handle form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const formData = new FormData(loginForm)
      const email = formData.get("email")
      const password = formData.get("password")

      // Show loading state
      loginBtn.disabled = true
      loginText.textContent = "Memproses..."
      errorMessage.classList.add("hidden")

      try {
        // Use the global authManager instance
        authManager.login(email, password)

        // Show success message
        errorMessage.textContent = "Login berhasil! Mengalihkan..."
        errorMessage.className = "alert alert-success"
        errorMessage.classList.remove("hidden")

        // Redirect after short delay
        setTimeout(() => {
          window.location.href = "home.html"
        }, 1000)
      } catch (error) {
        errorMessage.textContent = error.message
        errorMessage.className = "alert alert-error"
        errorMessage.classList.remove("hidden")
      } finally {
        // Reset loading state
        loginBtn.disabled = false
        loginText.textContent = "Masuk"
      }
    })
  }
})
