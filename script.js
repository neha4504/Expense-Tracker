const form = document.getElementById('transaction-form');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionsList = document.getElementById('transactions');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const balanceEl = document.getElementById('balance');
const pieChartEl = document.getElementById('pieChart');

let transactions = [];
let pieChart;

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const desc = descInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;
    if (!desc || isNaN(amount) || amount <= 0) return;
    transactions.push({ desc, amount, type });
    descInput.value = '';
    amountInput.value = '';
    updateUI();
});

function updateUI() {
    let income = 0, expense = 0;
    transactionsList.innerHTML = '';
    const expenseCategories = {};
    transactions.forEach((t, idx) => {
        const li = document.createElement('li');
        li.className = t.type;
        li.innerHTML = `<span>${t.desc}</span><span>${t.type === 'income' ? '+' : '-'}₹${t.amount.toFixed(2)}</span>`;
        transactionsList.appendChild(li);
        if (t.type === 'income') income += t.amount;
        else {
            expense += t.amount;
            expenseCategories[t.desc] = (expenseCategories[t.desc] || 0) + t.amount;
        }
    });
    totalIncomeEl.textContent = `₹${income.toFixed(2)}`;
    totalExpenseEl.textContent = `₹${expense.toFixed(2)}`;
    balanceEl.textContent = `₹${(income - expense).toFixed(2)}`;
    updatePieChart(expenseCategories);
}

function updatePieChart(categories) {
    const labels = Object.keys(categories);
    const data = Object.values(categories);
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(pieChartEl, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: [
                    '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#f67019', '#00a950'
                ],
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

updateUI();
