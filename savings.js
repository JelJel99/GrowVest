// const goals = [
//   {
//     title: "Liburan ke Bali",
//     desc: "Liburan",
//     targetDate: "31/12/2026",
//     total: 10000000,
//     saved: 3500000
//   },
//   {
//     title: "Dana Darurat",
//     desc: "Dana Darurat",
//     targetDate: "30/6/2025",
//     total: 15000000,
//     saved: 7500000
//   }
// ];

// document.addEventListener("DOMContentLoaded", () => {
//   renderGoals()
//   // setupGoalEventListeners()
// })


// document.addEventListener("DOMContentLoaded", function() {
//   // Inisialisasi modal
//   const modal = document.getElementById("goalModal");
//   const openModalBtn = document.getElementById("addTargetBtn");
//   const closeModalBtn = document.getElementById("closeModal");
//   const targetForm = document.getElementById("targetForm");

//   // Fungsi untuk menampilkan modal
//   function showModal() {
//     console.log("Modal akan ditampilkan");
//     modal.classList.add("show");
//     document.body.style.overflow = "hidden";
//   }

//   // Fungsi untuk menyembunyikan modal
//   function hideModal() {
//     modal.classList.remove("show");
//     document.body.style.overflow = "auto";
//   }

//   // Event listeners
//   openModalBtn.addEventListener("click", showModal);
//   closeModalBtn.addEventListener("click", hideModal);

//   // Tutup modal ketika klik di luar area konten
//   modal.addEventListener("click", function(e) {
//     if (e.target === modal) {
//       hideModal();
//     }
//   });

//   // Handle form submission
//   targetForm.addEventListener("submit", function(e) {
//     e.preventDefault();
//     console.log("Form submitted");
//     hideModal();
//   });

//   // Load data awal
//   renderGoals();

//     // === MODAL: TAMBAH DANA (addMoneyModal) ===
//   const addMoneyModal = document.getElementById("addMoneyModal");
//   const closeAddMoneyModalBtn = document.getElementById("closeAddMoneyModal");
//   const addMoneyForm = document.getElementById("addMoneyForm");
//   const addMoneyTargetName = document.getElementById("addMoneyTargetName");
//   const moneyAmountInput = document.getElementById("moneyAmount");
//   const currentGoalIndexInput = document.getElementById("currentGoalIndex");

//   window.showAddMoneyModal = function(index) {
//     const goal = goals[index];
//     addMoneyTargetName.textContent = `Tambahkan uang ke target: ${goal.title}`;
//     moneyAmountInput.value = "";
//     currentGoalIndexInput.value = index;

//     addMoneyModal.classList.add("show");
//     document.body.style.overflow = "hidden";
//   };


//   function hideAddMoneyModal() {
//     addMoneyModal.classList.remove("show");
//     document.body.style.overflow = "auto";
//   }

//   function handleAddMoneySubmit(e) {
//     e.preventDefault();

//     const amountToAdd = parseInt(moneyAmountInput.value);
//     const index = parseInt(currentGoalIndexInput.value);

//     if (isNaN(amountToAdd) || amountToAdd <= 0) {
//       alert("Masukkan jumlah uang yang valid");
//       return;
//     }

//     goals[index].saved += amountToAdd;

//     // Jika ingin menyimpan ke localStorage:
//     // localStorage.setItem("growvest-goals", JSON.stringify(goals));

//     renderGoals(); // Refresh UI
//     hideAddMoneyModal();
//   }

//   closeAddMoneyModalBtn?.addEventListener("click", hideAddMoneyModal);
//   addMoneyModal?.addEventListener("click", (e) => {
//     if (e.target === addMoneyModal) hideAddMoneyModal();
//   });
//   addMoneyForm?.addEventListener("submit", handleAddMoneySubmit);

//   // Supaya bisa dipanggil dari tombol HTML via onclick
//   window.showAddMoneyModal = showAddMoneyModal;

// });

// function showGoalModal() {
//   const modal = document.getElementById("goalModal")
//   modal.classList.add("show")
//   document.body.style.overflow = "hidden"
// }

// function updateGoalSummary(goals) {
//   const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0)
//   const totalTarget = goals.reduce((sum, g) => sum + g.total, 0)
//   const percent = totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0

//   const balance = document.getElementById("currentBalance")
//   const income = document.getElementById("totalIncome")
//   const expense = document.getElementById("totalExpense")
//   const overallProgress = document.getElementById("overallProgress")

//   if (balance) balance.textContent = "Rp " + format(totalTarget)
//   if (income) income.textContent = "Rp " + format(totalSaved)
//   if (expense) expense.textContent = percent + "%"
//   if (overallProgress) overallProgress.style.width = percent + "%"
// }

