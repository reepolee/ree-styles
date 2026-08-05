export function find_html_class_context(line_text, character) {
	const text_before_cursor = line_text.slice(0, character);
	const class_match = text_before_cursor.match(/\bclass\s*=\s*(["'])([^"']*)$/i);
	if (!class_match) {
		return undefined;
	}

	const class_value = class_match[2];
	const whitespace_match = class_value.match(/\s[^\s]*$/);
	const word_offset = whitespace_match ? whitespace_match.index + 1 : 0;
	const typed_text = class_value.slice(word_offset);
	const value_start = text_before_cursor.length - class_value.length;
	return {
		typed_text,
		start_character: value_start + word_offset,
		end_character: character,
	};
}

export function find_html_class_names(document_text, document_offset) {
	const attribute_pattern = /\bclass\s*=\s*(["'])([\s\S]*?)\1/gi;
	let attribute_match = attribute_pattern.exec(document_text);

	while (attribute_match) {
		const class_value = attribute_match[2];
		const full_attribute = attribute_match[0];
		const value_offset = full_attribute.indexOf(class_value);
		const value_start = attribute_match.index + value_offset;
		const value_end = value_start + class_value.length;

		if (document_offset >= value_start && document_offset <= value_end) {
			const class_names = class_value.split(/\s+/);
			return class_names.filter(Boolean);
		}

		attribute_match = attribute_pattern.exec(document_text);
	}

	return [];
}
