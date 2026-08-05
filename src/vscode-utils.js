const vscode = require("vscode");

export async function uri_exists(uri) {
	try {
		await vscode.workspace.fs.stat(uri);
		return true;
	} catch (stat_error) {
		return false;
	}
}
