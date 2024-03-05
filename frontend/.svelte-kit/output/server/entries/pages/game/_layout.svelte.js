import { c as create_ssr_component } from "../../../chunks/ssr.js";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: '.game-layout.svelte-lr5dpt{background-image:url("/images/game_background.png");background-repeat:no-repeat;background-size:cover;background-position:center;min-height:100vh;display:flex;flex-direction:column}.game-header.svelte-lr5dpt{display:flex;justify-content:space-between;background-color:#333;color:white;padding:10px;font-family:fantasy}.original-pong.svelte-lr5dpt{flex:1;text-align:center;font-family:fantasy}',
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="game-layout svelte-lr5dpt"><div class="game-header svelte-lr5dpt" data-svelte-h="svelte-1o1nxd3"><div class="original-pong svelte-lr5dpt"><span>Matchmaking game original Pong (1972)</span></div></div> ${slots.default ? slots.default({}) : ``} </div>`;
});
export {
  Layout as default
};
