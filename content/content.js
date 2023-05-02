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
}

const page = localStorage.getItem('page');

let key;
  if (page == 'expense') {
    key = 'local-expense-cards';
  } else {
    key = 'local-income-cards';
}

let localCards = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];

const cardForm = document.getElementById('card-form');
const cards = document.getElementById('cards');
const amountInput = document.getElementById('amount-input');
const total = document.getElementById('total');
const clearAll = document.getElementById('clear-all');
const title = document.getElementById('title');
const subheading = document.getElementsByName('h3');
const typeSelect = document.getElementById('type-select');
const typeOptions = typeSelect.children;

let iconOptions;
let trashCans = [];
let selectOptions;

function setTitleAndSubheading() {
  if(page == 'expense') {
    title.textContent = 'YOUR EXPENSES';
    subheading.textContent = 'Add Expense'
    return
  }
  title.textContent = 'YOUR INCOME'
  subheading.textContent = 'Add Income'
}

function createSelectOptions() {
  
  if(page == 'expense') {
    selectOptions = [ 'Food', 'Bills/Fees', 'Home Essentials', 'Medical', 'Transportation', 'Non-Essentials', 'Misc/Other' ];
  } else {
    selectOptions = [ 'Job', 'Side Gig', 'Refund', 'Gift', 'Interest', 'Bonus' ]
  }
  for(let x = 0; x < selectOptions.length; x++) {
    createAndAppendElement('option', { value: x+1, textContent: selectOptions[x] }, typeSelect )
  }
}

function clearAllButton() {
  clearAll.addEventListener('click', () => {
    if (clearAll.className == 'active') {
      cards.textContent = '';
      localCards = [];
      updateLocalStorage();
      updateTotal();
    }
  });
}

function determineClassForClearAllButton() {
  if (localCards.length > 0) {
    clearAll.className = 'active';
    return;
  }
  clearAll.className = 'inactive';
}

function createAndAppendElement(elementType, options = {}, parent) {
  const element = document.createElement(elementType);
  const optionKeys = Object.keys(options);

  optionKeys.forEach((key) => {
    if (key !== 'classList') {
      element[key] = options[key];
      return;
    }
    element[key].add(...options[key]);
  });
  parent.append(element);

  return element;
}

function removeElementAndUpdateLocalStorage(element, elements) {
  const removeIndex = elements.indexOf(element);

  elements.splice(removeIndex, 1);
  localCards.splice(removeIndex, 1)
  updateLocalStorage();
  updateTotal();
}

function createDeleteButton(parent) {
  const trashCan = createAndAppendElement('i', { classList: ['fa-solid', 'fa-trash'] }, parent);
  trashCans.push(trashCan);

  trashCan.addEventListener('click', () => {
    parent.remove(trashCan);
    removeElementAndUpdateLocalStorage(trashCan, trashCans);
  });
}

function formatCurrency(currency) {
  if (currency === undefined || currency === '') return '';
  return parseFloat(currency).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function createCard(optionNumber, amount) {
  const card = createAndAppendElement('div', { classList: ['card'] }, cards);
  const cardInfo = createAndAppendElement('div', { classList: ['card-info'] }, card);
  const leftInfo = createAndAppendElement('div', { classList: ['left'] }, cardInfo);

  // Icon
  const optionSelected = optionNumber;
  if (page == 'expense') {
    iconOptions = ['fa-burger', 'fa-file-invoice-dollar', 'fa-house', 'fa-suitcase-medical', 'fa-bus', 'fa-film', 'fa-layer-group'];
  } else {
    iconOptions = ['fa-briefcase', 'fa-car-side', 'fa-arrow-rotate-left', 'fa-gift', 'fa-arrow-trend-up', 'fa-plus', 'fa-layer-group'];
  }

  createAndAppendElement('i', { classList: ['icon', 'fa-solid', iconOptions[optionSelected - 1]] }, leftInfo);

  // cardType
  const cardTypeOptions = { classList: ['card-type'], textContent: typeOptions[optionSelected].textContent };
  createAndAppendElement('span', cardTypeOptions, leftInfo);

  //cardAmount
  const cardAmountOptions = { classList: ['card-amount'], textContent: formatCurrency(amount) };
  createAndAppendElement('div', cardAmountOptions, cardInfo);

  createDeleteButton(card);
}

function handleSubmit() {
  cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const inputData = { optionNumber: typeSelect.value, amount: amountInput.value };
    createCard(inputData.optionNumber, inputData.amount);
    localCards.push(inputData)

    updateLocalStorage();
    updateTotal();
    clearAllButton();
    resetInput([typeSelect, amountInput]);

    typeSelect.focus();
  });
}

function updateLocalStorage() {
  localStorage.setItem(key, JSON.stringify(localCards));
  determineClassForClearAllButton();
}

function updateTotal() {
  let totalAmount = 0;

  if (localCards.length > 0) {
    for (let x = 0; x < localCards.length; x++) {
      totalAmount += Number(localCards[x].amount);
    }
  }

  total.textContent = formatCurrency(totalAmount);
}

function resetInput(array) {
  array.forEach((element) => {
    element.value = '';
  });
}

function restoreData() {
  localCards.forEach((object) => {
    createCard(object.optionNumber, object.amount);
  });

  updateTotal();
}

function onPageLoad() {
  setTitleAndSubheading()
  createSelectOptions()
  clearAllButton()
  determineClassForClearAllButton()
  restoreData()
  handleSubmit()
}

onPageLoad()