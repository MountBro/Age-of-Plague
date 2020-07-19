module Card exposing (..)

import Random exposing (Generator, list, map)
import Random.List exposing (choose)


type alias Card =
    { selMode : Selection
    , cost : Int
    , action : List Action
    , name : String
    , describe : String
    , url : String
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
    , lowSoundWaves
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


powerOverload =
    Card
        NoSel
        0
        [ IncPowerI 3, IncPowerI (negate 3) ]
        "Power Overload"
        "+3 power, next round -3 power."
        "https://wx1.sbimg.cn/2020/07/19/CyowU.png"


onStandby =
    Card
        NoSel
        0
        [ IncPowerI 2 ]
        "On Standby"
        "+2 power"
        ""


coldWave =
    Card
        NoSel
        1
        [ Freeze 0.5 ]
        "Cold Wave"
        "There is a probability of 50% to freeze the spread of viruses spread for 1 round."
        ""


blizzard =
    Card
        NoSel
        8
        [ FreezeI, FreezeI, FreezeI ]
        "Blizzard"
        "Freeze the spread of viruses spread for 3 rounds."
        "https://wx1.sbimg.cn/2020/07/19/CyMCw.png"


rain =
    Card
        NoSel
        3
        [ EcoDoubleI_Freeze 0.5, EcoDoubleI_Freeze 0.5 ]
        "Rain"
        "In two rounds, there is a probability of 50% to freeze the spread of viruses for 1 round. The economy output doubles for two rounds."
        ""


cut =
    Card
        HexSel
        1
        [ CutHexI ( 0, 0 ) ]
        "Cut"
        "Eliminate the virus on the chosen hex."
        "https://wx1.sbimg.cn/2020/07/18/ClofD.png"


megaCut =
    Card
        TileSel
        5
        [ CutTileI ( 0, 0 ) ]
        "Mega Cut"
        "Eliminate the virus on the chosen tile."
        "https://wx2.sbimg.cn/2020/07/19/CykX1.png"


fubao =
    Card
        NoSel
        1
        [ Activate996I, Activate996I ]
        "996"
        "The next 2 rounds, economy temporarily doubles, but the death rate permanently rises 5%."
        "https://wx2.sbimg.cn/2020/07/19/Cy4lT.png"


organClone =
    Card
        TileSel
        3
        [ OrganCloneI ( 0, 0 ) ]
        "Organ Clone"
        "Each one of the dead on the selected tile could save one infected."
        ""


humanClone =
    Card
        TileSel
        3
        [ HumanCloneI ( 0, 0 ) ]
        "Human Clone"
        "Double the population of a certain tile."
        "https://wx2.sbimg.cn/2020/07/19/CyCFJ.png"


megaClone =
    Card
        NoSel
        8
        [ MegaCloneI ]
        "Mega Clone"
        "The whole population x1.25."
        ""


purification =
    Card
        TileSel
        3
        [ PurificationI ( 0, 0 ) ]
        "Purification"
        "Heal all patients in a certain tile."
        "https://wx1.sbimg.cn/2020/07/19/CV97I.png"


sacrifice =
    Card
        TileSel
        4
        [ SacrificeI ( 0, 0 ) ]
        "Sacrifice"
        "Select a tile. Kill both the viruses and the infected people."
        "https://wx1.sbimg.cn/2020/07/19/CV6AR.png"


resurgence =
    Card
        TileSel
        8
        [ ResurgenceI ( 0, 0 ) ]
        "Resurgence"
        "For each tile, restore 20% of the dead."
        "https://wx2.sbimg.cn/2020/07/19/CyGjY.png"


defenseline =
    Card
        TileSel
        2
        [ FreezevirusI ( 0, 0 ), FreezevirusI ( 0, 0 ) ]
        "Defenseline"
        "Froze the spread of viruses for 2 rounds."
        "https://wx2.sbimg.cn/2020/07/19/Cyauw.png"


hospital =
    Card
        TileSel
        4
        [ HospitalI ( 0, 0 ) ]
        "Build Hospital"
        "Put a hospital on a tile."
        ""


quarantine =
    Card
        TileSel
        4
        [ QuarantineI ( 0, 0 ) ]
        "Build Quarantine"
        "Put one tile in quarantine."
        ""


enhanceHealing =
    Card
        NoSel
        4
        [ EnhanceHealingI ]
        "Enhance healing"
        "Raise the efficiency of hospital healing by 1."
        ""


cellBroadcast =
    Card
        TileSel
        4
        [ AttractPeoI ( 0, 0 ), StopAttractI ( 0, 0 ) ]
        "Cell Broadcast"
        "In the selected tile, no one could go out during the next population flow."
        "https://wx2.sbimg.cn/2020/07/19/Cyiml.png"


drought =
    Card
        TileSel
        2
        [ DroughtI_Kill ( ( 0, 0 ), 0.5 ), DroughtI_Kill ( ( 0, 0 ), 0.5 ) ]
        "Drought"
        "In two rounds in the selected tile, the viruses have a probability of 50% to die. The economy output halves for two rounds."
        "https://wx2.sbimg.cn/2020/07/19/CyRd7.png"


warehouse =
    Card
        TileSel
        2
        [ WarehouseI ( 0, 0 ) ]
        "Warehouse"
        "Put a warehouse on a tile, +5 economy per round."
        "https://wx2.sbimg.cn/2020/07/19/CVGSK.png"


warmwave =
    Card
        TileSel
        1
        [ Warmwave_KIA ( ( 0, 0 ), 0.25 ) ]
        "Warmwave"
        "Choose a tile. There is a probability of 25% to kill the viruses."
        "https://wx1.sbimg.cn/2020/07/19/Cyv8o.png"


goingViral =
    Card
        TileSel
        8
        [ AVI ( 0, 0 ) ]
        "Going Viral"
        "Release the nano-viruses, which move randomly for 3 rounds and have a cut effect."
        "https://wx1.sbimg.cn/2020/07/19/Cymnl.png"


judgement =
    Card
        TileSel
        6
        [ JudgeI_Kill ( ( 0, 0 ), 0.25 ) ]
        "Judgement"
        "On the selected tile, either the people or the viruses die. The probability is 50%."
        "https://wx2.sbimg.cn/2020/07/19/Cy2Y8.png"


lowSoundWaves =
    Card
        TileSel
        4
        [ EvacuateI ( 0, 0 ), StopEVAI ( 0, 0 ) ]
        "LowSoundWaves"
        "Select a tile. Distribute all population to the neighboring tiles during the next population flow."
        "https://wx2.sbimg.cn/2020/07/19/CyWOG.png"


targetCardlst =
    [ cut, megaCut, organClone, humanClone, sacrifice, purification, resurgence, defenseline, hospital, quarantine, cellBroadcast, drought, warehouse, warmwave, goingViral, judgement, lowSoundWaves ]
