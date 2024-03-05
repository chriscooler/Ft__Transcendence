import { w as writable } from "./index.js";
let showModal = writable(false);
let selectedPage = writable("none");
function closeModal() {
  showModal.set(false);
  selectedPage.set("none");
}
let errorMsg = writable("");
export {
  selectedPage as a,
  closeModal as c,
  errorMsg as e,
  showModal as s
};
