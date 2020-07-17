module Card exposing (..)

import Random exposing (Generator, list, map)
import Random.List exposing (choose)


type alias Card =
    { selMode : Selection
    , cost : Int
    , action : List Action
    , name : String
    }


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
    ]


cardGenerator : Int -> Generator (List Card)
cardGenerator n =
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
    Card NoSel 0 [ IncPowerI 3, IncPowerI (negate 3) ] "Power Overload"


onStandby =
    Card NoSel 0 [ IncPowerI 2 ] "On Standby"


coldWave =
    Card NoSel 1 [ Freeze 0.5 ] "Cold Wave"


blizzard =
    Card NoSel 8 [ FreezeI, FreezeI, FreezeI ] "Blizzard"


rain =
    Card NoSel 3 [ EcoDoubleI, EcoDoubleI_Freeze 0.5 ] "Rain"


cut =
    Card HexSel 1 [ CutHexI ( 0, 0 ) ] "Cut"


megaCut =
    Card TileSel 5 [ CutTileI ( 0, 0 ) ] "Mega Cut"


fubao =
    Card NoSel 1 [ Activate996I, Activate996I ] "996"


organClone =
    Card TileSel 3 [ OrganCloneI ( 0, 0 ) ] "Organ Clone"


humanClone =
    Card TileSel 3 [ HumanCloneI ( 0, 0 ) ] "Human Clone"


megaClone =
    Card NoSel 8 [ MegaCloneI ] "Mega Clone"


purification =
    Card TileSel 3 [ PurificationI ( 0, 0 ) ] "Purification"


sacrifice =
    Card TileSel 4 [ SacrificeI ( 0, 0 ) ] "Sacrifice"


resurgence =
    Card TileSel 8 [ ResurgenceI ( 0, 0 ) ] "Resurgence"


defenseline =
    Card TileSel 2 [ FreezevirusI ( 0, 0 ), FreezevirusI ( 0, 0 ) ] "Defenseline"


targetCardlst =
    [ cut, megaCut, organClone, humanClone, sacrifice, purification, resurgence, defenseline ]
