import { describe, expect, test } from "bun:test";
import { generate_utility_css, generate_utility_css_stub, generate_utility_declarations } from "../src/utility-engine.js";

describe("Tailwind utility generation", () => {
	test("generates spacing utilities", async () => {
		const utility_css = await generate_utility_css("mt-4");
		expect(utility_css).toContain(".mt-4");
		expect(utility_css).toContain("margin-top: calc(0.25rem * 4)");
	});

	test("supports arbitrary values", async () => {
		const utility_css = await generate_utility_css("w-[13px]");
		expect(utility_css).toContain("width: 13px");
	});

	test("rejects unknown utilities", async () => {
		const utility_css = await generate_utility_css("definitely-not-a-tailwind-utility");
		expect(utility_css).toBe("");
	});

	test("generates declarations without a nested selector", async () => {
		const declarations = await generate_utility_declarations("mb-2");
		expect(declarations).toBe("margin-bottom: calc(0.25rem * 2);");
		expect(declarations).not.toContain(".mb-2");
	});

	test("generates font size utilities with their default line height", async () => {
		const declarations = await generate_utility_declarations("text-lg");
		expect(declarations).toBe("font-size: 1.125rem;\nline-height: calc(1.75 / 1.125);");
	});

	test("generates font family utilities", async () => {
		const declarations = await generate_utility_declarations("font-mono");
		expect(declarations).toContain("font-family: ui-monospace");
		expect(declarations).toContain("monospace;");
	});

	test("generates an empty stub rule for unrecognized class names", async () => {
		const utility_css = await generate_utility_css_stub("definitely-not-a-tailwind-utility");
		expect(utility_css).toBe(".definitely-not-a-tailwind-utility {\n\n}");
	});

	test("still generates real declarations in the stub when recognized", async () => {
		const utility_css = await generate_utility_css_stub("mt-4");
		expect(utility_css).toContain("margin-top: calc(0.25rem * 4)");
	});
});
