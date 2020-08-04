module Card exposing (..)

import List.Extra as LE


type alias Card =
    { selMode : Selection
    , cost : Int
    , action : List Action
    , name : String
    , describe : String
    , fd : String
    }


type alias Sel =
    ( Int, Int )


type Selection
    = HexSel
    | TileSel
    | NoSel


type Action
    = IncPowerI Int
    | FreezeI
    | Freeze Float
    | PowDoubleI_Freeze Float
    | NoAction
    | CutHexI ( Int, Int )
    | CutTileI ( Int, Int )
    | Summon (List Card)
    | Activate996I
    | OrganCloneI ( Int, Int )
    | HumanCloneI ( Int, Int )
    | MegaCloneI
    | PurificationI ( Int, Int )
    | SacrificeI ( Int, Int )
    | ResurgenceI ( Int, Int )
    | FreezevirusI ( Int, Int )
    | HospitalI ( Int, Int )
    | QuarantineI ( Int, Int )
    | EnhancedHealingI
    | AttractPeoI ( Int, Int )
    | StopAttractI ( Int, Int )
    | DroughtI_Kill ( ( Int, Int ), Float )
    | WarehouseI ( Int, Int )
    | Warmwave_KIA ( ( Int, Int ), Float )
    | AVI ( Int, Int )
    | JudgeI_Kill ( ( Int, Int ), Float )
    | EvacuateI ( Int, Int )
    | StopEVAI ( Int, Int )
    | DroughtRecoverI



-- Card -> String


cardPiles =
    [ cardPilestutorial, allCards, cardPile3, cardPile4, cardPile5, allCards ]


cardPilestutorial =
    [ blizzard ]


cardPile3 =
    -- Atlanta
    [ defenseline
    , defenseline
    , sacrifice
    , sacrifice
    , goingViral
    , goingViral
    , judgement
    , judgement
    , powerOverload
    , onStandby
    , coldWave
    , rain
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , megaCut
    , megaCut
    , megaCut
    , megaCut
    , megaCut
    , hospital
    , hospital
    , hospital
    , hospital
    , quarantine
    , enhancedHealing
    , enhancedHealing
    , cellBroadcast
    , warehouse
    , warmwave
    , lowSoundWave
    , compulsoryMR
    , firstAid
    , medMob
    , medMob
    , medMob
    ]


cardPile4 =
    --Amber
    [ megaClone
    , megaClone
    , organClone
    , organClone
    , organClone
    , resurgence
    , resurgence
    , purification
    , purification
    , purification
    , powerOverload
    , onStandby
    , coldWave
    , rain
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , megaCut
    , megaCut
    , megaCut
    , megaCut
    , fubao
    , humanClone
    , humanClone
    , humanClone
    , humanClone
    , hospital
    , hospital
    , quarantine
    , quarantine
    , enhancedHealing
    , cellBroadcast
    , warehouse
    , warmwave
    , lowSoundWave
    , compulsoryMR
    , firstAid
    , medMob
    , medMob
    ]


cardPile5 = -- St.P
    [ blizzard
    , blizzard
    , drought
    , drought
    , powerOverload
    , powerOverload
    , onStandby
    , coldWave
    , coldWave
    , rain
    , rain
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , megaCut
    , megaCut
    , megaCut
    , megaCut
    , fubao
    , hospital
    , hospital
    , quarantine
    , quarantine
    , enhancedHealing
    , cellBroadcast
    , warehouse
    , warmwave
    , warmwave
    , lowSoundWave
    , compulsoryMR
    , firstAid
    , medMob
    , medMob
    ]


allCards =
    [ powerOverload
    , onStandby
    , coldWave
    , blizzard
    , rain
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , cut
    , megaCut
    , megaCut
    , megaCut
    , megaCut
    , megaCut
    , megaCut
    , megaCut
    , fubao
    , organClone
    , humanClone
    , megaClone
    , purification
    , sacrifice
    , resurgence
    , defenseline
    , hospital
    , hospital
    , hospital
    , hospital
    , quarantine
    , quarantine
    , quarantine
    , enhancedHealing
    , cellBroadcast
    , drought
    , warehouse
    , warmwave
    , goingViral
    , judgement
    , lowSoundWave
    , compulsoryMR
    , firstAid
    , medMob
    ]