// function getGoals() {
//   return JSON.parse(localStorage.getItem("growvest-goals") || "[]")
// }

// function format(n) {
//   return n.toLocaleString("id-ID")
// }


// function renderGoals() {
//   const list = document.getElementById("goalList");
//   list.innerHTML = "";

//   goals.forEach((goal, index) => {
//     const percent = (goal.saved / goal.total * 100).toFixed(1);
//     const sisa = goal.total - goal.saved;

//     const div = document.createElement("div");
//     div.className = "save-goal";
//     div.innerHTML = `
//       <div class="goal-info">
//         <div>
//           <div class="goal-header">${goal.title}</div>
//           <div class="goal-amount">${goal.desc}</div>
//           <div class="goal-amount"> 
//             <i class="far fa-bell"></i> Target: ${goal.targetDate}
//           </div>
//         </div>
//         <div>
//           <button class="tambah-btn" onclick="showAddMoneyModal(${index})">+ Tambah</button>
//           <button class="delete-btn" onclick="deleteGoal(${index})">
//             <i class="fas fa-trash"></i>
//           </button>
//         </div>
//       </div>

//       <div class="goal-amount">Progress</div>
//       <div class="progress-bar">
//         <div class="progress-fill" style="width: ${percent}%"></div>
//       </div>
//       <div class="progress-info">
//         <div class="progress-percentage">${percent}% tercapai</div>
//         <div class="goal-sisa">
//           Rp ${format(goal.saved)} / Rp ${format(goal.total)} &nbsp;&nbsp;|&nbsp;&nbsp; 
//           Sisa: Rp ${format(sisa)}
//         </div>
//       </div>
//     `;
//     list.appendChild(div);
//   });

//   updateTotalSummary();
// }

// function updateTotalSummary() {
//   const totalTerkumpul = goals.reduce((sum, goal) => sum + goal.saved, 0);
//   const totalTarget = goals.reduce((sum, goal) => sum + goal.total, 0);

//   const percent = totalTarget > 0 ? (totalTerkumpul / totalTarget * 100).toFixed(1) : 0;

//   document.getElementById("totalIncome").textContent = "Rp " + format(totalTerkumpul);
//   document.getElementById("currentBalance").textContent = "Rp " + format(totalTarget);
//   document.getElementById("totalExpense").textContent = percent + "%";

//   const progressFill = document.getElementById("overallProgress");
//   if (progressFill) {
//     progressFill.style.width = percent + "%";
//   }
// }

// function updateCategoryOptions() {
//   const transactionType = document.getElementById("transactionType").value
//   const categorySelect = document.getElementById("category")

//   const categories = {
//     income: ["Gaji", "Freelance", "Investasi", "Bonus", "Lainnya"],
//     expense: ["Makanan", "Transportasi", "Belanja", "Tagihan", "Hiburan", "Kesehatan", "Pendidikan", "Lainnya"],
//   }

//   categorySelect.innerHTML = '<option value="">Pilih kategori</option>'
//   categories[transactionType].forEach((category) => {
//     categorySelect.innerHTML += `<option value="${category}">${category}</option>`
//   })
// }

// function tambah(index) {
//   const input = prompt("Masukkan jumlah dana yang ingin ditambahkan:");
//   const jumlah = parseInt(input);

//   if (isNaN(jumlah) || jumlah <= 0) {
//     alert("Input tidak valid.");
//     return;
//   }

//   goals[index].saved += jumlah;
//   renderGoals();
// }

// window.deleteGoal = function(index) {
//   if (confirm(`Yakin ingin menghapus target "${goals[index].title}"?`)) {
//     goals.splice(index, 1);
//     renderGoals();
//   }
// };

// window.onload = renderGoals;

const goals = [
  {
    title: "Liburan ke Bali",
    desc: "Liburan",
    targetDate: "31/12/2026",
    total: 10000000,
    saved: 3500000
  },
  {
    title: "Dana Darurat",
    desc: "Dana Darurat",
    targetDate: "30/6/2025",
    total: 15000000,
    saved: 7500000
  }
];

document.addEventListener("DOMContentLoaded", () => {
  setupModals();
  renderGoals();
});

