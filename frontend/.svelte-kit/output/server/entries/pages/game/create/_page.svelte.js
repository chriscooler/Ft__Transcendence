import { c as create_ssr_component, o as onDestroy, b as add_attribute } from "../../../../chunks/ssr.js";
import "../../../../chunks/gameRender.js";
import "colyseus.js";
import { c as closeModal } from "../../../../chunks/ModalValues.js";
import { f as inGame, n as navbar } from "../../../../chunks/store.js";
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
  return `${``}  <canvas id="rendering-canvas"${add_attribute("this", canvas, 0)}></canvas>`;
});
export {
  Page as default
};
