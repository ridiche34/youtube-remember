document.addEventListener("DOMContentLoaded", function () {
	const message = document.getElementById("message");

	linkSettings([
		{ key: "enableeverything",  element: document.getElementById("enableeverything") },
		{ key: "autosaveenabled",   element: document.getElementById("autosaveenabled") },
		{ key: "autosaveinterval",  element: document.getElementById("autosaveinterval") },
		{ key: "dontsaveuntil",     element: document.getElementById("dontsaveuntil") },
		{ key: "ignorelivestreams", element: document.getElementById("ignorelivestreams") },
	], () => { message.innerHTML = "Reload to see changes"; });
});
