export const stylesheet_selector = [
	{ language: "css" },
	{ language: "scss" },
	{ language: "less" },
	{ language: "tailwindcss" },
];

export const html_selector = [{ language: "html" }];
export const inline_style_target = "__inline_style__";
export const utility_word_pattern = /!?[\w@:[\]./%-]+!?/;
export const stylesheet_glob = "**/*.{css,scss,less,pcss,postcss}";
export const usage_source_glob = "**/*.{html,htm,ree,js,mjs,cjs,jsx,ts,mts,cts,tsx,vue,svelte,astro,php,twig,njk,mustache,css,scss,less,pcss,postcss}";
export const default_exclude_glob = "**/{node_modules,dist,build,.git}/**";
export const stylesheet_conventions = [
	"src/styles.css",
	"src/style.css",
	"src/styles/app.css",
	"src/styles/main.css",
	"public/css/app.css",
	"assets/css/app.css",
];
