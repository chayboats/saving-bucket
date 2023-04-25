const cardForm = document.getElementById('card-form');
const cards = document.getElementById('cards');
const amountInput = document.getElementById('amount-input');
const total = document.getElementById('total')
const typeSelect = document.getElementById('type-select');
const typeOptions = typeSelect.children;
const iconOptions = ['fa-burger', 'fa-file-invoice-dollar', 'fa-house', 'fa-suitcase-medical', 'fa-bus', 'fa-film', 'fa-layer-group'];
let localCards = localStorage.getItem('localCards') ? JSON.parse(localStorage.getItem('localCards')) : [];
let trashCans = [];


function updateLocalStorage(callback) {
  callback()
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

function deleteFromLocalStorage(element, elementArray, localArray) {
  const removeIndex = elementArray.indexOf(element);
    
  elementArray.splice(removeIndex, 1);
  updateLocalStorage(() => localArray.splice(removeIndex, 1));
  updateTotal(localCards)
}

function createDeleteButton(parent) {
  const trashCan = createElement('i', { classList: ['fa-solid', 'fa-trash'] }, parent);
  trashCans.push(trashCan);

  trashCan.addEventListener('click', () => {
    parent.remove(trashCan);
    deleteFromLocalStorage(trashCan, trashCans, localCards)
  });
}

function createCard(optionNumber, amount) {
  const card = createElement('div', { classList: ['card'] }, cards);
  const cardInfo = createElement('div', { classList: ['card-info'] }, card);
  const left = createElement('div', { classList: ['left'] }, cardInfo);

  const optionSelected = optionNumber;
  createElement('i', { classList: ['icon', 'fa-solid', iconOptions[optionSelected - 1]] }, left);

  const cardOptions = { classList: ['card-type'], textContent: typeOptions[optionSelected].textContent };
  createElement('span', cardOptions, left);

  const cardAmountOptions = { classList: ['card-amount'], textContent: formatCurrency(amount) };
  createElement('div', cardAmountOptions, cardInfo);
  createDeleteButton(card);
}

function formatCurrency(currency) {
  if (currency === undefined || currency === '') return '';
  return parseFloat(currency).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function updateTotal() {
  let totalAmount = 0
  
  if(localCards.length > 0) {
    for(let x = 0; x < localCards.length; x++) {
      totalAmount += Number(localCards[x].amount)
    }
  }
  return total.textContent = `$${totalAmount}`
}

function handleSubmit() {
  cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputData = { optionNumber: typeSelect.value, amount: amountInput.value };
    createCard(inputData.optionNumber, inputData.amount);

    updateLocalStorage(() => localCards.push(inputData));
    updateTotal()
  });
}

function restoreData() {
  localCards.forEach((object) => {
    createCard(object.optionNumber, object.amount);
  });
  updateTotal(localCards)

}

restoreData();
handleSubmit();
