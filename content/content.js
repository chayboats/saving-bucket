// Differences
// Text - names, headers, options
// Local storage key

const cardForm = document.getElementById('card-form');
const cards = document.getElementById('cards');
const amountInput = document.getElementById('amount-input');
const total = document.getElementById('total');
const clearAll = document.getElementById('clear-all');

const expenseLink = document.getElementById('expense-link');
const incomeLink = document.getElementById('income-link');
const title = document.getElementById('expenses-or-income');

const typeSelect = document.getElementById('type-select');
const typeOptions = typeSelect?.children || [];
const iconOptions = ['fa-burger', 'fa-file-invoice-dollar', 'fa-house', 'fa-suitcase-medical', 'fa-bus', 'fa-film', 'fa-layer-group'];
let localCards = localStorage.getItem('localCards') ? JSON.parse(localStorage.getItem('localCards')) : [];
let trashCans = [];

function determineTitle(link, titleTextContent) {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    title.textContent = titleTextContent;
  });
}

function incomePage() {}

determineTitle(expenseLink, 'YOUR EXPENSES');
determineTitle(incomeLink, 'YOUR INCOME');

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

function removeElementAndUpdateLocalStorage(element, elements, localElements) {
  const removeIndex = elements.indexOf(element);

  elements.splice(removeIndex, 1);
  updateLocalStorage(() => localElements.splice(removeIndex, 1));
  updateTotal(localElements);
}

function createDeleteButton(parent) {
  const trashCan = createAndAppendElement('i', { classList: ['fa-solid', 'fa-trash'] }, parent);
  trashCans.push(trashCan);

  trashCan.addEventListener('click', () => {
    parent.remove(trashCan);
    removeElementAndUpdateLocalStorage(trashCan, trashCans, localCards);
  });
}

function createCard(optionNumber, amount) {
  const card = createAndAppendElement('div', { classList: ['card'] }, cards);
  const cardInfo = createAndAppendElement('div', { classList: ['card-info'] }, card);
  const leftInfo = createAndAppendElement('div', { classList: ['left'] }, cardInfo);

  // Icon
  const optionSelected = optionNumber;
  createAndAppendElement('i', { classList: ['icon', 'fa-solid', iconOptions[optionSelected - 1]] }, leftInfo);

  // cardType
  const cardTypeOptions = { classList: ['card-type'], textContent: typeOptions[optionSelected].textContent };
  createAndAppendElement('span', cardTypeOptions, leftInfo);

  //cardAmount
  const cardAmountOptions = { classList: ['card-amount'], textContent: formatCurrency(amount) };
  createAndAppendElement('div', cardAmountOptions, cardInfo);

  createDeleteButton(card);
}

function formatCurrency(currency) {
  if (currency === undefined || currency === '') return '';
  return parseFloat(currency).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function updateTotal() {
  let totalAmount = 0;

  if (localCards.length > 0) {
    for (let x = 0; x < localCards.length; x++) {
      totalAmount += Number(localCards[x].amount);
    }
  }
  return (total.textContent = formatCurrency(totalAmount));
}

function resetInput(array) {
  array.forEach((element) => {
    element.value = '';
  });
}

function updateLocalStorage(callback) {
  callback();
  localStorage.setItem('localCards', JSON.stringify(localCards));
  determineClassForClearAllButton('active', 'inactive');
}

function clearAllButton() {
  if ((clearAll.className = 'active')) {
    clearAll.addEventListener('click', () => {
      cards.textContent = '';
      updateLocalStorage(() => (localCards = []));
      updateTotal();
    });
  }
}

function determineClassForClearAllButton(class1, class2) {
  if (localCards.length > 0) {
    clearAll.className = class1;
    return;
  }
  clearAll.className = class2;
}

function handleSubmit() {
  cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputData = { optionNumber: typeSelect.value, amount: amountInput.value };
    createCard(inputData.optionNumber, inputData.amount);
    updateLocalStorage(() => localCards.push(inputData));
    updateTotal();
    resetInput([typeSelect, amountInput]);
    typeSelect.focus();
  });
}

function restoreData() {
  localCards.forEach((object) => {
    createCard(object.optionNumber, object.amount);
  });
  updateTotal(localCards);
  determineClassForClearAllButton('active', 'inactive');
}

clearAllButton();
restoreData();
handleSubmit();
