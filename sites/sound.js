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

// These are for cards
var cardSound = function(msg) {
    switch (msg) {
        case "996":
            fubao.volume = 0.8;
            fubao.play();
            break;

        case "Blizzard":
            blizzard.volume = 0.8;
            blizzard.play();
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
            break;

        case "OnStandby":
            onStandby.volume = 0.8;
            onStandby.play();
            break;

        case "Blizzard":
            blizzard.volume = 0.8;
            blizzard.play();
            break;

        case "Rain":
            rain.volume = 0.8;
            rain.play();
            break;

        case "Cut":
            cut.volume = 1;
            cut.play();
            break;

        case "MegaCut":
            megaCut.volume = 1;
            megaCut.play();
            break;

        case "OrganClone":
            organClone.volume = 0.4;
            organClone.play();
            break;

        case "HumanClone":
            humanClone.volume = 0.8;
            humanClone.play();
            break;

        case "Purification":
            purification.volume = 0.3;
            purification.play();
            break;

        case "Sacrifice":
            sacrifice.volume = 0.4;
            sacrifice.play();
            break;

        case "Resurgence":
            resurgence.volume = 0.1;
            resurgence.play();
            break;

        case "DefensiveLine":
            defense.volume = 0.8;
            defense.play();
            break;

        case "Hospital":
            hospital.volume = 0.8;
            hospital.play();
            break;

        case "Quarantine":
            quarantine.volume = 0.8;
            quarantine.play();
            break;

        case "EnhancedHealing":
            enhancedHealing.volume = 0.8;
            enhancedHealing.play();
            break;

        case "CellBroadcast":
            cellbd.volume = 0.8;
            cellbd.play();
            break;

        case "Drought":
            drought.volume = 0.8;
            drought.play();
            break;

        case "Warehouse":
            warehouse.volume = 0.8;
            warehouse.play();
            break;

        case "GoingViral":
            goingVirus.volume = 0.6;
            goingVirus.play();
            break;

        case "Judgement":
            judgement.volume = 0.3;
            judgement.play();
            break;

        case "Infrasound":
            lowsound.volume = 0.8;
            lowsound.play();
            break;

        case "CompulsoryMedicalRecruitment":
            compulsorymedical.volume = 0.2;
            compulsorymedical.play();
            break;

        case "FirstAid":
            firstAid.volume = 0.8;
            firstAid.play();
            break;

        case "MedicalMobilization":
            medicalMobalization.volume = 0.2;
            medicalMobalization.play();
            break;

        default:
            break;
    }
};

// This is to subscirbe
app.ports.cardToMusic.subscribe(cardSound);