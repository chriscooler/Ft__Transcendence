

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/DM/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.96e3fd90.js","_app/immutable/chunks/scheduler.7c1da786.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/index.7a22757c.js","_app/immutable/chunks/store.7f25bae6.js","_app/immutable/chunks/index.dfdd8657.js"];
export const stylesheets = ["_app/immutable/assets/6.983dcae9.css"];
export const fonts = [];
