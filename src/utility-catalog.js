const numeric_values = [
	"0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "5", "6", "7", "8", "9", "10", "11", "12",
	"14", "16", "20", "24", "28", "32", "36", "40", "44", "48", "52", "56", "60", "64", "72", "80", "96",
];

const spacing_prefixes = [
	"m", "mx", "my", "mt", "mr", "mb", "ml", "ms", "me",
	"p", "px", "py", "pt", "pr", "pb", "pl", "ps", "pe",
	"gap", "gap-x", "gap-y", "space-x", "space-y",
	"w", "min-w", "max-w", "h", "min-h", "max-h", "size",
	"top", "right", "bottom", "left", "inset", "inset-x", "inset-y",
	"translate-x", "translate-y", "scroll-m", "scroll-p",
];

import { theme_colors, theme_font_families, theme_font_sizes } from "./generated-theme.js";

const color_prefixes = ["bg", "text", "border", "outline", "ring", "fill", "stroke", "decoration", "accent", "caret"];

const static_utilities = [
	"block", "inline-block", "inline", "flex", "inline-flex", "grid", "inline-grid", "hidden", "contents", "flow-root",
	"static", "fixed", "absolute", "relative", "sticky", "isolate", "isolation-auto",
	"visible", "invisible", "collapse", "box-border", "box-content",
	"flex-row", "flex-row-reverse", "flex-col", "flex-col-reverse", "flex-wrap", "flex-nowrap", "grow", "grow-0", "shrink", "shrink-0",
	"items-start", "items-center", "items-end", "items-baseline", "items-stretch",
	"justify-start", "justify-center", "justify-end", "justify-between", "justify-around", "justify-evenly",
	"self-auto", "self-start", "self-center", "self-end", "self-stretch",
	"overflow-auto", "overflow-hidden", "overflow-clip", "overflow-visible", "overflow-scroll",
	"text-left", "text-center", "text-right", "text-justify", "font-thin", "font-light", "font-normal", "font-medium", "font-semibold", "font-bold", "font-black",
	"italic", "not-italic", "underline", "overline", "line-through", "no-underline", "truncate", "text-ellipsis", "text-clip",
	"whitespace-normal", "whitespace-nowrap", "whitespace-pre", "whitespace-pre-line", "whitespace-pre-wrap", "break-normal", "break-words", "break-all",
	"rounded-none", "rounded-xs", "rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl", "rounded-full",
	"border", "border-0", "border-2", "border-4", "border-8", "shadow-xs", "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl", "shadow-none",
	"opacity-0", "opacity-25", "opacity-50", "opacity-75", "opacity-100", "cursor-auto", "cursor-default", "cursor-pointer", "cursor-wait", "cursor-text", "cursor-not-allowed",
	"select-none", "select-text", "select-all", "select-auto", "pointer-events-none", "pointer-events-auto",
	"transition", "transition-all", "transition-colors", "transition-opacity", "transition-transform", "transition-none",
	"animate-spin", "animate-ping", "animate-pulse", "animate-bounce", "transform", "transform-none",
	"sr-only", "not-sr-only", "container",
];

export function create_utility_catalog() {
	const utility_names = new Set(static_utilities);

	for (const spacing_prefix of spacing_prefixes) {
		for (const numeric_value of numeric_values) {
			utility_names.add(`${spacing_prefix}-${numeric_value}`);
		}
	}

	for (const color_prefix of color_prefixes) {
		utility_names.add(`${color_prefix}-transparent`);
		utility_names.add(`${color_prefix}-current`);
		utility_names.add(`${color_prefix}-black`);
		utility_names.add(`${color_prefix}-white`);

		for (const color_name of Object.keys(theme_colors)) {
			utility_names.add(`${color_prefix}-${color_name}`);
		}
	}

	for (const size_name of Object.keys(theme_font_sizes)) {
		utility_names.add(`text-${size_name}`);
	}

	for (const family_name of Object.keys(theme_font_families)) {
		utility_names.add(`font-${family_name}`);
	}

	const catalog = Array.from(utility_names);
	catalog.sort();
	return catalog;
}
