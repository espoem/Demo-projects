<script lang="ts">
	type State = 'ready' | 'ready.countdown' | 'recording';
	type Optional<T> = T | undefined;
	type Props = {
		width?: Optional<number>;
		height?: Optional<number>;
		audio?: boolean;
		frameRate?: Optional<number>;
	};
	let { width, height, audio = true, frameRate = 60 } = $props<Props>();

	let state = $state<State>('ready');
	let recorder: MediaRecorder;
	let stream: MediaStream;
	let videoChunks: Blob[] = [];
	let timerInterval: ReturnType<typeof setInterval>;
	let timer = $state(3);
	const videoMimeType = 'video/webm;codecs=vp9';

	async function startTimer() {
		state = 'ready.countdown';

		return new Promise((resolve) => {
			timerInterval = setInterval(() => {
				timer--;
				if (timer === 0) {
					clearInterval(timerInterval);
					resolve(timer);
				}
			}, 1000);
		});
	}

	function downloadRecording(videoChunks: Blob[]) {
		const blob = new Blob(videoChunks, {
			type: videoMimeType
		});
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'video.webm';
		a.click();
	}

	function startRecording() {
		state = 'recording';
		recorder = new MediaRecorder(stream, {
			mimeType: videoMimeType
		});
		recorder.start();

		recorder.addEventListener('dataavailable', (event) => {
			videoChunks.push(event.data);
		});

		recorder.addEventListener('stop', () => {
			downloadRecording(videoChunks);
			videoChunks = [];
		});
	}

	async function prepareRecording() {
		try {
			stream = await navigator.mediaDevices.getDisplayMedia({
				video: {
					width,
					height,
					frameRate
				},
				audio,
				// @ts-ignore
				preferCurrentTab: true
			});
			stream.addEventListener('inactive', stopRecording);

			await startTimer();
			startRecording();
		} catch (error) {
			console.error(error);
		}
	}

	function stopRecording() {
		state = 'ready';
		stream.getTracks().forEach((track) => track.stop());
		recorder?.stop();
		clearInterval(timerInterval);
		timer = 3;
	}

	function handleKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'R':
				if (state === 'ready') {
					prepareRecording();
				}
				break;
			case 'S':
				if (state !== 'ready') {
					stopRecording();
				}
				break;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if state.startsWith('ready')}
	<div class="recorder" data-state={state}>
		<button onclick={prepareRecording} class="record">
			<div class="circle">
				{#if state === 'ready.countdown'}
					{timer}
				{/if}
			</div>
		</button>

		<div class="info">
			{#if state === 'ready'}
				<p class="shortcut">Shift + R</p>
				<p class="description">To start recording</p>
			{/if}

			{#if state === 'ready.countdown'}
				<p class="shortcut">Shift + S</p>
				<p class="description">To stop recording</p>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	/* the props */
	@import 'https://unpkg.com/open-props';

	/* optional imports that use the props */
	@import 'https://unpkg.com/open-props/normalize.min.css';
	@import 'https://unpkg.com/open-props/buttons.min.css';

	html {
		background-color: var(--gray-10);
	}

	.recorder {
		--text-clr: var(--gray-1);
		--circle-bg-clr: var(--red-8);
		--circle-border-clr: var(--gray-1);

		position: absolute;
		left: 50%;
		bottom: 40px;
		transform: translateX(-50%);
		color: var(--text-clr);
		text-align: center;
		z-index: 10;
	}

	.recorder[data-state='ready.countdown'] {
		& .circle {
			--text-clr: var(--gray-10);
			--circle-bg-clr: var(--gray-1);
		}
	}

	.record {
		width: 80px;
		height: 80px;
		padding: 4px;
		border: 4px solid var(--circle-border-clr);
		border-radius: 50%;
	}

	.circle {
		width: 100%;
		height: 100%;
		display: grid;
		place-content: center;
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-clr);
		background: var(--circle-bg-clr);
		border-radius: 50%;
		transition: background-color 0.6s;

		&:hover {
			--circle-bg-clr: var(--red-7);
		}
	}

	.info {
		margin-block-start: 1rem;

		& .shortcut {
			font-weight: 700;
		}

		& .description {
			margin-block-start: 4px;
			opacity: 0.6;
		}
	}
</style>
