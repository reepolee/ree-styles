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
	isolate: "isolation: isolate;",
	"isolation-auto": "isolation: auto;",
	collapse: "visibility: collapse;",
	"self-auto": "align-self: auto;",
	"self-start": "align-self: flex-start;",
	"self-center": "align-self: center;",
	"self-end": "align-self: flex-end;",
	"self-stretch": "align-self: stretch;",
	"break-normal": "overflow-wrap: normal;\n  word-break: normal;",
	"border-solid": "border-style: solid;",
	"border-dashed": "border-style: dashed;",
	"border-dotted": "border-style: dotted;",
	"border-double": "border-style: double;",
	"border-hidden": "border-style: hidden;",
	"border-none": "border-style: none;",
	"shadow-none": "box-shadow: none;",
	transition: "transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;",
	"transition-all": "transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;",
	"transition-colors": "transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;",
	"transition-opacity": "transition-property: opacity;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;",
	"transition-shadow": "transition-property: box-shadow;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;",
	"transition-transform": "transition-property: transform;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;",
	"transition-none": "transition-property: none;",
	"ease-linear": "transition-timing-function: linear;",
	"ease-in": "transition-timing-function: cubic-bezier(0.4, 0, 1, 1);",
	"ease-out": "transition-timing-function: cubic-bezier(0, 0, 0.2, 1);",
	"ease-in-out": "transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);",
	"animate-spin": "animation: spin 1s linear infinite;",
	"animate-ping": "animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;",
	"animate-pulse": "animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;",
	"animate-bounce": "animation: bounce 1s infinite;",
	transform: "transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);",
	"transform-none": "transform: none;",
	"sr-only": "position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;",
	"not-sr-only": "position: static;\n  width: auto;\n  height: auto;\n  padding: 0;\n  margin: 0;\n  overflow: visible;\n  clip: auto;\n  white-space: normal;",
	container: "width: 100%;",
	"object-contain": "object-fit: contain;",
	"object-cover": "object-fit: cover;",
	"object-fill": "object-fit: fill;",
	"object-none": "object-fit: none;",
	"object-scale-down": "object-fit: scale-down;",
	"aspect-auto": "aspect-ratio: auto;",
	"aspect-square": "aspect-ratio: 1 / 1;",
	"aspect-video": "aspect-ratio: 16 / 9;",
	"z-auto": "z-index: auto;",
};

const border_width_properties = {
	border: ["border-width"],
	"border-t": ["border-top-width"],
	"border-r": ["border-right-width"],
	"border-b": ["border-bottom-width"],
	"border-l": ["border-left-width"],
	"border-x": ["border-left-width", "border-right-width"],
	"border-y": ["border-top-width", "border-bottom-width"],
};

const radius_scale = {
	none: "0px", xs: "0.125rem", sm: "0.25rem", md: "0.375rem", lg: "0.5rem", xl: "0.75rem", "2xl": "1rem", "3xl": "1.5rem", full: "9999px",
};

const radius_properties = {
	rounded: ["border-radius"],
	"rounded-t": ["border-top-left-radius", "border-top-right-radius"],
	"rounded-r": ["border-top-right-radius", "border-bottom-right-radius"],
	"rounded-b": ["border-bottom-right-radius", "border-bottom-left-radius"],
	"rounded-l": ["border-top-left-radius", "border-bottom-left-radius"],
	"rounded-tl": ["border-top-left-radius"],
	"rounded-tr": ["border-top-right-radius"],
	"rounded-br": ["border-bottom-right-radius"],
	"rounded-bl": ["border-bottom-left-radius"],
};

const shadow_scale = {
	xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
	sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
	md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
	lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
	xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
	"2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
	inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
};

const duration_delay_properties = {
	duration: "transition-duration",
	delay: "transition-delay",
};

const grid_span_properties = {
	col: "grid-column",
	row: "grid-row",
};

