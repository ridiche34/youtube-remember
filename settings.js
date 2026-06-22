export const SETTINGS_DEFAULTS = {
	enableeverything: true,
	autosaveenabled: false,
	autosaveinterval: 5,
	dontsaveuntil: 15,
	ignorelivestreams: true,
};

function getValue(element) {
	if (element.type === "checkbox") return element.checked;
	if (element.type === "number") return Number(element.value);
	return element.value;
}

function setValue(element, value) {
	if (element.type === "checkbox") element.checked = value;
	else element.value = value;
}

function clampElement(element) {
	if (element.type !== "number") return;
	let v = Number(element.value);
	if (element.min !== "" && v < Number(element.min)) v = Number(element.min);
	if (element.max !== "" && v > Number(element.max)) v = Number(element.max);
	element.value = v;
}

export function linkSettings(bindings, onSave) {
	const keys = bindings.map(b => b.key);

	browser.storage.sync.get(keys).then((data) => {
		for (const { key, element } of bindings) {
			setValue(element, data[key] ?? SETTINGS_DEFAULTS[key]);
		}
	});

	function save() {
		const obj = {};
		for (const { key, element } of bindings) {
			clampElement(element);
			obj[key] = getValue(element);
		}
		browser.storage.sync.set(obj).then(onSave);
	}

	for (const { element } of bindings) {
		element.addEventListener("input", save);
		if (element.type === "number")
			element.addEventListener("blur", () => { clampElement(element); save(); });
	}
}

export function loadSettings() {
	return browser.storage.sync.get(Object.keys(SETTINGS_DEFAULTS)).then((data) => {
		const result = {};
		for (const key of Object.keys(SETTINGS_DEFAULTS))
			result[key] = data[key] ?? SETTINGS_DEFAULTS[key];
		return result;
	});
}
