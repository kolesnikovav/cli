// @flow

import {rollup} from 'rollup';
import getGlobals from '../../utils/get-globals';
import buildRollupConfig from '../../utils/build-rollup-config';
import type BundleConfig from '../../@types/config';
import path from 'path';
import { spawn } from 'child_process';
// // alias spawn
const exec = (commands) => {
	console.log({commands})
   const config_file = path.resolve(process.cwd(), 'vue.config.js');
   spawn(commands, { stdio: "inherit", shell: true, env: {...process.env, 'VUE_CLI_SERVICE_CONFIG_PATH':  config_file}} );
};

export default async function rollupBundle(config: BundleConfig, useVite = false) {
	if (useVite) {
		const {input, output} = buildRollupConfig(config);
		console.log('==================== use vite==============');
		console.log({input, output, cwd: process.cwd()});
		exec("vite build -c " + path.join(process.cwd(), 'vite.config.js'));
		return {import:null,bundle: null }



	} else {
		const {input, output} = buildRollupConfig(config);
		const bundle = await rollup(input);
		const globals = getGlobals(bundle.imports, config);
		await bundle.write({...output, globals});
		return {imports: bundle.imports, bundle};		
	}
}