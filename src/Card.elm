module Card exposing (..)


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
    | Summon (List Card)
    | OrganCloneI (Int,Int)
    | HumanCloneI (Int,Int)
    | MegaCloneI


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


organClone =
    Card TileSel 3 [ OrganCloneI (0,0) ] "Organ Clone"


humanClone =
    Card TileSel 3 [ HumanCloneI (0,0) ] "Human Clone"


megaClone =
    Card TileSel 8 [ MegaCloneI] "Mega Clone"


targetCardlst = [ cut, organClone, humanClone ] --List of cards requiring target hex or tiles
