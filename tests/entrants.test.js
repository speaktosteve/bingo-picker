import { test } from 'node:test';
import assert from 'node:assert/strict';
import { drawWinner, parseEntrants } from '../src/lib/entrants.js';

test('reads CSV names including quoted commas and quotes', () => {
	assert.deepEqual(parseEntrants('number,name\r\n1,"Doe, Jane"\r\n2,"Sam ""Ace"""\r\n'), [
		{ number: '1', name: 'Doe, Jane' },
		{ number: '2', name: 'Sam "Ace"' }
	]);
});

test('rejects invalid CSV and duplicate numbers', () => {
	for (const csv of [
		'name,number\nAlice,1',
		'number,name\n1,Alice\n1,Bob',
		'number,name\n0,Alice',
		'number,name\n1,',
		'number,name\n1,Alice,extra',
		'number,name\n1,"unterminated'
	]) {
		assert.throws(() => parseEntrants(csv));
	}
	assert.deepEqual(parseEntrants('number,name\n'), []);
});

test('draws each number at most once until none remain', () => {
	let remaining = parseEntrants('number,name\n1,Alice\n2,Bob\n3,Carol');
	const winners = [];
	while (remaining.length) {
		const draw = drawWinner(remaining, () => 0.5);
		assert.ok(draw);
		winners.push(draw.winner.number);
		remaining = draw.remaining;
	}
	assert.deepEqual(winners, ['2', '3', '1']);
	assert.equal(drawWinner(remaining), null);
});
