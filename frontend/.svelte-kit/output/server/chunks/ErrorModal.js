import { c as create_ssr_component, e as escape } from "./ssr.js";
const ErrorModal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { msg } = $$props;
  if ($$props.msg === void 0 && $$bindings.msg && msg !== void 0)
    $$bindings.msg(msg);
  return `<div>Sorry, ${escape(msg)}</div>`;
});
export {
  ErrorModal as E
};
