// Differences
// Text - names, headers, options
// Local storage key

// const title = document.getElementById('expenses-or-income');
// function determineTitle(link, titleTextContent) {
//   link.addEventListener('click', (e) => {
//     e.preventDefault();
//     title.textContent = titleTextContent;
//   });
// }

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


const cardForm = document.getElementById('card-form');
const cards = document.getElementById('cards');
const amountInput = document.getElementById('amount-input');
const total = document.getElementById('total');
const clearAll = document.getElementById('clear-all');
const typeSelect = document.getElementById('type-select');
const typeOptions = typeSelect.children;

let localCards = [];
let expenseData;
let incomeData;

const iconOptions = ['fa-burger', 'fa-file-invoice-dollar', 'fa-house', 'fa-suitcase-medical', 'fa-bus', 'fa-film', 'fa-layer-group'];
let localExpenseCards = localStorage.getItem('local-expense-cards') ? JSON.parse(localStorage.getItem('local-expense-cards')) : [];
let trashCans = [];

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

function removeElementAndUpdateLocalStorage(localCardsString, element, elements, localCards) {
  const removeIndex = elements.indexOf(element);

  elements.splice(removeIndex, 1);
  updateLocalStorage(localCardsString, localCards, () => localCards.splice(removeIndex, 1));
  updateTotal(localCards);
}

function createDeleteButton(localCardsString, localCards, parent) {
  const trashCan = createAndAppendElement('i', { classList: ['fa-solid', 'fa-trash'] }, parent);
  trashCans.push(trashCan);

  trashCan.addEventListener('click', () => {
    parent.remove(trashCan);
    removeElementAndUpdateLocalStorage(localCardsString, trashCan, trashCans, localCards);
    console.log(localCards.length);
  });
}

function createCard(localCardsString, localCards, optionNumber, amount) {
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

  createDeleteButton(localCardsString, localCards, card);
}

function formatCurrency(currency) {
  if (currency === undefined || currency === '') return '';
  return parseFloat(currency).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function updateTotal(localCards) {
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

function updateLocalStorage(localCardsString, localCards) {
  localStorage.setItem(localCardsString, JSON.stringify(localCards));
  determineClassForClearAllButton(localCards, 'active', 'inactive');
}

function clearAllButton(localCardsString, localCards) {
  clearAll.addEventListener('click', () => {
    if (clearAll.className == 'active') {
      cards.textContent = '';
      localCards = [];
      updateLocalStorage(localCardsString, localCards);
      updateTotal(localCards);
    }
  });
}

function determineClassForClearAllButton(localCards, class1, class2) {
  if (localCards.length > 0) {
    clearAll.className = class1;
    return;
  }
  clearAll.className = class2;
}

function handleSubmit(localCardsString, localCards) {
  cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputData = { optionNumber: typeSelect.value, amount: amountInput.value };
    createCard(localCardsString, localCards, inputData.optionNumber, inputData.amount);
    updateLocalStorage(localCardsString, localCards, () => localCards.push(inputData));
    updateTotal(localCards);
    clearAllButton(localCardsString, localCards);
    resetInput([typeSelect, amountInput]);
    console.log(localCards.length);

    typeSelect.focus();
  });
}

function restoreData(localCardsString, localCards) {
  console.log(test);
  localCards.forEach((object) => {
    createCard(localCardsString, localCards, object.optionNumber, object.amount);
  });
  updateTotal(localCards);
}

// function loadPage(localCardsString, localCards) {
//   restoreData(localCardsString, localCards);
//   handleSubmit(localCardsString, localCards);
//   clearAllButton(localCardsString, localCards);
//   determineClassForClearAllButton(localCards, 'active', 'inactive');
// }

//loadPage('local-expense-cards', localExpenseCards);

function onPageLoad() {
  //Add
}

clearAllButton('local-expense-cards', localExpenseCards);
