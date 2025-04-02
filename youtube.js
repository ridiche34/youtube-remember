// Select the target node to observe (document body to check for element anywhere in the DOM)
const targetNode = document.body;
const config = { childList: true, subtree: true };

let videoElementExists = false;

// Function to handle the presence or absence of the element
function handleVideoElementPresence() {
	const videoElement = document.querySelector('.html5-main-video');

	if (videoElement != videoElementExists && videoElement) {
		videoElementExists = videoElement;
		console.log('Video appeared', videoElement);
		videoElement.addEventListener('pause', () => {
			console.log("Video paused");
			const livebadge = document.getElementsByClassName("ytp-live-badge");
			if (livebadge.length == 0 || window.getComputedStyle(livebadge[0]).display == "none")
			{
				if (window.location.href.includes("youtube.com/watch") ) {
					const url = new URL(window.location.href);
	
					// Set the time parameter (in seconds)
					const yourTimeInSeconds = Math.floor(videoElement.currentTime);
					if (yourTimeInSeconds > 5)
					{
						url.searchParams.set('t', yourTimeInSeconds);
						console.log("New URL for current time:", url);
		
						// Update the page URL without reloading
						window.history.replaceState({}, '', url);
					}
				}
			}
			else
			{
				console.log("Not saving time; Is livestream");
			}
		})
		// Additional actions when the element appears
	} else if (videoElement != videoElementExists) {
		videoElementExists = videoElement;
		console.log('Video disappeared');
		// Additional actions when the element disappears
	}
}

// Create a callback for mutations, only reacting to the appearance/disappearance of the element
const observer = new MutationObserver((mutationsList) => {
	for (let mutation of mutationsList) {
		if (mutation.type === 'childList') {
			handleVideoElementPresence();
		}
	}
});

// Start observing
observer.observe(targetNode, config);

// Initial check in case the element is already present
handleVideoElementPresence();
