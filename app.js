
//BUDGET CONTROLLER
var budgetyController = (function() {

var Expense = function(id, description, value) {
this.id = id;
this.description = description;
this.value = value;
this.percentage = -1;
};

Expense.prototype.calcPercentage = function (totalIncome) {

    if(totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
        this.percentage = -1;
    } 

};

Expense.prototype.getPercentage = function() {
return this.percentage;

}

var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    };



var calculateTotal = function(type){
var sum = 0;
data.allItems[type].forEach(function(cur) {
    sum += cur.value;

}); 
data.totals[type] = sum;

};    
 
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

percentage : -1,


};


return {
addItem: function(type, des, val){
var newItem, ID;

//ID = last ID + 1

//Create new ID
if(data.allItems[type].length > 0){
    ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
/*
assuming 
var exp = [ id: 0, description: "jkgij", value: "305",
            id: 1, description: "jkgij", value: "305",
            id: 2, description: "jkgij", value: "305" ]
        
Meaning that exp[exp.length - 1].id + 1  
 exp[3 - 1].id + 1
exp[2].id + 1 ( add 1 to the id property in the second array {2 + 1})

(exp[2] === id: 2, description: "jkgij", value: "305")
exp[2].id + 1 denotes all the value in "exp[2]"" but we want to work on "id property of the object" >>> exp[2].id and keep adding one to the last id property every time we call the function and id is > 0

*/

}else {
    ID = 0;
}

//Create new item based on 'inc' or 'exp' type
if(type === 'exp'){
    newItem = new Expense(ID, des, val);
} else if(type === 'inc'){
    newItem = new Income(ID, des, val);
}

//Push it into our data structure
data.allItems[type].push(newItem);

//Return the new element
return newItem;

},


deleteItem: function(type, id) {
var ids, index;
    // id = 6
    // [1 2 4 6 8]
    // index = 3



    ids = data.allItems[type].map(function(current) {
        return current.id;
    });

    index = ids.indexOf(id);

    if (index !== -1) {
        
        data.allItems[type].splice(index, 1);

    }

},
 
calculateBudget: function() {

    // calculate total income and expenses
    calculateTotal('exp');
    calculateTotal('inc');

    // calculate the budget: income - expenses
 
data.budget = data.totals.inc - data.totals.exp;


if (data.totals.inc < data.totals.exp){
alert('Check your input value, Expenses is more than your income (Overbudget)');

}
    // calculate the percentage of income that we spent 

    if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    } else {
        data.percentage = -1;
    }

}, 


calculatePercentages: function () {

    data.allItems.exp.forEach(function(cur) {

        cur.calcPercentage(data.totals.inc);

    });
},


getPercentages: function() {

   var allPerc = data.allItems.exp.map(function(cur) {
    return cur.getPercentage(); 
    });
return allPerc;
},


getBudget: function () {
return {
budget: data.budget,
totalInc: data.totals.inc,
totalExp: data.totals.exp,
percentage: data.percentage
}
},

 //ClearBudget on the UI
getBudgetInit: function () {
    return {
    budget: 0,
    totalInc:  0,
    totalExp: 0,
    percentage: 0
    };

},

//Zeroing all data when app starts



//to test and see user input data in the web console(budgetcontroller.testing())
testing: function(){
    console.log(data);
}


};

})();








/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







//UI CONTROLLER
var UIController = (function() {

var DOMStrings = {

    inputType: '.add__type',
    inputDescription :  '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel:    ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel:   ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container : '.container',
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
}

var formatNumber = function (num, type) {
    var numSplit, init, dec;
    
    
    num = Math.abs(num);
    num = num.toFixed(2);    
    
    numSplit = num.split('.')
    
    init = numSplit[0];
    if (init.length > 3) {
    init = init.substr(0, init.length -3) + ',' + init.substr(init.length - 3, 3);      
    }
     
    dec = numSplit[1];
    return (type === 'exp' ? '-' : '+') + '' + init + '.' + dec;
    
    };

//Making it accessible by other methods and function.  It is still a private function

var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
        callback(list[i], i);
    }
    }; 


