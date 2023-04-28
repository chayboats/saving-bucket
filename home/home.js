// Read from both keys in local storage and do what you gotta do
// when tab is clicked on, attach a class - active

fetch('../nav.html')
  .then((html) => html.text())
  .then((data) => {
    document.getElementById('nav').innerHTML = data;
  });
