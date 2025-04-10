import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dyv4Gtcf.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BDVbYWfH.mjs';
export { renderers } from '../renderers.mjs';

const $$Pqrs = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-gray-100 flex items-center justify-center min-h-screen"> <div class="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full"> <h2 class="text-2xl font-semibold text-gray-700 text-center mb-6">Formulario PQRS</h2> <form> <div class="mb-4"> <label class="block text-gray-700 font-medium" for="name">Nombre</label> <input type="text" id="name" class="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300" placeholder="Tu nombre" required> </div> <div class="mb-4"> <label class="block text-gray-700 font-medium" for="email">Correo Electrónico</label> <input type="email" id="email" class="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300" placeholder="tucorreo@example.com" required> </div> <div class="mb-4"> <label class="block text-gray-700 font-medium" for="tipo">Tipo de PQRS</label> <select id="tipo" class="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300" required> <option value="peticion">Petición</option> <option value="queja">Queja</option> <option value="reclamo">Reclamo</option> <option value="sugerencia">Sugerencia</option> </select> </div> <div class="mb-4"> <label class="block text-gray-700 font-medium" for="mensaje">Mensaje</label> <textarea id="mensaje" rows="4" class="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300" placeholder="Escribe tu mensaje" required></textarea> </div> <button type="submit" class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Enviar</button> </form> </div> </div> ` })}`;
}, "C:/Users/TUF GAMING/Desktop/Programacion de tavo/2.Proyectos/Proyectos/Avanti 3.0/Avanti3.0/src/pages/pqrs.astro", void 0);

const $$file = "C:/Users/TUF GAMING/Desktop/Programacion de tavo/2.Proyectos/Proyectos/Avanti 3.0/Avanti3.0/src/pages/pqrs.astro";
const $$url = "/pqrs";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Pqrs,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
