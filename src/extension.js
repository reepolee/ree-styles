const vscode = require("vscode");
const { register_completion_providers, get_utility_at_position } = require("./completion-providers.js");
const { CssIndex } = require("./css-index-service.js");
const { find_completed_class_word, find_html_class_names } = require("./html-class-context.js");
const { ProjectState } = require("./project-state.js");
const { create_utility_catalog } = require("./utility-catalog.js");
const { add_all_undefined_utilities, add_utilities_to_target, remove_all_unused_utilities } = require("./utility-actions.js");

function active_editor_or_warn(message) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(message);
		return undefined;
	}
	return editor;
}

export async function activate(extension_context) {
	const project_state = new ProjectState();
	const css_index = new CssIndex(project_state);
	await css_index.refresh();
	const utility_catalog = create_utility_catalog();
	const providers = register_completion_providers(css_index, project_state, utility_catalog);

	const add_command = vscode.commands.registerCommand("reeStyles.addUtility", async (provided_name, provided_uri, provided_offset, force_unrecognized) => {
		const editor = vscode.window.activeTextEditor;
		const source_uri = provided_uri ? vscode.Uri.parse(provided_uri) : editor?.document.uri;
		const utility_name = provided_name ?? (editor ? get_utility_at_position(editor.document, editor.selection.active) : undefined);
		if (!utility_name || !source_uri) {
			vscode.window.showWarningMessage("Place the cursor on a supported utility first.");
			return;
		}

		let utility_names = [utility_name];
		if (provided_offset !== undefined) {
			const source_document = await vscode.workspace.openTextDocument(source_uri);
			const attribute_names = find_html_class_names(source_document.getText(), provided_offset);
			if (attribute_names.length > 0) {
				utility_names = attribute_names;
			}
		}
		await add_utilities_to_target(utility_names, source_uri, css_index, project_state, Boolean(force_unrecognized));
	});

	const type_command = vscode.commands.registerTextEditorCommand("type", async (editor, edit_builder, type_args) => {
		const typed_text = type_args?.text;
		if (typed_text !== " " || editor.document.languageId !== "html") {
			await vscode.commands.executeCommand("default:type", type_args);
			return;
		}

		const position = editor.selection.active;
		const line_text = editor.document.lineAt(position.line).text;
		const completed_word = find_completed_class_word(line_text, position.character);
		await vscode.commands.executeCommand("default:type", type_args);

		if (completed_word && await project_state.is_enabled_for_uri(editor.document.uri)) {
			await add_utilities_to_target([completed_word], editor.document.uri, css_index, project_state, true);
		}
	});

	const refresh_command = vscode.commands.registerCommand("reeStyles.refreshIndex", async () => {
		project_state.invalidate();
		await css_index.refresh();
		vscode.window.showInformationMessage("ree Styles CSS index refreshed.");
	});

	const remove_unused_command = vscode.commands.registerCommand("reeStyles.removeAllUnusedUtilities", async () => {
		const editor = active_editor_or_warn("Open a project file before removing unused utilities.");
		if (editor) {
			await remove_all_unused_utilities(editor.document, css_index, project_state);
		}
	});

	const add_undefined_command = vscode.commands.registerCommand("reeStyles.addAllUndefinedUtilities", async () => {
		const editor = active_editor_or_warn("Open a project file before adding undefined utilities.");
		if (editor) {
			await add_all_undefined_utilities(editor.document, css_index, project_state);
		}
	});

	const project_watcher = vscode.workspace.createFileSystemWatcher("**/{package.json,tailwind.config.*,*.css,*.scss,*.less,*.pcss,*.postcss}");
	const refresh_index = async () => {
		project_state.invalidate();
		await css_index.refresh();
	};
	project_watcher.onDidCreate(refresh_index);
	project_watcher.onDidChange(refresh_index);
	project_watcher.onDidDelete(refresh_index);

	extension_context.subscriptions.push(
		...providers,
		add_command,
		type_command,
		refresh_command,
		remove_unused_command,
		add_undefined_command,
		project_watcher,
	);
}

export function deactivate() {}
