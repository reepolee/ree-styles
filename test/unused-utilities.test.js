import { describe, expect, test } from "bun:test";
import { find_standalone_class_rules, find_static_class_names, remove_class_rules, text_uses_class_name } from "../src/unused-utilities.js";

describe("unused utility cleanup", () => {
	test("finds standalone rules and ignores compound selectors", () => {
		const css_text = ".mt-1 {\n  margin-top: 0.25rem;\n}\n\n.card .px-2 {\n  padding-inline: 0.5rem;\n}\n";
		const rules = find_standalone_class_rules(css_text);
		expect(rules.map((rule) => rule.class_name)).toEqual(["mt-1"]);
	});

	test("matches exact class tokens", () => {
		expect(text_uses_class_name('<div class="mt-1 px-2">', "mt-1")).toBe(true);
		expect(text_uses_class_name('<div class="mt-10">', "mt-1")).toBe(false);
	});

	test("removes selected rules without damaging surrounding CSS", () => {
		const css_text = ".mt-1 {\n  margin-top: 0.25rem;\n}\n\n.px-2 {\n  padding-inline: 0.5rem;\n}\n";
		const rules = find_standalone_class_rules(css_text);
		const updated_css = remove_class_rules(css_text, [rules[0]]);
		expect(updated_css).not.toContain(".mt-1");
		expect(updated_css).toContain(".px-2");
	});

	test("collects static classes across markup and scripts", () => {
		const source_text = `
<div class="mt-1 px-2"></div>
<Component className={'py-2'} />
element.classList.add("mb-4", "flex");
`;
		const class_names = find_static_class_names(source_text);
		expect(class_names).toContain("mt-1");
		expect(class_names).toContain("px-2");
		expect(class_names).toContain("py-2");
		expect(class_names).toContain("mb-4");
		expect(class_names).toContain("flex");
	});
});
