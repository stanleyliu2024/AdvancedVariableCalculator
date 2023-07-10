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
      moveInputsUpByOne();
    }
  } else {
    mainInput.value += event.target.dataset.id;
  }
}

function moveInputsUpByOne() {
  const historyInputsArray = Array.from(historyInputs);
  for (const [index, input] of historyInputsArray.entries()) {
    if (index != historyInputsArray.length - 1) {
      input.value = historyInputsArray[index + 1].value;
    } else {
      input.value = '';
    }
  }
}

variableStore.addEventListener('click', function(event) {
  if (event.target.tagName === 'BUTTON' && event.target.id != "verify-pairs") {
    console.log("h")
    Array.from(event.target.parentNode.childNodes).filter(element => element.tagName === 'INPUT').forEach(element => element.value = "")
  }
  


})
