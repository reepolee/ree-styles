export function package_uses_tailwind(package_text) {
	let package_data;

	try {
		package_data = JSON.parse(package_text);
	} catch (parse_error) {
		return false;
	}

	const dependency_groups = [
		package_data.dependencies,
		package_data.devDependencies,
		package_data.peerDependencies,
		package_data.optionalDependencies,
	];

	for (const dependency_group of dependency_groups) {
		if (dependency_group && Object.hasOwn(dependency_group, "tailwindcss")) {
			return true;
		}
	}

	return false;
}

export function css_uses_tailwind(css_text) {
	const import_pattern = /@import\s+["']tailwindcss(?:\/[^"']*)?["']/;
	const legacy_directive_pattern = /@tailwind\s+(?:base|components|utilities)\s*;/;
	const tailwind_directive_pattern = /@(theme|utility|custom-variant|source)\b/;
	return import_pattern.test(css_text) || legacy_directive_pattern.test(css_text) || tailwind_directive_pattern.test(css_text);
}
