const class_pattern = /\.((?:\\.|[\w-])+)(?=[:\s,{])/g;

function unescape_class_name(class_name) {
	return class_name.replace(/\\([!:.[\]\/])/g, "$1");
}

export function find_css_class_definitions(css_text) {
	const definitions = [];
	let class_match = class_pattern.exec(css_text);

	while (class_match) {
		const raw_name = class_match[1];
		const class_name = unescape_class_name(raw_name);
		const before_match = css_text.slice(0, class_match.index);
		const line_matches = before_match.match(/\n/g);
		const line = line_matches ? line_matches.length : 0;
		definitions.push({ class_name, line, character: class_match.index });
		class_match = class_pattern.exec(css_text);
	}

	return definitions;
}
