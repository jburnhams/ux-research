// Stylesheets imported for their side effect (fonts, globals). TypeScript 7 checks side-effect
// imports (noUncheckedSideEffectImports is on by default), and a .css file has no types of its own.
declare module "*.css";
