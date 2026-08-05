const build_result = await Bun.build({
	entrypoints: ["src/extension.js"],
	outdir: "dist",
	target: "node",
	format: "cjs",
	minify: false,
	external: ["vscode"],
});

if (!build_result.success) {
	for (const build_log of build_result.logs) {
		console.error(build_log);
	}

	process.exit(1);
}

console.log("Built dist/extension.js");
