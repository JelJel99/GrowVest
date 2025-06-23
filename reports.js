document.addEventListener('DOMContentLoaded', function () {
  
    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    }

    function getTransactions() {
        const transactions = localStorage.getItem("growvest-transactions");
        return transactions ? JSON.parse(transactions) : [];
    }

    function getWeekRange() {
        const today = new Date();
        const dayOfWeek = today.getDay();

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        startOfWeek.setHours(0, 0, 0, 0);
        endOfWeek.setHours(23, 59, 59, 999);
        return { start: startOfWeek, end: endOfWeek };
    }

    function getMonthRange() {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        startOfMonth.setHours(0, 0, 0, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        return { start: startOfMonth, end: endOfMonth };
    }

    function updateSummaryCards(totalPemasukan, totalPengeluaran, saldoBersih, jumlahTransaksi) {
        const totalIncomeElement = document.getElementById('totalIncome');
        const totalExpenseElement = document.getElementById('totalExpense');
        const netBalanceElement = document.getElementById('netBalance');
        const totalTransactionsElement = document.getElementById('totalTransactions');

        if (totalIncomeElement) totalIncomeElement.textContent = formatRupiah(totalPemasukan);
        if (totalExpenseElement) totalExpenseElement.textContent = formatRupiah(totalPengeluaran);
        if (netBalanceElement) netBalanceElement.textContent = formatRupiah(saldoBersih);
        if (totalTransactionsElement) totalTransactionsElement.textContent = jumlahTransaksi;
    }

    function updateCategoryLists(pemasukanKategori, pengeluaranKategori) {
        const incomeContainer = document.getElementById('incomeCategory');
        if (incomeContainer) {
            if (pemasukanKategori.length === 0) {
                incomeContainer.innerHTML = '<div class="empty-state">Tidak ada data pemasukan</div>';
            } else {
                incomeContainer.innerHTML = pemasukanKategori.map(item => `
                    <div class="report-per-category">
                        <div class="category-report">${item.kategori}</div>
                        <div class="category-amount">${formatRupiah(item.jumlah)}</div>
                    </div>
                `).join('');
            }
        }

        const expenseContainer = document.getElementById('expenseCategory');
        if (expenseContainer) {
            if (pengeluaranKategori.length === 0) {
                expenseContainer.innerHTML = '<div class="empty-state">Tidak ada data pengeluaran</div>';
            } else {
                expenseContainer.innerHTML = pengeluaranKategori.map(item => `
                    <div class="report-per-category">
                        <div class="category-report">${item.kategori}</div>
                        <div class="category-amount">${formatRupiah(item.jumlah)}</div>
                    </div>
                `).join('');
            }
        }
    }


    function loadReportData(period) {
        const allTransactions = getTransactions();
        let startDate, endDate;

        if (period === 'thisWeek') {
            const range = getWeekRange();
            startDate = range.start;
            endDate = range.end;
        } else if (period === 'thisMonth') {
            const range = getMonthRange();
            startDate = range.start;
            endDate = range.end;
        } else {
            const range = getWeekRange();
            startDate = range.start;
            endDate = range.end;
        }

        const filteredTransactions = allTransactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= startDate && transactionDate <= endDate;
        });

        const totalPemasukan = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalPengeluaran = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const saldoBersih = totalPemasukan - totalPengeluaran;
        const jumlahTransaksi = filteredTransactions.length;

        const pemasukanKategoriMap = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});
        const pemasukanKategori = Object.keys(pemasukanKategoriMap).map(category => ({
            kategori: category,
            jumlah: pemasukanKategoriMap[category]
        }));

        const pengeluaranKategoriMap = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});
        const pengeluaranKategori = Object.keys(pengeluaranKategoriMap).map(category => ({
            kategori: category,
            jumlah: pengeluaranKategoriMap[category]
        }));

        updateSummaryCards(totalPemasukan, totalPengeluaran, saldoBersih, jumlahTransaksi);
        updateCategoryLists(pemasukanKategori, pengeluaranKategori);
    }

    const periodSelect = document.getElementById('periodSelect');

    if (periodSelect) {
        periodSelect.addEventListener('change', function() {
            loadReportData(this.value);
        });
    }

    if (periodSelect) {
        loadReportData(periodSelect.value);
    } else {
        loadReportData('thisWeek');
    }

    window.generateReport = function () {
        const element = document.querySelector('.container');
        
        if (!element) {
            console.error("Element to generate report not found.");
            return;
        }

        const opt = {
            margin: 0.5,
            filename: 'Laporan_Keuangan.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        if (typeof html2pdf !== 'undefined') {
            html2pdf().set(opt).from(element).save();
        } else {
            console.error("html2pdf library not loaded.");
        }
    };

    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function() {
            userDropdown.classList.toggle('show');
        });
        window.addEventListener('click', function(event) {
            if (!userMenuBtn.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
});

window.generateReport = function () {
        const element = document.getElementById('reportChartSection');

        const opt = {
            margin: 0.5,
            filename: 'Laporan_Keuangan.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        if (element && typeof html2pdf !== 'undefined') {
            html2pdf().set(opt).from(element).save();
        } else {
            console.error("Element with ID 'reportContent' not found or html2pdf library not loaded.");
        }
};