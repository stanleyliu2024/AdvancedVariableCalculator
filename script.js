import { checkExpression } from "./internal.js"

const inputsContainer = document.getElementById('inputs-container');
const inputButtonContainer = document.getElementById('input-button-container');
const mainInput = document.getElementById('main-input');
const historyInputs = document.getElementsByClassName('history-input');

const variableStore = document.getElementById('variable-store')

inputButtonContainer.addEventListener('click', function (event) {
  analyzeAction(event.target.dataset.id);
});

function analyzeAction(action) {
  if (!action) {
    return
  }
  if (action === 'Clear') {
    mainInput.value = '';
  } else if (action === 'Enter') {
    if (mainInput.value != '') {
      if (checkExpression(mainInput.value) === null) {
        mainInput.style.border = "1px solid red"
        mainInput.style.backgroundColor = "pink"
      }
      else {
        mainInput.style.border = "1px solid black"
        mainInput.style.backgroundColor = "white"
        moveInputsUpByOne();
      }
      
    }
  } else {
    mainInput.value += action;
  }
}

function moveInputsUpByOne() {
  const historyInputsArray = Array.from(historyInputs);
  for (const [index, input] of historyInputsArray.entries()) {
    if (index != historyInputsArray.length - 1) {
      input.value = historyInputsArray[index + 1].value;
      if (input.value != "") {
        input.style.border = "1px solid black"
      }
    } else {
      input.value = '';
    }
  }
}

variableStore.addEventListener('click', function(event) {
  if (event.target.tagName === 'BUTTON' && event.target.id != "verify-pairs") {
    Array.from(event.target.parentNode.childNodes).filter(element => element.tagName === 'INPUT').forEach(element => element.value = "")
  } 
  else if (event.target.tagName === 'BUTTON' && event.target.id === 'verify-pairs') {
    

  }
  


})
