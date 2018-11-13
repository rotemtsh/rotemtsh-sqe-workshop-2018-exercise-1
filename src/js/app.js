import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        makeRow(parsedCode)
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});


const tableStruct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o;} , {}));
const rowItem = tableStruct('Line', 'Type', 'Name', 'Condition', 'Value');
var myRows = [];

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
        value = parsedCode['right'];
        if(value != null)
            value = makeRow(value);
        myRows.push(rowItem(parsedCode['loc']['start']['line'], 'assignment expression', parsedCode['left']['name'], '', value));
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
        for (i = 0; i < parsedCode['consequent']['body']['length']; i++) {
            makeRow(parsedCode['consequent']['body'][i]);
        }
        break;
    case 'else if statement':
        break;
    case 'ReturnStatement':
        break;
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