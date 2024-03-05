import { c as create_ssr_component, o as onDestroy, e as escape, b as add_attribute, v as validate_component, a as each } from "../../../chunks/ssr.js";
import { M as Modal } from "../../../chunks/Modal.js";
import { c as closeModal, s as showModal, a as selectedPage } from "../../../chunks/ModalValues.js";
const InviteToPlayButton_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "button.svelte-u14nu0{color:blue;border-width:1px;border-radius:25%;border-color:blue;margin-left:2px;margin-right:2px}",
  map: null
};
const InviteToPlayButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<div><button class="svelte-u14nu0" data-svelte-h="svelte-ykxnzg">Invite To Play</button> </div>`;
});
const OtherProfile_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "button.svelte-11kq53h{color:red;border-width:1px;border-radius:25%;border-color:red;margin-left:2px;margin-right:2px}.profile-Page.svelte-11kq53h{align-items:center}.profile-pic.svelte-11kq53h{max-width:20%;max-height:20%;border-radius:50%}img.svelte-11kq53h{align-items:center;position:relative;border-color:black;border-width:2px}p.svelte-11kq53h{margin-top:2px}h1.svelte-11kq53h{align-items:center;color:black}",
  map: null
};
const OtherProfile = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { username } = $$props;
  let login;
  let pictureLink;
  let rank;
  let title;
  let win;
  let loose;
  let games = [];
  onDestroy(() => {
    closeModal();
  });
  if ($$props.username === void 0 && $$bindings.username && username !== void 0)
    $$bindings.username(username);
  $$result.css.add(css$1);
  return `<div class="profile-Page svelte-11kq53h"><h1 class="svelte-11kq53h">That is * ${escape(username)} * Profile Bro !</h1> <div><img class="profile-pic svelte-11kq53h"${add_attribute("src", pictureLink, 0)} alt=": 🤖 👨🏻‍🌾 Error  🍪 🤣 :"></div> <div><p class="svelte-11kq53h">Login : ${escape(login)}</p> <p class="svelte-11kq53h">Name : ${escape(username)}</p> <p class="svelte-11kq53h">Total Won: ${escape(win)} - ${escape(loose)} :Lost</p> <p class="svelte-11kq53h">Rank : ${escape(rank)}</p> <p class="svelte-11kq53h">Title: ${escape(title)}</p></div> ${`${`${``}`}`}</div> <div>${``}</div> <div>${`${``}`}</div> ${validate_component(InviteToPlayButton, "InviteToPlayButton").$$render($$result, {}, {}, {})} <div><h1 class="svelte-11kq53h" data-svelte-h="svelte-1ki9rmi">Game History</h1> ${games.length > 0 ? `${each(games, (game, i) => {
    return `<p class="svelte-11kq53h">${escape(game.player1)} ${escape(game.scorePlayer1)} vs ${escape(game.scorePlayer2)} ${escape(game.player2)} </p>`;
  })}` : `<p class="svelte-11kq53h" data-svelte-h="svelte-os8lx6">Aucune partie trouvée.</p>`}</div> `;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "h2.svelte-gphyp3{color:rgb(241, 58, 58);align-items:center}h1.svelte-gphyp3{color:rgb(134, 58, 241);align-items:center}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let show_Modal;
  showModal.subscribe((a) => {
    show_Modal = a;
  });
  let selectedModal;
  selectedPage.subscribe((b) => {
    selectedModal = b;
  });
  let onlineUsers = [];
  let friendsList = [];
  let onlineFriendsList = [];
  let inGameFriendsList = [];
  let pendingList = [];
  let sentRequestsList = [];
  let usersIBlockedList = [];
  let usersWhoBlockedMeList = [];
  let userToDisplay;
  let pictureLink;
  $$result.css.add(css);
  return `<ul role="list" class="divide-y divide-gray-100"><h1 class="svelte-gphyp3" data-svelte-h="svelte-elfmv2">Find friends</h1> ${show_Modal ? `<div>${validate_component(Modal, "Modal").$$render($$result, {}, {}, {
    default: () => {
      return `${selectedModal === "OtherProfile" ? `${validate_component(OtherProfile, "OtherProfile").$$render($$result, { username: userToDisplay }, {}, {})}` : ``}`;
    }
  })}</div>` : ` <div><h2 class="svelte-gphyp3" data-svelte-h="svelte-2ba2xt">Online Users</h2> <li class="flex justify-between"></li> ${`${each(onlineUsers, (user) => {
    return `<li class="flex justify-between gap-x-6 py-5"><div class="flex min-w-0 gap-x-4"><img class="h-12 w-13 flex-none rounded-full bg-gray-50" style="margin-left: 20px;"${add_attribute("src", pictureLink, 0)} alt=": 🤖 👨🏻‍🌾 Error  🍪 🤣 :"> <div class="min-w-0 flex-auto"><p class="text-sm font-semibold leading-6 text-gray-900">${escape(user)}</p> <p class="mt-1 truncate text-xs leading-5 text-gray-500"><button data-svelte-h="svelte-1o411lb">See Profile
									</button></p> </div></div>  <div class="mt-1 flex items-center gap-x-1.5" data-svelte-h="svelte-1krg0v3"><div class="flex-none rounded-full bg-emerald-500/20 p-1"><div class="h-2 w-2 rounded-full bg-emerald-500"></div></div> <p class="text-xs leading-5 text-gray-500" style="margin-right: 130px;">Online</p></div>   </li>`;
  })}`} <li class="flex justify-between"></li> <h2 class="svelte-gphyp3" data-svelte-h="svelte-1hlgdno">Online Friends</h2> ${`${each(onlineFriendsList, (user) => {
    return `<li class="flex justify-between gap-x-6 py-5"><div class="flex min-w-0 gap-x-4"><img class="h-12 w-12 flex-none rounded-full bg-gray-50" style="margin-left: 20px;" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""> <div class="min-w-0 flex-auto"><p class="text-sm font-semibold leading-6 text-gray-900">${escape(user)}</p> <p class="mt-1 truncate text-xs leading-5 text-gray-500"><button data-svelte-h="svelte-qocn6x">See Profile 
										</button></p> </div></div>  <div class="mt-1 flex items-center gap-x-1.5" data-svelte-h="svelte-1krg0v3"><div class="flex-none rounded-full bg-emerald-500/20 p-1"><div class="h-2 w-2 rounded-full bg-emerald-500"></div></div> <p class="text-xs leading-5 text-gray-500" style="margin-right: 130px;">Online</p></div> </li>`;
  })}`} <h2 class="svelte-gphyp3" data-svelte-h="svelte-gx2w7g">In Game Friends</h2> ${`${each(inGameFriendsList, (user) => {
    return `<li class="flex justify-between gap-x-6 py-5"><div class="flex min-w-0 gap-x-4"><img class="h-12 w-12 flex-none rounded-full bg-gray-50" style="margin-left: 20px;" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""> <div class="min-w-0 flex-auto"><p class="text-sm font-semibold leading-6 text-gray-900">${escape(user)}</p> <p class="mt-1 truncate text-xs leading-5 text-gray-500"><button data-svelte-h="svelte-axb7dr">See Profile 
									</button></p> </div></div>  <div class="mt-1 flex items-center gap-x-1.5" data-svelte-h="svelte-19ytggl"><div class="flex-none rounded-full bg-emerald-500/20 p-1"><div class="h-1.5 w-1.5 rounded-full bg-emerald-500"></div></div> <p class="text-xs leading-5 text-gray-500" style="margin-right: 130px;">Game-On</p></div> </li>`;
  })}`} <h2 class="svelte-gphyp3" data-svelte-h="svelte-f6iwi9">Friends List</h2> ${`${each(friendsList, (friendUser) => {
    return `<li class="flex justify-between gap-x-6 py-5"><div class="flex min-w-0 gap-x-4"><img class="h-12 w-12 flex-none rounded-full bg-gray-50" style="margin-left: 20px;" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""> <div class="min-w-0 flex-auto"><p class="text-sm font-semibold leading-6 text-gray-900">${escape(friendUser)}</p> <p class="mt-1 truncate text-xs leading-5 text-gray-500"><button data-svelte-h="svelte-1khnvbh">See Profile
										</button></p> </div></div>  <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end"><p class="mt-1 truncate text-xs leading-5 text-gray-500" style="margin-right: 130px;"><button data-svelte-h="svelte-1bo8d1y">Undo Friendship</button> </p></div> ${`<div class="mt-1 flex items-center gap-x-1.5" data-svelte-h="svelte-pw7a1z"><div class="flex-none rounded-full bg-emerald-500/20 p-1"><div class="h-2 w-2 rounded-full bg-emerald-500"></div></div> <p class="text-xs leading-5 text-gray-500" style="margin-right:130px;">Online</p> </div>`} </li>`;
  })}`} <h2 class="svelte-gphyp3" data-svelte-h="svelte-1tfw4k6">Pending friend Request</h2> ${`${each(pendingList, (pendingUser) => {
    return `<li class="flex justify-between gap-x-6 py-5"><div class="flex min-w-0 gap-x-4"><img class="h-12 w-12 flex-none rounded-full bg-gray-50" style="margin-left: 20px;" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""> <div class="min-w-0 flex-auto"><p class="text-sm font-semibold leading-6 text-gray-900">${escape(pendingUser)}</p> <p class="mt-1 truncate text-xs leading-5 text-gray-500"><button data-svelte-h="svelte-1mml0vx">See Profile
									</button></p> </div></div>  <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end"><p class="mt-1 truncate text-xs leading-5 text-gray-500" style="margin-right:500px;"><button data-svelte-h="svelte-1tmn14g">Accept</button> </p></div> <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end"><p class="mt-1 truncate text-xs leading-5 text-gray-500" style="margin-right:390px;"><button data-svelte-h="svelte-1llkcbq">Refuse</button> </p></div>  </li>`;
  })}`} ${` <li class="flex justify-between gap-x-6 py-5" data-svelte-h="svelte-1f53ij8"><div class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"><p class="text-xs leading-5 text-gray-500">Waiting an answer from</p></div></li> ${each(sentRequestsList, (requestedUser) => {
    return `<li class="flex justify-between gap-x-6 py-5"><div class="flex min-w-0 gap-x-4"><img class="h-12 w-12 flex-none rounded-full bg-gray-50" style="margin-left: 20px;" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""> <div class="min-w-0 flex-auto"><p class="text-sm font-semibold leading-6 text-gray-900">${escape(requestedUser)}</p> <p class="mt-1 truncate text-xs leading-5 text-gray-500"><button data-svelte-h="svelte-12c5ii4">See Profile
									</button></p> </div></div>  </li>`;
  })}`} ${` <li class="flex justify-between gap-x-6 py-5" data-svelte-h="svelte-1wq6dz7"><div class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"><p class="text-xs leading-5 text-gray-500">Users I Blocke</p></div></li> ${each(usersIBlockedList, (blockedUser) => {
    return `<li class="flex justify-between gap-x-6 py-5"><div class="flex min-w-0 gap-x-4"><img class="h-12 w-12 flex-none rounded-full bg-gray-50" style="margin-left: 20px;" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""> <div class="min-w-0 flex-auto"><p class="text-sm font-semibold leading-6 text-gray-900">${escape(blockedUser)}</p> <p class="mt-1 truncate text-xs leading-5 text-gray-500"><button data-svelte-h="svelte-1hdqk67">See Profile
									
									</button></p> </div></div> </li> `;
  })}`} ${` <li class="flex justify-between gap-x-6 py-5" data-svelte-h="svelte-17sbyzi"><div class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"><p class="text-xs leading-5 text-gray-500">Users Who Blocked Me</p></div></li> ${each(usersWhoBlockedMeList, (blockedUser) => {
    return `<li class="flex justify-between gap-x-6 py-5"><div class="flex min-w-0 gap-x-4"><img class="h-12 w-12 flex-none rounded-full bg-gray-50" style="margin-left: 20px;" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""> <div class="min-w-0 flex-auto"><p class="text-sm font-semibold leading-6 text-gray-900">${escape(blockedUser)}</p> <p class="mt-1 truncate text-xs leading-5 text-gray-500"><button data-svelte-h="svelte-12ijpdg">See Profile
									</button></p> </div></div> </li> `;
  })}`}</div>`}    </ul>`;
});
export {
  Page as default
};
