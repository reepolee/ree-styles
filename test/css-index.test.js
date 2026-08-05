import { describe, expect, test } from "bun:test";
import { find_css_class_definitions } from "../src/css-index.js";

describe("CSS class indexing", () => {
	test("finds ordinary and escaped utility selectors", () => {
		const css_text = ".mt-4 { margin-top: 1rem; }\n.hover\\:bg-red-500:hover { color: red; }";
		const definitions = find_css_class_definitions(css_text);
		expect(definitions.map((definition) => definition.class_name)).toEqual(["mt-4", "hover:bg-red-500"]);
		expect(definitions[1].line).toBe(1);
	});

	test("does not treat property values as classes", () => {
		const definitions = find_css_class_definitions("a { opacity: .5; }");
		expect(definitions).toEqual([]);
	});
});
