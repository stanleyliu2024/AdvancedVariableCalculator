import { solveExpression, OperatorDict, VariableDict } from "./internal.js"
const operatorDictionary = new OperatorDict()
const variableDictionary = new VariableDict(operatorDictionary)


const inputsContainer = document.getElementById('inputs-container')
const taskBar = document.getElementById('task-bar')
const inputButtonContainer = document.getElementById('input-button-container');
const mainInput = document.getElementById('main-input');

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

  let historyList = inputsContainer.querySelector("ul")
  let newHistoryElement = document.createElement('li')
  let historyInput = document.createElement('input')
  let clearButton = document.createElement('button')
  clearButton.textContent = 'X'
  newHistoryElement.appendChild(historyInput)
  newHistoryElement.appendChild(clearButton)
  historyList.appendChild(newHistoryElement)


  let historyInputsArray = Array.from(historyList.querySelectorAll('li'))
  for (let index = historyInputsArray.length - 1; index > 0; index--) {
    let changingHistory = historyInputsArray[index].querySelector('input')
    changingHistory.value = historyInputsArray[index - 1].querySelector('input').value
    historyInputsArray[index].style.border = "1px solid black"
  }
  historyInputsArray[0].querySelector('input').value = ''

}

inputsContainer.addEventListener('click', function(event) {
  if (event.target.tagName === 'BUTTON') {
    event.target.parentNode.remove()
  }
})



variableStore.addEventListener('click', function(event) {
  if (event.target.tagName === 'BUTTON' && event.target.id != "verify-pairs") {
    let pair = Array.from(event.target.parentNode.querySelectorAll('input'))
    variableDictionary.remove(pair[0].value)
    pair.forEach((inputElement) => {
      inputElement.value = ""
      inputElement.style.border = '1px solid gray'
      inputElement.style.backgroundColor = 'whitesmoke'

    })

  } 
  else if (event.target.tagName === 'BUTTON' && event.target.id === 'verify-pairs') {
    variableDictionary.clearDict()

    let pairs = Array.from(event.target.parentNode.querySelectorAll('ul li'))

    for (const pair of pairs) {
      let inputsInPair = pair.querySelectorAll('input')
      let keyInput = inputsInPair[0]
      let valueInput = inputsInPair[1]
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