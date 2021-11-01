import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import vitePluginImp from 'vite-plugin-imp';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		// vitePluginImp({
		// 	libList: [
		// 		{
		// 			libName: 'antd',
		// 			style: (name) => {
		// 				if (name === 'col' || name === 'row') {
		// 					return 'antd/lib/style/index.less';
		// 				}
		// 				return `antd/es/${name}/style/index.less`;
		// 			},
		// 		},
		// 	],
		// }),
	],
	// css: {
	// 	preprocessorOptions: {
	// 		less: {
	// 			javascriptEnabled: true,
	// 		},
	// 	},
	// },
	// build: {
	// 	minify: 'esbuild',
	// },
});
