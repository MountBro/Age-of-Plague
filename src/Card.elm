module Card exposing (..)


type alias Card =
    { selMode : Selection
    , cost : Int
    , action : List Action
    , name : String
    , describe : String
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
    | EcoDoubleI
    | EcoDoubleI_Freeze Float
    | DisableEvolveI
    | DisableEvolve Float
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



-- Card -> String


cardPiles =
    [ cardPilestutorial, allCards, cardPile3, cardPile4, cardPile5 ]


cardPilestutorial =
    [ blizzard ]


cardPile5 =
    -- St.P
    [ blizzard
    , blizzard
    , blizzard
    , drought
    , drought
    , powerOverload
    , onStandby
    , coldWave
    , coldWave
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
    , fubao
    , hospital
    , hospital
    , hospital
    , hospital
    , hospital
    , quarantine
    , quarantine
    , quarantine
    , enhancedHealing
    , cellBroadcast
    , warehouse
    , warehouse
    , warmwave
    , warmwave
    , lowSoundWave
    , compulsoryMR
    , firstAid
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
    , megaCut
    , fubao
    , humanClone
    , humanClone
    , humanClone
    , hospital
    , hospital
    , hospital
    , quarantine
    , quarantine
    , quarantine
    , enhancedHealing
    , cellBroadcast
    , warehouse
    , warehouse
    , warmwave
    , lowSoundWave
    , compulsoryMR
    , firstAid
    , medMob
    , medMob
    ]


cardPile3 =
    -- Atlanta
    [ defenseline
    , defenseline
    , sacrifice
    , sacrifice
    , goingViral
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
    , megaCut
    , megaCut
    , megaCut
    , megaCut
    , megaCut

    --, fubao
    --, humanClone
    , hospital
    , hospital
    , hospital
    , hospital
    , hospital
    , hospital
    , hospital
    , quarantine
    , enhancedHealing
    , enhancedHealing
    , enhancedHealing
    , cellBroadcast
    , warehouse
    , warehouse
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
    , megaCut
    , megaCut
    , megaCut
    , megaCut
    , fubao
    , organClone
    , humanClone
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
    , hospital
    , quarantine
    , quarantine
    , quarantine
    , enhancedHealing
    , cellBroadcast
    , drought
    , warehouse
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


powerOverload =
    Card
        NoSel
        0
        [ IncPowerI 3, IncPowerI (negate 3) ]
        "Power Overload"
        "+3 power, next round -3 power."



-- "https://wx1.sbimg.cn/2020/07/19/CyowU.png"


onStandby =
    Card
        NoSel
        0
        [ IncPowerI 2 ]
        "On Standby"
        "+2 power"


coldWave =
    Card
        NoSel
        1
        [ Freeze 0.5 ]
        "Cold Wave"
        "50% of virus freezing chance."


blizzard =
    Card
        NoSel
        8
        [ FreezeI, FreezeI, FreezeI ]
        "Blizzard"
        "Freeze the viruses."


rain =
    Card
        NoSel
        3
        [ EcoDoubleI_Freeze 0.5, EcoDoubleI_Freeze 0.5 ]
        "Rain"
        "50% of virus freezing chance.\nThe economy output doubles."


cut =
    Card
        HexSel
        1
        [ CutHexI ( 0, 0 ) ]
        "Cut"
        "Eliminate virus on the chosen hex."


megaCut =
    Card
        TileSel
        5
        [ CutTileI ( 0, 0 ) ]
        "Mega Cut"
        "Eliminate virus on the chosen tile."


fubao =
    Card
        NoSel
        1
        [ Activate996I, Activate996I ]
        "996"
        "Economy doubles\ndeath rate increases 5%."


organClone =
    Card
        TileSel
        3
        [ OrganCloneI ( 0, 0 ) ]
        "Organ Clone"
        "One local dead saves one patient."


humanClone =
    Card
        TileSel
        3
        [ HumanCloneI ( 0, 0 ) ]
        "Human Clone"
        "Double the local population."


megaClone =
    Card
        NoSel
        8
        [ MegaCloneI ]
        "Mega Clone"
        "The whole population x1.25."


purification =
    Card
        TileSel
        3
        [ PurificationI ( 0, 0 ) ]
        "Purification"
        "Heal all local patients."


sacrifice =
    Card
        TileSel
        4
        [ SacrificeI ( 0, 0 ) ]
        "Sacrifice"
        "Kill local virus and patients."


resurgence =
    Card
        TileSel
        8
        [ ResurgenceI ( 0, 0 ) ]
        "Resurgence"
        "Restore 20% of the dead."


defenseline =
    Card
        TileSel
        2
        [ FreezevirusI ( 0, 0 ), FreezevirusI ( 0, 0 ) ]
        "Defensive Line"
        "Froze virus."


hospital =
    Card
        TileSel
        4
        [ HospitalI ( 0, 0 ) ]
        "Hospital"
        "Build hospital."


quarantine =
    Card
        TileSel
        4
        [ QuarantineI ( 0, 0 ) ]
        "Quarantine"
        "Build a quarantine tile."


enhancedHealing =
    Card
        NoSel
        4
        [ EnhancedHealingI ]
        "Enhanced Healing"
        "All existing hospital healing +1."


cellBroadcast =
    Card
        TileSel
        4
        [ AttractPeoI ( 0, 0 ), StopAttractI ( 0, 0 ) ]
        "Cell Broadcast"
        "Ban local population flow."


drought =
    Card
        TileSel
        2
        [ DroughtI_Kill ( ( 0, 0 ), 0.5 ), DroughtI_Kill ( ( 0, 0 ), 0.5 ) ]
        "Drought"
        "50% to kill local virus,\neconomy output halves."


warehouse =
    Card
        TileSel
        4
        [ WarehouseI ( 0, 0 ) ]
        "Warehouse"
        "+2 economy per round."


warmwave =
    Card
        TileSel
        1
        [ Warmwave_KIA ( ( 0, 0 ), 0.25 ) ]
        "Warm Wave"
        "25% of chance to kill the local virus."


goingViral =
    Card
        TileSel
        8
        [ AVI ( 0, 0 ) ]
        "Going Viral"
        "Release the anti-virus."


judgement =
    Card
        TileSel
        6
        [ JudgeI_Kill ( ( 0, 0 ), 0.25 ) ]
        "Judgement"
        "Purify or destory tile."


lowSoundWave =
    Card
        TileSel
        4
        [ EvacuateI ( 0, 0 ), StopEVAI ( 0, 0 ) ]
        "Low Sound Wave"
        "Evacuate the tile."


compulsoryMR =
    --CompulsoryMedicalRecruitment
    Card
        NoSel
        6
        [ Summon [ megaCut, megaCut ] ]
        "Compulsory Medical Recruitment"
        "Summon two [ MegaCut ]."


firstAid =
    Card
        NoSel
        2
        [ Summon [ hospital ] ]
        "FirstAid"
        "Summon one [ Hospital ]."


medMob =
    Card
        NoSel
        6
        [ Summon [ cut, cut, cut ] ]
        "Medical Mobilization"
        "Summon three [ Cut ]."


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
    ([medMob, firstAid, compulsoryMR], [3, 1, 2])
