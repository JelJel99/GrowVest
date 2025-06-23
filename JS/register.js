document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm")
  const togglePassword = document.getElementById("togglePassword")
  const toggleConfirmPassword = document.getElementById("toggleConfirmPassword")
  const passwordInput = document.getElementById("password")
  const confirmPasswordInput = document.getElementById("confirmPassword")
  const errorMessage = document.getElementById("errorMessage")
  const registerBtn = document.getElementById("registerBtn")
  const registerText = document.getElementById("registerText")
  const passwordStrength = document.getElementById("passwordStrength")
  const strengthText = document.getElementById("strengthText")
  const passwordMatch = document.getElementById("passwordMatch")

  // Toggle password visibility
  togglePassword.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
    passwordInput.setAttribute("type", type)

    const icon = togglePassword.querySelector("i")
    icon.className = type === "password" ? "fas fa-eye" : "fas fa-eye-slash"
  })

  toggleConfirmPassword.addEventListener("click", () => {
    const type = confirmPasswordInput.getAttribute("type") === "password" ? "text" : "password"
    confirmPasswordInput.setAttribute("type", type)

    const icon = toggleConfirmPassword.querySelector("i")
    icon.className = type === "password" ? "fas fa-eye" : "fas fa-eye-slash"
  })

  // Password strength checker
  function checkPasswordStrength(password) {
    let strength = 0
    if (password.length >= 6) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/\d/)) strength++
    if (password.match(/[^a-zA-Z\d]/)) strength++
    return strength
  }

  function updatePasswordStrength(strength) {
    const bars = passwordStrength.querySelectorAll(".strength-bar")
    const texts = ["Lemah", "Sedang", "Kuat", "Sangat Kuat"]
    const classes = ["weak", "medium", "strong", "very-strong"]

    bars.forEach((bar, index) => {
      bar.className = "strength-bar"
      if (index < strength) {
        bar.classList.add(classes[Math.min(strength - 1, 3)])
      }
    })

    strengthText.textContent = texts[Math.min(strength - 1, 3)] || "Lemah"
  }

  passwordInput.addEventListener("input", () => {
    const password = passwordInput.value
    if (password) {
      passwordStrength.style.display = "block"
      const strength = checkPasswordStrength(password)
      updatePasswordStrength(strength)
    } else {
      passwordStrength.style.display = "none"
    }
  })

  // Password match checker
  function checkPasswordMatch() {
    const password = passwordInput.value
    const confirmPassword = confirmPasswordInput.value

    if (confirmPassword) {
      passwordMatch.style.display = "flex"
      const isMatch = password === confirmPassword
      passwordMatch.className = `password-match ${isMatch ? "match" : "no-match"}`

      const icon = passwordMatch.querySelector("i")
      const text = passwordMatch.querySelector("span")

      if (isMatch) {
        icon.className = "fas fa-check"
        text.textContent = "Password cocok"
      } else {
        icon.className = "fas fa-times"
        text.textContent = "Password tidak cocok"
      }
    } else {
      passwordMatch.style.display = "none"
    }
  }

  confirmPasswordInput.addEventListener("input", checkPasswordMatch)
  passwordInput.addEventListener("input", checkPasswordMatch)

  // Handle form submission
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(registerForm)
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      agreeToTerms: formData.get("agreeToTerms"),
    }

    const authManager = {
      register(data) {
        // Simpan ke localStorage atau validasi lainnya
        console.log("Register data:", data)
        localStorage.setItem("userData", JSON.stringify(data))
      }
    }


    // Validation
    if (userData.password.length < 6) {
      errorMessage.textContent = "Password minimal 6 karakter"
      errorMessage.classList.remove("hidden")
      return
    }

    if (userData.password !== userData.confirmPassword) {
      errorMessage.textContent = "Konfirmasi password tidak cocok"
      errorMessage.classList.remove("hidden")
      return
    }

    // Show loading state
    registerBtn.disabled = true
    registerText.textContent = "Memproses..."
    errorMessage.classList.add("hidden")

    try {
      authManager.register(userData)
      window.location.href = "home.html"
    } catch (error) {
      errorMessage.textContent = error.message
      errorMessage.classList.remove("hidden")
    } finally {
      // Reset loading state
      registerBtn.disabled = false
      registerText.textContent = "Daftar Sekarang"
    }
  })
})
