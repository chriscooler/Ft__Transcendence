import { c as create_ssr_component, b as add_attribute, e as escape } from "./ssr.js";
const GoogleAuth_svelte_svelte_type_style_lang = "";
const css = {
  code: "button.svelte-18uqrg{margin-left:5px;border-width:1px;border-color:brown;border-radius:42%}button.svelte-18uqrg:hover{color:brown}",
  map: null
};
const GoogleAuth = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let codeVerif;
  let { QrCode } = $$props;
  let { login } = $$props;
  let indication = "";
  if ($$props.QrCode === void 0 && $$bindings.QrCode && QrCode !== void 0)
    $$bindings.QrCode(QrCode);
  if ($$props.login === void 0 && $$bindings.login && login !== void 0)
    $$bindings.login(login);
  $$result.css.add(css);
  codeVerif = "";
  return `<div><div data-svelte-h="svelte-tmpiqs">Google Authenticator</div> <div data-svelte-h="svelte-1c70cjx">Use Google Authenticator App to scan the QR Code</div>  <img${add_attribute("src", QrCode, 0)} alt="Error Google generating QR"> <div data-svelte-h="svelte-15vehko">Code d&#39;authentification Google :</div> <div><input type="text" placeholder="Put code here !"${add_attribute("value", codeVerif, 0)}>   <button class="svelte-18uqrg" data-svelte-h="svelte-1phq86a">Verify Code</button></div> <div>${escape(indication)}</div> </div>`;
});
export {
  GoogleAuth as G
};
