function pos(first)
{
	return Math.abs(first);
}
function neg(first)
{
	return -first;
}
function add(first, second)
{
	return first + second;
}
function subtract(first, second)
{
	return first - second;
}
function multiply(first, second)
{
	return first * second;
}
function divide(first, second)
{
	return first / second;
}



class ExpressionNode
{
	constructor(parent)
	{
		this.parent = parent;
		this.elements = [];
	}	
	
	addToElements(element)
	{
		this.elements.push(element);
	}
	getElements()
	{
		return this.elements;
	}
	getParent()
	{
		return this.parent;
	}

}


class TwoSidedOperator
{
	constructor(name, func, allowedTypesBefore, allowedTypesAfter)
	{
		this.name = name;
		this.func = func;
		this.allowedTypesBefore = allowedTypesBefore;
		this.allowedTypesAfter = allowedTypesAfter;

	}
	getName()
	{ return this.name; }
	getFunc()
	{ return this.func; }
	getAllowedTypesBefore()
	{ return this.allowedTypesBefore }
	getAllowedTypesAfter()
	{ return this.allowedTypesAfter }
	
	validateOperatorPosition(before, after)
	{
		let beforeCheck = false;
		for (const allowedType of this.allowedTypesBefore)
		{
			if (allowedType === null)
			{
				if (before === null) { beforeCheck = true; break; }
			}
			else if (allowedType === 'number' || allowedType === 'string')
			{
				if (typeof before === allowedType) { beforeCheck = true; break; }
			}
			else
			{
				if (before instanceof allowedType) { beforeCheck = true; break; }
			}
		}		
		let afterCheck = false;
		for (const allowedType of this.allowedTypesAfter)
		{
			if (allowedType === null)
			{
				if (after === null) { afterCheck = true; break; }
			}
			else if (allowedType === 'number' || allowedType === 'string')
			{
				if (typeof after === allowedType) { afterCheck = true; break; }
			}
			else
			{
				if (after instanceof allowedType) { afterCheck = true; break; }
			}
		}
		return beforeCheck === true && afterCheck === true;	

	}


}

class OneSidedOperator
{
	constructor(name, func, allowedTypesAfter)
	{
		this.name = name;
		this.func = func;
		this.allowedTypesAfter = allowedTypesAfter;

	}
	getName()
	{ return this.name; }
	getFunc()
	{ return this.func; }
	getAllowedTypesAfter()
	{ return this.allowedTypesAfter }
	
	validateOperatorPosition(after)
	{
		let afterCheck = false;
		for (const allowedType of this.allowedTypesAfter)
		{
			if (allowedType === null)
			{
				if (after === null) { afterCheck = true; break; }
			}
			else if (allowedType === 'number' || allowedType === 'string')
			{
				if (typeof after === allowedType) { afterCheck = true; break; }
			}
			else
			{
				if (after instanceof allowedType) { afterCheck = true; break; }
			}
		}
	
		return afterCheck === true;	

	}



}

class multiPurposeOperator
{
	constructor(name, subName, typesBeforeForSubName, typesAfterForSubName)
	{
		this.name = name;
		this.subName = subName;
		this.typesBeforeForSubName = typesBeforeForSubName;
		this.typesAfterForSubName = typesAfterForSubName;
	}
	getName()
	{ return this.name; }
	getSubName()
	{ return this.subName; }
	getTypesBeforeForSubName()
	{ return this.typesBeforeForSubName; }
	getTypesAfterForSubName()
	{ return this.typesAfterForSubName; }
	selectWhichPurpose(before, after)
	{
		let beforeCheck = false;
		for (const option of this.typesBeforeForSubName)
		{
			if (option === null)
			{
				if (before === null) { beforeCheck = true; break; }
			}
			else if (option === 'string' || option === 'number')
			{
				if (typeof before === option)  { beforeCheck = true; break; }
			}		
			else
			{
				if (before instanceof option) { beforeCheck = true; break; }
			}
		}
		let afterCheck = false;
		for (const option of this.typesAfterForSubName)
		{
			if (option === null)
			{
				if (after === null) { afterCheck = true; break; }
			}
			else if (option === 'string' || option === 'number')
			{
				if (typeof after === option)  { afterCheck = true; break; }
			}		
			else
			{
				if (after instanceof option) { afterCheck = true; break; }
			}
		}
		if (beforeCheck === true && afterCheck === true) { return this.subName; }
		return this.name;

		

	}


}