const grid_line_properties = {
	"col-start": "grid-column-start",
	"col-end": "grid-column-end",
	"row-start": "grid-row-start",
	"row-end": "grid-row-end",
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

	if (utility_name === "border") {
		return ["border-width: 1px;"];
	}

	for (const [border_prefix, property_names] of Object.entries(border_width_properties)) {
		const prefix_text = `${border_prefix}-`;
		if (!utility_name.startsWith(prefix_text)) {
			continue;
		}

		const raw_value = utility_name.slice(prefix_text.length);
		const arbitrary_value = resolve_arbitrary_value(raw_value);
		const numeric_value = Number(raw_value);
		if (!arbitrary_value && !/^\d+(\.\d+)?$/.test(raw_value)) {
			continue;
		}

		const css_value = arbitrary_value ?? `${numeric_value}px`;
		return property_names.map((property_name) => `${property_name}: ${css_value};`);
	}

	if (utility_name === "rounded") {
		return ["border-radius: 0.25rem;"];
	}

	const radius_entries = Object.entries(radius_properties).sort((first_entry, second_entry) => second_entry[0].length - first_entry[0].length);
	for (const [radius_prefix, property_names] of radius_entries) {
		const prefix_text = `${radius_prefix}-`;
		if (!utility_name.startsWith(prefix_text)) {
			continue;
		}

		const raw_value = utility_name.slice(prefix_text.length);
		const arbitrary_value = resolve_arbitrary_value(raw_value);
		const css_value = arbitrary_value ?? radius_scale[raw_value];
		if (!css_value) {
			continue;
		}

		return property_names.map((property_name) => `${property_name}: ${css_value};`);
	}

	if (utility_name === "shadow") {
		return [`box-shadow: ${shadow_scale.sm};`];
	}

	if (utility_name.startsWith("shadow-")) {
		const shadow_name = utility_name.slice("shadow-".length);
		const arbitrary_value = resolve_arbitrary_value(shadow_name);
		const shadow_value = arbitrary_value ?? shadow_scale[shadow_name];
		if (shadow_value) {
			return [`box-shadow: ${shadow_value};`];
		}
	}

	const z_index_match = utility_name.match(/^z-(\d+)$/);
	if (z_index_match) {
		return [`z-index: ${z_index_match[1]};`];
	}

	for (const [duration_prefix, property_name] of Object.entries(duration_delay_properties)) {
		const prefix_text = `${duration_prefix}-`;
		if (!utility_name.startsWith(prefix_text)) {
			continue;
		}

		const raw_value = utility_name.slice(prefix_text.length);
		if (!/^\d+$/.test(raw_value)) {
			return undefined;
		}

		return [`${property_name}: ${raw_value}ms;`];
	}

	const grid_cols_match = utility_name.match(/^grid-cols-(\d+)$/);
	if (grid_cols_match) {
		return [`grid-template-columns: repeat(${grid_cols_match[1]}, minmax(0, 1fr));`];
	}

	const grid_rows_match = utility_name.match(/^grid-rows-(\d+)$/);
	if (grid_rows_match) {
		return [`grid-template-rows: repeat(${grid_rows_match[1]}, minmax(0, 1fr));`];
	}

	for (const [span_prefix, property_name] of Object.entries(grid_span_properties)) {
		const prefix_text = `${span_prefix}-span-`;
		if (!utility_name.startsWith(prefix_text)) {
			continue;
		}

		const raw_value = utility_name.slice(prefix_text.length);
		if (raw_value === "full") {
			return [`${property_name}: 1 / -1;`];
		}

		if (/^\d+$/.test(raw_value)) {
			return [`${property_name}: span ${raw_value} / span ${raw_value};`];
		}

		return undefined;
	}

	for (const [line_prefix, property_name] of Object.entries(grid_line_properties)) {
		const prefix_text = `${line_prefix}-`;
		if (!utility_name.startsWith(prefix_text)) {
			continue;
		}

		const raw_value = utility_name.slice(prefix_text.length);
		if (raw_value === "auto") {
			return [`${property_name}: auto;`];
		}

		if (/^\d+$/.test(raw_value)) {
			return [`${property_name}: ${raw_value};`];
		}

		return undefined;
	}

	const scale_match = utility_name.match(/^scale(-x|-y)?-(\d+)$/);
	if (scale_match) {
		const axis_suffix = scale_match[1];
		const scale_value = Number(scale_match[2]) / 100;
		if (axis_suffix === "-x") {
			return [`transform: scaleX(${scale_value});`];
		}
		if (axis_suffix === "-y") {
			return [`transform: scaleY(${scale_value});`];
		}
		return [`transform: scale(${scale_value});`];
	}

	const rotate_match = utility_name.match(/^-?rotate-(\d+)$/);
	if (rotate_match) {
		const rotate_sign = utility_name.startsWith("-") ? "-" : "";
		return [`transform: rotate(${rotate_sign}${rotate_match[1]}deg);`];
	}

	const skew_match = utility_name.match(/^-?skew-(x|y)-(\d+)$/);
	if (skew_match) {
		const skew_sign = utility_name.startsWith("-") ? "-" : "";
		const skew_axis = skew_match[1] === "x" ? "skewX" : "skewY";
		return [`transform: ${skew_axis}(${skew_sign}${skew_match[2]}deg);`];
	}

	const translate_match = utility_name.match(/^-?translate-(x|y)-(.+)$/);
	if (translate_match) {
		const translate_sign = utility_name.startsWith("-") ? "-" : "";
		const translate_axis = translate_match[1] === "x" ? "X" : "Y";
		const raw_value = translate_match[2];
		const arbitrary_value = resolve_arbitrary_value(raw_value);
		const numeric_value = Number(raw_value);
		const css_value = arbitrary_value ?? (Number.isFinite(numeric_value) ? `calc(0.25rem * ${numeric_value})` : undefined);
		if (!css_value) {
			return undefined;
		}

		return [`transform: translate${translate_axis}(${translate_sign}${css_value});`];
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

export async function generate_utility_css_stub(utility_name) {
	const normalized_name = normalize_utility_name(utility_name);
	const declarations = resolve_declarations(normalized_name);
	return format_rule(normalized_name, declarations ?? []);
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
