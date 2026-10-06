// wwwroot/js/audio.js
// Plays a sound file from wwwroot/sounds. Errors (e.g. autoplay blocked) are ignored.
window.playSound = (file) => {
    const audio = new Audio(`sounds/${file}`);
    audio.volume = 0.6;
    audio.play().catch(() => {
        /* ignore autoplay/decode errors */
    });
};