const SETTINGS_DEFAULTS = {
	enableeverything: true,
	autosaveenabled: false,
	autosaveinterval: 5,
	dontsaveuntil: 15,
	ignorelivestreams: true,
};

function clampNumberBox(element, allowEmpty) {
	if (element.type !== "number") throw new TypeError("clampNumberBox must be called on a number box");
	
	let v = Number(element.value);
	if (element.value === "") v = NaN;
	
	if (isNaN(v)) {
		if (!allowEmpty)
			return element.value = element.min; // I sure do hope I don't add a numberbox which can be negative sometime later or I will regret this
		return Number(element.min);
	}

	if (element.min !== "" && v < Number(element.min)) element.value = element.min;
	if (element.max !== "" && v > Number(element.max)) element.value = element.max;
	return Number(element.value);
}

function getValueAndClamp(element) {
	if (element.type === "checkbox") return element.checked;
	if (element.type === "number") {
		return clampNumberBox(element, true);
	}
	return element.value;
}

function setValue(element, value) {
	if (element.type === "checkbox") element.checked = value;
	else element.value = value;
}

function linkSettings(bindings, onSave) {
	const keys = bindings.map(b => b.key);

	browser.storage.sync.get(keys).then((data) => {
		for (const { key, element } of bindings) {
			setValue(element, data[key] ?? SETTINGS_DEFAULTS[key]);
		}
	});

	function save() {
		const obj = {};
		for (const { key, element } of bindings) {
			obj[key] = getValueAndClamp(element);
		}
		browser.storage.sync.set(obj).then(onSave);
	}

	for (const { element } of bindings) {
		if (element.type === "number") {
			element.addEventListener("input", save);
			element.addEventListener("blur", () => clampNumberBox(element, false));
		} else {
			element.addEventListener("input", save);
		}
	}
}

function loadSettings() {
	return browser.storage.sync.get(Object.keys(SETTINGS_DEFAULTS)).then((data) => {
		const result = {};
		for (const key of Object.keys(SETTINGS_DEFAULTS))
			result[key] = data[key] ?? SETTINGS_DEFAULTS[key];
		return result;
	});
}
