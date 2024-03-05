import { c as create_ssr_component, o as onDestroy, b as add_attribute } from "../../../../chunks/ssr.js";
import "colyseus.js";
import { f as inGame, n as navbar } from "../../../../chunks/store.js";
import { c as closeModal } from "../../../../chunks/ModalValues.js";
import "../../../../chunks/gameRender.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "canvas#rendering-canvas.svelte-1e7so1n{max-width:100%;max-height:100%;border:10px solid white}",
  map: null
};
async function LeaveGame() {
  const jwt = localStorage.getItem("jwt");
  const response = await fetch("http://localhost:3000/user/leaveGame", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json"
    }
  });
  if (response.ok) {
    console.log("-[ Leave Game ]- ");
  }
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let room;
  let canvas;
  onDestroy(() => {
    room.send("player_disconnected", {
      messageDuFront: "Salut du Frontend onDestroy SveltKit !"
    });
    room.leave();
    inGame.set(false);
    LeaveGame();
    closeModal();
    navbar.set(true);
    console.log("Le composant [Game/Create] a été démonté.");
  });
  $$result.css.add(css);
  return `  <canvas id="rendering-canvas" class="svelte-1e7so1n"${add_attribute("this", canvas, 0)}></canvas>`;
});
export {
  Page as default
};
