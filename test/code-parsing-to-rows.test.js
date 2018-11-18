import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {makeRow, myRows, rowItem, clearMyRows} from '../src/js/makeRows';


describe('The javascript parser for assignment', () => {
    it('is parsing a simple assignment expression correctly', () => {
        clearMyRows();
        makeRow(parseCode('param=\'abcd\';'));
        var rows = [];
        rows.push(rowItem(1, 'assignment expression', 'param', '', 'abcd'));
        assert.equal(JSON.stringify(myRows), JSON.stringify(rows));
    });
    it('is parsing an variable declaration and assignment expression correctly', () => {
        clearMyRows();
        makeRow(parseCode('let a; a=1;'));
        var rows = [];
        rows.push(rowItem(1, 'variable declaration', 'a', '', null));
        rows.push(rowItem(1, 'assignment expression', 'a', '', 1));
        assert.equal(JSON.stringify(myRows), JSON.stringify(rows));
    });
}
);

describe('The javascript parser for conditions', () => {
    it('is parsing a if statement correctly', () => {
        clearMyRows();
        makeRow(parseCode('if(a < b)\n' + 'a++;'));
        var rows = [];
        rows.push(rowItem(1, 'if statement', '', 'a < b', ''));
        rows.push(rowItem(2, 'assignment expression', 'a', '', 'a++'));
        assert.equal(JSON.stringify(myRows), JSON.stringify(rows));});
    it('is parsing a else if correctly', () => {
        clearMyRows();
        makeRow(parseCode('if(a < b)\n' +
            'a =1;\n' +
            'else if(a==b)\n' +
            'a=2;'));
        var rows = [];
        rows.push(rowItem(1, 'if statement', '', 'a < b', ''));
        rows.push(rowItem(2, 'assignment expression', 'a', '', 1));
        rows.push(rowItem(3, 'else if statement', '', 'a == b', ''));
        rows.push(rowItem(4, 'assignment expression', 'a', '', 2));
        assert.equal(JSON.stringify(myRows), JSON.stringify(rows));});
    it('is parsing a else correctly', () => {
        clearMyRows();
        makeRow(parseCode('if(a > b)\na=1\nelse\nb=1'));
        var rows = [];
        rows.push(rowItem(1, 'if statement', '', 'a > b', ''));
        rows.push(rowItem(2, 'assignment expression', 'a', '', 1));
        rows.push(rowItem(4, 'assignment expression', 'b', '', 1));
        assert.equal(JSON.stringify(myRows), JSON.stringify(rows));});
    it('is parsing a else if in else if correctly', () => {
        clearMyRows();
        makeRow(parseCode('if(a > b)\na=1\nelse if(a==b)\nb=1\nelse if(a>c)\nc=1'));
        var rows = [];
        rows.push(rowItem(1, 'if statement', '', 'a > b', ''));
        rows.push(rowItem(2, 'assignment expression', 'a', '', 1));
        rows.push(rowItem(3, 'else if statement', '', 'a == b', ''));
        rows.push(rowItem(4, 'assignment expression', 'b', '', 1));
        rows.push(rowItem(5, 'else if statement', '', 'a > c', ''));
        rows.push(rowItem(6, 'assignment expression', 'c', '', 1));
        assert.equal(JSON.stringify(myRows), JSON.stringify(rows));});
});

describe('The javascript parser for loops', () => {
    it('is parsing a while statement correctly', () => {
        clearMyRows();
        makeRow(parseCode('while(a < b)\n b=1;'));
        var rows = [];
        rows.push(rowItem(1,'while statement','' ,'a < b',''));
        rows.push(rowItem(2, 'assignment expression','b','',1));
        assert.equal(JSON.stringify(myRows),JSON.stringify(rows));});
    it('is parsing a for statement correctly', () => {
        clearMyRows();
        makeRow(parseCode('for(a=0; a < b; ++a){\n a=1}'));
        var rows = [];
        rows.push(rowItem(1,'for statement','' ,'a=0;a < b;++a',''));
        rows.push(rowItem(2, 'assignment expression','a','',1));
        assert.equal(JSON.stringify(myRows),JSON.stringify(rows));});
});

