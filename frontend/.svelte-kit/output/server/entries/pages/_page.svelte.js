import { c as create_ssr_component, i as is_promise, n as noop, v as validate_component } from "../../chunks/ssr.js";
import { E as ErrorModal } from "../../chunks/ErrorModal.js";
import { s as showModal, a as selectedPage, e as errorMsg } from "../../chunks/ModalValues.js";
import { M as Modal } from "../../chunks/Modal.js";
const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
function is_void(name) {
  return void_element_names.test(name) || name.toLowerCase() === "!doctype";
}
const Game = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div data-svelte-h="svelte-wnhymx"><h1>🏓 Voici Le Game 🏓</h1> <div> <img src="images/imgT1.jpg" alt="Image presentation"></div></div>`;
});
const Chat = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div data-svelte-h="svelte-a3ezqs"><h1>😺 VOici Le Chat 💬</h1> <div> <img src="images/imgT2.jpg" alt="Image presentation"></div></div>`;
});
var MediaMatcher = window.matchMedia || // @ts-ignore
window["webkitMatchmedia"] || window["mozMatchmedia"] || window["oMatchmedia"];
function MediaQuery(query) {
  return MediaMatcher != null && MediaMatcher(query).matches;
}
function DocumentIsReady() {
  return document.readyState === "interactive" || document.readyState === "complete";
}
var ViewportWidth = 0;
var ViewportHeight = 0;
function determineViewportSize() {
  ViewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  ViewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
}
determineViewportSize();
var ScreenOrientation = void 0;
var detailledScreenOrientation = void 0;
function determineScreenOrientation() {
  var Orientation;
  if ("orientation" in window.Screen) {
    Orientation = window.screen.orientation.type;
  }
  switch (Orientation) {
    case "portrait-primary":
    case "portrait-secondary":
      ScreenOrientation = "portrait";
      detailledScreenOrientation = Orientation;
      break;
    case "landscape-primary":
    case "landscape-secondary":
      ScreenOrientation = "landscape";
      detailledScreenOrientation = Orientation;
      break;
    default:
      switch (true) {
        case MediaQuery("(orientation:portrait)"):
          ScreenOrientation = "portrait";
          break;
        case MediaQuery("(orientation:landscape)"):
        case ViewportWidth > ViewportHeight:
          ScreenOrientation = "landscape";
          break;
        default:
          ScreenOrientation = "portrait";
      }
      detailledScreenOrientation = void 0;
  }
  if (DocumentIsReady()) {
    document.body.classList.remove("Portrait", "Landscape", "Portrait-primary", "Portrait-secondary", "Landscape-primary", "Landscape-secondary");
    switch (ScreenOrientation) {
      case "portrait":
        document.body.classList.add("Portrait");
        break;
      case "landscape":
        document.body.classList.add("Landscape");
        break;
    }
    if (detailledScreenOrientation != null) {
      var capitalized = function(Name) {
        return Name[0].toUpperCase() + Name.slice(1);
      };
      document.body.classList.add(capitalized(detailledScreenOrientation));
    }
  }
}
determineScreenOrientation();
if (!DocumentIsReady()) {
  window.addEventListener("DOMContentLoaded", determineScreenOrientation);
}
var oldViewportWidth = ViewportWidth;
var oldViewportHeight = ViewportHeight;
var oldScreenOrientation = ScreenOrientation;
var oldDetailledScreenOrientation = detailledScreenOrientation;
function rememberSettings() {
  oldViewportWidth = ViewportWidth;
  oldViewportHeight = ViewportHeight;
  oldScreenOrientation = ScreenOrientation;
  oldDetailledScreenOrientation = detailledScreenOrientation;
}
function submitEvents() {
  if (!DocumentIsReady()) {
    return;
  }
  if (oldViewportWidth !== ViewportWidth || oldViewportHeight !== ViewportHeight) {
    document.body.dispatchEvent(new Event("viewportchanged", { bubbles: true, cancelable: true }));
  }
  if (oldScreenOrientation !== ScreenOrientation || oldDetailledScreenOrientation !== detailledScreenOrientation) {
    document.body.dispatchEvent(new Event("orientationchangeend", { bubbles: true, cancelable: true }));
  }
}
var Poller;
var PollCounter = 0;
var PollCounterLimit = 10;
function stopPolling() {
  clearInterval(Poller);
  Poller = void 0;
  PollCounter = 0;
}
function pollForViewportAfterOrientationChange() {
  Poller = setInterval(function() {
    determineViewportSize();
    if (
      // no update of screen size yet? => continue polling
      oldViewportWidth === ViewportWidth && oldViewportHeight === ViewportHeight
    ) {
      PollCounter += 1;
      if (PollCounter <= PollCounterLimit) {
        return;
      }
    }
    stopPolling();
    determineScreenOrientation();
    submitEvents();
    rememberSettings();
  }, 100);
}
function determineViewportSizeAndScreenOrientation() {
  determineViewportSize();
  determineScreenOrientation();
  if (Poller != null) {
    stopPolling();
    submitEvents();
    rememberSettings();
  }
  if (oldViewportWidth === ViewportWidth && oldViewportHeight === ViewportHeight) {
    pollForViewportAfterOrientationChange();
  } else {
    submitEvents();
    rememberSettings();
  }
}
window.addEventListener("orientationchange", function() {
  setTimeout(determineViewportSizeAndScreenOrientation, 10);
});
window.addEventListener("resize", determineViewportSizeAndScreenOrientation);
if ("orientation" in screen) {
  screen.orientation.addEventListener("change", function() {
    setTimeout(determineViewportSizeAndScreenOrientation, 10);
  });
}
const Typewriter_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "@keyframes svelte-1gv2i7t-cursorFade{0%,100%{opacity:1}50%{opacity:0}}.typewriter-container.svelte-1gv2i7t *:not(.typing):not(.finished-typing):not([data-static]){display:none}.typewriter-container.svelte-1gv2i7t .finished-typing::after{content:none}.cursor.svelte-1gv2i7t .typing::after{content:'';width:var(--cursor-width, 1ch);height:2ch;display:inline-block;vertical-align:text-top;background-color:var(--cursor-color, #000000);animation:svelte-1gv2i7t-cursorFade 1.25s infinite}",
  map: null
};
const Typewriter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isLoopMode;
  let isFiniteCursorMode;
  let invalidCursorOnFinish;
  let invalidCursorOnDelay;
  let invalidLoopProps;
  let invalidScrambleProps;
  let unnecessaryCursorOnFinish;
  let delayPromise;
  let { mode = "concurrent" } = $$props;
  let { interval = 30 } = $$props;
  let { cursor = true } = $$props;
  let { keepCursorOnFinish = false } = $$props;
  let { delay = 0 } = $$props;
  let { showCursorOnDelay = false } = $$props;
  let { disabled = false } = $$props;
  let { element = "div" } = $$props;
  let { scrambleDuration = 3e3 } = $$props;
  let { scrambleSlowdown = true } = $$props;
  let { unwriteInterval = 30 } = $$props;
  let { wordInterval = 1500 } = $$props;
  const modes = {
    concurrent: () => import("../../chunks/concurrent.js"),
    cascade: () => import("../../chunks/cascade.js"),
    loop: () => import("../../chunks/loop.js"),
    loopOnce: () => import("../../chunks/loopOnce.js"),
    loopRandom: () => import("../../chunks/loopRandom.js"),
    scramble: () => import("../../chunks/scramble.js")
  };
  if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0)
    $$bindings.mode(mode);
  if ($$props.interval === void 0 && $$bindings.interval && interval !== void 0)
    $$bindings.interval(interval);
  if ($$props.cursor === void 0 && $$bindings.cursor && cursor !== void 0)
    $$bindings.cursor(cursor);
  if ($$props.keepCursorOnFinish === void 0 && $$bindings.keepCursorOnFinish && keepCursorOnFinish !== void 0)
    $$bindings.keepCursorOnFinish(keepCursorOnFinish);
  if ($$props.delay === void 0 && $$bindings.delay && delay !== void 0)
    $$bindings.delay(delay);
  if ($$props.showCursorOnDelay === void 0 && $$bindings.showCursorOnDelay && showCursorOnDelay !== void 0)
    $$bindings.showCursorOnDelay(showCursorOnDelay);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.element === void 0 && $$bindings.element && element !== void 0)
    $$bindings.element(element);
  if ($$props.scrambleDuration === void 0 && $$bindings.scrambleDuration && scrambleDuration !== void 0)
    $$bindings.scrambleDuration(scrambleDuration);
  if ($$props.scrambleSlowdown === void 0 && $$bindings.scrambleSlowdown && scrambleSlowdown !== void 0)
    $$bindings.scrambleSlowdown(scrambleSlowdown);
  if ($$props.unwriteInterval === void 0 && $$bindings.unwriteInterval && unwriteInterval !== void 0)
    $$bindings.unwriteInterval(unwriteInterval);
  if ($$props.wordInterval === void 0 && $$bindings.wordInterval && wordInterval !== void 0)
    $$bindings.wordInterval(wordInterval);
  $$result.css.add(css$1);
  isLoopMode = /^loop(Once|Random)?$/.test(mode);
  isFiniteCursorMode = ["concurrent", "cascade", "loopOnce"].includes(mode);
  invalidCursorOnFinish = !isFiniteCursorMode && keepCursorOnFinish;
  invalidCursorOnDelay = delay < 1 && showCursorOnDelay;
  invalidLoopProps = !isLoopMode && ($$props.unwriteInterval || $$props.wordInterval);
  invalidScrambleProps = mode !== "scramble" && ($$props.scrambleDuration || $$props.scrambleSlowdown);
  unnecessaryCursorOnFinish = typeof keepCursorOnFinish === "number" && keepCursorOnFinish < 1;
  invalidCursorOnFinish && console.warn("[svelte-typewriter] The prop 'keepCursorOnFinish' is compatible only with finite modes");
  invalidCursorOnDelay && console.warn("[svelte-typewriter] The prop 'showCursorOnDelay' has no effect if the delay is 0");
  invalidLoopProps && console.warn("[svelte-typewriter] The props 'unwriteInterval' and 'wordInterval' are only compatible with loop modes");
  invalidScrambleProps && console.warn("[svelte-typewriter] The props 'scrambleDuration' and 'scrambleSlowdown' are only compatible with scramble mode");
  unnecessaryCursorOnFinish && console.warn("[svelte-typewriter] The prop 'keepCursorOnFinish' has no effect with values lower than 1");
  delayPromise = () => new Promise((resolve) => setTimeout(() => resolve(delay), delay));
  return `<noscript>${slots.default ? slots.default({}) : ``}</noscript> ${disabled ? `<div class="typewriter-container svelte-1gv2i7t">${slots.default ? slots.default({}) : ``}</div>` : `${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return ` ${showCursorOnDelay ? `<div class="typewriter-container cursor svelte-1gv2i7t" data-svelte-h="svelte-1ssf3hl"><p class="typing"></p></div>` : ``} `;
    }
    return function() {
      return ` ${function(__value2) {
        if (is_promise(__value2)) {
          __value2.then(null, noop);
          return ``;
        }
        return function(selectedMode) {
          return ` ${((tag) => {
            return tag ? `<${element} class="${["typewriter-container svelte-1gv2i7t", cursor ? "cursor" : ""].join(" ").trim()}">${is_void(tag) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
          })(element)} `;
        }();
      }(modes[mode]())} `;
    }();
  }(delayPromise())}`}`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: '.main.svelte-446j0u{background-image:url("/images/backgroundImg.jpg");background-repeat:no-repeat;background-size:cover;background-position:center;z-index:1;content:"";position:relative;top:0;left:0;width:100vw;height:100vh;margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center}autoTyping.svelte-446j0u{content:"";margin-top:-620px;font-size:2rem;text-align:center}.py-2.svelte-446j0u,.py-1.svelte-446j0u,.py-0.svelte-446j0u{font-family:fantasy}',
  map: null
};
let show_Modal;
showModal.subscribe((a) => {
  show_Modal = a;
});
let selectedPage_Value;
selectedPage.subscribe((a) => {
  selectedPage_Value = a;
});
let msgError = "";
errorMsg.subscribe((a) => {
  msgError = a;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<main><div class="main svelte-446j0u"><autoTyping class="svelte-446j0u">${validate_component(Typewriter, "Typewriter").$$render($$result, { loopRandom: true }, {}, {
    default: () => {
      return `<p class="py-2 text-2xl text-white svelte-446j0u" data-svelte-h="svelte-1r1gax2">In a realm of digital wizardry, a land of fascination.</p> <p class="py-1 text-2xl text-white svelte-446j0u" data-svelte-h="svelte-1ppzxyi">Our Transcendence project, a tale of innovation.</p> <p class="py-1 text-2xl text-white svelte-446j0u" data-svelte-h="svelte-14x69hr">Users are about to embark, an epic recreation, A cosmic Pong game, a matchmaking duel</p>  <p class="py-1 text-2xl text-white svelte-446j0u" data-svelte-h="svelte-6ysn8z">Within this mystical Nestjs and sevlte, a grand foundation,An interface of elegance, a futuristic narration.</p>  <p class="py-0 text-2xl text-white svelte-446j0u" data-svelte-h="svelte-b3n85d">Designed to traverse space, a cosmic exploration, Uniting players in time, a cosmic synchronization.</p>  <p class="py-0 text-2xl text-white svelte-446j0u" data-svelte-h="svelte-f45jej">A chat feature will serve, a global communication, Among interstellar gladiators, a cosmic federation.</p> `;
    }
  })}</autoTyping> ${show_Modal ? `${validate_component(Modal, "Modal").$$render($$result, {}, {}, {
    default: () => {
      return `  ${selectedPage_Value === "chat" ? `${validate_component(Chat, "Chat").$$render($$result, {}, {}, {})}` : `${selectedPage_Value === "game" ? `${validate_component(Game, "Game").$$render($$result, {}, {}, {})} ` : `${selectedPage_Value === "errorMsg" ? `${validate_component(ErrorModal, "ErrorModal").$$render($$result, { msg: msgError }, {}, {})}` : ``}`}`}`;
    }
  })}` : ``}</div>   </main> `;
});
export {
  Page as default
};
