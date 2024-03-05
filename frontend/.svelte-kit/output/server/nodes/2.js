

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/game/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.034cc27e.js","_app/immutable/chunks/scheduler.7c1da786.js","_app/immutable/chunks/index.7a22757c.js"];
export const stylesheets = ["_app/immutable/assets/2.8a217fa8.css"];
export const fonts = [];
