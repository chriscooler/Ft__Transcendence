

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/game/create/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.2c043665.js","_app/immutable/chunks/scheduler.7c1da786.js","_app/immutable/chunks/index.7a22757c.js","_app/immutable/chunks/store.7f25bae6.js","_app/immutable/chunks/index.dfdd8657.js"];
export const stylesheets = ["_app/immutable/assets/3.6787ba2e.css"];
export const fonts = [];
