<script lang="ts">
	export let activeLetters: string[] = [];
	export let inactiveLetters: string[] = [];
	export let disabled: boolean = false;
	export let addGuessedLetter: (letter: string) => void;

	const KEYS = [
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z',
	];
</script>

<div class="wrapper">
	{#each KEYS as key}
		{@const isActive = activeLetters.includes(key)}
		{@const isInactive = inactiveLetters.includes(key)}
		<button class="btn" class:active={isActive} class:inactive={isInactive} disabled={isActive || isInactive || disabled} on:click={() => addGuessedLetter(key)}>{key}</button>
	{/each}
</div>

<style>
	.wrapper {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
		gap: 0.5rem;
	}
	.btn {
		width: 100%;
		border: 3px solid black;
        background: none;
		aspect-ratio: 1/1;
		font-size: 2.5rem;
		text-transform: uppercase;
		padding: 0.5rem;
		font-weight: bold;
		color: black;
		cursor: pointer;
	}
	.btn.active {
		background: hsl(200, 100%, 50%);
		color: white;
	}
	.btn.inactive {
		opacity: 0.3;
	}
	.btn:hover:not(:disabled),
	.btn:focus:not(:disabled) {
		background: hsl(200, 100%, 75%);
	}
</style>
