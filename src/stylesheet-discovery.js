const vscode = require("vscode");
const { stylesheet_conventions, stylesheet_glob, stylesheet_selector } = require("./extension-constants.js");
const { uri_exists } = require("./vscode-utils.js");

function linked_stylesheet_paths(html_text) {
	const stylesheet_paths = [];
	const link_pattern = /<link\b[^>]*\brel=["'][^"']*stylesheet[^"']*["'][^>]*\bhref=["']([^"']+)["'][^>]*>|<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["'][^"']*stylesheet[^"']*["'][^>]*>/gi;
	let link_match = link_pattern.exec(html_text);

	while (link_match) {
		const raw_path = link_match[1] ?? link_match[2];
		const clean_path = raw_path.split(/[?#]/, 1)[0];
		if (clean_path.endsWith(".css") && !/^(?:https?:|data:|\/\/)/i.test(clean_path)) {
			stylesheet_paths.push(clean_path);
		}
		link_match = link_pattern.exec(html_text);
	}

	return stylesheet_paths;
}

export async function discover_target_stylesheet(source_document, workspace_folder) {
	const configuration = vscode.workspace.getConfiguration("reeStyles", source_document.uri);
	const configured_target = configuration.get("targetStylesheet");
	if (configured_target) {
		return configured_target;
	}

	const candidate_paths = [];
	if (source_document.languageId === "html") {
		const html_text = source_document.getText();
		const linked_paths = linked_stylesheet_paths(html_text);
		for (const linked_path of linked_paths) {
			const linked_uri = linked_path.startsWith("/")
				? vscode.Uri.joinPath(workspace_folder.uri, linked_path.slice(1))
				: vscode.Uri.joinPath(source_document.uri, "..", linked_path);
			if (await uri_exists(linked_uri)) {
				candidate_paths.push(vscode.workspace.asRelativePath(linked_uri, false));
			}
		}
	}

	for (const convention_path of stylesheet_conventions) {
		const convention_uri = vscode.Uri.joinPath(workspace_folder.uri, convention_path);
		if (await uri_exists(convention_uri)) {
			candidate_paths.push(convention_path);
		}
	}

	const unique_candidates = Array.from(new Set(candidate_paths));
	if (unique_candidates.length === 1) {
		return unique_candidates[0];
	}

	const css_pattern = new vscode.RelativePattern(workspace_folder, stylesheet_glob);
	const exclude_pattern = configuration.get("exclude");
	const css_files = await vscode.workspace.findFiles(css_pattern, exclude_pattern);
	if (unique_candidates.length === 0 && css_files.length === 1) {
		return vscode.workspace.asRelativePath(css_files[0], false);
	}

	const selectable_paths = unique_candidates.length > 0
		? unique_candidates
		: css_files.map((css_file) => vscode.workspace.asRelativePath(css_file, false));
	let target_stylesheet;

	if (selectable_paths.length > 0) {
		target_stylesheet = await vscode.window.showQuickPick(selectable_paths, {
			placeHolder: "Select the project stylesheet for generated utility definitions",
		});
	} else {
		target_stylesheet = await vscode.window.showInputBox({
			prompt: "Create a project stylesheet for generated utility definitions",
			value: "src/styles/utilities.css",
			validateInput: (input_value) => input_value.endsWith(".css") ? undefined : "Enter a workspace-relative .css path",
		});
	}

	if (!target_stylesheet) {
		return undefined;
	}

	await configuration.update("targetStylesheet", target_stylesheet, vscode.ConfigurationTarget.WorkspaceFolder);
	return target_stylesheet;
}

export async function resolve_cleanup_stylesheet(source_document, workspace_folder) {
	const configuration = vscode.workspace.getConfiguration("reeStyles", source_document.uri);
	const configured_target = configuration.get("targetStylesheet");
	if (configured_target) {
		const configured_uri = vscode.Uri.joinPath(workspace_folder.uri, configured_target);
		if (await uri_exists(configured_uri)) {
			return configured_uri;
		}
	}

	if (stylesheet_selector.some((selector) => selector.language === source_document.languageId)) {
		return source_document.uri;
	}

	const css_pattern = new vscode.RelativePattern(workspace_folder, stylesheet_glob);
	const exclude_pattern = configuration.get("exclude");
	const css_files = await vscode.workspace.findFiles(css_pattern, exclude_pattern);
	if (css_files.length === 0) {
		vscode.window.showInformationMessage("No project stylesheet was found.");
		return undefined;
	}

	if (css_files.length === 1) {
		return css_files[0];
	}

	const stylesheet_items = css_files.map((css_file) => ({ label: vscode.workspace.asRelativePath(css_file, false), uri: css_file }));
	const selected_item = await vscode.window.showQuickPick(stylesheet_items, { placeHolder: "Select the stylesheet to clean" });
	return selected_item?.uri;
}
