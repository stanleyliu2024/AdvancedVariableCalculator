import { solveExpression, OperatorDict, VariableDict } from "./internal.js"
const operatorDictionary = new OperatorDict()
const variableDictionary = new VariableDict(operatorDictionary)


const inputsContainer = document.getElementById('inputs-container')
const taskBar = document.getElementById('task-bar')
const inputButtonContainer = document.getElementById('input-button-container');
const mainInput = document.getElementById('main-input');
const historyInputs = document.getElementsByClassName('history-input');

const variableStore = document.getElementById('variable-store')





inputButtonContainer.addEventListener('click', function (event) {
  analyzeAction(event.target.dataset.id)
})

mainInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    onEnter()
  }

})

function analyzeAction(action) {
  if (!action) {
    return
  }
  if (action === 'Clear') {
    mainInput.style.border = "1px solid black"
    mainInput.style.backgroundColor = "white"
    mainInput.value = '';
  } else if (action === 'Enter') {
    onEnter()
  } else {
    mainInput.value += action;
  }
}

function onEnter() {
  if (mainInput.value != '') {

    let result = solveExpression(mainInput.value, operatorDictionary, variableDictionary)

    if (result === null) {
      mainInput.style.border = "1px solid red"
      mainInput.style.backgroundColor = "pink"
    }
    else {
      mainInput.style.border = "1px solid black"
      mainInput.style.backgroundColor = "white"
      mainInput.value = result + ' = ' + mainInput.value
      moveInputsUpByOne();
    }

  }
}

function moveInputsUpByOne() {
  let newLine = document.createElement("input")
  newLine.classList.add("history-input")
  inputsContainer.insertBefore(newLine, inputsContainer.firstChild)
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
    
    Array.from(event.target.parentNode.childNodes).filter(element => element.tagName === 'INPUT').forEach((element) => {
      if (element.classList.contains("key")) {
        variableDictionary.remove(element.value)
      }
      element.value = ""; element.style.border = '1px solid gray'; element.style.backgroundColor = 'whitesmoke'; 
    
    })


  } 
  else if (event.target.tagName === 'BUTTON' && event.target.id === 'verify-pairs') {
    variableDictionary.clearDict()
    let pairs = Array.from(event.target.parentNode.childNodes).filter(element => element instanceof HTMLDivElement)
    
    for (const pair of pairs) {
      let keyInput = pair.getElementsByClassName("key")[0]
      let valueInput = pair.getElementsByClassName("value")[0]
      keyInput.style.backgroundColor = 'whitesmoke'
      valueInput.style.backgroundColor = 'whitesmoke'
      keyInput.style.border = '1px solid gray'
      valueInput.style.border = '1px solid gray'
      
      if (keyInput.value === '' || valueInput.value === ''){
        continue;
      }
      

      let status = variableDictionary.add(keyInput.value, valueInput.value)
      if (status === 0) {
        keyInput.style.backgroundColor = 'lightgreen'
        valueInput.style.backgroundColor = 'lightgreen'
        keyInput.style.border = '1px solid green'
        valueInput.style.border = '1px solid green'
      }
      else{
        keyInput.style.backgroundColor = 'pink'
        keyInput.style.border = '1px solid red'
        valueInput.style.backgroundColor = 'pink'
        valueInput.style.border = '1px solid red'
      }

    }


  }
  


})



taskBar.addEventListener('click', function(event) {
  
  if (event.target.classList[0] === 'dropdown-button') {

    let targetDropDown = event.target.parentNode.querySelector('.dropdown')

    Array.from(taskBar.querySelectorAll('.dropdown')).forEach((dropdown) => {
      if (targetDropDown != dropdown) {
        if(!dropdown.classList.contains('hide-dropdown')) { dropdown.classList.add('hide-dropdown')}
      }
      else {
        if (dropdown.classList.contains('hide-dropdown')) {
          dropdown.classList.remove('hide-dropdown')
        }
        else {
          dropdown.classList.add('hide-dropdown')
        }
      }
      
    })

  }

})