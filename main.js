const cardForm = document.getElementById('card-form');
const cardContainer = document.getElementById('cards');
const amountInput = document.getElementById('amount-input');
const typeSelect = document.getElementById('type-select');

const typeOptions = typeSelect.children;

const iconOptions = ['fa-burger', 'fa-file-invoice-dollar', 'fa-house', 'fa-suitcase-medical', 'fa-bus', 'fa-film', 'fa-layer-group'];

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

function createIcon(array, index, parent) {
  return createElement('i', { classList: ['icon', 'fa-solid', array[index - 1]] }, parent);
}

function handleSubmit() {
  cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const card = createElement('div', { classList: ['card'] }, cardContainer);
    const left = createElement('div', { classList: ['left'] }, card);

    const optionNumber = typeSelect.value;
    const cardOptions = { classList: ['card-type'], textContent: typeOptions[optionNumber].textContent };
    createElement('span', cardOptions, left);

    createElement('i', { classList: ['icon', 'fa-solid', iconOptions[optionNumber - 1]] }, left);

    const cardAmountOptions = { classList: ['card-amount'], textContent: formatCurrency(amountInput.value) };
    createElement('div', cardAmountOptions, card);
  });
}

function formatCurrency(currency) {
  if (currency === undefined || currency === '') return '';
  return parseFloat(currency).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

handleSubmit();
