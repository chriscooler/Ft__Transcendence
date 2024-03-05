import { c as create_ssr_component, d as subscribe, a as each, e as escape } from "../../../chunks/ssr.js";
import { s as session, u as user } from "../../../chunks/store.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".room-list.svelte-10mcx3e{display:flex;height:100%;width:25%;-webkit-user-select:none;-moz-user-select:none;user-select:none;flex-direction:column;--tw-bg-opacity:1;background-color:rgb(96 165 250 / var(--tw-bg-opacity))\n}.direct-chat.svelte-10mcx3e{display:flex;height:100%;width:75%;flex-direction:column;--tw-bg-opacity:1;background-color:rgb(134 239 172 / var(--tw-bg-opacity))\n}.message-list.svelte-10mcx3e{display:flex;height:80%;width:100%;flex-direction:column;gap:1.25rem;--tw-bg-opacity:1;background-color:rgb(252 165 165 / var(--tw-bg-opacity))\n}.message.svelte-10mcx3e{position:absolute;top:0px;height:100%;--tw-bg-opacity:1;background-color:rgb(253 230 138 / var(--tw-bg-opacity));padding:0.75rem;font-size:0.75rem;line-height:1rem;max-width:50%\n}.chat-wrapper.svelte-10mcx3e{position:relative;height:20%;--tw-bg-opacity:1;background-color:rgb(254 252 232 / var(--tw-bg-opacity));font-size:1.125rem;line-height:1.75rem\n}.room.svelte-10mcx3e{display:flex;height:6rem;cursor:pointer;align-items:center;justify-content:center;gap:0.75rem;--tw-bg-opacity:1;background-color:rgb(191 219 254 / var(--tw-bg-opacity))\n}.room.svelte-10mcx3e:hover{--tw-brightness:brightness(.9);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)\n}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_session;
  let $user, $$unsubscribe_user;
  $$unsubscribe_session = subscribe(session, (value) => value);
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  let rooms = [];
  $$result.css.add(css);
  $$unsubscribe_session();
  $$unsubscribe_user();
  return `<div class="w-full h-full flex"><div class="room-list svelte-10mcx3e">${each(rooms, (room, i) => {
    return `<div class="room svelte-10mcx3e"><div class="room-name">${escape(room.userOne.userName == $user.userName ? room.userTwo.userName : room.userOne.userName)}</div> </div>`;
  })}</div> ${``} </div>`;
});
export {
  Page as default
};
