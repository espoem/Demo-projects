<script lang="ts">
	export let guessedLetters: string[];
	export let wordToGuess: string;
	export let reveal: boolean = false;
</script>

<div class="wrapper">
	{#each wordToGuess?.split('') as letter, idx (idx)}
		{@const guessed = guessedLetters?.includes(letter)}
		<span class="bottom-border">
			<span class:invisible={!(reveal || guessed)} class:not-guessed={reveal && !guessed}>
				{letter}
			</span>
		</span>
	{/each}
</div>

<style>
	.wrapper {
		display: flex;
		gap: 0.25em;
		font-size: 6rem;
		font-weight: bold;
		font-family: monospace;
		text-transform: uppercase;
		color: black;
	}
	.bottom-border {
		border-bottom: 0.1em solid black;
	}
	.invisible {
		visibility: hidden;
	}
	.not-guessed {
		color: red;
	}
</style>