cardComparison : Card -> Card -> Order
cardComparison c1 c2 =
    if c1.cost < c2.cost then
        LT

    else if c1.cost > c2.cost then
        GT

    else if String.length c1.name > String.length c2.name then
        GT

    else if String.length c1.name < String.length c2.name then
        LT

    else
        EQ


toPngUrl : Card -> String
toPngUrl c =
    "./assets/cardPNG/" ++ String.replace " " "" c.name ++ ".png"


toSoundUrl : Card -> String
toSoundUrl c =
    "./assets/sound/" ++ String.replace " " "" c.name ++ ".wav"



-- sites/assets/sound/EnhancedHealing.wav


powerOverload =
    Card
        NoSel
        0
        [ IncPowerI 3, IncPowerI (negate 3) ]
        "Power Overload"
        "+3 power, next round -3 power."
        "+3 power, next round -3 power."



-- "https://wx1.sbimg.cn/2020/07/19/CyowU.png"


onStandby =
    Card
        NoSel
        0
        [ IncPowerI 2 ]
        "On Standby"
        "+2 power"
        "Immediately + 2 power."


coldWave =
    Card
        NoSel
        1
        [ Freeze 0.5 ]
        "Cold Wave"
        "50% of virus freezing chance."
        "There's a probability of 50% to freeze the spread \nof virus for 1 round."


blizzard =
    Card
        NoSel
        8
        [ FreezeI, FreezeI, FreezeI ]
        "Blizzard"
        "Freeze the viruses for 3 rounds."
        "Freeze the spread of virus for 3 rounds."


rain =
    Card
        NoSel
        3
        [ PowDoubleI_Freeze 0.5, PowDoubleI_Freeze 0.5 ]
        "Rain"
        "In two rounds,\n‧ 50% of virus freezing chance;\n‧ Power +1."
        "In two rounds, there is a probability of 50% to freeze\nthe spread of viruses for 1 round.\nPower +1 for two rounds."


cut =
    Card
        HexSel
        1
        [ CutHexI ( 0, 0 ) ]
        "Cut"
        "Eliminated virus on the chosen hex."
        "Eliminates virus on one hex."


megaCut =
    Card
        TileSel
        5
        [ CutTileI ( 0, 0 ) ]
        "Mega Cut"
        "Eliminated virus on the chosen tile."
        "Eliminates virus on one tile."


fubao =
    Card
        NoSel
        1
        [ Activate996I, Activate996I ]
        "996"
        "In two rounds, ‧Power +1;\n‧ Death rate becomes 105% in total."
        "In the next 2 rounds, +1 power, \nbut the death rate permanently rises 5%."


organClone =
    Card
        TileSel
        3
        [ OrganCloneI ( 0, 0 ) ]
        "Organ Clone"
        "Each local dead saves one patient."
        "Inside the chosen tile, each one of the dead could \nsave one infected."


humanClone =
    Card
        TileSel
        2
        [ HumanCloneI ( 0, 0 ) ]
        "Human Clone"
        "Double the local population."
        "Doubles the population of a certain tile."


megaClone =
    Card
        NoSel
        8
        [ MegaCloneI ]
        "Mega Clone"
        "Healthy population x1.5."
        "Healthy population x1.5."


purification =
    Card
        TileSel
        3
        [ PurificationI ( 0, 0 ) ]
        "Purification"
        "Heal all local patients."
        "Heal all patients in a tile."


sacrifice =
    Card
        TileSel
        4
        [ SacrificeI ( 0, 0 ) ]
        "Sacrifice"
        "Cleared local virus and patients."
        "Kill both the viruses and infected people in a tile."


resurgence =
    Card
        TileSel
        8
        [ ResurgenceI ( 0, 0 ) ]
        "Resurgence"
        "Restore 20% of the dead."
        "For the selected tile, restore 20% of the dead."


