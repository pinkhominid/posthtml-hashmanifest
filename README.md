# posthtml-hashmanifest

_[PostHTML] plugin for rewriting static asset paths given a hash manifest_

The manifest is compatible with the one emitted by tools like [rollup-plugin-entrypoint-hashmanifest] and [hashmark]. Includes an option to rebase the manifest paths before processing.

```sh
npm install -D posthtml-hashmanifest
```

## Usage

entrypoint.hashmanifest.json

```json
{
  "css/style.css": "css/style-d8a08eb5.css",
  "./js/script.js": "./js/script-ae52c04e.js",
  "img/img.png": "img/img-e7a03cbf.png"
}
```

module

```js
import posthtml from 'posthtml'
import processHashManifest from 'posthtml-hashmanifest'

const html = `
<html>
  <style href="css/style.css">
  <script src="./js/script.js"></script>
  <img src="img/img.png">
</html>
`

posthtml([
  .use(processHashManifest())
  .process(html)
  .then(result => console.log(result))
```

output

```sh
<html>
  <style href="css/style-d8a08eb5.css">
  <script src="./js/script-ae52c04e.js"></script>
  <img src="img/img-e7a03cbf.png">
</html>
```

## Options

```js
{
  manifest: './hashmanifest.json',
  rebase: {
    'src': '.'
  }
}
```

- `manifest`: Filepath of manifest to read from. Default `./entrypoint.hashmanifest.json`.
- `rebase`: Optional Object of manifest paths to rebase before processing.

[posthtml]: https://posthtml.org
[rollup-plugin-entrypoint-hashmanifest]: https://www.npmjs.com/package/rollup-plugin-entrypoint-hashmanifest
[hashmark]: https://www.npmjs.com/package/hashmark
