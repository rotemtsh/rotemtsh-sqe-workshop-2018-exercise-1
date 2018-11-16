import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {makeRow, myRows, rowItem} from '../src/js/app';


describe('The javascript parser for me', () => {
    it('is parsing a simple assignment expression correctly', () => {
        makeRow(parseCode('let a; a=1;'));
        var rows = [];
        rows.push(rowItem(1,'variable declaration','a','','null'));
        rows.push(rowItem(1, 'assignment expression','a','','1'));

        assert.equal(
            JSON.stringify(myRows),
            JSON.stringify(rows)
        );
    });
});
