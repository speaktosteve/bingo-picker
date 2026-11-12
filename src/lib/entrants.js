import Papa from 'papaparse';

/**
 * @typedef {{number: string, name: string}} Entrant
 * @param {string} csv
 * @returns {Entrant[]}
 */
export function parseEntrants(csv) {
	const result = Papa.parse(csv, { skipEmptyLines: 'greedy' });
	if (result.errors.length) throw new Error('The CSV could not be parsed.');

	const rows = /** @type {string[][]} */ (result.data);
	const header = rows.shift();
	if (!header || header.length !== 2 || header[0].trim().toLowerCase() !== 'number' || header[1].trim().toLowerCase() !== 'name') {
		throw new Error('The CSV must have a number,name header.');
	}

	const numbers = new Set();
	return rows.map((row) => {
		if (row.length !== 2) throw new Error('Every CSV row must contain a number and a name.');
		const number = row[0].trim();
		const name = row[1].trim();
		if (!/^[1-9]\d*$/.test(number) || !name || numbers.has(number)) {
			throw new Error('Each entrant needs a unique positive whole number and a name.');
		}
		numbers.add(number);
		return { number, name };
	});
}

/**
 * @param {Entrant[]} remaining
 * @param {() => number} random
 * @returns {{winner: Entrant, remaining: Entrant[]} | null}
 */
export function drawWinner(remaining, random = Math.random) {
	if (remaining.length === 0) return null;
	const index = Math.floor(random() * remaining.length);
	return {
		winner: remaining[index],
		remaining: [...remaining.slice(0, index), ...remaining.slice(index + 1)]
	};
}
