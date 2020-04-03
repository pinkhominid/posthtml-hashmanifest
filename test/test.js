const posthtml = require('posthtml');
const processHashManifest = require('../index.js');

const input = `
  <html>
    <head>
      <link href=base/style1.css>
      <link href=rebased/style2.css>
      <script type=module src=./base/script1.js></script>
      <script type=module src=./rebased/script2.js></script>
    </head>
    <body>
      <img src=base/img1.png>
      <img src=rebased/img2.png>
    </body>
  </html>
`;

const expected = `
  <html>
    <head>
      <link href="base/replaced.css">
      <link href="rebased/replaced.css">
      <script type="module" src="./base/replaced.js"></script>
      <script type="module" src="./rebased/replaced.js"></script>
    </head>
    <body>
      <img src="base/replaced.png">
      <img src="rebased/replaced.png">
    </body>
  </html>
`;

let exitCode = 1; // default fail

posthtml([
  // Test manifest object
  processHashManifest({
    manifest: {
      'base/style1.css': 'base/replaced.css',
      './base/script1.js': './base/replaced.js',
      'base/img1.png': 'base/replaced.png',
    },
  }),

  // Test manifest filepath, and rebasing manifest paths
  processHashManifest({
    manifest: './test/entrypoint.hashmanifest.json',
    rebase: {
      base: 'rebased',
      './base': './rebased',
    },
  }),
])
  .process(input)
  .then((actual) => {
    if (actual.html !== expected) {
      console.error('Actual:', actual.html, 'Expected:', expected, 'FAIL!');
    } else {
      console.info('Acutal:', actual.html, 'Expected:', expected, 'SUCCESS!');
      exitCode = 0;
    }
  })
  .catch((e) => console.error(e))
  .finally(() => process.exit(exitCode));
