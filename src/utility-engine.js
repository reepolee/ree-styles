import { theme_colors, theme_font_families, theme_font_sizes, tailwind_version } from "./generated-theme.js";

const static_declarations = {
	block: "display: block;",
	"inline-block": "display: inline-block;",
	inline: "display: inline;",
	flex: "display: flex;",
	"inline-flex": "display: inline-flex;",
	grid: "display: grid;",
	"inline-grid": "display: inline-grid;",
	hidden: "display: none;",
	contents: "display: contents;",
	"flow-root": "display: flow-root;",
	static: "position: static;",
	fixed: "position: fixed;",
	absolute: "position: absolute;",
	relative: "position: relative;",
	sticky: "position: sticky;",
	visible: "visibility: visible;",
	invisible: "visibility: hidden;",
	"box-border": "box-sizing: border-box;",
	"box-content": "box-sizing: content-box;",
	"flex-row": "flex-direction: row;",
	"flex-row-reverse": "flex-direction: row-reverse;",
	"flex-col": "flex-direction: column;",
	"flex-col-reverse": "flex-direction: column-reverse;",
	"flex-wrap": "flex-wrap: wrap;",
	"flex-nowrap": "flex-wrap: nowrap;",
	grow: "flex-grow: 1;",
	"grow-0": "flex-grow: 0;",
	shrink: "flex-shrink: 1;",
	"shrink-0": "flex-shrink: 0;",
	"items-start": "align-items: flex-start;",
	"items-center": "align-items: center;",
	"items-end": "align-items: flex-end;",
	"items-baseline": "align-items: baseline;",
	"items-stretch": "align-items: stretch;",
	"justify-start": "justify-content: flex-start;",
	"justify-center": "justify-content: center;",
	"justify-end": "justify-content: flex-end;",
	"justify-between": "justify-content: space-between;",
	"justify-around": "justify-content: space-around;",
	"justify-evenly": "justify-content: space-evenly;",
	"overflow-auto": "overflow: auto;",
	"overflow-hidden": "overflow: hidden;",
	"overflow-clip": "overflow: clip;",
	"overflow-visible": "overflow: visible;",
	"overflow-scroll": "overflow: scroll;",
	"text-left": "text-align: left;",
	"text-center": "text-align: center;",
	"text-right": "text-align: right;",
	"text-justify": "text-align: justify;",
	"font-thin": "font-weight: 100;",
	"font-light": "font-weight: 300;",
	"font-normal": "font-weight: 400;",
	"font-medium": "font-weight: 500;",
	"font-semibold": "font-weight: 600;",
	"font-bold": "font-weight: 700;",
	"font-black": "font-weight: 900;",
	italic: "font-style: italic;",
	"not-italic": "font-style: normal;",
	underline: "text-decoration-line: underline;",
	overline: "text-decoration-line: overline;",
	"line-through": "text-decoration-line: line-through;",
	"no-underline": "text-decoration-line: none;",
	"text-ellipsis": "text-overflow: ellipsis;",
	"text-clip": "text-overflow: clip;",
	"whitespace-normal": "white-space: normal;",
	"whitespace-nowrap": "white-space: nowrap;",
	"whitespace-pre": "white-space: pre;",
	"whitespace-pre-line": "white-space: pre-line;",
	"whitespace-pre-wrap": "white-space: pre-wrap;",
	"break-words": "overflow-wrap: break-word;",
	"break-all": "word-break: break-all;",
	"cursor-auto": "cursor: auto;",
	"cursor-default": "cursor: default;",
	"cursor-pointer": "cursor: pointer;",
	"cursor-wait": "cursor: wait;",
	"cursor-text": "cursor: text;",
	"cursor-not-allowed": "cursor: not-allowed;",
	"select-none": "user-select: none;",
	"select-text": "user-select: text;",
	"select-all": "user-select: all;",
	"select-auto": "user-select: auto;",
	"pointer-events-none": "pointer-events: none;",
	"pointer-events-auto": "pointer-events: auto;",
};

const spacing_properties = {
	m: ["margin"], mx: ["margin-inline"], my: ["margin-block"], mt: ["margin-top"], mr: ["margin-right"], mb: ["margin-bottom"], ml: ["margin-left"], ms: ["margin-inline-start"], me: ["margin-inline-end"],
	p: ["padding"], px: ["padding-inline"], py: ["padding-block"], pt: ["padding-top"], pr: ["padding-right"], pb: ["padding-bottom"], pl: ["padding-left"], ps: ["padding-inline-start"], pe: ["padding-inline-end"],
	gap: ["gap"], "gap-x": ["column-gap"], "gap-y": ["row-gap"], w: ["width"], "min-w": ["min-width"], "max-w": ["max-width"], h: ["height"], "min-h": ["min-height"], "max-h": ["max-height"], size: ["width", "height"],
	top: ["top"], right: ["right"], bottom: ["bottom"], left: ["left"], inset: ["inset"], "inset-x": ["inset-inline"], "inset-y": ["inset-block"],
};