function setupModals() {
  const modal = document.getElementById("goalModal");
  const openModalBtn = document.getElementById("addTargetBtn");
  const closeModalBtn = document.getElementById("closeModal");
  const targetForm = document.getElementById("targetForm");

  openModalBtn.addEventListener("click", () => {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  });

  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    document.body.style.overflow = "auto";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
      document.body.style.overflow = "auto";
    }
  });

  targetForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("description")?.value.trim();
    const total = parseInt(document.getElementById("amount")?.value);
    const desc = document.getElementById("category")?.value;
    const targetDate = document.getElementById("targetDate")?.value;

    if (!title || !desc || desc === "Pilih kategori" || !targetDate || isNaN(total) || total <= 0) {
      alert("Mohon isi semua data dengan benar!");
      return;
    }

    goals.push({
      title,
      desc,
      targetDate,
      total,
      saved: 0
    });

    console.log("Target baru ditambahkan:", goals[goals.length - 1]);
    renderGoals();

    targetForm.reset();
    modal.classList.remove("show");
    document.body.style.overflow = "auto";

    // Scroll ke target baru
    setTimeout(() => {
      const lastGoal = document.querySelector("#goalList .save-goal:last-child");
      lastGoal?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  });

  // Modal Tambah Dana
  const addMoneyModal = document.getElementById("addMoneyModal");
  const closeAddMoneyModalBtn = document.getElementById("closeAddMoneyModal");
  const addMoneyForm = document.getElementById("addMoneyForm");
  const addMoneyTargetName = document.getElementById("addMoneyTargetName");
  const moneyAmountInput = document.getElementById("moneyAmount");
  const currentGoalIndexInput = document.getElementById("currentGoalIndex");

  window.showAddMoneyModal = function (index) {
    const goal = goals[index];
    addMoneyTargetName.textContent = `Tambahkan uang ke target: ${goal.title}`;
    moneyAmountInput.value = "";
    currentGoalIndexInput.value = index;
    addMoneyModal.classList.add("show");
    document.body.style.overflow = "hidden";
  };

  closeAddMoneyModalBtn?.addEventListener("click", () => {
    addMoneyModal.classList.remove("show");
    document.body.style.overflow = "auto";
  });

  addMoneyModal?.addEventListener("click", (e) => {
    if (e.target === addMoneyModal) {
      addMoneyModal.classList.remove("show");
      document.body.style.overflow = "auto";
    }
  });

  addMoneyForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    const index = parseInt(currentGoalIndexInput.value);
    const amountToAdd = parseInt(moneyAmountInput.value);

    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      alert("Masukkan jumlah uang yang valid");
      return;
    }

    goals[index].saved += amountToAdd;
    renderGoals();
    addMoneyModal.classList.remove("show");
    document.body.style.overflow = "auto";
  });
}

function renderGoals() {
  const list = document.getElementById("goalList");
  list.innerHTML = "";

  goals.forEach((goal, index) => {
    const percent = ((goal.saved / goal.total) * 100).toFixed(1);
    const sisa = goal.total - goal.saved;

    const div = document.createElement("div");
    div.className = "save-goal";
    div.innerHTML = `
      <div class="goal-info">
        <div>
          <div class="goal-header">${goal.title}</div>
          <div class="goal-amount">${goal.desc}</div>
          <div class="goal-amount">
            <i class="far fa-bell"></i> Target: ${goal.targetDate}
          </div>
        </div>
        <div>
          <button class="tambah-btn" onclick="showAddMoneyModal(${index})">+ Tambah</button>
          <button class="delete-btn" onclick="deleteGoal(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="goal-amount">Progress</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percent}%"></div>
      </div>
      <div class="progress-info">
        <div class="progress-percentage">${percent}% tercapai</div>
        <div class="goal-sisa">
          Rp ${format(goal.saved)} / Rp ${format(goal.total)} &nbsp;&nbsp;|&nbsp;&nbsp; 
          Sisa: Rp ${format(sisa)}
        </div>
      </div>
    `;
    list.appendChild(div);
  });

  updateTotalSummary();
}

function updateTotalSummary() {
  const totalTerkumpul = goals.reduce((sum, goal) => sum + goal.saved, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.total, 0);
  const percent = totalTarget > 0 ? (totalTerkumpul / totalTarget * 100).toFixed(1) : 0;

  document.getElementById("totalIncome").textContent = "Rp " + format(totalTerkumpul);
  document.getElementById("currentBalance").textContent = "Rp " + format(totalTarget);
  document.getElementById("totalExpense").textContent = percent + "%";

  const progressFill = document.getElementById("overallProgress");
  if (progressFill) progressFill.style.width = percent + "%";
}

function format(n) {
  return n.toLocaleString("id-ID");
}

window.deleteGoal = function (index) {
  if (confirm(`Yakin ingin menghapus target "${goals[index].title}"?`)) {
    goals.splice(index, 1);
    renderGoals();
  }
};