class OperatorDict
{
	constructor()
	{
		this.operatorDict = {};
		this.multiPurposeOperatorDict = {};
		this.orderOfOperators = [['pos', 'neg', 'abs'], ['^', 'sqrt'], ['*', '/'], ['+', '-']];
		this.fillWithMultiplicationBeforeAfter = [['number', 'string', ExpressionNode], ['number', 'string', ExpressionNode, OneSidedOperator]];
	
		this.initializeOperatorDict();
		this.initializeMultiPurposeOperatorDict()
	}
	initializeOperatorDict()
	{
		this.operatorDict['pos'] = new OneSidedOperator('pos', pos, ['number', 'string', OneSidedOperator, ExpressionNode]);
		this.operatorDict['neg'] = new OneSidedOperator('neg', neg, ['number', 'string', OneSidedOperator, ExpressionNode]);
		this.operatorDict['abs'] = new OneSidedOperator('abs', Math.abs, [ExpressionNode]);
		
		this.operatorDict['sqrt'] = new OneSidedOperator('sqrt', Math.sqrt, [ExpressionNode]);
		this.operatorDict['^'] = new TwoSidedOperator('^', Math.pow, ['number', 'string', ExpressionNode], ['number', 'string', ExpressionNode, OneSidedOperator]);
		
		this.operatorDict['*'] = new TwoSidedOperator('*', multiply, ['number', 'string', ExpressionNode], ['number', 'string', ExpressionNode, OneSidedOperator]);
		this.operatorDict['/'] = new TwoSidedOperator('/', divide, ['number', 'string', ExpressionNode], ['number', 'string', ExpressionNode, OneSidedOperator]);
		
		this.operatorDict['+'] = new TwoSidedOperator('+', add, ['number', 'string', ExpressionNode], ['number', 'string', ExpressionNode, OneSidedOperator]);
		this.operatorDict['-'] = new TwoSidedOperator('-', subtract, ['number', 'string', ExpressionNode], ['number', 'string', ExpressionNode, OneSidedOperator]);
	}
	initializeMultiPurposeOperatorDict()
	{
		this.multiPurposeOperatorDict['+'] = new multiPurposeOperator('+', 'pos', [null, OneSidedOperator, TwoSidedOperator],
									      [null, 'number', 'string', ExpressionNode, OneSidedOperator, TwoSidedOperator]);
		this.multiPurposeOperatorDict['-'] = new multiPurposeOperator('-', 'neg', [null, OneSidedOperator, TwoSidedOperator], 
									      [null, 'number', 'string', ExpressionNode, OneSidedOperator, TwoSidedOperator]);
	}
	isInDict(key)
	{
		return key in this.operatorDict 
	}
	getOperatorClass(key)
	{
		if (this.isInDict(key) === false) { return null; }
		return this.operatorDict[key];
	}
	isMultiPurpose(key)
	{
		return key in this.multiPurposeOperatorDict;
	}
	getMultiPurposeOperatorClass(key)
	{
		if (this.isMultiPurpose(key) === false) { return null; }
		return this.multiPurposeOperatorDict[key];
	}
	checkWhichPurpose(before, operator, after)
	{
		if (this.isInDict(operator) === false || this.isMultiPurpose(operator) === false) { return operator; }
		let first = this.isInDict(before) === true ? this.getOperatorClass(before) : before;
		let second = this.isInDict(after) === true ? this.getOperatorClass(after) : after;
		let result = this.getMultiPurposeOperatorClass(operator).selectWhichPurpose(first, second);
		return result;

	}
	checkOperatorPositionValid(before, operator, after)
	{
		if (this.isInDict(operator) === false) { return true; }
		let first = this.isInDict(before) === true ? this.getOperatorClass(before) : before;
		let second = this.isInDict(after) === true ? this.getOperatorClass(after) : after;
		let classToUse = this.getOperatorClass(operator)	
		let result = true;
		if (classToUse instanceof OneSidedOperator)
		{
			result = classToUse.validateOperatorPosition(second);
		}
		else if (classToUse instanceof TwoSidedOperator)
		{
			result = classToUse.validateOperatorPosition(first, second);
		}
		return result;
	}
	shouldFillWithMultiply(first, second)
	{
		let before = this.isInDict(first) === true ? this.getOperatorClass(first) : first;
		let after = this.isInDict(second) === true ? this.getOperatorClass(second) : second;
		let beforeCheck = false;
		for (const allowedType of this.fillWithMultiplicationBeforeAfter[0])
		{
			if (allowedType === null)
			{
				if (before === null) { beforeCheck = true; break; }
			}
			else if (allowedType === 'number' || allowedType === 'string')
			{
				if (typeof before === allowedType) { beforeCheck = true; break; }
			}
			else
			{
				if (before instanceof allowedType) { beforeCheck = true; break; }
			}
		}		
		let afterCheck = false;
		for (const allowedType of this.fillWithMultiplicationBeforeAfter[1])
		{
			if (allowedType === null)
			{
				if (after === null) { afterCheck = true; break; }
			}
			else if (allowedType === 'number' || allowedType === 'string')
			{
				if (typeof after === allowedType) { afterCheck = true; break; }
			}
			else
			{
				if (after instanceof allowedType) { afterCheck = true; break; }
			}
		}
		return beforeCheck === true && afterCheck === true;	

	}
	getOrderOfOperators() {
		return this.orderOfOperators
	}

}

