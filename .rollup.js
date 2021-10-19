import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

export default {
	input: "src/index.js",
	output: [
		{ file: "validate.min.js", format: "iife", name: "Validate", sourcemap: true },
		{ file: "validate.js", format: "cjs", exports: "default", sourcemap: true },
		{ file: "validate.mjs", format: "esm", exports: "default", sourcemap: true }
	],
	plugins: [
		babel({
			babelHelpers: "bundled", 
			presets: [
				["@babel/preset-env", {modules: false, targets: { node: 6 } }]
			]
		}),
		terser()
	]
};