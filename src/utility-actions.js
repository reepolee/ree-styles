const vscode = require("vscode");
const { usage_source_glob } = require("./extension-constants.js");
const { discover_target_stylesheet, resolve_cleanup_stylesheet } = require("./stylesheet-discovery.js");
const { find_standalone_class_rules, find_static_class_names, remove_class_rules, text_uses_class_name } = require("./unused-utilities.js");
const { generate_utility_css, normalize_utility_name } = require("./utility-engine.js");

function preview_detail(item_names) {
	const preview_limit = 30;
	const preview_names = item_names.slice(0, preview_limit);
	const remaining_count = item_names.length - preview_names.length;
	const remaining_text = remaining_count > 0 ? `\n...and ${remaining_count} more` : "";
	return `${preview_names.join("\n")}${remaining_text}`;
}

export async function add_utilities_to_target(utility_names, source_uri, css_index, project_state) {
	if (!await project_state.is_enabled_for_uri(source_uri)) {
		vscode.window.showInformationMessage("ree Styles is inactive because this workspace folder uses Tailwind. Set reeStyles.mode to enabled to override detection.");
		return;
	}

	const normalized_names = utility_names.map(normalize_utility_name);
	const unique_names = Array.from(new Set(normalized_names));
	const generated_rules = [];
	let existing_count = 0;
	let unsupported_count = 0;

	for (const utility_name of unique_names) {
		if (css_index.get(utility_name, source_uri).length > 0) {
			existing_count += 1;
			continue;
		}

		const utility_css = await generate_utility_css(utility_name);
		if (!utility_css) {
			unsupported_count += 1;
			continue;
		}
		generated_rules.push(utility_css);
	}

	if (generated_rules.length === 0) {
		vscode.window.showInformationMessage(`No utilities added. ${existing_count} already defined, ${unsupported_count} unsupported.`);
		return;
	}

	const workspace_folder = vscode.workspace.getWorkspaceFolder(source_uri);
	if (!workspace_folder) {
		vscode.window.showWarningMessage("Open a workspace before adding a utility.");
		return;
	}

	const source_document = await vscode.workspace.openTextDocument(source_uri);
	const target_stylesheet = await discover_target_stylesheet(source_document, workspace_folder);
	if (!target_stylesheet) {
		return;
	}

	const target_uri = vscode.Uri.joinPath(workspace_folder.uri, target_stylesheet);
	let existing_css = "";
	try {
		const existing_bytes = await vscode.workspace.fs.readFile(target_uri);
		existing_css = new TextDecoder().decode(existing_bytes);
	} catch (read_error) {
		const parent_segments = target_stylesheet.split("/");
		parent_segments.pop();
		const parent_path = parent_segments.join("/");
		if (parent_path) {
			const parent_uri = vscode.Uri.joinPath(workspace_folder.uri, parent_path);
			await vscode.workspace.fs.createDirectory(parent_uri);
		}
	}

	const separator = existing_css && !existing_css.endsWith("\n") ? "\n\n" : existing_css ? "\n" : "";
	const generated_css = generated_rules.join("\n\n");
	const updated_css = `${existing_css}${separator}${generated_css}\n`;
	await vscode.workspace.fs.writeFile(target_uri, new TextEncoder().encode(updated_css));
	await css_index.refresh();
	vscode.window.showInformationMessage(`Added ${generated_rules.length} utilities to ${target_stylesheet}. ${existing_count} already defined, ${unsupported_count} unsupported.`);
}

