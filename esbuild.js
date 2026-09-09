const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const isWatch = process.argv.includes('--watch');

const ctx = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  sourcemap: true,
  target: 'node18',
  logLevel: 'info'
};

function copyWebviewAssets() {
  const outDir = path.join(__dirname, 'dist', 'ui');
  fs.mkdirSync(outDir, { recursive: true });
  for (const file of ['sidebar.css', 'sidebar.js']) {
    fs.copyFileSync(path.join(__dirname, 'src', 'ui', file), path.join(outDir, file));
  }
  console.log('Copied webview assets to dist/ui');
}

async function run() {
  copyWebviewAssets();

  if (isWatch) {
    const context = await esbuild.context({
      ...ctx,
      plugins: [
        {
          name: 'copy-webview-assets',
          setup(build) {
            build.onEnd(() => copyWebviewAssets());
          }
        }
      ]
    });
    await context.watch();
    console.log('Watching for changes...');
    return;
  }

  await esbuild.build(ctx);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