class VariableDict
{
	constructor(operatorDict)
	{
		this.operatorDict = operatorDict;
		this.variableDict = {};
	}
	add(key, value)
	{
		if (this.checkKeyString(key) === false ) { return false; }
		if (this.checkValueString(value) === false ) { return false; }
		this.variableDict[key] = value;
		return true;
	}
	remove(key)
	{
		if (this.isInDict(key) === false) { return false; }
		delete this.variableDict[key];
		return true;
	}
	isInDict(key)
	{
		return key in this.variableDict;
	}
	getValue(key)
	{
		if (this.isInDict(key) === false) { return null; }
		return this.variableDict[key];
	}
	checkKeyString(key)
	{
		const keyNameRegexCheck = /^[A-Za-z_]+$/;
		if (keyNameRegexCheck.test(key) === false) { return false; }
		if (this.operatorDict.isInDict(key)) { return false; }
		return true;
	}
	checkValueString(value)
	{
		const numbersRegex = /^[0-9]$/;
		for (const char of value)
		{
			if (char === '(' || char === ')' || char === ' ')
			{	
			}
			else if (numbersRegex.test(char))
			{
			}
			else if (this.operatorDict.isInDict(char))
			{
			}
			else
			{
				return false;
			}
		}		
		return true;

	}


}


function createExpressionNodeTree(expressionArray)
{
	let currentNode = new ExpressionNode(null);
	for (const element of expressionArray)
	{
		if (element === '(')
		{
			let childNode = new ExpressionNode(currentNode);
			currentNode.addToElements(childNode);
			currentNode = childNode;
		}
		else if (element === ')')
		{
			currentNode = currentNode.getParent();
		}
		else
		{
			currentNode.addToElements(element);
		}
	}
	return currentNode;
	
}
function printExpressionNodeTree(topNode)
{
	let layers = [];
	function recursiveTraverse(node, currentLayer)
	{
		if (currentLayer === layers.length)
		{
			layers.push([]);
		}
		else
		{
			layers[currentLayer].push('------NEXT------');
		}
		for (const element of node.getElements())
		{	
			if (element instanceof ExpressionNode)
			{
				layers[currentLayer].push('(DOWN)');
				recursiveTraverse(element, currentLayer + 1);
			
			}
			else
			{
				layers[currentLayer].push(element);
			}
		}
	}
	recursiveTraverse(topNode, 0);
	console.log(layers);
	return layers;
}

function splitFirstNumbersFromRestString(currentElement)
{
	if (currentElement === null) { return [null, null]; }
	if (currentElement === '') { return ['', '']; }
		
	let numbersFirst = currentElement.match(/^\d+/);
	
	let stringNumbers = numbersFirst === null ? '' : numbersFirst[0];
	let stringString = currentElement.substr(stringNumbers.length);
	
	return [stringNumbers, stringString];
}

function splitExpressionElements(expressionString, operatorDictionary)
{
	let expressionArray = [];
	let currentElement = '';
	for (const char of expressionString)
	{	
		if (char === ' ')
		{
			continue;
		}
		if (char === '(' || char === ')' || operatorDictionary.isInDict(char))
		{
			let firstNumbersAndString = splitFirstNumbersFromRestString(currentElement);
			if (firstNumbersAndString[0] !== '') { expressionArray.push(firstNumbersAndString[0]); }
			if (firstNumbersAndString[1] !== '') { expressionArray.push(firstNumbersAndString[1]); }
			currentElement = ''; 
			expressionArray.push(char);			
		} 
		else 
		{
			currentElement += char;
		}	
	}
	let firstNumbersAndString = splitFirstNumbersFromRestString(currentElement);
	if (firstNumbersAndString[0] !== '') { expressionArray.push(firstNumbersAndString[0]); }
	if (firstNumbersAndString[1] !== '') { expressionArray.push(firstNumbersAndString[1]); }
	currentElement = ''; 	
	return expressionArray;


}


