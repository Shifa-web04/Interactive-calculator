const currentOperand = document.getElementById("currentOperand");
const previousOperand = document.getElementById("previousOperand");
const buttons = document.querySelector(".buttons");

const historyList = document.getElementById("historyList");
const clearHistoryButton = document.getElementById("clearHistory");

let currentValue = "0";
let previousValue = "";
let operator = null;
let shouldReset = false;

let calculationHistory = [];

// DISPLAY
function updateDisplay() {
    currentOperand.textContent = currentValue;

    previousOperand.textContent = operator
        ? `${previousValue} ${operator}`
        : "";
}

// NUMBER INPUT
function appendNumber(number) {
    if (currentValue === "Error") currentValue = "0";

    if (shouldReset) {
        currentValue = number;
        shouldReset = false;
        updateDisplay();
        return;
    }

    if (currentValue === "0") {
        currentValue = number;
    } else if (currentValue.length < 15) {
        currentValue += number;
    }

    updateDisplay();
}

// DECIMAL
function appendDecimal() {
    if (currentValue === "Error" || shouldReset) {
        currentValue = "0";
        shouldReset = false;
    }

    if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}

// OPERATORS
function chooseOperator(selectedOperator) {
    if (currentValue === "Error") return;

    if (operator !== null && !shouldReset) {
        calculate();
    }

    previousValue = currentValue;
    operator = selectedOperator;
    shouldReset = true;

    updateDisplay();
}

// CALCULATE
function calculate() {
    if (operator === null || shouldReset) return;

    const first = Number(previousValue);
    const second = Number(currentValue);

    const expression =
        `${previousValue} ${operator} ${currentValue}`;

    let result;

    switch (operator) {
        case "+":
            result = first + second;
            break;

        case "−":
            result = first - second;
            break;

        case "×":
            result = first * second;
            break;

        case "÷":
            result = second === 0 ? "Error" : first / second;
            break;
    }

    if (typeof result === "number") {
        result = Number(result.toPrecision(12));
    }

    currentValue = String(result);

    if (result !== "Error") {
        addToHistory(expression, currentValue);
    }

    previousValue = "";
    operator = null;
    shouldReset = true;

    updateDisplay();
}

// CLEAR CALCULATOR
function clearCalculator() {
    currentValue = "0";
    previousValue = "";
    operator = null;
    shouldReset = false;

    updateDisplay();
}

// DELETE
function deleteNumber() {
    if (currentValue === "Error" || shouldReset) {
        currentValue = "0";
        shouldReset = false;
    } else {
        currentValue = currentValue.slice(0, -1) || "0";
    }

    updateDisplay();
}

// PERCENTAGE
function percentage() {
    if (currentValue === "Error") return;

    currentValue = String(Number(currentValue) / 100);

    updateDisplay();
}

// ADD HISTORY
function addToHistory(expression, result) {
    calculationHistory.unshift({
        expression,
        result
    });

    if (calculationHistory.length > 10) {
        calculationHistory.pop();
    }

    renderHistory();
}

// DISPLAY HISTORY
function renderHistory() {
    historyList.innerHTML = "";

    if (calculationHistory.length === 0) {
        historyList.innerHTML =
            '<p class="empty-history">Your calculations will appear here.</p>';
        return;
    }

    calculationHistory.forEach((item) => {
        const historyItem = document.createElement("div");

        historyItem.className = "history-item";

        const expressionText = document.createElement("span");
        expressionText.textContent = item.expression;

        const resultText = document.createElement("span");
        resultText.textContent = `= ${item.result}`;

        historyItem.append(expressionText, resultText);

        historyList.appendChild(historyItem);
    });
}

// CLEAR HISTORY
clearHistoryButton.addEventListener("click", () => {
    calculationHistory = [];
    renderHistory();
});

// BUTTON EVENTS
buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.number !== undefined) {
        appendNumber(button.dataset.number);
    }

    if (button.dataset.operation) {
        chooseOperator(button.dataset.operation);
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;

        case "delete":
            deleteNumber();
            break;

        case "decimal":
            appendDecimal();
            break;

        case "calculate":
            calculate();
            break;

        case "percent":
            percentage();
            break;
    }
});

// KEYBOARD SUPPORT
document.addEventListener("keydown", (event) => {

    if (event.key >= "0" && event.key <= "9") {
        appendNumber(event.key);
    }

    if (event.key === ".") {
        appendDecimal();
    }

    if (event.key === "+") chooseOperator("+");
    if (event.key === "-") chooseOperator("−");
    if (event.key === "*") chooseOperator("×");

    if (event.key === "/") {
        event.preventDefault();
        chooseOperator("÷");
    }

    if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        calculate();
    }

    if (event.key === "Backspace") {
        deleteNumber();
    }

    if (event.key === "Escape") {
        clearCalculator();
    }
});

// INITIALIZE
updateDisplay();
renderHistory();