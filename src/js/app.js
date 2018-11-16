import $ from 'jquery';
import {parseCode} from './code-analyzer';
import  {makeRow, myRows, clearMyRows} from './makeRows';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {

        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        makeRow(parsedCode);
        showTable();
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        clearMyRows();
    });
});




function insertRow(row, table){
    var newRow = table.insertRow();
    newRow.insertCell(0).innerHTML= row['Line'];
    newRow.insertCell(1).innerHTML = row['Type'];
    newRow.insertCell(2).innerHTML = row['Name'];
    newRow.insertCell(3).innerHTML = row['Condition'];
    newRow.insertCell(4).innerHTML = row['Value'];
}

function showTable() {
    var table = document.getElementById('outputTable');
    table.innerHTML ='';
    var row = table.insertRow();
    row.insertCell(0).innerHTML= 'Line';
    row.insertCell(1).innerHTML = 'Type';
    row.insertCell(2).innerHTML = 'Name';
    row.insertCell(3).innerHTML = 'Condition';
    row.insertCell(4).innerHTML = 'Value';
    table.style= 'visibility: visible;width: 80%;';
    myRows.forEach(row => insertRow(row, table));
}


