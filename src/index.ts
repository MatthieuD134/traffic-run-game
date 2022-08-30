import decrement from './helpers/decrement';
import increment from './helpers/increment';

// Get the different element from the document
const countValue = <HTMLSpanElement>document.querySelector('#count-value');
const incrementBtn = <HTMLButtonElement>(
	document.querySelector('#increment-btn')
);
const decrementBtn = <HTMLButtonElement>(
	document.querySelector('#decrement-btn')
);

// Handle the click on increment Button
function handleIncrementClick() {
	const currentValue = parseInt(countValue.innerText);
	countValue.innerText = increment(currentValue).toString();
}

// Handle the click on decrement Button
function handleDecrementClick() {
	const currentValue = parseInt(countValue.innerText);
	countValue.innerText = decrement(currentValue).toString();
}

// Add event listener to the buttons
incrementBtn.addEventListener('click', () => handleIncrementClick());
decrementBtn.addEventListener('click', () => handleDecrementClick());
