import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_Dyv4Gtcf.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BDVbYWfH.mjs';
export { renderers } from '../renderers.mjs';

const $$SobreNosotros = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {})}`;
}, "C:/Users/TUF GAMING/Desktop/Programacion de tavo/2.Proyectos/Proyectos/Avanti 3.0/Avanti3.0/src/pages/sobreNosotros.astro", void 0);

const $$file = "C:/Users/TUF GAMING/Desktop/Programacion de tavo/2.Proyectos/Proyectos/Avanti 3.0/Avanti3.0/src/pages/sobreNosotros.astro";
const $$url = "/sobreNosotros";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$SobreNosotros,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
