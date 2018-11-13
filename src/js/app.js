import $ from 'jquery';
import {parseCode} from './code-analyzer';

const tableStruct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o;} , {}));
const rowItem = tableStruct('Line', 'Type', 'Name', 'Condition', 'Value');
var myRows = [];

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
    switch(parsedCode['type']) {
    case 'Program':
        var i;
        for (i = 0; i < parsedCode['body']['length']; i++) {
            makeRow(parsedCode['body'][i]);
        }
        break;
    case 'FunctionDeclaration':
        functionDec(parsedCode);
        break;
    case 'VariableDeclaration':
        for (i = 0; i < parsedCode['declarations']['length']; i++) {
            var value = parsedCode['declarations'][i]['init'];
            if(value != null)
                value = makeRow(value);
            myRows.push(rowItem(parsedCode['loc']['start']['line'], 'variable declaration', parsedCode['declarations'][i]['id']['name'], '', value));
        }
        break;
    case 'ExpressionStatement':
        value = parsedCode['expression']['right'];
        if(value != null)
            value = makeRow(value);
        myRows.push(rowItem(parsedCode['loc']['start']['line'], 'assignment expression', parsedCode['expression']['left']['name'], '', value));
        break;
    case 'Identifier':
        return parsedCode['name'];
    case 'BinaryExpression':
        var left = makeRow(parsedCode['left']);
        var oper = parsedCode['operator'];
        var right = makeRow(parsedCode['right']);
        return ''+ left + ' ' + oper + ' ' + right;
    case 'Literal':
        return parsedCode['value'];
    case 'WhileStatement':
        var test = parsedCode['test'];
        if(test != null)
            test = makeRow(test);
        myRows.push(rowItem(parsedCode['loc']['start']['line'], 'while statement', '', test, ''));
        for (i = 0; i < parsedCode['body']['body']['length']; i++) {
            makeRow(parsedCode['body']['body'][i]);
        }
        break;
    case 'IfStatement':
        test = parsedCode['test'];
        if(test != null)
            test = makeRow(test);
        myRows.push(rowItem(parsedCode['loc']['start']['line'], 'if statement', '', test, ''));
        makeRow(parsedCode['consequent']);
        if(parsedCode['alternate']!=null)
            if(parsedCode['alternate']['type']=== 'IfStatement')
                elseif(parsedCode['alternate']);
            else  makeRow(parsedCode['alternate']);
        break;
    case 'ReturnStatement':
        value = parsedCode['argument'];
        if(value != null)
            value = makeRow(value);
        myRows.push(rowItem(parsedCode['loc']['start']['line'], 'return statement', '', '', value));
        break;
    case 'UnaryExpression':
        value = parsedCode['argument'];
        if(value != null)
            value = makeRow(value);
        if(parsedCode['prefix'])
            return parsedCode['operator'] + '' + value;
        else return value;
    case 'MemberExpression':
        value = parsedCode['object'];
        if(value != null)
            value = makeRow(value);
        var property = makeRow(parsedCode['property']);
        return '' + value +'[' + property +']';
    }


}

function functionDec(parsedCode)
{
    myRows.push(rowItem(parsedCode['loc']['start']['line'], 'function declaration',parsedCode['id']['name'], '',''));

    var i;
    for (i = 0; i < parsedCode['params']['length']; i++) {
        insertParams(parsedCode['params'][i]);
    }

    for (i = 0; i < parsedCode['body']['body']['length']; i++) {
        makeRow(parsedCode['body']['body'][i]);
    }
}

function insertParams(parsedCodeParam)
{
    myRows.push(rowItem(parsedCodeParam['loc']['start']['line'], 'variable declaration', parsedCodeParam['name'],'','' ));
}

function elseif(parsedCode)
{
    var test = parsedCode['test'];
    if(test != null)
        test = makeRow(test);
    myRows.push(rowItem(parsedCode['loc']['start']['line'], 'else if statement', '', test, ''));
    makeRow(parsedCode['consequent']);
    if(parsedCode['alternate']!=null)
        if(parsedCode['alternate']['type'] === 'IfStatement')
            elseif(parsedCode['alternate']);
        else  makeRow(parsedCode['alternate']);
}

function showTable()
{
    var table = document.getElementById('outputTable');
    table.style= 'visibility: visible;width: 80%;';
    var i;
    for (i = 0; i < myRows.length; i++) {
        var row = table.insertRow();
        row.insertCell(0).innerHTML= myRows[i].Line;
        row.insertCell(1).innerHTML = myRows[i]['Type'];
        row.insertCell(2).innerHTML = myRows[i].Name;
        row.insertCell(3).innerHTML = myRows[i]['Condition'];
        row.insertCell(4).innerHTML = myRows[i]['Value'];
    }
}