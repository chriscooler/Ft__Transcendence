import { c as create_ssr_component, e as escape, a as each, b as add_attribute, v as validate_component, o as onDestroy, d as subscribe } from "../../chunks/ssr.js";
import { s as showModal, a as selectedPage, c as closeModal } from "../../chunks/ModalValues.js";
import { M as Modal } from "../../chunks/Modal.js";
import { i as inviteNotif, s as session, d as dataGame, a as inviteNotifModal, b as authentificated, q as qrGoogle, c as isGoogleAuthActivated, n as navbar, u as user } from "../../chunks/store.js";
import "socket.io-client";
import { G as GoogleAuth } from "../../chunks/GoogleAuth.js";
const app = "";
function client_method(key) {
  {
    if (key === "before_navigate" || key === "after_navigate") {
      return () => {
      };
    } else {
      const name_lookup = {
        disable_scroll_handling: "disableScrollHandling",
        preload_data: "preloadData",
        preload_code: "preloadCode",
        invalidate_all: "invalidateAll"
      };
      return () => {
        throw new Error(`Cannot call ${name_lookup[key] ?? key}(...) on the server`);
      };
    }
  }
}
const goto = /* @__PURE__ */ client_method("goto");
const Navigation_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: ".notif.svelte-1wcchdr{color:blue}",
  map: null
};
const Navigation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let notif;
  inviteNotif.subscribe((a) => {
    notif = a;
  });
  showModal.subscribe((a) => {
  });
  selectedPage.subscribe((b) => {
  });
  $$result.css.add(css$4);
  notif = false;
  return `<nav class="w-full flex gap-10 p-2 justify-center items-center h-full"><button data-svelte-h="svelte-153nab8">Home</button>  <button data-svelte-h="svelte-3otsla">Profile</button> <button data-svelte-h="svelte-1oa1xvu">Game</button>  <button data-svelte-h="svelte-1ajs67s">Chat</button>  <button data-svelte-h="svelte-3ieha6">Friends</button> <button data-svelte-h="svelte-t0xtl">DM</button> <button data-svelte-h="svelte-5sp11i">Logout</button> ${notif === true ? `<button class="notif svelte-1wcchdr" data-svelte-h="svelte-1vs909q">🏓 Invitation 🏓</button> ` : ``}</nav>  ${``}`;
});
const LoginButton_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: 'div.svelte-1lqlm97{align-items:center;grid-template-columns:repeat(7, 1fr);grid-gap:5px;max-width:400px}.pick-a-color.svelte-1lqlm97{margin-top:400px;align-items:center}.round-button.svelte-1lqlm97{width:1em;height:1em;border-radius:50%;background:var(--color, #fff);transform:translate(-2px, -2px);filter:drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.2));transition:all 0.1s;margin-right:9%;font-size:small}.bigButton.svelte-1lqlm97{cursor:not-allowed;font:medium;width:6em;height:6em;border-radius:50%;box-shadow:0 8px 0 hsl(0, 100%, 30%), 2px 12px 10px rgba(0, 0, 0, 0.35);color:hsl(0, 100%, 30%);text-shadow:-1px -1px 2px rgba(0, 0, 0, 0.3),\n			1px 1px 2px rgba(255, 255, 255, 0.4);text-transform:uppercase;letter-spacing:0.05em;transform:translate(0, -8px);transition:all 0.2s;margin-top:190%;transition:color 4.2s}.bigButton.svelte-1lqlm97:active{transform:translate(0, -2px);box-shadow:0 2px 0 hsl(0, 100%, 30%), 2px 6px 10px rgba(0, 0, 0, 0.35)}button[aria-current="true"].svelte-1lqlm97{transition:color 0.2s;transform:none;filter:none;box-shadow:inset 3px 3px 4px rgba(0, 0, 0, 0.2)}',
  map: null
};
const LoginButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const colors = ["green", "yellow", "orange", "red"];
  let selected = colors[0];
  colors.length - 1;
  $$result.css.add(css$3);
  return `<div class="svelte-1lqlm97"><button class="bigButton svelte-1lqlm97" style="${"background-color: " + escape(selected, true)}">Log in</button>  <div class="pick-a-color svelte-1lqlm97">${each(colors, (color, i) => {
    return `<button class="round-button svelte-1lqlm97"${add_attribute("aria-current", selected === color, 0)}${add_attribute("aria-label", color, 0)} style="${"background: " + escape(color, true)}">${escape(i + 1)}</button>`;
  })}</div> </div>`;
});
const LoginFortyTwo_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: `.content.svelte-5y2mik{z-index:1}div.svelte-5y2mik{display:flex;flex-direction:column;align-items:center;justify-content:center}h2.svelte-5y2mik{color:green;font-size:180px;margin-top:100;font-family:fantasy}.content.svelte-5y2mik::before{content:"";position:absolute;margin:0;top:0;left:0;width:100%;height:100%;background-image:url('/images/42auth_image.png');background-size:cover;background-repeat:no-repeat;opacity:0.5}`,
  map: null
};
const LoginFortyTwo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<div class="content svelte-5y2mik">${validate_component(LoginButton, "LoginButton").$$render($$result, {}, {}, {})} <h2 class="svelte-5y2mik" data-svelte-h="svelte-4wglav">Transcendence</h2>    </div>`;
});
const GameInvitation_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".accept.svelte-pk67c6{color:blue;border-width:1px;border-radius:25%;border-color:blue;margin-left:2px;margin-right:2px}.refuse.svelte-pk67c6{color:rgb(159, 11, 11);border-width:1px;border-radius:25%;border-color:blue;margin-left:2px;margin-right:2px}",
  map: null
};
const GameInvitation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  session.subscribe((a) => {
  });
  dataGame.subscribe((a) => {
  });
  onDestroy(() => {
    inviteNotif.set(false);
    inviteNotifModal.set(false);
    closeModal();
  });
  $$result.css.add(css$1);
  return `<button class="accept svelte-pk67c6" data-svelte-h="svelte-1iq7hug">Accept</button> <button class="refuse svelte-pk67c6" data-svelte-h="svelte-zyz6bg">Refuse</button>`;
});
const GameNavbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isModalOpen = false;
  function handleBackHomeModal() {
    isModalOpen = true;
  }
  function handleCancelLeaveGame() {
    isModalOpen = false;
  }
  function leaveGame() {
    isModalOpen = false;
    goto("/");
  }
  if ($$props.handleBackHomeModal === void 0 && $$bindings.handleBackHomeModal && handleBackHomeModal !== void 0)
    $$bindings.handleBackHomeModal(handleBackHomeModal);
  if ($$props.handleCancelLeaveGame === void 0 && $$bindings.handleCancelLeaveGame && handleCancelLeaveGame !== void 0)
    $$bindings.handleCancelLeaveGame(handleCancelLeaveGame);
  if ($$props.leaveGame === void 0 && $$bindings.leaveGame && leaveGame !== void 0)
    $$bindings.leaveGame(leaveGame);
  return ` <nav class="w-full flex gap-10 p-2 justify-center items-center h-full text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"><button data-svelte-h="svelte-1suvixp">Back to Business</button> </nav> ${isModalOpen ? `<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true"><div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div> <div class="fixed inset-0 z-10 w-screen overflow-y-auto"><div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"><div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"><div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4" data-svelte-h="svelte-qakhp"><div class="sm:flex sm:items-start"><div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"><svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"></path></svg></div> <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left"><h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Leave Game</h3> <div class="mt-2"><p class="text-sm text-gray-500">Are you sure you want to leave game? Once you leave, you are lost as well. This action cannot be undone.</p></div></div></div></div> <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"><button id="leaveGameButton" type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" data-svelte-h="svelte-175y44s">Leave Game</button> <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" data-svelte-h="svelte-13gukz7">Cancel</button></div></div></div></div></div>` : ``}`;
});
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: "body{width:100vw;height:100vh}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_user;
  let $$unsubscribe_session;
  $$unsubscribe_user = subscribe(user, (value) => value);
  $$unsubscribe_session = subscribe(session, (value) => value);
  let login;
  let auth = false;
  authentificated.subscribe((a) => {
    auth = a;
  });
  let ImgQrCode = "";
  qrGoogle.subscribe((a) => {
    ImgQrCode = a;
  });
  let googleActivated = false;
  isGoogleAuthActivated.subscribe((a) => {
    googleActivated = a;
  });
  let ModalInviteNotif = false;
  inviteNotifModal.subscribe((a) => {
    ModalInviteNotif = a;
  });
  let nav = false;
  navbar.subscribe((a) => {
    nav = a;
  });
  $$result.css.add(css);
  $$unsubscribe_user();
  $$unsubscribe_session();
  return `<div class="w-full h-full">${!auth ? `<main class="w-full h-full">${googleActivated ? `${validate_component(Modal, "Modal").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(GoogleAuth, "GoogleAuth").$$render($$result, { login, QrCode: ImgQrCode }, {}, {})}`;
    }
  })}` : `${validate_component(LoginFortyTwo, "LoginFortyTwo").$$render($$result, {}, {}, {})}`}</main>` : `${ModalInviteNotif ? `${validate_component(Modal, "Modal").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(GameInvitation, "GameInvitation").$$render($$result, {}, {}, {})}`;
    }
  })}` : ``} ${nav ? `<header class="h-24 w-full bg-red-500">${validate_component(Navigation, "Navigation").$$render($$result, {}, {}, {})}</header>` : `<header class="h-24 w-full bg-red-500">${validate_component(GameNavbar, "GameNavbar").$$render($$result, {}, {}, {})}</header>`} ${slots.default ? slots.default({}) : ``}`} </div>`;
});
export {
  Layout as default
};
