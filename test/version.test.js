import { describe, expect, test } from "bun:test";
import { increment_patch_version } from "../scripts/version.js";

describe("package version", () => {
	test("increments the patch component", () => {
		expect(increment_patch_version("0.1.0")).toBe("0.1.1");
		expect(increment_patch_version("2.9.99")).toBe("2.9.100");
	});

	test("rejects versions that cannot be safely incremented", () => {
		expect(() => increment_patch_version("1.0.0-beta.1")).toThrow();
	});
});