return {
getInput: function() {
    return {
        type: document.querySelector(DOMStrings.inputType).value,// Will be either inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
        };
    },

addListItem: function(obj, type){
var html, newHtml, element;

//Create HTML string with placeholder text

if(type === 'inc'){
element = DOMStrings.incomeContainer;   
html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
}

else if(type === 'exp'){

element = DOMStrings.expensesContainer;   
html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
}

//Replace the placeholder text with some actual data
newHtml = html.replace('%id%', obj.id);
newHtml = newHtml.replace('%description%', obj.description);
newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


//Insert the html in UI
/**verification of position name
<!---beforebegin--//  JS CODE>
<p>
 <!---afterbegin--> // JS CODE
 ----------------------------------------------------------
<!---beforeend--> // JS CODE
</p>
<!---aftereend--> // JS CODE
 **/

    document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


},


deleteListItem: function (selectorID) {
    
    var el = document.getElementById(selectorID)
    el.parentNode.removeChild(el)

},

clearFields: function(){
var fields, fieldsArr;

    fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

    fieldsArr = Array.prototype.slice.call(fields);
 
    fieldsArr.forEach(function(current){
  current.value = " ";
 
});

    fieldsArr[0].focus();
},

displayBudget: function(obj){
    var type;
    obj.budget > 0 ? type = 'inc' : type = 'exp';

    document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
    document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
    document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
   
    if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
    } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
    }
},

displayPercentages: function(percentages) {

var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

nodeListForEach(fields, function(current, index){

    if (percentages[index] > 0) {
        current.textContent = percentages[index] + '%';
    } else {
        current.textContent = '---';
    } 
});
 
},

displayMonth: function() {
var now, year, month, months;
now = new Date();

months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octomber','November', 'December' ]
month = now.getMonth();
year = now.getFullYear();

document.querySelector(DOMStrings.dateLabel).

textContent = months[month] + ', ' + year;

},



changedType: function() {

    var fields = document.querySelectorAll(
        DOMStrings.inputType + ',' +
        DOMStrings.inputDescription + ',' +
        DOMStrings.inputValue
    );

    nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus');

    }); 
},

getDOMstrings: function() {
        return DOMStrings; 
    }
}

})();

  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







//GLOBAL APP CONTROLLER
var controller = ( function (budgetCtrl, UICtrl) {

    var setUpEventListeners = function() {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
        
        document.addEventListener('keypress', function(event) {
        if (event.keycode === 13 || event.which === 13) {
          ctrlAddItem();
        }
        
        }); 

        document.querySelector(DOM.container).addEventListener('click',  ctrlDelItem)

    };



var updateBudget = function(){

// 1. Calculate the budget
budgetCtrl.calculateBudget();

// 2. Return the budget
var budget = budgetCtrl.getBudget();

// 3. Display the budget on the UI
UICtrl.displayBudget(budget);       

};


var updatePercentages = function() {

    // 1. Calculate Percentages
budgetCtrl.calculatePercentages();
    // 2. Read Percentages form budget controller
var percentages = budgetCtrl.getPercentages();
    // 3. Update the UI with new percentages
UICtrl.displayPercentages(percentages);
    
};    



var ctrlAddItem = function() {
var input, logNewItem
// 1. Get the filed input data 
input = UICtrl.getInput();



if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

    // 2. Add new item to the budget controller 
logNewItem = budgetCtrl.addItem(input.type, input.description, input.value);

// 3. Add the item to the UI
UICtrl.addListItem(logNewItem, input.type)

//4. Clear the fiedls
UICtrl.clearFields();

// 5. Calculate and update budget
updateBudget();

// 6. Calculaate and Update Percentages
updatePercentages();

}

};



var ctrlDelItem = function(event) {
var itemID;

  itemID = event.target.parentNode.parentNode.parentNode.id;
  
  if (itemID) {
    var splitID, type, ID;

    //inc-1 will be the id the itemID will log from the HTML above and we need to split it by using 'split' features which uses a symbol to indicate position to start spliting.


    splitID = itemID.split('-');
    // returns the answer in an array ["inc", "1"]
    type = splitID[0]; // "inc"
    ID = parseInt(splitID[1]);   // 1 instead of "1" due to parseInt conversion

    // 1. Delete the item from data structure
    budgetCtrl.deleteItem(type, ID);

    // 2. Delete the item from the UI
    UICtrl.deleteListItem(itemID);
    
    // 3. Update and show the new budget 
    updateBudget();

    // 4. Calculaate and Update Percentages
    updatePercentages();

  }

}


return {

init: function() {
    console.log('Application has started.');
    UICtrl.displayMonth();

    setUpEventListeners();

    //ClearBudget and Input on the UI
   var clearBudget = budgetCtrl.getBudgetInit();
   UICtrl.displayBudget(clearBudget);
   UICtrl.clearFields();

},

};

})(budgetyController, UIController);


controller.init();
