const cardForm = document.getElementById('card-form');
const cardContainer = document.getElementById('cards');
const amountInput = document.getElementById('amount-input');
const typeSelect = document.getElementById('type-select');
const typeOptions = typeSelect.children
const optionNumber = typeSelect.value

function createElement(elementType, options = {}, parent = "") {
  const element = document.createElement(elementType);
  const optionKeys = Object.keys(options)

  optionKeys.forEach((key) => {
    if(key !== 'classList') {
      element[key] = options[key]
      return
    } 
    element[key].add(...options[key]);  
  })

  if(parent !="" ) {
    parent.append(element);
  }

  return element
}

function createIcon(array, index, parent) {
  return createElement('i', { classList: ['icon', 'fa-solid', array[index - 1]] }, parent)
}

function handleSubmit() {
  cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const iconOptions = ['fa-burger', 'fa-file-invoice-dollar', 'fa-house', 'fa-suitcase-medical', 'fa-bus', 'fa-film', 'fa-layer-group'];


    const card = createElement('div',{ classList: ['card'] }, cardContainer);
    const left = createElement('div', { classList: ['left'] }, card);
    const icon = createIcon(iconOptions, typeSelect.value);
    const cardType = createElement('span', { classList: ['card-type'], textContent: typeOptions[optionNumber].textContent }, left)
    const cardAmount = createElement('div', { classList: ['card-amount'], textContent: `$${amountInput.value}` }, card);

  })

}

handleSubmit()