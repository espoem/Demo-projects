<script lang="ts">
	export let numberOfGuesses: number = 0;
	const hangmanParts = ['head', 'body', 'right-arm', 'left-arm', 'right-leg', 'left-leg'];
	const scaffoldParts = ['part-one', 'part-two', 'part-three', 'part-four'];
</script>

<div class="wrapper">
	<!-- draw person -->
	{#each hangmanParts as part, i}
		{#if i < numberOfGuesses}
			<div class={part} />
		{/if}
	{/each}
	<!-- draw scaffold -->
	{#each scaffoldParts as part, i}
		<div class={part} />
	{/each}
</div>

<style>
	.head {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		border: 10px solid black;
		position: absolute;
		top: 50px;
		right: -30px;
	}
	.body {
		width: 10px;
		height: 100px;
		background: black;
		position: absolute;
		top: 120px;
		right: 0;
	}
	.right-arm {
		width: 100px;
		height: 10px;
		background: black;
		position: absolute;
		top: 150px;
		right: -100px;
		rotate: -30deg;
		transform-origin: left bottom;
	}
	.left-arm {
		width: 100px;
		height: 10px;
		background: black;
		position: absolute;
		top: 150px;
		right: 10px;
		rotate: 30deg;
		transform-origin: right bottom;
	}
	.right-leg {
		width: 100px;
		height: 10px;
		background: black;
		position: absolute;
		top: 210px;
		right: -90px;
		rotate: 60deg;
		transform-origin: left bottom;
	}
	.left-leg {
		width: 100px;
		height: 10px;
		background: black;
		position: absolute;
		top: 210px;
		right: 0;
		rotate: -60deg;
		transform-origin: right bottom;
	}
	.wrapper {
		position: relative;
	}
	.part-one {
		width: 10px;
		height: 50px;
		background: black;
		position: absolute;
		top: 0;
		right: 0;
	}
	.part-two {
		width: 200px;
		height: 10px;
		background: black;
		margin-left: 120px;
	}
	.part-three {
		width: 10px;
		height: 400px;
		background: black;
		margin-left: 120px;
	}
	.part-four {
		height: 10px;
		width: 250px;
		background: black;
	}
</style>
