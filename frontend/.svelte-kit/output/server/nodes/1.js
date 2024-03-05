

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.dcb91345.js","_app/immutable/chunks/scheduler.7c1da786.js","_app/immutable/chunks/index.7a22757c.js"];
export const stylesheets = ["_app/immutable/assets/1.c81b1adf.css"];
export const fonts = [];
