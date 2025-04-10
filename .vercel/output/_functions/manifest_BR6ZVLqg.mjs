import 'kleur/colors';
import { h as decodeKey } from './chunks/astro/server_Dyv4Gtcf.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_C389MuJ5.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/TUF%20GAMING/Desktop/Programacion%20de%20tavo/2.Proyectos/Proyectos/Avanti%203.0/Avanti3.0/","cacheDir":"file:///C:/Users/TUF%20GAMING/Desktop/Programacion%20de%20tavo/2.Proyectos/Proyectos/Avanti%203.0/Avanti3.0/node_modules/.astro/","outDir":"file:///C:/Users/TUF%20GAMING/Desktop/Programacion%20de%20tavo/2.Proyectos/Proyectos/Avanti%203.0/Avanti3.0/dist/","srcDir":"file:///C:/Users/TUF%20GAMING/Desktop/Programacion%20de%20tavo/2.Proyectos/Proyectos/Avanti%203.0/Avanti3.0/src/","publicDir":"file:///C:/Users/TUF%20GAMING/Desktop/Programacion%20de%20tavo/2.Proyectos/Proyectos/Avanti%203.0/Avanti3.0/public/","buildClientDir":"file:///C:/Users/TUF%20GAMING/Desktop/Programacion%20de%20tavo/2.Proyectos/Proyectos/Avanti%203.0/Avanti3.0/dist/client/","buildServerDir":"file:///C:/Users/TUF%20GAMING/Desktop/Programacion%20de%20tavo/2.Proyectos/Proyectos/Avanti%203.0/Avanti3.0/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[{"type":"external","src":"/_astro/index.Bw6pFBf-.css"}],"routeData":{"route":"/nuestrosproductos","isIndex":false,"type":"page","pattern":"^\\/nuestrosProductos\\/?$","segments":[[{"content":"nuestrosProductos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/nuestrosProductos.astro","pathname":"/nuestrosProductos","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[{"type":"external","src":"/_astro/index.Bw6pFBf-.css"}],"routeData":{"route":"/pqrs","isIndex":false,"type":"page","pattern":"^\\/pqrs\\/?$","segments":[[{"content":"pqrs","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/pqrs.astro","pathname":"/pqrs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[{"type":"external","src":"/_astro/index.Bw6pFBf-.css"}],"routeData":{"route":"/sobrenosotros","isIndex":false,"type":"page","pattern":"^\\/sobreNosotros\\/?$","segments":[[{"content":"sobreNosotros","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sobreNosotros.astro","pathname":"/sobreNosotros","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[{"type":"external","src":"/_astro/index.Bw6pFBf-.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/TUF GAMING/Desktop/Programacion de tavo/2.Proyectos/Proyectos/Avanti 3.0/Avanti3.0/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/TUF GAMING/Desktop/Programacion de tavo/2.Proyectos/Proyectos/Avanti 3.0/Avanti3.0/src/pages/nuestrosProductos.astro",{"propagation":"none","containsHead":true}],["C:/Users/TUF GAMING/Desktop/Programacion de tavo/2.Proyectos/Proyectos/Avanti 3.0/Avanti3.0/src/pages/pqrs.astro",{"propagation":"none","containsHead":true}],["C:/Users/TUF GAMING/Desktop/Programacion de tavo/2.Proyectos/Proyectos/Avanti 3.0/Avanti3.0/src/pages/sobreNosotros.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/nuestrosProductos@_@astro":"pages/nuestrosproductos.astro.mjs","\u0000@astro-page:src/pages/pqrs@_@astro":"pages/pqrs.astro.mjs","\u0000@astro-page:src/pages/sobreNosotros@_@astro":"pages/sobrenosotros.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","C:/Users/TUF GAMING/Desktop/Programacion de tavo/2.Proyectos/Proyectos/Avanti 3.0/Avanti3.0/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DFw_AFeO.mjs","\u0000@astrojs-manifest":"manifest_BR6ZVLqg.mjs","C:/Users/TUF GAMING/Desktop/Programacion de tavo/2.Proyectos/Proyectos/Avanti 3.0/Avanti3.0/src/components/Header.astro?astro&type=script&index=0&lang.ts":"_astro/Header.astro_astro_type_script_index_0_lang.l0sNRNKZ.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/TUF GAMING/Desktop/Programacion de tavo/2.Proyectos/Proyectos/Avanti 3.0/Avanti3.0/src/components/Header.astro?astro&type=script&index=0&lang.ts",""]],"assets":["/_astro/index.Bw6pFBf-.css","/barco_completo.jpg","/barco_vista_arriba_frente.jpg","/favicon.svg","/Homepage_Split_IMG-2.webp","/Homepage_Split_IMG-3.webp","/logo.jpg","/Trucking-2-3x.webp","/Trucking-3-3x.webp","/js/particles.min.js","/js/particlesjs-config.json"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"QDsu2tp3O5GQn9O3Kl4MyalLoeO1508NzE2OXqmVVqU="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
