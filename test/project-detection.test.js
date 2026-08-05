import { describe, expect, test } from "bun:test";
import { css_uses_tailwind, package_uses_tailwind } from "../src/project-detection.js";

describe("Tailwind project detection", () => {
	test("detects package dependencies", () => {
		const package_text = JSON.stringify({ devDependencies: { tailwindcss: "4.3.3" } });
		expect(package_uses_tailwind(package_text)).toBe(true);
		expect(package_uses_tailwind(JSON.stringify({ dependencies: {} }))).toBe(false);
	});

	test("detects modern and legacy CSS entry points", () => {
		expect(css_uses_tailwind('@import "tailwindcss";')).toBe(true);
		expect(css_uses_tailwind("@tailwind utilities;")).toBe(true);
		expect(css_uses_tailwind("body { margin: 0; }")).toBe(false);
	});
});
