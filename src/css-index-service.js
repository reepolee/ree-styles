const vscode = require("vscode");
const { find_css_class_definitions } = require("./css-index.js");
const { stylesheet_glob } = require("./extension-constants.js");

export class CssIndex {
	constructor(project_state) {
		this.project_state = project_state;
		this.definitions = new Map();
	}

	async refresh() {
		this.definitions.clear();
		const configuration = vscode.workspace.getConfiguration("reeStyles");
		const exclude_pattern = configuration.get("exclude");
		const css_files = await vscode.workspace.findFiles(stylesheet_glob, exclude_pattern);

		for (const css_file of css_files) {
			const is_enabled = await this.project_state.is_enabled_for_uri(css_file);
			if (!is_enabled) {
				continue;
			}

			const file_bytes = await vscode.workspace.fs.readFile(css_file);
			const css_text = new TextDecoder().decode(file_bytes);
			const file_definitions = find_css_class_definitions(css_text);

			for (const file_definition of file_definitions) {
				const locations = this.definitions.get(file_definition.class_name) ?? [];
				const position = new vscode.Position(file_definition.line, 0);
				locations.push(new vscode.Location(css_file, position));
				this.definitions.set(file_definition.class_name, locations);
			}
		}
	}

	get(utility_name, source_uri) {
		const locations = this.definitions.get(utility_name) ?? [];
		const workspace_folder = vscode.workspace.getWorkspaceFolder(source_uri);
		if (!workspace_folder) {
			return locations;
		}

		return locations.filter((location) => vscode.workspace.getWorkspaceFolder(location.uri)?.uri.toString() === workspace_folder.uri.toString());
	}
}
