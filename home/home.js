let incomeLink;
let expenseLink;

fetch('../nav.html')
  .then((html) => html.text())
  .then((data) => {
    document.getElementById('nav').innerHTML = data;
    expenseLink = document.getElementById('expense-link');
    incomeLink = document.getElementById('income-link');

    expenseLink.addEventListener('click', () => setPage('expense'));
    incomeLink.addEventListener('click', () => setPage('income'));
});

let localExpenseCards = localStorage.getItem('local-expense-cards') ? JSON.parse(localStorage.getItem('local-expense-cards')) : [];
let localIncomeCards = localStorage.getItem('local-income-cards') ? JSON.parse(localStorage.getItem('local-income-cards')) : [];

const bucketTotal = document.getElementById('bucket-total');

function setPage(pageKey) {
  localStorage.setItem('page', pageKey);
  console.log(pageKey);
}

function formatCurrency(currency) {
  if (currency === undefined || currency === '') return '';
  return parseFloat(currency).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function localTotal() {
  const incomeTotal = localIncomeCards.reduce((acc, curr) =>  acc + parseFloat(curr.amount) , 0);
  const expenseTotal = localExpenseCards.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const localTotal = incomeTotal - expenseTotal;
  
  bucketTotal.textContent = formatCurrency(localTotal);
}

localTotal()