function validateParenthesisLocations(expressionArray)
{
	let openCount = 0;
	for (const [index, element] of expressionArray.entries())
	{
		if (element === '(')
		{
			if (index === expressionArray.length - 1) { return false; }
			if (expressionArray[index + 1] === ')') { return false; }
			openCount++;
		}
		
		if (element === ')')
		{
			if (openCount === 0) { return false; }
			openCount--;			
		}		
	}
	if (openCount !== 0){ return false; }
	return true;
}

function checkForMultiPurposeOperators(elements, operatorDictionary)
{
	for (const [index, element] of elements.entries())
	{
		let before = index === 0 ? null : elements[index - 1];
		let after = index === elements.length - 1 ? null : elements[index + 1];
		elements[index] = operatorDictionary.checkWhichPurpose(before, element, after);

	}

}
function validateOperatorPositions(elements, operatorDictionary)
{
	let invalid_operators = [];
	for (const [index, element] of elements.entries())
	{
		let before = index === 0 ? null : elements[index - 1];
		let after = index === elements.length - 1 ? null : elements[index + 1];
		if(operatorDictionary.checkOperatorPositionValid(before, element, after) === false) {invalid_operators.push(element);}
	}
	return invalid_operators;

}
function fillGapsWithMultiplication(elements, operatorDictionary)
{
	if (elements.length == 0 || elements.length == 1) { return ; }	
	for (let index = 0; index < elements.length - 1; index++)
	{
		let first = elements[index];
		let second = elements[index + 1];
		if (operatorDictionary.shouldFillWithMultiply(first, second))
		{
			elements.splice(index + 1, 0, '*');
			index++;
		}
	}

}
function operatorCheckTree(topNode, operatorDictionary)
{
	let invalidOperators = [];

	function recursiveCheck(node, operatorDictionary)
	{
		checkForMultiPurposeOperators(node.getElements(), operatorDictionary);
		let invalidFound = validateOperatorPositions(node.getElements(), operatorDictionary);
		if (invalidFound.length > 0) {invalidOperators.push(invalidFound); }	
		
		fillGapsWithMultiplication(node.getElements(), operatorDictionary);
	
		for (const [index, element] of node.getElements().entries())
		{
			if (element instanceof ExpressionNode)
			{
				recursiveCheck(element, operatorDictionary);		
			}
		}

	}
	
	recursiveCheck(topNode, operatorDictionary);
	return invalidOperators;	
}

function convert(topNode, operatorDictionary) {

	function recursiveConvert(node) {

		for (const [index, element] of node.getElements().entries()) {
			if (element instanceof ExpressionNode) {
				recursiveConvert(element)
			}
			else if (operatorDictionary.isInDict(element)) {

			}
			else {
				let convertedToNumber = parseFloat(element)
				if (!isNaN(convertedToNumber)) {
					console.log(convertedToNumber)
					node.getElements()[index] = convertedToNumber
				}
			}

		}


	}

	recursiveConvert(topNode)


}

function solve(topNode, operatorDictionary) {
	
	function recursiveSolve(node) {
		let elements = node.getElements();
		for (const operatorGroup of operatorDictionary) {
				for (let index = 0; index < elements.length; index++) {
					if (operatorGroup.includes(elements[index])) {
							if (operatorDictionary.getOperatorClass(elements[index]) instanceof OneSidedOperator) {
								if (elements[index + 1] instanceof ExpressionNode) {
									operatorDictionary.getOperatorClass(elements[index]).getFunc()(solve(elements[index + 1]))
								} 
								else {
									elements[index] = operatorDictionary.getOperatorClass(elements[index]).getFunc()(elements[index + 1])
									elements.splice(index+1 , 1)
								}

							}
							else if (operatorDictionary.getOperatorClass(elements[index]) instanceof TwoSidedOperator) {

							}

					}

				}

		}


		console.log(elements)


			

	}

	recursiveSolve(topNode)
}



export function checkExpression(expressionString)
{
	let operatorDictionary = new OperatorDict(); // Create an operator dictionary with all operators
	let expressionArray = splitExpressionElements(expressionString, operatorDictionary); // split the expressionstring into arrays 
	
	if (validateParenthesisLocations(expressionArray) === false) {return null }
	
	let topNode = createExpressionNodeTree(expressionArray);
	let invalidOperators = operatorCheckTree(topNode, operatorDictionary);
	if (invalidOperators.length > 0) {return null }
	convert(topNode, operatorDictionary)
	printExpressionNodeTree(topNode)

	
	return 0;
}
