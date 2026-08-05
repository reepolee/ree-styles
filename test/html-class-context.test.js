import { describe, expect, test } from "bun:test";
import { find_completed_class_word, find_html_class_context, find_html_class_names } from "../src/html-class-context.js";

describe("HTML class completion context", () => {
	test("returns the current class token", () => {
		const line_text = '<div class="card mt-';
		const context = find_html_class_context(line_text, line_text.length);
		expect(context.typed_text).toBe("mt-");
		expect(line_text.slice(context.start_character, context.end_character)).toBe("mt-");
	});

	test("ignores text outside class attributes", () => {
		const line_text = "<div>mt-";
		expect(find_html_class_context(line_text, line_text.length)).toBeUndefined();
	});

	test("collects every class after a completion is accepted", () => {
		const document_text = '<div class="mt-1 px-2 py-2">';
		const document_offset = document_text.indexOf("py-2") + 2;
		expect(find_html_class_names(document_text, document_offset)).toEqual(["mt-1", "px-2", "py-2"]);
	});

	test("supports multiline class attributes", () => {
		const document_text = '<div class="mt-1\n  px-2\n  py-2">';
		const document_offset = document_text.indexOf("py-2") + 2;
		expect(find_html_class_names(document_text, document_offset)).toEqual(["mt-1", "px-2", "py-2"]);
	});
});

describe("find_completed_class_word", () => {
	test("returns the word just before the cursor inside a class attribute", () => {
		const line_text = '<div class="custom-thing';
		expect(find_completed_class_word(line_text, line_text.length)).toBe("custom-thing");
	});

	test("returns undefined outside class attributes", () => {
		const line_text = "<div>custom-thing";
		expect(find_completed_class_word(line_text, line_text.length)).toBeUndefined();
	});

	test("returns undefined when there is no word before the cursor", () => {
		const line_text = '<div class="mt-1 ';
		expect(find_completed_class_word(line_text, line_text.length)).toBeUndefined();
	});
});
