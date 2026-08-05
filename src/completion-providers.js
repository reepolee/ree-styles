const vscode = require("vscode");
const { html_selector, stylesheet_selector, utility_word_pattern } = require("./extension-constants.js");
const { find_html_class_context } = require("./html-class-context.js");
const { generate_utility_css, generate_utility_declarations, normalize_utility_name } = require("./utility-engine.js");

export function get_utility_at_position(document, position) {
	const word_range = document.getWordRangeAtPosition(position, utility_word_pattern);
	if (!word_range) {
		return undefined;
	}
	return normalize_utility_name(document.getText(word_range));
}

function create_completion_item(utility_name, utility_css, locations, source_range, insert_text, command_arguments) {
	const completion_item = new vscode.CompletionItem(utility_name, vscode.CompletionItemKind.Snippet);
	completion_item.range = source_range;
	completion_item.detail = locations.length > 0
		? `Already defined in ${vscode.workspace.asRelativePath(locations[0].uri)}`
		: "Utility is not yet defined in this project";
	completion_item.documentation = new vscode.MarkdownString(`\`\`\`css\n${utility_css}\n\`\`\``);
	completion_item.insertText = new vscode.SnippetString(insert_text);
	if (command_arguments) {
		completion_item.command = { command: "reeStyles.addUtility", title: "Add utility to project CSS", arguments: command_arguments };
	}
	return completion_item;
}

export function register_completion_providers(css_index, project_state, utility_catalog) {
	const stylesheet_provider = vscode.languages.registerCompletionItemProvider(stylesheet_selector, {
		async provideCompletionItems(document, position) {
			if (!await project_state.is_enabled_for_uri(document.uri)) {
				return [];
			}
			const word_range = document.getWordRangeAtPosition(position, utility_word_pattern);
			const typed_text = word_range ? document.getText(word_range) : "";
			if (typed_text.length < 2) {
				return [];
			}
			const matching_names = utility_catalog.filter((utility_name) => utility_name.startsWith(typed_text));
			const completion_items = [];
			for (const utility_name of matching_names.slice(0, 100)) {
				const utility_css = await generate_utility_css(utility_name);
				if (utility_css) {
					const locations = css_index.get(utility_name, document.uri);
					const declarations = await generate_utility_declarations(utility_name);
					completion_items.push(create_completion_item(utility_name, utility_css, locations, word_range, declarations));
				}
			}
			return completion_items;
		},
	}, ":", "-", "[");

	const html_provider = vscode.languages.registerCompletionItemProvider(html_selector, {
		async provideCompletionItems(document, position) {
			if (!await project_state.is_enabled_for_uri(document.uri)) {
				return [];
			}
			const line_text = document.lineAt(position.line).text;
			const class_context = find_html_class_context(line_text, position.character);
			if (!class_context || class_context.typed_text.length < 2) {
				return [];
			}
			const source_range = new vscode.Range(position.line, class_context.start_character, position.line, class_context.end_character);
			const matching_names = utility_catalog.filter((utility_name) => utility_name.startsWith(class_context.typed_text));
			const completion_items = [];
			for (const utility_name of matching_names.slice(0, 100)) {
				const utility_css = await generate_utility_css(utility_name);
				if (utility_css) {
					const locations = css_index.get(utility_name, document.uri);
					const command_arguments = [utility_name, document.uri.toString(), document.offsetAt(position)];
					completion_items.push(create_completion_item(utility_name, utility_css, locations, source_range, utility_name, command_arguments));
				}
			}
			return completion_items;
		},
	}, ":", "-", "[");

	const code_action_provider = vscode.languages.registerCodeActionsProvider(stylesheet_selector, {
		async provideCodeActions(document, range, context) {
			if (context.only && !context.only.contains(vscode.CodeActionKind.QuickFix)) {
				return [];
			}
			if (!await project_state.is_enabled_for_uri(document.uri)) {
				return [];
			}
			const utility_name = get_utility_at_position(document, range.start);
			if (!utility_name || css_index.get(utility_name, document.uri).length > 0 || !await generate_utility_css(utility_name)) {
				return [];
			}
			const action = new vscode.CodeAction(`Add .${utility_name} to project CSS`, vscode.CodeActionKind.QuickFix);
			action.command = { command: "reeStyles.addUtility", title: "Add utility", arguments: [utility_name, document.uri.toString()] };
			return [action];
		},
	});

	return [stylesheet_provider, html_provider, code_action_provider];
}
