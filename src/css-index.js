const class_pattern = /\.((?:\\.|[\w-])+)(?=[:\s,{])/g;
const style_block_pattern = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;

function unescape_class_name(class_name) {
	return class_name.replace(/\\([!:.[\]\/])/g, "$1");
}

function line_at_offset(text, offset) {
	const before_match = text.slice(0, offset);
	const line_matches = before_match.match(/\n/g);
	return line_matches ? line_matches.length : 0;
}

export function find_css_class_definitions(css_text) {
	const definitions = [];
	let class_match = class_pattern.exec(css_text);

	while (class_match) {
		const raw_name = class_match[1];
		const class_name = unescape_class_name(raw_name);
		const line = line_at_offset(css_text, class_match.index);
		definitions.push({ class_name, line, character: class_match.index });
		class_match = class_pattern.exec(css_text);
	}

	return definitions;
}

export function find_html_style_block_definitions(html_text) {
	const definitions = [];
	let style_match = style_block_pattern.exec(html_text);

	while (style_match) {
		const block_text = style_match[1];
		const block_start = style_match.index + style_match[0].indexOf(block_text);
		const block_line_offset = line_at_offset(html_text, block_start);
		const block_definitions = find_css_class_definitions(block_text);

		for (const block_definition of block_definitions) {
			definitions.push({
				class_name: block_definition.class_name,
				line: block_definition.line + block_line_offset,
				character: block_definition.character,
			});
		}

		style_match = style_block_pattern.exec(html_text);
	}

	return definitions;
}