export async function remove_all_unused_utilities(source_document, css_index, project_state) {
	const source_uri = source_document.uri;
	if (!await project_state.is_enabled_for_uri(source_uri)) {
		vscode.window.showInformationMessage("ree Styles is inactive because this workspace folder uses Tailwind. Set reeStyles.mode to enabled to override detection.");
		return;
	}

	const workspace_folder = vscode.workspace.getWorkspaceFolder(source_uri);
	if (!workspace_folder) {
		vscode.window.showWarningMessage("Open a workspace before removing unused utilities.");
		return;
	}

	const target_uri = await resolve_cleanup_stylesheet(source_document, workspace_folder);
	if (!target_uri) {
		return;
	}

	const target_bytes = await vscode.workspace.fs.readFile(target_uri);
	const target_css = new TextDecoder().decode(target_bytes);
	const standalone_rules = find_standalone_class_rules(target_css);
	const recognized_rules = [];
	for (const standalone_rule of standalone_rules) {
		if (await generate_utility_css(standalone_rule.class_name)) {
			recognized_rules.push(standalone_rule);
		}
	}

	if (recognized_rules.length === 0) {
		vscode.window.showInformationMessage("No standalone ree Styles utility rules were found.");
		return;
	}

	const css_without_candidates = remove_class_rules(target_css, recognized_rules);
	const used_names = new Set();
	for (const recognized_rule of recognized_rules) {
		if (text_uses_class_name(css_without_candidates, recognized_rule.class_name)) {
			used_names.add(recognized_rule.class_name);
		}
	}

	const configuration = vscode.workspace.getConfiguration("reeStyles", source_uri);
	const usage_pattern = new vscode.RelativePattern(workspace_folder, usage_source_glob);
	const usage_files = await vscode.workspace.findFiles(usage_pattern, configuration.get("exclude"));
	for (const usage_file of usage_files) {
		if (usage_file.toString() === target_uri.toString()) {
			continue;
		}
		const usage_bytes = await vscode.workspace.fs.readFile(usage_file);
		const usage_text = new TextDecoder().decode(usage_bytes);
		for (const recognized_rule of recognized_rules) {
			if (!used_names.has(recognized_rule.class_name) && text_uses_class_name(usage_text, recognized_rule.class_name)) {
				used_names.add(recognized_rule.class_name);
			}
		}
	}

	const unused_rules = recognized_rules.filter((recognized_rule) => !used_names.has(recognized_rule.class_name));
	if (unused_rules.length === 0) {
		vscode.window.showInformationMessage(`All ${recognized_rules.length} recognized utilities are in use.`);
		return;
	}

	const unused_names = unused_rules.map((unused_rule) => unused_rule.class_name);
	unused_names.sort();
	const confirmation = await vscode.window.showWarningMessage(
		`Remove ${unused_rules.length} unused utilities from ${vscode.workspace.asRelativePath(target_uri, false)}?`,
		{ modal: true, detail: preview_detail(unused_names) },
		"Remove Unused Utilities",
	);
	if (confirmation !== "Remove Unused Utilities") {
		return;
	}

	const updated_css = remove_class_rules(target_css, unused_rules);
	await vscode.workspace.fs.writeFile(target_uri, new TextEncoder().encode(updated_css));
	await css_index.refresh();
	vscode.window.showInformationMessage(`Removed ${unused_rules.length} unused utilities from ${vscode.workspace.asRelativePath(target_uri, false)}.`);
}

export async function add_all_undefined_utilities(source_document, css_index, project_state) {
	const source_uri = source_document.uri;
	if (!await project_state.is_enabled_for_uri(source_uri)) {
		vscode.window.showInformationMessage("ree Styles is inactive because this workspace folder uses Tailwind. Set reeStyles.mode to enabled to override detection.");
		return;
	}

	const workspace_folder = vscode.workspace.getWorkspaceFolder(source_uri);
	if (!workspace_folder) {
		vscode.window.showWarningMessage("Open a workspace before adding undefined utilities.");
		return;
	}

	const configuration = vscode.workspace.getConfiguration("reeStyles", source_uri);
	const usage_pattern = new vscode.RelativePattern(workspace_folder, usage_source_glob);
	const usage_files = await vscode.workspace.findFiles(usage_pattern, configuration.get("exclude"));
	const used_class_names = new Set();
	for (const usage_file of usage_files) {
		const usage_bytes = await vscode.workspace.fs.readFile(usage_file);
		const usage_text = new TextDecoder().decode(usage_bytes);
		for (const class_name of find_static_class_names(usage_text)) {
			used_class_names.add(class_name);
		}
	}

	const undefined_names = [];
	for (const class_name of used_class_names) {
		if (css_index.get(class_name, source_uri).length === 0 && await generate_utility_css(class_name)) {
			undefined_names.push(class_name);
		}
	}

	undefined_names.sort();
	if (undefined_names.length === 0) {
		vscode.window.showInformationMessage("No undefined supported utilities were found.");
		return;
	}

	const confirmation = await vscode.window.showInformationMessage(
		`Add ${undefined_names.length} undefined utilities to the project stylesheet?`,
		{ modal: true, detail: preview_detail(undefined_names) },
		"Add Undefined Utilities",
	);
	if (confirmation === "Add Undefined Utilities") {
		await add_utilities_to_target(undefined_names, source_uri, css_index, project_state);
	}
}
