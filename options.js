// yeah I could write this a lot nicer if I tried
document.addEventListener("DOMContentLoaded", function () {
    const enabledcheckbox = document.getElementById("enableeverything");
    const autosavecheckbox = document.getElementById("autosaveenabled");
    const autosaveintervalinput = document.getElementById("autosaveinterval");
    const dontsaveuntilinput = document.getElementById("dontsaveuntil");
    const ignorelivestreamcheckbox = document.getElementById("ignorelivestreams");
    const message = document.getElementById("message");

	function withDefault(value, defaultValue) {
		if (value === null)
			return defaultValue;
		else
			return value;
	}

    // Load settings from storage
    browser.storage.sync.get(["enableeverything", "autosaveenabled", "autosaveinterval",
		"dontsaveuntil", "ignorelivestreams"]).then((data) => {
        enabledcheckbox.checked = withDefault(data.enableeverything, true);
        autosavecheckbox.checked = withDefault(data.autosaveenabled, false);
		autosaveintervalinput.value = withDefault(data.autosaveinterval, 5);
		dontsaveuntilinput.value = withDefault(data.dontsaveuntil, 5);
		ignorelivestreamcheckbox.value = withDefault(data.ignorelivestreams, true);
    });

    enabledcheckbox.addEventListener("input", saveSettings);
    autosavecheckbox.addEventListener("input", saveSettings);
    autosaveintervalinput.addEventListener("input", saveSettings);
    autosaveintervalinput.addEventListener("blur", () => {ensurelimitsarerespected(autosaveintervalinput, true)});
    dontsaveuntilinput.addEventListener("input", saveSettings);
    dontsaveuntilinput.addEventListener("blur", () => {ensurelimitsarerespected(dontsaveuntilinput, true)});
    ignorelivestreamcheckbox.addEventListener("input", saveSettings);
    message.addEventListener("input", saveSettings);

    function ensurelimitsarerespected(numberbox, doifempty) {
        if (numberbox.value === "" && !doifempty)
        {
            return numberbox.min; // i sure do hope i don't add something that can be negative at some point and i get really confused
        }
        if (numberbox.min !== "") {
            if (Number(numberbox.value) < Number(numberbox.min))
                numberbox.value = Number(numberbox.min);
        }
        if (numberbox.max !== "") {
            if (Number(numberbox.value) > Number(numberbox.max))
                numberbox.value = Number(numberbox.max);
        }
        return Number(numberbox.value)
    }

    function saveSettings() {
        browser.storage.sync.set({
            enableeverything: enabledcheckbox.checked,
            autosaveenabled: autosavecheckbox.checked,
            autosaveinterval: ensurelimitsarerespected(autosaveintervalinput, false),
            dontsaveuntil: ensurelimitsarerespected(dontsaveuntilinput, false),
            ignorelivestreams: ignorelivestreamcheckbox.checked,
        }).then(() => {
            message.innerHTML = "Reload to see changes";
        });
    }
});
