import { describe, expect, test } from "bun:test";
import { create_zip } from "../scripts/zip.js";

describe("VSIX ZIP writer", () => {
	test("writes ZIP signatures and filenames", () => {
		const encoder = new TextEncoder();
		const zip_bytes = create_zip([{ path: "extension/package.json", bytes: encoder.encode("{}") }]);
		const data_view = new DataView(zip_bytes.buffer);
		expect(data_view.getUint32(0, true)).toBe(0x04034b50);
		const zip_text = new TextDecoder().decode(zip_bytes);
		expect(zip_text).toContain("extension/package.json");
		const end_offset = zip_bytes.length - 22;
		expect(data_view.getUint32(end_offset, true)).toBe(0x06054b50);
	});
});
