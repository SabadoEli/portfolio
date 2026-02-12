function calculate() {
    "use strict";

    // Clear any error or output messages
    document.getElementById("Operand1Error").innerHTML = "";
    document.getElementById("Operand2Error").innerHTML = "";
    document.getElementById("OperatorError").innerHTML = "";
    document.getElementById("Result").innerHTML = "";

    // Error Flag - True if an error has occurred
    let errorflag = false;

    // Get Operand 1 from form
    let operand1 = document.getElementById("Operand1").value;

    // Operand 1 is Required
    if (operand1 == "") {
        document.getElementById("Operand1Error").innerHTML = "Operand 1 is Required";
        errorflag = true;
    }

    // Operand 1 must be a floating point number
    if (isNaN(operand1)) {
        document.getElementById("Operand1Error").innerHTML = "Operand 1 Must be a Floating Point Number";
        errorflag = true;
    }

    // Get Operand 2 from form
    let operand2 = document.getElementById("Operand2").value;

    // Operand 2 is Required
    if (operand2 == "") {
        document.getElementById("Operand2Error").innerHTML = "Operand 2 is Required";
        errorflag = true;
    }

    // Operand 2 must be a floating point number
    if (isNaN(operand2)) {
        document.getElementById("Operand2Error").innerHTML = "Operand 2 Must be a Floating Point Number";
        errorflag = true;
    }

    // At least one operator has to be checked
    if (!document.getElementById("AddOperator").checked && 
        !document.getElementById("SubOperator").checked && 
        !document.getElementById("MulOperator").checked && 
        !document.getElementById("DivOperator").checked) {
            document.getElementById("OperatorError").innerHTML = "Operator is Required";
            errorflag = true;                
    }

    // if there is no error, perform the calculations
    if (!errorflag) {

        // convert the operands from string to floating point
        let operand1fp = parseFloat (operand1);
        let operand2fp = parseFloat (operand2);
        
        // figure out which operator was checked and place the value in operator
        let operator;
        if (document.getElementById("AddOperator").checked) {
            operator = document.getElementById("AddOperator").value;
        }
        if (document.getElementById("SubOperator").checked) {
            operator = document.getElementById("SubOperator").value;
        }
        if (document.getElementById("MulOperator").checked) {
            operator = document.getElementById("MulOperator").value;
        }

        if (document.getElementById("DivOperator").checked) {
            operator = document.getElementById("DivOperator").value;
        }

        // Calculate the answer and put it in result
        let result;
        
        // if the operator was "Min" then set result to the minimum */
        if (operator == "Add") {
            result = operand1fp + operand2fp;
        }

        if (operator == "Sub") {
            result = operand1fp - operand2fp;
        }

        if (operator == "Mul") {
            result = operand1fp * operand2fp;
        }

        if (operator == "Div") {
            result = operand1fp / operand2fp;
        }
        
        /* convert the result to a string and display it */
        document.getElementById("Result").innerHTML = result.toString();
    }
}

function clearform() {
    
    /* Set all of the form values to blank or false */
    document.getElementById("Operand1").value = "";
    document.getElementById("Operand2").value = "";
    document.getElementById("Operand1Error").innerHTML = "";
    document.getElementById("Operand2Error").innerHTML = "";
    document.getElementById("AddOperator").checked = false;
    document.getElementById("SubOperator").checked = false;
    document.getElementById("MulOperator").checked = false;
    document.getElementById("DivOperator").checked = false;
    document.getElementById("OperatorError").innerHTML = "";
    document.getElementById("Result").innerHTML = "";
}