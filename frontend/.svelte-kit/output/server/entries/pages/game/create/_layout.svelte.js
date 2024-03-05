import { c as create_ssr_component, e as escape } from "../../../../chunks/ssr.js";
import { l as leftPlayerUsername, r as rightPlayerUsername, w as winnerScore } from "../../../../chunks/store.js";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".game-header.svelte-1ej3igc{display:flex;justify-content:space-between;background-color:#333;color:white;padding:10px}.left-player.svelte-1ej3igc,.right-player.svelte-1ej3igc{flex:1;text-align:center}.scoreToWin.svelte-1ej3igc{flex:1;text-align:center;justify-content:space-between}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let login = "";
  leftPlayerUsername.subscribe((a) => {
    login = a;
  });
  let invited;
  rightPlayerUsername.subscribe((a) => {
    invited = a;
  });
  let socreToWin;
  winnerScore.subscribe((a) => {
    socreToWin = a;
  });
  $$result.css.add(css);
  return `<div class="game-header svelte-1ej3igc"><div class="left-player svelte-1ej3igc">  <span>Left Player: &#39;${escape(login)}&#39;</span></div> <div class="right-player svelte-1ej3igc">  <span>Right Player: &#39;${escape(invited)}&#39;</span></div></div> <div class="scoreToWin svelte-1ej3igc">  <span>Score To Win: &#39;${escape(socreToWin)}&#39;</span></div> <div class="game-content">${slots.default ? slots.default({}) : ``} </div>`;
});
export {
  Layout as default
};
