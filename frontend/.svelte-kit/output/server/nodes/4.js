

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/game/matchmaking/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.594f144a.js","_app/immutable/chunks/scheduler.7c1da786.js","_app/immutable/chunks/index.7a22757c.js"];
export const stylesheets = ["_app/immutable/assets/4.b60d01cb.css"];
export const fonts = [];
