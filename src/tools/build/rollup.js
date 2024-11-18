// @flow

import {rollup} from 'rollup';
import { ViteRuntime } from 'vite/runtime';
import getGlobals from '../../utils/get-globals';
import buildRollupConfig from '../../utils/build-rollup-config';
import type BundleConfig from '../../@types/config';

export default async function rollupBundle(config: BundleConfig, useVite = false) {
	if (useVite) {
		const {input, output} = buildRollupConfig(config);
		console.log('==================== use vite==============')
		const bundle = await new ViteRuntime({
			options: {
				config: {
					rollupOp
				}
			}
		}).executeEntrypoint(input);
		const globals = getGlobals(bundle.imports, config);
		await bundle.write({...output, globals});
		return {imports: bundle.imports, bundle};



	} else {
		const {input, output} = buildRollupConfig(config);
		const bundle = await rollup(input);
		const globals = getGlobals(bundle.imports, config);
		await bundle.write({...output, globals});
		return {imports: bundle.imports, bundle};		
	}
}