export const INTRO_STORAGE_KEY = "intro-seen";

// Runs before paint: hides the intro curtain on repeat visits in this session.
export const INTRO_SKIP_SCRIPT = `try{if(sessionStorage.getItem("${INTRO_STORAGE_KEY}"))document.documentElement.dataset.introSeen=""}catch(e){}`;
