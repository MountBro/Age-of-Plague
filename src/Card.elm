module Card exposing (..)

import Random exposing (Generator, list, map)
import Random.List exposing (choose)


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
    | EnhanceHealingI
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


allCards =
    [ powerOverload
    , onStandby
    , coldWave
    , blizzard
    , rain
    , cut
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
    , quarantine
    , enhanceHealing
    , cellBroadcast
    , drought
    , warehouse
    , warmwave
    , goingViral
    , judgement
    , lowSoundWave
<<<<<<< HEAD
=======
    , compulsoryMR
    , firstAid
    , medMob
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8
    ]


cardGenerator : Generator Card
cardGenerator =
    choose allCards
        |> Random.map (\( x, y ) -> Maybe.withDefault cut x)


cardsGenerator : Int -> Generator (List Card)
cardsGenerator n =
    choose allCards
        |> Random.map (\( x, y ) -> Maybe.withDefault cut x)
        |> Random.list n


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
<<<<<<< HEAD
        "There is a probability of 50% to freeze the spread of viruses spread for 1 round."
=======
        "50% of virus freezing chance."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


blizzard =
    Card
        NoSel
        8
        [ FreezeI, FreezeI, FreezeI ]
        "Blizzard"
<<<<<<< HEAD
        "Freeze the spread of viruses spread for 3 rounds."
=======
        "Freeze the viruses."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


rain =
    Card
        NoSel
        3
        [ EcoDoubleI_Freeze 0.5, EcoDoubleI_Freeze 0.5 ]
        "Rain"
<<<<<<< HEAD
        "In two rounds, there is a probability of 50% to freeze the spread of viruses for 1 round. The economy output doubles for two rounds."
=======
        "50% of virus freezing chance.\nThe economy output doubles."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


cut =
    Card
        HexSel
        1
        [ CutHexI ( 0, 0 ) ]
        "Cut"
<<<<<<< HEAD
        "Eliminate the virus on the chosen hex."
=======
        "Eliminate virus on the chosen hex."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


megaCut =
    Card
        TileSel
        5
        [ CutTileI ( 0, 0 ) ]
        "Mega Cut"
<<<<<<< HEAD
        "Eliminate the virus on the chosen tile."
=======
        "Eliminate virus on the chosen tile."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


fubao =
    Card
        NoSel
        1
        [ Activate996I, Activate996I ]
        "996"
<<<<<<< HEAD
        "The next 2 rounds, economy temporarily doubles, but the death rate permanently rises 5%."
=======
        "Economy doubles\ndeath rate increases 5%."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


organClone =
    Card
        TileSel
        3
        [ OrganCloneI ( 0, 0 ) ]
        "Organ Clone"
<<<<<<< HEAD
        "Each one of the dead on the selected tile could save one infected."
=======
        "One local dead saves one patient."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


humanClone =
    Card
        TileSel
        3
        [ HumanCloneI ( 0, 0 ) ]
        "Human Clone"
<<<<<<< HEAD
        "Double the population of a certain tile."
=======
        "Double the local population."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


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
<<<<<<< HEAD
        "Heal all patients in a certain tile."
=======
        "Heal all local patients."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


sacrifice =
    Card
        TileSel
        4
        [ SacrificeI ( 0, 0 ) ]
        "Sacrifice"
<<<<<<< HEAD
        "Select a tile. Kill both the viruses and the infected people."
=======
        "Kill local virus and patients."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


resurgence =
    Card
        TileSel
        8
        [ ResurgenceI ( 0, 0 ) ]
        "Resurgence"
<<<<<<< HEAD
        "For each tile, restore 20% of the dead."
=======
        "Restore 20% of the dead."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


defenseline =
    Card
        TileSel
        2
        [ FreezevirusI ( 0, 0 ), FreezevirusI ( 0, 0 ) ]
        "Defensive Line"
<<<<<<< HEAD
        "Froze the spread of viruses for 2 rounds."
=======
        "Froze virus."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


hospital =
    Card
        TileSel
        4
        [ HospitalI ( 0, 0 ) ]
<<<<<<< HEAD
        "Build Hospital"
        "Put a hospital on a tile."
=======
        "Hospital"
        "Build hospital."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


quarantine =
    Card
        TileSel
        4
        [ QuarantineI ( 0, 0 ) ]
<<<<<<< HEAD
        "Build Quarantine"
        "Put one tile in quarantine."
=======
        "Quarantine"
        "Build a quarantine tile."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


enhanceHealing =
    Card
        NoSel
        4
        [ EnhanceHealingI ]
        "Enhance healing"
<<<<<<< HEAD
        "Raise the efficiency of hospital healing by 1."
=======
        "All hospital healing +1."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


cellBroadcast =
    Card
        TileSel
        4
        [ AttractPeoI ( 0, 0 ), StopAttractI ( 0, 0 ) ]
        "Cell Broadcast"
<<<<<<< HEAD
        "In the selected tile, no one could go out during the next population flow."
=======
        "Ban local population flow."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


drought =
    Card
        TileSel
        2
        [ DroughtI_Kill ( ( 0, 0 ), 0.5 ), DroughtI_Kill ( ( 0, 0 ), 0.5 ) ]
        "Drought"
<<<<<<< HEAD
        "In two rounds in the selected tile, the viruses have a probability of 50% to die. The economy output halves for two rounds."
=======
        "50% to kill local virus,\neconomy output halves."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


warehouse =
    Card
        TileSel
        2
        [ WarehouseI ( 0, 0 ) ]
        "Warehouse"
<<<<<<< HEAD
        "Put a warehouse on a tile, +5 economy per round."
=======
        "+5 economy per round."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


warmwave =
    Card
        TileSel
        1
        [ Warmwave_KIA ( ( 0, 0 ), 0.25 ) ]
        "Warmwave"
<<<<<<< HEAD
        "Choose a tile. There is a probability of 25% to kill the viruses."
=======
        "25% of chance to kill the local virus."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


goingViral =
    Card
        TileSel
        8
        [ AVI ( 0, 0 ) ]
        "Going Viral"
<<<<<<< HEAD
        "Release the nano-viruses, which move randomly for 3 rounds and have a cut effect."
=======
        "Release the anti-virus."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


judgement =
    Card
        TileSel
        6
        [ JudgeI_Kill ( ( 0, 0 ), 0.25 ) ]
        "Judgement"
<<<<<<< HEAD
        "On the selected tile, either the people or the viruses die. The probability is 50%."
=======
        "Purify or destory tile."
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


lowSoundWave =
    Card
        TileSel
        4
        [ EvacuateI ( 0, 0 ), StopEVAI ( 0, 0 ) ]
        "Low Sound Wave"
<<<<<<< HEAD
        "Select a tile. Distribute all population to the neighboring tiles during the next population flow."
=======
        "Evacuate the tile."


compulsoryMR = --CompulsoryMedicalRecruitment
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
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8


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
