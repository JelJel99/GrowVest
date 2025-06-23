const groupData = {
    groupName: "Liburan Keluarga",
    description: "Tabungan untuk liburan keluarga ke Yogyakarta",
    targetDate: "17/08/2026",
    target: 8000000,
    contributions: [
        {name: "Angela", amount: 2000000 },
        {name: "Nabila", amount: 1000000 },
        {name: "Naira", amount: 1500000 },
        {name: "Vionita", amount: 10000 },
        {name: "Dira", amount: 2500000 },
        {name: "Demo User", amount: 0}
    ],
    currentUser: "Demo User"
};

let totalContributed = groupData.contributions.reduce((sum, user) => sum + user.amount, 0);
let progressPercent = ((totalContributed / groupData.target) * 100).toFixed(1);
let remaining = groupData.target - totalContributed;


document.addEventListener("DOMContentLoaded", () => {
    const createGroupBtn = document.getElementById('createGroupBtn');
    const joinGroupBtn = document.getElementById('joinGroupBtn');
    const contributeBtn = document.getElementById('contributeBtn');

    const createGroupModal = document.getElementById('createGroupModal');
    const joinGroupModal = document.getElementById('joinGroupModal');
    const contributeModal = document.getElementById('contributeModal');

    const createGroupForm = document.getElementById('createGroupForm');
    const joinGroupForm = document.getElementById('joinGroupForm');
    const contributeForm = document.getElementById('contributeForm');

    const modalCloseButtons = document.querySelectorAll('.modal-close');

    const groupListContainer = document.getElementById('groupListContainer'); // NEW

    function openModal(modalElement) {
        modalElement.classList.add('show');
        document.body.style.overflow = "hidden";
        if (modalElement === createGroupModal) {
            if (createGroupForm) createGroupForm.reset();
        } else if (modalElement === joinGroupModal) {
            if (joinGroupForm) joinGroupForm.reset();
        } else if (modalElement === contributeModal) {
            if (contributeForm) contributeForm.reset();
        }
    }

    function closeModal(modalElement) {
        modalElement.classList.remove('show');
        document.body.style.overflow = "auto";
        if (modalElement === createGroupModal) {
            if (createGroupForm) createGroupForm.reset();
        } else if (modalElement === joinGroupModal) {
            if (joinGroupForm) joinGroupForm.reset();
        } else if (modalElement === contributeModal) {
            if (contributeForm) contributeForm.reset();
        }
    }

    if (createGroupBtn) {
        createGroupBtn.addEventListener('click', function() {
            openModal(createGroupModal);
        });
    }

    if (joinGroupBtn) {
        joinGroupBtn.addEventListener('click', function() {
            openModal(joinGroupModal);
        });
    }

    if (contributeBtn) {
        contributeBtn.addEventListener('click', function() {
            openModal(contributeModal);
        });
    }

    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalToClose = button.closest('.modal');
            if (modalToClose) {
                closeModal(modalToClose);
            }
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target === createGroupModal) {
            closeModal(createGroupModal);
        }
        if (event.target === joinGroupModal) {
            closeModal(joinGroupModal);
        }
        if (event.target === contributeModal) {
            closeModal(contributeModal);
        }
    });

    // Fungsi untuk mendapatkan grup tabungan dari localStorage
    function getSavingsGroups() {
        const groups = localStorage.getItem('growvest-savings-groups');
        return groups ? JSON.parse(groups) : [];
    }

    // Fungsi untuk menyimpan grup tabungan ke localStorage
    function saveSavingsGroups(groups) {
        localStorage.setItem('growvest-savings-groups', JSON.stringify(groups));
    }

    function renderSavingsGroups() {
        const groups = getSavingsGroups();
        const emptyState = document.getElementById("emptyState");

        if (groupListContainer) {
            groupListContainer.innerHTML = '';

            if (groups.length === 0) {
                emptyState.classList.remove("hidden");
                return;
            } else {
                if (emptyState) emptyState.classList.add("hidden");
            }

            groups.forEach(group => {
                const currentAmount = group.currentAmount || 0;
                const targetAmount = group.targetAmount || 1; // Avoid division by zero
                const progressPercentage = ((currentAmount / targetAmount) * 100).toFixed(1);
                const remainingAmount = targetAmount - currentAmount;

                const groupCard = document.createElement('div');
                groupCard.className = 'group-box';

                groupCard.innerHTML = `
                    <div class="group-header">
                        <div class="group-info">
                            <h3>${group.name}</h3>
                            <p class="desc">${group.description}</p>
                            <p class="target-date">Target: ${group.targetDate}</p>
                        </div>
                        <div class="group-actions">
                            </div>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar">
                            <div class="overall-progress" style="width: ${progressPercentage}%;"></div>
                        </div>
                        <div class="progress-label">${progressPercentage}% tercapai</div>
                        <div class="progress-info">Rp ${formatRupiah(currentAmount)} / Rp ${formatRupiah(group.targetAmount)} - Sisa: Rp ${formatRupiah(remainingAmount)}</div>
                    </div>
                    <div class="members">
                        </div>
                    <div class="your-contribution">
                        </div>
                `;
                groupListContainer.appendChild(groupCard);
            });
        }
    }

    function updateGroupUI() {
        const groupNameElement = document.getElementById("groupNameDisplay");
        const groupDescriptionElement = document.getElementById("groupDescriptionDisplay");
        const targetDateElement = document.getElementById("groupTargetDateDisplay");

        if (groupNameElement) {
            groupNameElement.textContent = groupData.groupName;
        }
        if (groupDescriptionElement) {
            groupDescriptionElement.textContent = groupData.description;
        }
        if (targetDateElement) {
            targetDateElement.textContent = `Target: ${groupData.targetDate}`;
        }

        const progressBar = document.getElementById("overallProgress");
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }

        const progressInfo = document.querySelector(".progress-info");
        if (progressInfo) {
            progressInfo.textContent = `Rp ${formatRupiah(totalContributed)} / Rp ${formatRupiah(groupData.target)} - Sisa: Rp ${formatRupiah(remaining)}`;
        }

        const progressLabel = document.querySelector(".progress-label");
        if (progressLabel) {
            progressLabel.textContent = `${progressPercent}% tercapai`;
        }

        const membersContainer = document.querySelector(".members");
        if (membersContainer) {
            membersContainer.innerHTML = ""; // Kosongkan dulu
            groupData.contributions.forEach(user => {
                const percent = totalContributed > 0 ? ((user.amount / totalContributed) * 100).toFixed(1) : 0;
                const avatar = user.name[0].toUpperCase();
                membersContainer.innerHTML += `
                    <div class="member">
                        <span class="avatar">${avatar}</span>
                        <span class="name">${user.name}</span>
                        <span class="amount">Rp ${formatRupiah(user.amount)} (${percent}%)</span>
                    </div>
                `;
            });
        }

        const you = groupData.contributions.find(user => user.name === groupData.currentUser);
        const yourAmount = you ? you.amount : 0;
        const yourPercent = totalContributed > 0 ? ((yourAmount / totalContributed) * 100).toFixed(1) : 0;
        const yourContribution = document.querySelector(".your-contribution");
        if (yourContribution) {
            yourContribution.innerHTML = `<strong>Kontribusi Anda:</strong> Rp ${formatRupiah(yourAmount)} (${yourPercent}% dari total)`;
        }
    }


    if (createGroupForm) {
        createGroupForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const groupName = document.getElementById('groupName').value.trim();
            const groupDescription = document.getElementById('groupDescription').value.trim();
            const targetAmount = parseFloat(document.getElementById('target').value);
            const targetDate = document.getElementById('targetDate').value.trim();

            // Input validation
            if (!groupName || !groupDescription || isNaN(targetAmount) || targetAmount <= 0 || !targetDate) {
                alert('Mohon lengkapi semua field dengan benar.');
                return;
            }

            const newGroup = {
                id: Date.now(),
                name: groupName,
                description: groupDescription,
                targetAmount: targetAmount,
                targetDate: targetDate,
                currentAmount: 0,
                contributions: [],
                createdAt: new Date().toISOString()
            };

            const existingGroups = getSavingsGroups();
            existingGroups.push(newGroup);
            saveSavingsGroups(existingGroups);

            console.log("Grup Baru Disimpan:", newGroup);
            closeModal(createGroupModal);

            renderSavingsGroups();
        });
    }

    if (joinGroupForm) {
        joinGroupForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const inviteCode = document.getElementById('inviteCode').value.trim();
            if (inviteCode.length !== 6) {
                console.error('Kode Undangan harus 6 digit.');
                return;
            }

            console.log("Bergabung dengan Grup:", { inviteCode });

            closeModal(joinGroupModal);
            renderSavingsGroups();
        });
    }

    if (contributeForm) {
        const contributionAmountInput = document.getElementById('contributionAmount');

        contributeForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const contributionAmount = parseFloat(contributionAmountInput.value);

            const currentUserIndex = groupData.contributions.findIndex(user => user.name === groupData.currentUser);
            if (currentUserIndex !== -1) {
                groupData.contributions[currentUserIndex].amount += contributionAmount;
            } else {
                groupData.contributions.push({ name: groupData.currentUser, amount: contributionAmount });
            }
            totalContributed = groupData.contributions.reduce((sum, user) => sum + user.amount, 0);
            groupData.currentAmount = totalContributed;

            alert("Kontribusi berhasil ditambahkan!");
            closeModal(contributeModal);
            contributeForm.reset();

            updateGroupUI();
            renderSavingsGroups();
        });
    }


    updateGroupUI();
    renderSavingsGroups();

    const groupActionsContainer = document.querySelector(".group-actions");
    if (groupActionsContainer) {
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
        deleteButton.style.background = "transparent";
        deleteButton.style.border = "none";
        deleteButton.style.cursor = "pointer";
        deleteButton.style.fontSize = "1.3rem";
        deleteButton.style.color = "red";
        deleteButton.style.padding = "4px";

        deleteButton.addEventListener("click", () => {
            const confirmDelete = confirm("Yakin ingin menghapus grup ini?");
            if (confirmDelete) {
                const groupBox = document.querySelector(".group-box");
                if (groupBox) {
                    groupBox.remove();
                }
            }
        });
        groupActionsContainer.appendChild(deleteButton);
    }
});

function formatRupiah(num) {
    return num.toLocaleString("id-ID");
}