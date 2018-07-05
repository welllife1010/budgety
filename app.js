// BUDGET CONTROLLER
/* --------------------------------------------------------------------------------------------
		MODULES
1. Important aspect of any robust application's architecture;
2. Keep the units of code for a project both cleanly separated and organized;
3. Encapsulated some data into privacy and expose other data publicly.

So basically, modules allow us to break up our code into logical parts which are the modules,
and then make them interact with one another.

Data encapsulation - Allows us to hide the implementation details of a specific module from the
outside scope so that we only expose a public interface which is somethimes called an API.

The secret of the module pattern is that it returns an object containing all of the functions 
that we want to be public.

-------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------

1. UI MODULE
2. DATA MOFULE
3. CONTROLLER MODULE - control the entire app and basically acting as a link between the other two modules.

-------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------

Closure - An inner function has always access to the variables and parameters of its outer function
even after theouter function has returned.

-------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------

The difference between map and forEach is that map returns a brand new array.

-------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------

1. Array slice() Method is used to create a copy of the array. 
   The slice() method returns the selected elements in an array, as a new array object.
   The slice() method selects the elements starting at the given start argument, and ends at, but does not include, the given end argument.
   Note: The original array will not be changed.

2. Array splice() Method is used to remove elements.
   The splice() method adds/removes items to/from an array, and returns the removed item(s).
   Note: This method changes the original array.

-------------------------------------------------------------------------------------------- */

// BUDGET CONTROLLER - 
// Keeps track of all the incomes and expenses and also of the budget itself and later also the percentages.
var budgetController = (function() {

	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(cur) {
			sum += cur.value;
		});
		data.totals[type] = sum;
	};

	// Data structure ready to receive data
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1 // -1 is usually a valu that we use to say that something is nonexistent.
	};

	return {
		addItem: function(type, des, val) {
			var newItem, ID;

			// ID = last ID + 1
			// ID = a unique number that we want to assign to each new item that we put either in expense or in the income arrays for the allItems.
			// 1. Create new ID - 
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}	
			// 2. Create new item based on 'inc' or 'exp' type - 
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}
			// 3. Push it into our data structure - 
			data.allItems[type].push(newItem);
			// 4. Return the new element - 
			return newItem;
		},
		deleteItem: function(type, id) {
			var ids, index;
			ids = data.allItems[type].map(function(current){
				return current.id;
			});

			index = ids.indexOf(id);

			if (index !== -1) {
				data.allItems[type].splice(index, 1); // start removing element at the number index and remove exactly one element.
			}
		},
		calculateBudget: function() {
			// calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');
			// calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;
			// calculate the percentage of income that we spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
			
		},
		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
		},
		testing: function() {
			console.log(data);
		}
	};

})();


// UI CONTROLLER - 
var UIController = (function() {

	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container'
	}

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},
		addListItem: function(obj, type) {
			var html, newHTML, element;
			// 1. Create HTML string with placeholder text
			if (type === 'inc') {
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}	
			// 2. Replace the placeholder text with some actual data
			newHTML = html.replace('%id%', obj.id);
			newHTML = newHTML.replace('%description%', obj.description);
			newHTML = newHTML.replace('%value%', obj.value);
			// 3. Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
		},
		deleteListItem: function(selectorID) {
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},
		clearFields: function() {
			var fields, fieldsArr;
			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue); // querySelectorAll return a node list. not array.
			// convert the list to an array using array slice method. slice method is sotred in the Array prototype.
			fieldsArr = Array.prototype.slice.call(fields); 

			fieldsArr.forEach(function(current, index, array) {
				current.value = "";
			});

			fieldsArr[0].focus();
		},
		displayBudget: function(obj) {
			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}
		},
		getDOMstrings: function() {
			return DOMstrings;
		}
	};

})();


// GLOBAL APP CONTROLLER - 
// We'll pass the other two modules as arguments to the controller so that 
// this controller knows about the other two and can connect them.
// This is the central place where I want to decide, where I want to control
// what happens upon each event, and then delegate these tasks to other controllers.
var controller = (function(budgetCtrl, UICtrl) {

	var setupEventListeners = function() {
		var DOM = UICtrl.getDOMstrings();
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
		document.addEventListener('keypress', function(event) {
			if (event.keyCode === 13 || event.which === 13) {
				event.preventDefault(); // prevents the enter key from also triggering a click event
				ctrlAddItem();
			}
		});// Event Delegation
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	};

	var updateBudget = function() {
		// 1. Calculate the budget
		budgetCtrl.calculateBudget();
		// 2. Return the budget (from the budget controller)
		var budget = budgetCtrl.getBudget();
		// 3. Display the budget on the UI
		UICtrl.displayBudget(budget);
	};

	var updatePercentages = function() {
		// 1. Calculate the percentages
		// 2. Read percentages from the budget controller
		// 3. Update the UI with the new percentages
	};

	var ctrlAddItem = function() {
		var input, newItem;

		// 1. Get the field input data
		input = UICtrl.getInput();
		
		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			// 2. Add the item to the budet controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);
			// 3. Add the item to the UI
			UICtrl.addListItem(newItem, input.type);
			// 4. Clear the fields
			UICtrl.clearFields();
			// 5. Calculate and update budget
			updateBudget();
			// 6. Calculate and update percentages
			updatePercentages();
		}
	};

	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID;
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		if (itemID) {
			// inc-1
			splitID = itemID.split('-') // split the string into an array
			type = splitID[0]; // string
			ID = parseInt(splitID[1]); //  parses a string and returns an integer

			// 1. Delete the item from the data structure
			budgetCtrl.deleteItem(type, ID);
			// 2. Delete the item from the UI
			UICtrl.deleteListItem(itemID);
			// 3. Update and show the new budget
			updateBudget();
			// 4. Calculate and update percentages
			updatePercentages();
		}
	};

	return {
		init: function() {
			console.log('Application has started.');
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: 0
			});
			setupEventListeners();
		}
	}

})(budgetController, UIController);

// Without this line of code, nothing is ever going to happen
// because there will be no event listeners.
// Without event listeners we cannot input data, and withour data, 
// there is no application.
// We create the init function because we want to have a place 
// where we can put all code that we want to be executed 
// right at the begining when our application starts.
controller.init();


























