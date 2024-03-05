import { c as create_ssr_component } from "../../../../chunks/ssr.js";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".game-header.svelte-bux373{display:flex;justify-content:space-between;background-color:#333;color:white;padding:10px}.left-player.svelte-bux373,.right-player.svelte-bux373{flex:1;text-align:center}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="game-header svelte-bux373" data-svelte-h="svelte-1c4sv3r"><div class="left-player svelte-bux373">  <span>Left Player:</span></div> <div class="right-player svelte-bux373">  <span>Right Player:</span></div></div> <div class="game-content">${slots.default ? slots.default({}) : ``} </div>`;
});
export {
  Layout as default
};
