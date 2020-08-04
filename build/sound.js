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
var fubao = new Audio("./assets/sound/card/996.wav");
var blizzard = new Audio("./assets/sound/card/Blizzard.mp3");
var cellbd = new Audio("./assets/sound/card/CellBroadcast.mp3");
var coldwave = new Audio("./assets/sound/card/ColdWave.mp3");
var compulsorymedical = new Audio("./assets/sound/card/CompulsoryMedicalRecruiment.mp3");
var cut = new Audio("./assets/sound/card/Cut.mp3");
var defense = new Audio("./assets/sound/card/DefensiveLine.mp3");
var drought = new Audio("./assets/sound/card/Drought.mp3");
var enhancedHealing = new Audio("./assets/sound/card/EnhancedHealing.mp3");
var firstAid = new Audio("./assets/sound/card/FirstAid.mp3");
var goingVirus = new Audio("./assets/sound/card/GoingViral.mp3");
var hospital = new Audio("./assets/sound/card/Hospital.mp3");
var humanClone = new Audio("./assets/sound/card/HumanClone.mp3");
var judgement = new Audio("./assets/sound/card/Judgement.mp3");
var lowsound = new Audio("./assets/sound/card/LowsoundWaves.mp3");
var medicalMobalization = new Audio("./assets/sound/card/MedicalMobilization.mp3");
var megaClone = new Audio("./assets/sound/card/MegaClone.mp3");
var megaCut = new Audio("./assets/sound/card/MegaCut.mp3");
var onStandby = new Audio("./assets/sound/card/OnStandby.mp3");
var organClone = new Audio("./assets/sound/card/OrganClone.mp3");
var poweroverload = new Audio("./assets/sound/card/PowerOverload.mp3");
var purification = new Audio("./assets/sound/card/Purification.mp3");
var quarantine = new Audio("./assets/sound/card/Quarantine.mp3");
var rain = new Audio("./assets/sound/card/Rain.mp3");
var resurgence = new Audio("./assets/sound/card/Resurgence.mp3");
var sacrifice = new Audio("./assets/sound/card/Sacrifice.mp3");
var warehouse = new Audio("./assets/sound/card/Warehouse.mp3");
var warmWave = new Audio("./assets/sound/card/WarmWave.mp3");

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
// var bgmSound = function(msg) {
//     switch (msg) {
//         case "1":
//             bgmTt.play(); // "Tutorial"
//         case "2":
//             bgmTt.play(); // "Tutorial"
//         case "3":
//             bgm1.play(); // "Atlanta"
//         case "4":
//             bgm2.play(); // "Amber"
//         case "5":
//             bgm3.play(); // "St.P"
//         case "6":
//             bgmEndless.play(); // "Endless"
//     }
// }

// These are for cards
var cardSound = function(msg) {
    switch (msg) {
        case "996":
            fubao.volume = 0.8;
            fubao.play();
            break;

        case "Blizzard":
            ice.volume = 0.8;
            ice.play();
            break;

        case "MegaClone":
            megaClone.volume = 0.8;
            megaClone.play();
            break;

        case "ColdWave":
            coldwave.volume = 0.8;
            coldwave.play();
            break;

        case "PowerOverload":
            poweroverload.volume = 0.8;
            poweroverload.play();

        case "OnStandby":
            onStandby.volume = 0.8;
            onStandby.play();

        case "Blizzard":
            blizzard.volume = 0.8;
            blizzard.play();

        case "Rain":
            rain.volume = 0.8;
            rain.play()

        case "Cut":
            cut.volume = 0.8;
            cut.play();

        case "MegaCut":
            megaCut.volume = 0.8;
            megaCut.play();

        default:
            break;
    }
};

// This is to stop the music
var cease = function(msg) {
    bgm1.pause();
    bgm2.pause();
    bgm3.pause();
    bgmTt.pause();
    bgmEndless.pause();
}

// This is to subscirbe
app.ports.cardToMusic.subscribe(cardSound);
app.ports.pause.subscribe(cease);