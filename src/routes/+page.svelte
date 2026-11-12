<script>
	import csv from '#lib/entrants.csv?raw';
	import { drawWinner, parseEntrants } from '#lib/entrants.js';

	function loadEntrants() {
		try {
			return { entrants: parseEntrants(csv), error: '' };
		} catch (cause) {
			return {
				entrants: /** @type {import('#lib/entrants.js').Entrant[]} */ ([]),
				error: cause instanceof Error ? cause.message : 'The CSV could not be loaded.'
			};
		}
	}

	const { entrants, error } = loadEntrants();
	let remaining = $state(entrants);
	/** @type {import('#lib/entrants.js').Entrant[]} */
	let winners = $state([]);

	function pick() {
		const draw = drawWinner(remaining);
		if (draw) {
			remaining = draw.remaining;
			winners = [draw.winner, ...winners];
		}
	}
</script>

<svelte:head>
	<title>Bingo picker</title>
	<meta name="description" content="Pick bingo winners without drawing a number twice." />
</svelte:head>

<main>
	<h1>Bingo picker</h1>
	<p>Pick a random number and its matching name.</p>

	{#if error}
		<p class="notice" role="alert">{error} Check the entrants CSV and redeploy.</p>
	{:else}
		<p>{remaining.length} of {entrants.length} numbers remaining</p>
		<button onclick={pick} disabled={remaining.length === 0}>Pick a winner</button>

		<div aria-live="polite">
			{#if winners.length > 0}
				<h2>Latest winner</h2>
				<p class="winner"><strong>{winners[0].number}</strong> — {winners[0].name}</p>
			{/if}
			{#if remaining.length === 0}
				<p class="notice">{entrants.length === 0 ? 'There are no entrants in the CSV.' : 'All numbers have been picked.'}</p>
			{/if}
		</div>

		{#if winners.length > 1}
			<h2>Previous winners</h2>
			<ol>
				{#each winners.slice(1) as winner}
					<li>{winner.number} — {winner.name}</li>
				{/each}
			</ol>
		{/if}
		<p class="hint">A session lasts until this page is refreshed or closed.</p>
	{/if}
</main>

<style>
	:global(body) {
		margin: 0;
		background: #f5f7fb;
		color: #17233c;
		font-family: system-ui, sans-serif;
		line-height: 1.5;
	}
	main {
		box-sizing: border-box;
		max-width: 42rem;
		margin: 4rem auto;
		padding: 2rem;
	}
	h1 { font-size: 2.5rem; margin-bottom: 0; }
	h2 { font-size: 1.25rem; margin-top: 2rem; }
	button {
		border: 0;
		border-radius: 0.5rem;
		background: #174ab3;
		color: white;
		padding: 0.8rem 1.25rem;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	button:disabled { background: #667085; cursor: not-allowed; }
	.winner { font-size: 1.5rem; overflow-wrap: anywhere; }
	.notice { font-weight: 600; }
	.hint { color: #475467; margin-top: 2rem; }
</style>
