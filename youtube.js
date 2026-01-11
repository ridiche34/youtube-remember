browser.storage.sync.get(["enableeverything", "autosaveenabled", "autosaveinterval",
		"dontsaveuntil", "ignorelivestreams"]).then((settings) => {
	if (settings.dontsaveuntil === null)
		settings.dontsaveuntil = 5;
	if (settings.enableeverything === false)
		return;

	function updateURLWithTimestamp(videoElement) {
		if (window.location.href.includes("youtube.com/watch") ) {
			const url = new URL(window.location.href);

			// Set the time parameter (in seconds)
			const yourTimeInSeconds = Math.floor(videoElement.currentTime);
			if (yourTimeInSeconds > settings.dontsaveuntil)
			{
				url.searchParams.set('t', yourTimeInSeconds);
				console.log("New URL for current time:", url);

				// Update the page URL without reloading
				window.history.replaceState({}, '', url);
			}
		}
	}

	function tryToSave(videoElement) {
		if (settings.ignorelivestreams === false)
			updateURLWithTimestamp(videoElement);
		else
		{
			const livebadge = document.getElementsByClassName("ytp-live-badge");
			if (livebadge.length == 0 || window.getComputedStyle(livebadge[0]).display == "none")
			{
				updateURLWithTimestamp(videoElement);
			}
			else
			{
				console.debug("Not saving time; Is livestream");
			}
		}
	}

	// Select the target node to observe (document body to check for element anywhere in the DOM)
	const targetNode = document.body;
	const config = { childList: true, subtree: true };

	let videoElementExists = false;
	let autosaveIntervalId = null;

	// Function to handle the presence or absence of the element
	function handleVideoElementPresence() {
		const videoElement = document.querySelector('.html5-main-video');

		if (videoElement != videoElementExists && videoElement) {
			videoElementExists = videoElement;
			console.log('Video appeared', videoElement);
			videoElement.addEventListener('pause', () => {
				tryToSave(videoElement);
			});

			if (settings.autosaveenabled) {
				// delete interval if it already exists
				if (autosaveIntervalId) {
					clearInterval(autosaveIntervalId);
				}
				// make new interval
				setInterval(() => {
					if (!videoElement.paused)
						tryToSave(videoElement);
				}, settings.autosaveinterval*1000);
			}
		} else if (videoElement != videoElementExists) {
			videoElementExists = videoElement;
			console.log('Video disappeared');
			// delete interval
			if (autosaveIntervalId) {
				clearInterval(autosaveIntervalId);
			}
		}
	}

	// Create a callback for mutations, only reacting to the appearance/disappearance of the element
	const observer = new MutationObserver((mutationsList) => {
		for (let mutation of mutationsList) {
			if (mutation.type === 'childList') {
				handleVideoElementPresence();
				break; // avoid running multiple times
			}
		}
	});

	// Start observing
	observer.observe(targetNode, config);

	// Initial check in case the element is already present
	handleVideoElementPresence();
})