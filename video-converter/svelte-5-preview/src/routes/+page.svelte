<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { confetti } from '@neoconfetti/svelte';
	import { FFmpeg } from '@ffmpeg/ffmpeg';
	import { onMount } from 'svelte';

	type State = 'loading' | 'loaded' | 'convert.start' | 'convert.error' | 'convert.done';

	let state = $state<State>('loading');
	let error = $state('');
	let ffmpeg: FFmpeg;
	let progress = tweened(0);

	async function readFile(file: File): Promise<Uint8Array> {
		return new Promise((resolve) => {
			const fileReader = new FileReader();

			fileReader.onload = () => {
				const { result } = fileReader;
				if (result instanceof ArrayBuffer) {
					resolve(new Uint8Array(result));
				}
			};

			fileReader.onerror = () => {
				error = 'Error reading file';
			};

			fileReader.readAsArrayBuffer(file);
		});
	}

	async function convertVideo(video: File) {
		state = 'convert.start';
		const data = await readFile(video);

		await ffmpeg.writeFile('input.webm', data);
		await ffmpeg.exec(['-i', 'input.webm', 'output.mp4']);

		const output = ffmpeg.readFile('output.mp4');
		state = 'convert.done';

		return output as Promise<Uint8Array>;
	}

	function downloadVideo(data: Uint8Array) {
		const blob = new Blob([data.buffer], { type: 'video/mp4' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'video.mp4';
		a.click();
		URL.revokeObjectURL(url);
	}

	async function handleDrop(event: DragEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		event.preventDefault();
		if (!event.dataTransfer) {
			return;
		}

		if (event.dataTransfer.files.length > 1) {
			error = 'Upload one file';
		}

		if (event.dataTransfer.files[0].type === 'video/webm') {
			error = '';
			const [file] = event.dataTransfer.files;
			const data = await convertVideo(file);

			downloadVideo(data);
		} else {
			error = 'Upload a .webm file';
		}
	}

	async function loadFFmpeg() {
		const baseUrl = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm';

		ffmpeg = new FFmpeg();

		ffmpeg.on('progress', (event) => {
			$progress = event.progress * 100;
		});

		ffmpeg.load({
			coreURL: `${baseUrl}/ffmpeg-core.js`,
			wasmURL: `${baseUrl}/ffmpeg-core.wasm`,
			workerURL: `${baseUrl}/ffmpeg-worker.js`
		});

		state = 'loaded';
	}

	onMount(() => {
		loadFFmpeg();
	});

	$inspect(state);
</script>

<h1 class="title">WebM To MP4 Converter</h1>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	ondrop={handleDrop}
	ondragover={(event) => event.preventDefault()}
	data-state={state}
	class="drop"
>
	{#if state === 'loading'}
		<p in:fade>Loading FFmpeg...</p>
	{/if}

	{#if state === 'loaded'}
		<p in:fade>Drag video here</p>
	{/if}

	{#if state === 'convert.start'}
		<p in:fade>Converting video</p>

		<div class="progress-bar">
			<div class="progress" style:--progress="{$progress}%">
				{$progress.toFixed(0)}%
			</div>
		</div>
	{/if}

	{#if state === 'convert.done'}
		<div use:confetti></div>
		<p in:fade>Done! 🎉</p>
	{/if}

	{#if error}
		<p in:fade class="error">{error}</p>
	{/if}
</div>

<style lang="scss">
	.title {
		text-align: center;
	}

	.drop {
		width: 600px;
		height: 400px;
		display: grid;
		place-content: center;
		margin-block-start: 2rem;
		border: 10px dashed hsl(220 10% 20%);
		border-radius: 8px;

		& p {
			font-size: 2rem;
			text-align: center;

			&.error {
				color: hsl(0 100% 64%);
			}
		}
	}

	.progress-bar {
		--progress-bar-clr: hsl(180 100% 50%);
		--progress-txt-clr: hsl(0 0% 0%);

		width: 300px;
		height: 40px;
		position: relative;
		font-weight: 700;
		background-color: hsl(200 10% 14%);
		border-radius: 8px;

		& .progress {
			width: var(--progress);
			height: 100%;
			position: absolute;
			left: 0px;
			display: grid;
			place-content: center;
			background: var(--progress-bar-clr);
			color: var(--progress-txt-clr);
			border-radius: 8px;
		}
	}
</style>
