import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

export default {
	input: "src/index.js",
	output: [
		{ file: "validate.js", format: "cjs", sourcemap: true },
		{ file: "validate.mjs", format: "esm", sourcemap: true }
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