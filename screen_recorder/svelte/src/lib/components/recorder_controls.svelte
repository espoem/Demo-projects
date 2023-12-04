<script lang="ts">
	let mediaStream: MediaStream;
	let settings: MediaTrackSettings;
	let videoEl: HTMLVideoElement;

	async function record() {
		mediaStream = await navigator.mediaDevices.getDisplayMedia({
			video: { frameRate: { ideal: 60 } },
			audio: true,
			// @ts-ignore
			selfBrowserSurface: 'include'
		});

		videoEl.srcObject = mediaStream; // view the stream in the <video> element
		settings = mediaStream.getVideoTracks()[0].getSettings();

		const recorder = new MediaRecorder(mediaStream);
		recorder.addEventListener('dataavailable', (event) => {
			// view the recorded blob in the <video> element
			videoEl.srcObject = null;
			videoEl.src = URL.createObjectURL(event.data);
		});
		recorder.start();
	}

	function stop() {
		mediaStream.getTracks().forEach((track) => track.stop());
	}
</script>

<details class="recorder">
	<summary>Recorder</summary>

	<!-- svelte-ignore a11y-media-has-caption -->
	<video bind:this={videoEl} controls autoplay></video>

	<div class="controls">
		<button onclick={record}>Record</button>
		<button onclick={stop}>Stop</button>
	</div>

	{#if settings}
		<pre>{JSON.stringify(settings, null, 2)}</pre>
	{/if}
</details>

<style lang="scss">
	.recorder {
		position: absolute;
		top: 40px;
		left: 40px;
		padding: 1rem;
		font-family: 'Manrope Variable';
		color: white;
		background-color: hsl(0, 0%, 4%);
		border-radius: 4px;
		user-select: none;
		z-index: 10;

		& video {
			width: 100%;
			height: 400px;
			border-radius: 4px;
			aspect-ratio: 16/9;
		}

		& .controls {
			display: flex;
			gap: 0.5rem;
			margin-block: 1rem;
		}

		& button {
			font-weight: bold;
			color: hsl(0, 0%, 4%);
			background-color: hsl(0, 0%, 98%);
			padding: 1rem;
			border-radius: 8px;
		}

		& pre {
			padding: 1rem;
			color: hsl(0, 0%, 4%);
			background-color: hsl(0, 0%, 98%);
			border-radius: 4px;
		}
	}
</style>