const color_properties = {
	bg: "background-color", text: "color", border: "border-color", outline: "outline-color", ring: "--tw-ring-color", fill: "fill", stroke: "stroke", decoration: "text-decoration-color", accent: "accent-color", caret: "caret-color",
};

function escape_selector(utility_name) {
	return utility_name.replace(/([^a-zA-Z0-9_-])/g, "\\$1");
}

function format_rule(utility_name, declarations) {
	const declaration_lines = declarations.map((declaration) => `  ${declaration}`);
	const declaration_text = declaration_lines.join("\n");
	const selector = escape_selector(utility_name);
	return `.${selector} {\n${declaration_text}\n}`;
}

function resolve_arbitrary_value(raw_value) {
	if (!raw_value.startsWith("[") || !raw_value.endsWith("]")) {
		return undefined;
	}

	const inner_value = raw_value.slice(1, -1);
	return inner_value.replaceAll("_", " ");
}

function resolve_declarations(utility_name) {
	const static_declaration = static_declarations[utility_name];
	if (static_declaration) {
		return [static_declaration];
	}

	if (utility_name === "truncate") {
		return ["overflow: hidden;", "text-overflow: ellipsis;", "white-space: nowrap;"];
	}

	if (utility_name.startsWith("text-")) {
		const size_name = utility_name.slice("text-".length);
		const size_definition = theme_font_sizes[size_name];
		if (size_definition) {
			const declarations = [`font-size: ${size_definition.font_size};`];
			if (size_definition.line_height) {
				declarations.push(`line-height: ${size_definition.line_height};`);
			}
			return declarations;
		}
	}

	if (utility_name.startsWith("font-")) {
		const family_name = utility_name.slice("font-".length);
		const font_family = theme_font_families[family_name];
		if (font_family) {
			return [`font-family: ${font_family};`];
		}
	}

	const arbitrary_property_match = utility_name.match(/^\[([a-z-]+):(.+)\]$/);
	if (arbitrary_property_match) {
		const property_name = arbitrary_property_match[1];
		const property_value = arbitrary_property_match[2].replaceAll("_", " ");
		return [`${property_name}: ${property_value};`];
	}

	for (const [spacing_prefix, property_names] of Object.entries(spacing_properties)) {
		const prefix_text = `${spacing_prefix}-`;
		if (!utility_name.startsWith(prefix_text)) {
			continue;
		}

		const raw_value = utility_name.slice(prefix_text.length);
		const arbitrary_value = resolve_arbitrary_value(raw_value);
		const numeric_value = Number(raw_value);
		const css_value = arbitrary_value ?? (Number.isFinite(numeric_value) ? `calc(0.25rem * ${numeric_value})` : undefined);
		if (!css_value) {
			return undefined;
		}

		return property_names.map((property_name) => `${property_name}: ${css_value};`);
	}

	for (const [color_prefix, property_name] of Object.entries(color_properties)) {
		const prefix_text = `${color_prefix}-`;
		if (!utility_name.startsWith(prefix_text)) {
			continue;
		}

		const raw_color = utility_name.slice(prefix_text.length);
		const arbitrary_color = resolve_arbitrary_value(raw_color);
		const named_colors = { transparent: "transparent", current: "currentColor", black: "#000", white: "#fff" };
		const color_value = arbitrary_color ?? named_colors[raw_color] ?? theme_colors[raw_color];
		if (!color_value) {
			return undefined;
		}

		return [`${property_name}: ${color_value};`];
	}

	const opacity_match = utility_name.match(/^opacity-(\d+)$/);
	if (opacity_match) {
		const opacity_value = Number(opacity_match[1]) / 100;
		return [`opacity: ${opacity_value};`];
	}

	return undefined;
}

export function normalize_utility_name(utility_name) {
	const trimmed_name = utility_name.trim();
	return trimmed_name.replace(/^\./, "");
}

export async function generate_utility_css(utility_name) {
	const normalized_name = normalize_utility_name(utility_name);
	const declarations = resolve_declarations(normalized_name);
	if (!declarations) {
		return "";
	}

	return format_rule(normalized_name, declarations);
}

export async function generate_utility_declarations(utility_name) {
	const normalized_name = normalize_utility_name(utility_name);
	const declarations = resolve_declarations(normalized_name);
	if (!declarations) {
		return "";
	}

	return declarations.join("\n");
}

export { tailwind_version };
