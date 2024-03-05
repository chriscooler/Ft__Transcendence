import { c as create_ssr_component } from "./ssr.js";
const Modal_svelte_svelte_type_style_lang = "";
const css = {
  code: ".modal-backdrop.svelte-1bm41mq{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0, 0, 0, 0.5);display:flex;justify-content:center;align-items:center}.modal-content.svelte-1bm41mq{width:90%;max-width:600px;max-height:90%;background-color:white;border-radius:8px;padding:20px;overflow-y:auto}",
  map: null
};
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<main>  <div class="modal-backdrop svelte-1bm41mq"><div class="modal-content svelte-1bm41mq"> ${slots.default ? slots.default({}) : ``} </div></div></main> `;
});
export {
  Modal as M
};
