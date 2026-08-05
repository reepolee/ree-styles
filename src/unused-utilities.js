const standalone_rule_pattern = /(^|\r?\n)[ \t]*\.((?:\\.|[\w-])+)[ \t]*\{[^{}]*\}[ \t]*(?=\r?\n|$)/g;

function unescape_class_name(class_name) {
	return class_name.replace(/\\([!:.[\]\/])/g, "$1");
}

function escape_regular_expression(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function find_standalone_class_rules(css_text) {
	const rules = [];
	let rule_match = standalone_rule_pattern.exec(css_text);

	while (rule_match) {
		const leading_break = rule_match[1];
		const rule_start = rule_match.index + leading_break.length;
		const rule_end = rule_match.index + rule_match[0].length;
		const class_name = unescape_class_name(rule_match[2]);
		rules.push({ class_name, start: rule_start, end: rule_end });
		rule_match = standalone_rule_pattern.exec(css_text);
	}

	return rules;
}

export function text_uses_class_name(source_text, class_name) {
	const escaped_name = escape_regular_expression(class_name);
	const usage_pattern = new RegExp(`(^|[^\\w-])${escaped_name}(?=$|[^\\w-])`);
	return usage_pattern.test(source_text);
}

export function remove_class_rules(css_text, rules) {
	const sorted_rules = [...rules];
	sorted_rules.sort((first_rule, second_rule) => second_rule.start - first_rule.start);
	let updated_css = css_text;

	for (const rule of sorted_rules) {
		updated_css = `${updated_css.slice(0, rule.start)}${updated_css.slice(rule.end)}`;
	}

	const collapsed_css = updated_css.replace(/\n{3,}/g, "\n\n");
	return collapsed_css.trimEnd() + "\n";
}

export function find_static_class_names(source_text) {
	const class_names = new Set();
	const attribute_pattern = /\b(?:class|className|class:list|_default_class)\s*=\s*(?:\{\s*)?(["'])([\s\S]*?)\1(?:\s*\})?/gi;
	let attribute_match = attribute_pattern.exec(source_text);

	while (attribute_match) {
		const attribute_names = attribute_match[2].split(/\s+/);
		for (const attribute_name of attribute_names) {
			if (attribute_name) {
				class_names.add(attribute_name);
			}
		}
		attribute_match = attribute_pattern.exec(source_text);
	}

	const class_list_pattern = /\bclassList\.(?:add|remove|toggle|replace)\s*\(([^)]*)\)/g;
	let class_list_match = class_list_pattern.exec(source_text);

	while (class_list_match) {
		const argument_text = class_list_match[1];
		const string_pattern = /["']([^"']+)["']/g;
		let string_match = string_pattern.exec(argument_text);
		while (string_match) {
			class_names.add(string_match[1]);
			string_match = string_pattern.exec(argument_text);
		}
		class_list_match = class_list_pattern.exec(source_text);
	}

	return Array.from(class_names);
}
