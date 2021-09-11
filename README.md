# garreg-mach-library
Repository of Byleth information

For creating a new page, clone "base_page.html" UNLESS it is in a folder (like moves currently), then copy "folder_base.html" so that references to the navbar are correct.

## Developing in TypeScript
To work on the TypeScript/JavaScript side of things, you must set up the most recent LTS version Node. If you've done it right, in your console `node -v` and `npm -v` should both return version numbers. Once you've gotten that set up, you need to run `npm install` in this repo. Lastly, run `npm run build` to build your changes, or `npm run watch` for webpack to stay up to date while you're developing. Making TypeScript/JavaScript changes without running `npm run build` will not result in a change in this repo.

In html files, to access built JavaScript files, you have to reference it in a `<script>` tag with the `src` value referring to the relative path to the JS file. For example, if you have `index.html` at the top level, and a built JavaScript file at `js/dist/index.js`, you'll need to use `<script src="./js/dist/index.js">`.