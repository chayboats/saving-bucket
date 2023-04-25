const cardForm = document.getElementById('card-form');
const cards = document.getElementById('cards');
const amountInput = document.getElementById('amount-input');
const typeSelect = document.getElementById('type-select');
const typeOptions = typeSelect.children;
const iconOptions = ['fa-burger', 'fa-file-invoice-dollar', 'fa-house', 'fa-suitcase-medical', 'fa-bus', 'fa-film', 'fa-layer-group'];
const localCards = localStorage.getItem('localCards') ? JSON.parse(localStorage.getItem('localCards')) : [];

function updateLocalStorage() {
  localStorage.setItem('localCards', JSON.stringify(localCards));
}

function createElement(elementType, options = {}, parent) {
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

function createCard(optionNumber, amount) {
  const card = createElement('div', { classList: ['single-card-container'] }, cards);
  const cardInfo = createElement('div', { classList: ['card'] }, card);
  const left = createElement('div', { classList: ['left'] }, cardInfo);

  const optionSelected = optionNumber;
  createElement('i', { classList: ['icon', 'fa-solid', iconOptions[optionSelected - 1]] }, left);

  const cardOptions = { classList: ['card-type'], textContent: typeOptions[optionSelected].textContent };
  createElement('span', cardOptions, left);

  const cardAmountOptions = { classList: ['card-amount'], textContent: formatCurrency(amount) };
  createElement('div', cardAmountOptions, cardInfo);
  createElement('i', { classList: ['fa-solid', 'fa-trash'] }, card);
}

function formatCurrency(currency) {
  if (currency === undefined || currency === '') return '';
  return parseFloat(currency).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function handleSubmit() {
  cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputData = { optionNumber: typeSelect.value, amount: amountInput.value };
    createCard(inputData.optionNumber, inputData.amount);

    localCards.push(inputData);
    updateLocalStorage();
  });
}

function restoreData() {
  localCards.forEach((object) => {
    createCard(object.optionNumber, object.amount);
  });
}

restoreData();
handleSubmit();
