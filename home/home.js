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

function setPage(pageKey) {
  localStorage.setItem('page', pageKey);
  console.log(pageKey);
}
