<script lang="ts">
	import HangmanDrawing from '$lib/components/HangmanDrawing.svelte';
	import HangmanWord from '$lib/components/HangmanWord.svelte';
	import Keyboard from '$lib/components/Keyboard.svelte';
	import word from '$lib/wordList.json';
	import { onMount } from 'svelte';

	let guessedLetters: string[] = [];
	let wordToGuess: string = getNewWord();
	$: incorrectLetters = guessedLetters.filter((letter) => !wordToGuess.includes(letter));
	$: isLoser = incorrectLetters.length > 5;
	$: isWinner = wordToGuess.split('').every((letter) => guessedLetters.includes(letter));
	$: numberOfGuesses = incorrectLetters.length;

	function getNewWord() {
		return word[Math.floor(Math.random() * word.length)];
	}

	function addGuessedLetter(letter: string): void {
		if (guessedLetters.includes(letter) || isLoser || isWinner) return;

		guessedLetters = [...guessedLetters, letter];
	}

	function restart(e: KeyboardEvent) {
		const key = e.key;

		if (key !== 'Enter') return;

		e.preventDefault();
		wordToGuess = getNewWord();
		guessedLetters = [];
	}

	function guessLetterWithKeyboard(e: KeyboardEvent) {
		const key = e.key;

		if (!key.match(/^[a-z]$/)) return;

		e.preventDefault();
		addGuessedLetter(key);
	}

	onMount(() => {
		document.addEventListener('keypress', guessLetterWithKeyboard);
		document.addEventListener('keypress', restart);

		return () => {
			document.removeEventListener('keypress', guessLetterWithKeyboard);
			document.removeEventListener('keypress', restart);
		};
	});
</script>

<div class="container">
	<div class="result">{isLoser ? 'Loser' : ''}{isWinner ? 'Winner' : ''}</div>
	<HangmanDrawing {numberOfGuesses} />
	<HangmanWord {guessedLetters} {wordToGuess} reveal={isLoser} />
	<div class="keyboard-wrapper">
		<Keyboard
			activeLetters={guessedLetters.filter((letter) => wordToGuess.includes(letter))}
			inactiveLetters={incorrectLetters}
			{addGuessedLetter}
		/>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin: 0 auto;
		align-items: center;
	}
	.keyboard-wrapper {
		align-self: stretch;
	}
	.result {
		font-size: 2rem;
		text-align: center;
	}
</style>
