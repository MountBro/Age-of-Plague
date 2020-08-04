// This is the bgm music
var ctnr = document.getElementById("ctr");
ctnr.addEventListener("mouseover", playBgm);
document.addEventListener("mouseover", playBgm);

// The BGMs
var bgm1 = new Audio("./assets/sound/bgm/Atlanta_Glenn Stafford,Derek Duke,Tracy Bush - Dark Covenant.mp3");
var bgm2 = new Audio("./assets/sound/bgm/Amber_Andreas Waldetoft - Robo Sapiens.mp3");
var bgm3 = new Audio("./assets/sound/bgm/St.P_Geoff Knorr - Japan (The Atomic Era).mp3");
var bgmTt = new Audio("./assets/sound/bgm/Tutorial_菅野祐悟 - virus.mp3");
var bgmEndless = new Audio("./assets/sound/bgm/Endless_Andreas Waldetoft - Stellaris Suite： Creation and Beyond.mp3");
// The cards' sound
var jiujiuliu = new Audio("./assets/music/996.wav");
var ice = new Audio("./assets/music/ice.wav");

// This is the Main page bgm
function playBgm() {
    var bgm = document.getElementById("bgm");
    bgm.volume = 0.2;
    bgm.play();
    document.removeEventListener('mouseover', playBgm)
}

// City names
// 1 Atlanta
// 2 Amber
// 3 St.P

// Level numbers
// 3 is city1; 4 is city2; 5 is city3
// 6 is endless


// These are all for different levels
var bgmSound = function(msg) {
    switch (msg) {
        case "1":
            bgmTt.play(); // "Tutorial"
        case "2":
            bgmTt.play(); // "Tutorial"
        case "3":
            bgm1.play(); // "Atlanta"
        case "4":
            bgm2.play(); // "Amber"
        case "5":
            bgm3.play(); // "St.P"
        case "6":
            bgmEndless.play(); // "Endless"
    }
}

// These are for cards
var cardSound = function(msg) {
    switch (msg) {
        case "996":
            jiujiuliu.volume = 0.8;
            jiujiuliu.play();
            break;

        case "Blizzard":
            ice.volume = 0.5;
            ice.play();

        default:
            break;
    }
};
app.ports.cardToMusic.subscribe(cardSound);
app.ports.playBgm.subscribe(bgmSound);