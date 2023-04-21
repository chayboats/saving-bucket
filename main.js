const cardForm = document.getElementById('card-form');
const cardContainer = document.getElementById('cards');

const typeSelect = document.getElementById('type-select');
const amountInput = document.getElementById('amount-input');

const typeOptions = typeSelect.children

function createElement(elementType, options = {}) {
  const element = document.createElement(elementType);
  const optionKeys = Object.keys(options)

  optionKeys.forEach((key) => {
    if(key !== 'classList') {
      element[key] = options[key]
      return
    } 
    element[key].add(...options[key]);  
  })

  return element
}

function children(parent) {
  return parent.children
}

function createIcon(index) {
  const iconOptions = ['fa-burger', 'fa-file-invoice-dollar', 'fa-house', 'fa-suitcase-medical', 'fa-bus', 'fa-film', 'fa-layer-group'];
  createElement('i', { classList: ['icon', 'fa-solid', iconOptions[index]] })
}

function handleSubmit() {
  cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const card = createElement('div',{ classList: ['card'] });
    const left = createElement('div', { classList: ['left'] });
    const icon = createIcon(typeSelect.value);
   // const cardType = createElement('span', { classList: ['card-type'], textContent: })

    cardContainer.append(card);
    card.append(left, icon)
  })

}

handleSubmit()