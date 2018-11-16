import $ from 'jquery';
import {parseCode} from './code-analyzer';

const tableStruct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o;} , {}));
const rowItem = tableStruct('Line', 'Type', 'Name', 'Condition', 'Value');
var myRows = [];
const pushFunctions = {
    'Program': ProgramParsing,
    'FunctionDeclaration': FunctionParsing,
    'VariableDeclaration': VariableParsing,
    'ExpressionStatement': ExpressionParsing,
    'WhileStatement': WhileParsing,
    'IfStatement': IfParsing,
    'ReturnStatement': ReturnParsing
};

const returnFunctions = {
    'Identifier': IdentifierParsing,
    'BinaryExpression': BinaryParsing,
    'Literal': LiteralParsing,
    'UnaryExpression': UnaryParsing,
    'MemberExpression': MemberParsing
};

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {

        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        makeRow(parsedCode);
        showTable();
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        myRows = [];
    });
});


function makeRow(parsedCode){
    if (parsedCode.type in pushFunctions)
        pushFunctions[parsedCode.type](parsedCode);
}

function ProgramParsing(parsedCode){
    parsedCode['body'].forEach(body => makeRow(body));
}

function FunctionParsing(parsedCode) {
    myRows.push(rowItem(parsedCode['loc']['start']['line'], 'function declaration',parsedCode['id']['name'], '',''));
    parsedCode['params'].forEach(param => insertParams(param));
    parsedCode['body']['body'].forEach(body=> makeRow(body));
}

function VariableParsing(parsedCode){
    parsedCode['declarations'].forEach(decler => declaration(decler));
}

function declaration(parsedCode){
    var name = parsedCode['id'];
    if(name != null)
        name = returnFunctions[name.type](name);
    var value = parsedCode['init'];
    if(value != null)
        value = returnFunctions[value.type](value);
    myRows.push(rowItem(parsedCode['loc']['start']['line'], 'variable declaration', name, '', value));
}

function ExpressionParsing(parsedCode){
    var left = parsedCode['expression']['left'];
    if(left != null)
        left = returnFunctions[left.type](left);
    var value = parsedCode['expression']['right'];
    if(value != null)
        value = returnFunctions[value.type](value);
    myRows.push(rowItem(parsedCode['loc']['start']['line'], 'assignment expression', left, '', value));
}

function WhileParsing(parsedCode){
    var test = parsedCode['test'];
    if(test != null)
        test = returnFunctions[test.type](test);
    myRows.push(rowItem(parsedCode['loc']['start']['line'], 'while statement', '', test, ''));
    parsedCode['body']['body'].forEach(body => makeRow(body));
}

function IfParsing(parsedCode){
    var test = parsedCode['test'];
    if(test != null)
        test = returnFunctions[test.type](test);
    myRows.push(rowItem(parsedCode['loc']['start']['line'], 'if statement', '', test, ''));
    makeRow(parsedCode['consequent']);
    if(parsedCode['alternate']!=null)
        if(parsedCode['alternate']['type']=== 'IfStatement')
            elseif(parsedCode['alternate']);
        else  makeRow(parsedCode['alternate']);
}

function ReturnParsing(parsedCode){
    var value = parsedCode['argument'];
    if(value != null)
        value = returnFunctions[value.type](value);
    myRows.push(rowItem(parsedCode['loc']['start']['line'], 'return statement', '', '', value));
}

function IdentifierParsing(parsedCode){
    return parsedCode['name'];
}

/**
 * @return {string}
 */
function BinaryParsing(parsedCode){
    var left = returnFunctions[parsedCode['left'].type](parsedCode['left']);
    var oper = parsedCode['operator'];
    var right = returnFunctions[parsedCode['right'].type](parsedCode['right']);
    return ''+ left + ' ' + oper + ' ' + right;
}

function LiteralParsing(parsedCode){
    return parsedCode['value'];
}

/**
 * @return {string}
 */
function UnaryParsing(parsedCode){
    var value = parsedCode['argument'];
    if(value != null)
        value = returnFunctions[value.type](value);
    if(parsedCode['prefix'])
        return parsedCode['operator'] + '' + value;
    else return value;
}

/**
 * @return {string}
 */
function MemberParsing(parsedCode){
    var value = parsedCode['object'];
    if(value != null)
        value = returnFunctions[value.type](value);
    var property = returnFunctions[parsedCode['property'].type](parsedCode['property'])
    return '' + value +'[' + property +']';
}


function insertParams(parsedCodeParam)
{
    myRows.push(rowItem(parsedCodeParam['loc']['start']['line'], 'variable declaration', parsedCodeParam['name'],'','' ));
}

function elseif(parsedCode)
{
    var test = parsedCode['test'];
    if(test != null)
        test = returnFunctions[test.type](test);
    myRows.push(rowItem(parsedCode['loc']['start']['line'], 'else if statement', '', test, ''));
    makeRow(parsedCode['consequent']);
    if(parsedCode['alternate']!=null)
        if(parsedCode['alternate']['type'] === 'IfStatement')
            elseif(parsedCode['alternate']);
        else  makeRow(parsedCode['alternate']);
}

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

export {makeRow, myRows, rowItem};


