const vscode = require("vscode");
const { default_exclude_glob, stylesheet_glob } = require("./extension-constants.js");
const { css_uses_tailwind, package_uses_tailwind } = require("./project-detection.js");
const { uri_exists } = require("./vscode-utils.js");

export class ProjectState {
	constructor() {
		this.tailwind_folders = new Map();
	}

	invalidate() {
		this.tailwind_folders.clear();
	}

	async is_enabled_for_uri(uri) {
		const configuration = vscode.workspace.getConfiguration("reeStyles", uri);
		const mode = configuration.get("mode");
		if (mode === "enabled") {
			return true;
		}

		if (mode === "disabled") {
			return false;
		}

		const workspace_folder = vscode.workspace.getWorkspaceFolder(uri);
		if (!workspace_folder) {
			return true;
		}

		const is_tailwind = await this.is_tailwind_folder(workspace_folder);
		return !is_tailwind;
	}

	async is_tailwind_folder(workspace_folder) {
		const cache_key = workspace_folder.uri.toString();
		const cached_value = this.tailwind_folders.get(cache_key);
		if (cached_value !== undefined) {
			return cached_value;
		}

		const detection_promise = this.detect_tailwind_folder(workspace_folder);
		this.tailwind_folders.set(cache_key, detection_promise);
		return detection_promise;
	}

	async detect_tailwind_folder(workspace_folder) {
		const package_uri = vscode.Uri.joinPath(workspace_folder.uri, "package.json");
		if (await uri_exists(package_uri)) {
			const package_bytes = await vscode.workspace.fs.readFile(package_uri);
			const package_text = new TextDecoder().decode(package_bytes);
			if (package_uses_tailwind(package_text)) {
				return true;
			}
		}

		const config_pattern = new vscode.RelativePattern(workspace_folder, "**/tailwind.config.{js,cjs,mjs,ts,cts,mts}");
		const config_files = await vscode.workspace.findFiles(config_pattern, default_exclude_glob, 1);
		if (config_files.length > 0) {
			return true;
		}

		const css_pattern = new vscode.RelativePattern(workspace_folder, stylesheet_glob);
		const css_files = await vscode.workspace.findFiles(css_pattern, default_exclude_glob, 50);
		for (const css_file of css_files) {
			const css_bytes = await vscode.workspace.fs.readFile(css_file);
			const css_text = new TextDecoder().decode(css_bytes);
			if (css_uses_tailwind(css_text)) {
				return true;
			}
		}

		return false;
	}
}
