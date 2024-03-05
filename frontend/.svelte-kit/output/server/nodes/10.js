

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/game/create/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.bf0c6b93.js","_app/immutable/chunks/scheduler.7c1da786.js","_app/immutable/chunks/gameRender.d8bcad45.js","_app/immutable/chunks/store.7f25bae6.js","_app/immutable/chunks/index.dfdd8657.js","_app/immutable/chunks/paths.0e6369ab.js","_app/immutable/chunks/index.7a22757c.js","_app/immutable/chunks/ModalValues.a888a47e.js","_app/immutable/chunks/navigation.8a75274b.js","_app/immutable/chunks/singletons.954b5846.js"];
export const stylesheets = [];
export const fonts = [];
