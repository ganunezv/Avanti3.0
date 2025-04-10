import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_SxbtTemM.mjs';
import { manifest } from './manifest_BR6ZVLqg.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/nuestrosproductos.astro.mjs');
const _page2 = () => import('./pages/pqrs.astro.mjs');
const _page3 = () => import('./pages/sobrenosotros.astro.mjs');
const _page4 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/nuestrosProductos.astro", _page1],
    ["src/pages/pqrs.astro", _page2],
    ["src/pages/sobreNosotros.astro", _page3],
    ["src/pages/index.astro", _page4]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "33bc82b8-c9f3-42d1-b3cb-be73e0d4db11",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
