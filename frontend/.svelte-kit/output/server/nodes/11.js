

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/game/matchmaking/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/11.dca2542f.js","_app/immutable/chunks/scheduler.7c1da786.js","_app/immutable/chunks/gameRender.d8bcad45.js","_app/immutable/chunks/store.7f25bae6.js","_app/immutable/chunks/index.dfdd8657.js","_app/immutable/chunks/paths.0e6369ab.js","_app/immutable/chunks/index.7a22757c.js","_app/immutable/chunks/ModalValues.a888a47e.js"];
export const stylesheets = ["_app/immutable/assets/11.b2654d7b.css"];
export const fonts = [];