describe('The javascript parser for function', () => {
    it('is parsing a function declaration correctly', () => {
        clearMyRows();
        makeRow(parseCode('function myFunc(a){\n' + 'a=1;\n' + '}\n'));
        var rows = [];
        rows.push(rowItem(1,'function declaration','myFunc' ,'',''));
        rows.push(rowItem(1, 'variable declaration','a','',''));
        rows.push(rowItem(2, 'assignment expression','a','',1));
        assert.equal(JSON.stringify(myRows),JSON.stringify(rows));});
    it('is parsing a return statement correctly', () => {
        clearMyRows();
        makeRow(parseCode('function myFunc(a){\nb=1\n return b;}'));
        var rows = [];
        rows.push(rowItem(1,'function declaration','myFunc' ,'',''));
        rows.push(rowItem(1, 'variable declaration','a','',''));
        rows.push(rowItem(2, 'assignment expression','b','',1));
        rows.push(rowItem(3, 'return statement','','','b'));
        assert.equal(JSON.stringify(myRows),JSON.stringify(rows));});
});

describe('The javascript parser for program', () => {
    it('is parsing a function declaration correctly', () => {clearMyRows();
        makeRow(parseCode('function binarySearch(X, V, n){\n let low, high, mid;\n' +
            '       low = 0;\n high = n - 1;\n while (low <= high) {\n mid = (low + high)/2;\n' +
            '        if (X < V[mid])\n high = mid - 1;\n' +
            '        else if (X > V[mid])\n low = mid + 1;\n' +
            '        else\n return mid;\n }\n return -1;\n}'));
        var rows = [];
        rows.push(rowItem(1,'function declaration','binarySearch' ,'',''));
        rows.push(rowItem(1, 'variable declaration','X','',''));
        rows.push(rowItem(1, 'variable declaration','V','',''));
        rows.push(rowItem(1, 'variable declaration','n','',''));
        rows.push(rowItem(2, 'variable declaration','low','',null));
        rows.push(rowItem(2, 'variable declaration','high','',null));
        rows.push(rowItem(2, 'variable declaration','mid','',null));
        rows.push(rowItem(3, 'assignment expression','low','',0));
        rows.push(rowItem(4, 'assignment expression','high','','n - 1'));
        rows.push(rowItem(5,'while statement','' ,'low <= high',''));
        rows.push(rowItem(6, 'assignment expression','mid','','low + high / 2'));
        rows.push(rowItem(7, 'if statement','','X < V[mid]',''));
        rows.push(rowItem(8,'assignment expression','high' ,'','mid - 1'));
        rows.push(rowItem(9, 'else if statement','','X > V[mid]',''));
        rows.push(rowItem(10, 'assignment expression','low','','mid + 1'));
        rows.push(rowItem(12,'return statement','' ,'','mid'));
        rows.push(rowItem(14, 'return statement','','','-1'));
        assert.equal(JSON.stringify(myRows),JSON.stringify(rows));});
});


describe('The javascript parser for program', () => {
    it('is parsing a function declaration correctly', () => {clearMyRows();
        makeRow(parseCode('function myFunc(a, b, c){\n' +
            '        for (let i =0; i< a; i++) {\n if(i>b){\n' +
            '       c++;} \n else if(i < c)\n{ --b; }\n else ++a\n}\n' +
            '        return a + b + c;}'));
        var rows = [];
        rows.push(rowItem(1,'function declaration','myFunc' ,'',''));
        rows.push(rowItem(1, 'variable declaration','a','',''));
        rows.push(rowItem(1, 'variable declaration','b','',''));
        rows.push(rowItem(1, 'variable declaration','c','',''));
        rows.push(rowItem(2, 'for statement','','i=0;i < a;i++',''));
        rows.push(rowItem(3, 'if statement','','i > b',''));
        rows.push(rowItem(4, 'assignment expression','c','','c++'));
        rows.push(rowItem(5, 'else if statement','','i < c',''));
        rows.push(rowItem(6, 'assignment expression','b','','--b'));
        rows.push(rowItem(7,'assignment expression','a' ,'','++a'));
        rows.push(rowItem(9, 'return statement','','','a + b + c'));
        assert.equal(JSON.stringify(myRows),JSON.stringify(rows));});
});
