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

const border_width_values = ["0", "2", "4", "8"];
const border_width_prefixes = ["border", "border-t", "border-r", "border-b", "border-l", "border-x", "border-y"];
const radius_values = ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "full"];
const radius_prefixes = ["rounded", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"];
const z_index_values = ["0", "10", "20", "30", "40", "50"];
const duration_delay_values = ["75", "100", "150", "200", "300", "500", "700", "1000"];
const grid_count_values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const scale_values = ["0", "50", "75", "90", "95", "100", "105", "110", "125", "150"];
const rotate_values = ["0", "1", "2", "3", "6", "12", "45", "90", "180"];
const skew_values = ["0", "1", "2", "3", "6", "12"];

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
	"transition", "transition-all", "transition-colors", "transition-opacity", "transition-shadow", "transition-transform", "transition-none",
	"ease-linear", "ease-in", "ease-out", "ease-in-out",
	"animate-spin", "animate-ping", "animate-pulse", "animate-bounce", "transform", "transform-none",
	"sr-only", "not-sr-only", "container",
	"border-solid", "border-dashed", "border-dotted", "border-double", "border-hidden", "border-none",
	"object-contain", "object-cover", "object-fill", "object-none", "object-scale-down",
	"aspect-auto", "aspect-square", "aspect-video", "z-auto",
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

	for (const border_width_prefix of border_width_prefixes) {
		for (const border_width_value of border_width_values) {
			utility_names.add(`${border_width_prefix}-${border_width_value}`);
		}
	}

	for (const radius_prefix of radius_prefixes) {
		for (const radius_value of radius_values) {
			utility_names.add(`${radius_prefix}-${radius_value}`);
		}
	}

	for (const z_index_value of z_index_values) {
		utility_names.add(`z-${z_index_value}`);
	}

	for (const duration_delay_value of duration_delay_values) {
		utility_names.add(`duration-${duration_delay_value}`);
		utility_names.add(`delay-${duration_delay_value}`);
	}

	for (const grid_count_value of grid_count_values) {
		utility_names.add(`grid-cols-${grid_count_value}`);
		utility_names.add(`col-span-${grid_count_value}`);
		utility_names.add(`row-span-${grid_count_value}`);
		utility_names.add(`col-start-${grid_count_value}`);
		utility_names.add(`col-end-${grid_count_value}`);
		utility_names.add(`row-start-${grid_count_value}`);
		utility_names.add(`row-end-${grid_count_value}`);
	}
	utility_names.add("col-span-full");
	utility_names.add("row-span-full");

	for (let row_count = 1; row_count <= 6; row_count += 1) {
		utility_names.add(`grid-rows-${row_count}`);
	}

	for (const scale_value of scale_values) {
		utility_names.add(`scale-${scale_value}`);
		utility_names.add(`scale-x-${scale_value}`);
		utility_names.add(`scale-y-${scale_value}`);
	}

	for (const rotate_value of rotate_values) {
		utility_names.add(`rotate-${rotate_value}`);
		utility_names.add(`-rotate-${rotate_value}`);
	}

	for (const skew_value of skew_values) {
		utility_names.add(`skew-x-${skew_value}`);
		utility_names.add(`skew-y-${skew_value}`);
		utility_names.add(`-skew-x-${skew_value}`);
		utility_names.add(`-skew-y-${skew_value}`);
	}

	const catalog = Array.from(utility_names);
	catalog.sort();
	return catalog;
}