defenseline =
    Card
        TileSel
        4
        [ FreezevirusI ( 0, 0 ), FreezevirusI ( 0, 0 ) ]
        "Defensive Line"
        "Freezes the virus for 2 rounds\nin a tile."
        "Freezes the spread of viruses for 2 rounds in a tile"


hospital =
    Card
        TileSel
        4
        [ HospitalI ( 0, 0 ) ]
        "Hospital"
        "Build a hospital."
        "Puts a hospital on a tile."


quarantine =
    Card
        TileSel
        4
        [ QuarantineI ( 0, 0 ) ]
        "Quarantine"
        "Build a quarantine."
        "Puts one tile in quarantine"


enhancedHealing =
    Card
        NoSel
        4
        [ EnhancedHealingI ]
        "Enhanced Healing"
        "All existing hospital healing effect +1\n(not card [hospital]), maximum: +3."
        "Slightly raises the efficiency of hospital healing."


cellBroadcast =
    Card
        TileSel
        4
        [ AttractPeoI ( 0, 0 ), StopAttractI ( 0, 0 ) ]
        "Cell Broadcast"
        "Ban local population flow."
        "For a tile, attract 1 population from each\nneighboring tile."


drought =
    Card
        TileSel
        2
        [ DroughtI_Kill ( ( 0, 0 ), 0.5 ), DroughtI_Kill ( ( 0, 0 ), 0.5 ), DroughtRecoverI ]
        "Drought"
        "‧ 50% to kill local virus; \n‧ Power output halves."
        "Choose a tile, in two rounds, the viruses have\n a probability of 50% to die. \nThe power output halves for two rounds."


warehouse =
    Card
        TileSel
        4
        [ WarehouseI ( 0, 0 ) ]
        "Warehouse"
        "+2 maximum power."
        "+2 maximum power."


warmwave =
    Card
        TileSel
        1
        [ Warmwave_KIA ( ( 0, 0 ), 0.25 ) ]
        "Warm Wave"
        "25% of chance to kill the local virus."
        "Choose a tile. There is a probability of 25% \nto kill the viruses."


goingViral =
    Card
        TileSel
        8
        [ AVI ( 0, 0 ) ]
        "Going Viral"
        "Release the anti-virus."
        """Select a tile. Release the nano-viruses, 
which move randomly for 3 rounds and 
have a "cut" effect."""


judgement =
    Card
        TileSel
        6
        [ JudgeI_Kill ( ( 0, 0 ), 0.25 ) ]
        "Judgement"
        "Purify or destroy tile."
        "Select a tile. For each hex on and around \nthe tile, either the people or the viruses die. \nThe probability is 50%."


lowSoundWave =
    Card
        TileSel
        4
        [ EvacuateI ( 0, 0 ), StopEVAI ( 0, 0 ) ]
        "Infrasound"
        "Evacuate the tile."
        "Select a tile. Distribute all population to\n neighboring tiles."


compulsoryMR =
    --CompulsoryMedicalRecruitment
    Card
        NoSel
        6
        [ Summon [ megaCut, megaCut ] ]
        "Compulsory Medical Recruitment"
        "Summoned two [MegaCut]."
        "Immediately summons [MegaCut] x2"


firstAid =
    Card
        NoSel
        2
        [ Summon [ hospital ] ]
        "FirstAid"
        "Summoned one [Hospital]."
        "Immediately sommons one [Hospital]"


medMob =
    Card
        NoSel
        6
        [ Summon [ cut, cut, cut ] ]
        "Medical Mobilization"
        "Summoned three [Cut]."
        "Immediately summons [Cut] x3"


targetCardlst =
    [ cut
    , megaCut
    , organClone
    , humanClone
    , sacrifice
    , purification
    , resurgence
    , defenseline
    , hospital
    , quarantine
    , cellBroadcast
    , drought
    , warehouse
    , warmwave
    , goingViral
    , judgement
    , lowSoundWave
    ]


summonNum =
    ( [ medMob, firstAid, compulsoryMR ], [ 3, 1, 2 ] )
