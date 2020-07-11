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
    | EcoDoubleI
    | DisableEvolveI
    | DisableEvolve Float
    | NoAction


powerOverload =
    Card NoSel 0 [ IncPowerI 3, IncPowerI (negate 3) ] "Power Overload"


onStandby =
    Card NoSel 0 [ IncPowerI 2 ] "On Standby"
