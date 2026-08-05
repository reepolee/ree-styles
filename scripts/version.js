export function increment_patch_version(version) {
	const version_match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
	if (!version_match) {
		throw new Error(`Cannot increment non-standard version: ${version}`);
	}

	const major_version = Number(version_match[1]);
	const minor_version = Number(version_match[2]);
	const patch_version = Number(version_match[3]) + 1;
	return `${major_version}.${minor_version}.${patch_version}`;
}
