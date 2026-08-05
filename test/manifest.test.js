import { describe, expect, test } from "bun:test";
import package_data from "../package.json";

describe("extension manifest", () => {
	test("activates for HTML and Tailwind-associated stylesheets", () => {
		expect(package_data.activationEvents).toContain("onLanguage:html");
		expect(package_data.activationEvents).toContain("onLanguage:tailwindcss");
	});

	test("defaults to automatic project detection", () => {
		const mode_property = package_data.contributes.configuration.properties["reeStyles.mode"];
		expect(mode_property.default).toBe("auto");
	});

	test("contributes both project cleanup commands", () => {
		const command_ids = package_data.contributes.commands.map((command) => command.command);
		expect(command_ids).toContain("reeStyles.removeAllUnusedUtilities");
		expect(command_ids).toContain("reeStyles.addAllUndefinedUtilities");
	});
});
