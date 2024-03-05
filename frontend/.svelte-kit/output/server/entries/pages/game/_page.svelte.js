import { c as create_ssr_component, f as createEventDispatcher, d as subscribe, o as onDestroy, e as escape, v as validate_component, b as add_attribute } from "../../../chunks/ssr.js";
import { I as InvitedUserLogin } from "../../../chunks/store.js";
import { s as showModal } from "../../../chunks/ModalValues.js";
const global = "";
const GameModal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let { isOpen = false } = $$props;
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  return `${isOpen ? `<div class="modal"><div class="modal-content">  <span class="close-btn" data-svelte-h="svelte-11mydyo">×</span> ${slots.default ? slots.default({}) : ``}</div></div>` : ``}`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: `.button-container.svelte-19xh1jj{display:flex;justify-content:center;align-items:center}.onSubmitPrivateRoom-container.svelte-19xh1jj{width:100%;height:100%;border:35px solid var(--border-color);padding:18px;margin:0 auto;box-sizing:border-box;background-image:url("/images/playRoom.jpg");background-position:center;background-size:cover}.create-privateRoom-button.svelte-19xh1jj{background-color:#03080cbd;font-family:'fantasy';color:white;border:none;padding:10px 20px;font-size:20px;border-radius:5px;cursor:pointer;transition:background-color 0.3s ease;display:block;margin:0 auto}.create-privateRoom-button.svelte-19xh1jj:hover{background-color:#007bff}label.svelte-19xh1jj{display:flex;align-items:center;margin-bottom:10px;color:rgb(29, 41, 131);font-size:16px;font-weight:600}.range.svelte-19xh1jj{width:30%;background:linear-gradient(to right, #007bff, #00cc99);border:none;border-radius:10px;padding:1px;margin:2px 0;-webkit-appearance:none}.range.svelte-19xh1jj::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;background:#00cc99;border:2px solid #d5dfe9;border-radius:66%;cursor:pointer}input.svelte-19xh1jj,select.svelte-19xh1jj,button.svelte-19xh1jj{background:rgba(217, 204, 204, 0.8);border:none;padding:10px;border-radius:20px}.py-2.svelte-19xh1jj{font-family:fantasy}button.svelte-19xh1jj{cursor:pointer;color:white;background:#007bff;border-radius:3px;padding:10px 20px;font-size:18px;border:2px solid #eff1f4;transition:background 0.3s ease, color 0.3s ease;border-radius:30px}button.svelte-19xh1jj:hover{background:#245a1a}`,
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $showModal, $$unsubscribe_showModal;
  $$unsubscribe_showModal = subscribe(showModal, (value) => $showModal = value);
  let speed = 1;
  let isModalOpen = false;
  let colorMode = "blue";
  let borderColors = {
    green: "rgb(0,100,0)",
    blue: "rgb(70,130,180)",
    orange: "rgb(255,143,31)"
  };
  let invited;
  InvitedUserLogin.subscribe((a) => {
    invited = a;
  });
  const closeModal = () => {
    isModalOpen = false;
  };
  onDestroy(() => {
    closeModal();
  });
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        const selectedColor = colorMode;
        if (selectedColor in borderColors) {
          document.documentElement.style.setProperty("--border-color", borderColors[selectedColor]);
        }
      }
    }
    $$rendered = `<main class="game-background"><div class="button-container svelte-19xh1jj"><button style="margin-top: 2px" class="create-privateRoom-button svelte-19xh1jj" data-svelte-h="svelte-1trqxti">MatchMaking</button> <button style="margin-top: 2px" class="create-privateRoom-button svelte-19xh1jj">Create PrivateGame with &#39;${escape(invited)}&#39;</button> <button style="margin-top: 2px" class="create-privateRoom-button svelte-19xh1jj" data-svelte-h="svelte-125f6ju">Game Rules</button></div></main>  ${$showModal ? `<div class="modal"><div class="modal-content">  <span class="close" data-svelte-h="svelte-1poxmqt">×</span> <h2 class="py-2 text-4xl text-white svelte-19xh1jj" data-svelte-h="svelte-1kwjlf5">Game Rules</h2> <p data-svelte-h="svelte-11hw1k4">To win, be the first to reach the winning score.</p> <p data-svelte-h="svelte-1o6d5fm">Designate right and left players; left player starts.</p> <p data-svelte-h="svelte-16picws">Use &#39;up&#39; and &#39;down&#39; to move your paddle and hit the ball.</p> <p data-svelte-h="svelte-1qigpmn">Invitations initiated by the left player.</p> <p data-svelte-h="svelte-1gwbfax">Choose between 3vs3 or 5vs5 games.</p> <p data-svelte-h="svelte-1rlbvjw">Select game speed (0-3).</p> <p data-svelte-h="svelte-198f9uj">Customize your paddle size.</p> <p data-svelte-h="svelte-4qzjqn">Stay in the game; disconnecting forfeits the match to your opponent.</p></div></div>` : ``} ${validate_component(GameModal, "GameModal").$$render(
      $$result,
      { isOpen: isModalOpen },
      {
        isOpen: ($$value) => {
          isModalOpen = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<form><div class="onSubmitPrivateRoom-container svelte-19xh1jj"><h2 class="py-2 text-4xl text-white svelte-19xh1jj">Let&#39;s Play with &#39;${escape(invited)}&#39;</h2> <label class="svelte-19xh1jj">Choose ping-pong court color :
			<select class="svelte-19xh1jj"><option value="green" data-svelte-h="svelte-1k1fjta">Sprite</option><option value="blue" data-svelte-h="svelte-13mmx0f">Pepsi Blue</option><option value="orange" data-svelte-h="svelte-9l8byo">Fanta</option></select></label>  <label for="speed-range" class="label svelte-19xh1jj">Speed : 
				<input type="range" id="speed-range" min="1" max="3" class="range svelte-19xh1jj"${add_attribute("value", speed, 0)}> <span>${escape(speed)} / 3</span></label> <label class="svelte-19xh1jj">Paddle Size :
			<select class="svelte-19xh1jj"><option value="normal" data-svelte-h="svelte-1dkk9p2">normal</option><option value="small" data-svelte-h="svelte-1t68eqo">small</option><option value="invisible" data-svelte-h="svelte-rkwdmo">invisible</option></select></label> <label class="svelte-19xh1jj">Score to Win :
			<select class="svelte-19xh1jj"><option value="3" data-svelte-h="svelte-1ulgbgg">3 vs 3</option><option value="5" data-svelte-h="svelte-3u38b6">5 vs 5</option></select></label> <button type="submit" class="svelte-19xh1jj" data-svelte-h="svelte-1tzeix">Create Game</button></div></form>`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_showModal();
  return $$rendered;
});
export {
  Page as default
};
