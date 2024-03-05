import { c as create_ssr_component, b as add_attribute, e as escape, v as validate_component } from "../../../chunks/ssr.js";
import { M as Modal } from "../../../chunks/Modal.js";
import { s as showModal, a as selectedPage } from "../../../chunks/ModalValues.js";
import { E as ErrorModal } from "../../../chunks/ErrorModal.js";
import { G as GoogleAuth } from "../../../chunks/GoogleAuth.js";
import { e as isGoogleAuthEnabled } from "../../../chunks/store.js";
const ImgPreviewProfile_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: "button.svelte-n1ryty{margin-left:5px;border-width:1px;border-color:brown;border-radius:42%}button.svelte-n1ryty:hover{color:brown}div.svelte-n1ryty{grid-auto-flow:row}.profile-pic.svelte-n1ryty{max-width:42%;max-height:42%;border-radius:50%;align-items:center;position:relative;border-color:black;border-width:2px}",
  map: null
};
const ImgPreviewProfile = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { image } = $$props;
  let { login } = $$props;
  let { username } = $$props;
  if ($$props.image === void 0 && $$bindings.image && image !== void 0)
    $$bindings.image(image);
  if ($$props.login === void 0 && $$bindings.login && login !== void 0)
    $$bindings.login(login);
  if ($$props.username === void 0 && $$bindings.username && username !== void 0)
    $$bindings.username(username);
  $$result.css.add(css$3);
  return `<div class="svelte-n1ryty"><h3 data-svelte-h="svelte-1km2ytl">That is your Cookie Bro, Enjoy !!!</h3> <div class="svelte-n1ryty"><img class="profile-pic svelte-n1ryty"${add_attribute("src", image, 0)} alt=": 🤖 👨🏻‍🌾 Error  🍪 🤣 :"></div> <div class="svelte-n1ryty"><p>Login : ${escape(login)}</p> <p>Name : ${escape(username)}</p></div></div> <div class="svelte-n1ryty"><div class="svelte-n1ryty" data-svelte-h="svelte-1dyboml">Make a Choice Son !</div> <button class="svelte-n1ryty" data-svelte-h="svelte-1d3eaar">Garder</button> <button class="svelte-n1ryty" data-svelte-h="svelte-1fva4b3">C&#39;est pas Top !</button> </div>`;
});
const Enable2Fa = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let show_Modal;
  showModal.subscribe((a) => {
    show_Modal = a;
  });
  let { login } = $$props;
  let QrSource;
  isGoogleAuthEnabled.subscribe((a) => {
  });
  if ($$props.login === void 0 && $$bindings.login && login !== void 0)
    $$bindings.login(login);
  return `${show_Modal ? `<div data-svelte-h="svelte-rr24xi">Enabling Google Authenticator</div> <div data-svelte-h="svelte-1ovwphr">Authenticate Yourself to enable 2fa</div> ${validate_component(GoogleAuth, "GoogleAuth").$$render($$result, { QrCode: QrSource, login }, {}, {})}` : ``}`;
});
const Disable2Fa_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "button.svelte-18uqrg{margin-left:5px;border-width:1px;border-color:brown;border-radius:42%}button.svelte-18uqrg:hover{color:brown}",
  map: null
};
const Disable2Fa = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { login } = $$props;
  if ($$props.login === void 0 && $$bindings.login && login !== void 0)
    $$bindings.login(login);
  $$result.css.add(css$2);
  return `<div data-svelte-h="svelte-jazmy6">Desabling Google Authentificator</div> <div data-svelte-h="svelte-kg0bbi">Confirm your choice :</div> <div><button class="svelte-18uqrg" data-svelte-h="svelte-86ed60">Confirm</button> <button class="svelte-18uqrg" data-svelte-h="svelte-xy3i54">No</button> </div>`;
});
const Profilepage_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".indication.svelte-ixosjt{color:crimson}input.svelte-ixosjt{border-color:black;border-width:1px}button.svelte-ixosjt{color:red;border-width:1px;border-radius:25%;border-color:red;margin-left:2px;margin-right:2px}.profile-Page.svelte-ixosjt{align-items:center;color:rgb(244, 237, 237);margin-left:300px}.profile-pic.svelte-ixosjt{max-width:50%;max-height:50%;border-radius:50%;align-items:center;border-color:rgb(111, 151, 142);border-width:2px}p.svelte-ixosjt{margin-top:2px;color:rgb(77, 60, 60);margin-left:0px}h1.svelte-ixosjt{align-items:center;color:rgb(237, 228, 228)}h3.svelte-ixosjt{align-items:center;color:rgb(207, 245, 71)}",
  map: null
};
const Profilepage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let newImg;
  let username;
  let show_Modal;
  showModal.subscribe((a) => {
    show_Modal = a;
  });
  let selectedModal;
  selectedPage.subscribe((b) => {
    selectedModal = b;
  });
  let login;
  let pictureLink;
  let rank;
  let title;
  let win;
  let loose;
  let newUserName = "";
  $$result.css.add(css$1);
  newImg = "";
  username = "";
  return `${show_Modal ? `<div>${validate_component(Modal, "Modal").$$render($$result, {}, {}, {
    default: () => {
      return `${selectedModal === "Try Avatar" ? `${validate_component(ImgPreviewProfile, "ImgPreviewProfile").$$render($$result, { image: newImg, login, username }, {}, {})}` : ``} ${selectedModal === "errorMsg" ? `${validate_component(ErrorModal, "ErrorModal").$$render(
        $$result,
        {
          msg: "username [ " + newUserName + " ] is already used !"
        },
        {},
        {}
      )}` : ``} ${selectedModal === "Try Enable 2fa" ? `${validate_component(Enable2Fa, "Enable2Fa").$$render($$result, { login }, {}, {})}` : ``} ${selectedModal === "Try Disable 2fa" ? `${validate_component(Disable2Fa, "Disable2Fa").$$render($$result, { login }, {}, {})}` : ``}`;
    }
  })}</div>` : `<div class="profile-Page svelte-ixosjt"><h1 class="svelte-ixosjt">That is * ${escape(username)} * Profil Bro !</h1> <h3 class="svelte-ixosjt" data-svelte-h="svelte-khmq8q">You will get a Cookie if you are a Good Boy</h3> <div><img class="profile-pic svelte-ixosjt"${add_attribute("src", pictureLink, 0)} alt=": 🤖 👨🏻‍🌾 Error  🍪 🤣 :"></div> <div><p class="svelte-ixosjt">Login : ${escape(login)}</p> <p class="svelte-ixosjt">Name : ${escape(username)}</p> <p class="svelte-ixosjt">Rank : ${escape(rank)}</p> <p class="svelte-ixosjt">Title : ${escape(title)}</p> <p class="svelte-ixosjt">Total Won: ${escape(win)} - ${escape(loose)} :Lost</p> <p class="svelte-ixosjt">Change username
				<input type="text" placeholder="new username" class="svelte-ixosjt"${add_attribute("value", newUserName, 0)}>  <button class="svelte-ixosjt" data-svelte-h="svelte-ueto28">Change</button></p> ${``} <p class="svelte-ixosjt">Change Avatar (.jpg only !)
				<input type="text" placeholder="avatar img link" class="svelte-ixosjt"${add_attribute("value", newImg, 0)}>  <button class="svelte-ixosjt" data-svelte-h="svelte-4vx16m">Change</button> <button class="svelte-ixosjt" data-svelte-h="svelte-f7q7q3">Preview</button> ${``}</p> <div data-svelte-h="svelte-14v492x">You could try : images/defaultAvatar.jpg</div> <div data-svelte-h="svelte-b8tgm8">You could try : images/backgroundImg.jpg</div> <div><span data-svelte-h="svelte-1mw4z0p">Google Authentificator :</span> ${`<span><button class="svelte-ixosjt" data-svelte-h="svelte-5gjy51">Enable</button></span>`}</div></div></div>`}`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: '.background.svelte-1ha7zbc{background-image:url("/images/milky_galaxy.jpg");background-size:cover;background-position:center;width:100%;height:100%;position:fixed;top:0;left:0;z-index:-1}.box.svelte-1ha7zbc{width:1000px;height:650px;border:1px solid #aaa;border-radius:6px;box-shadow:20px 300px 100px rgba(255, 5, 5, 0.1);padding:3em;margin:0 0 1em 0;margin:0 auto;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%)}',
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="background svelte-1ha7zbc" data-svelte-h="svelte-164wv47"></div> <main> <div class="box svelte-1ha7zbc"> ${validate_component(Profilepage, "Profilepage").$$render($$result, {}, {}, {})}</div> </main>`;
});
export {
  Page as default
};
