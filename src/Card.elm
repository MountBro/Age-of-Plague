module Card exposing (..)


type alias Card =
    { selMode : Selection
    , cost : Int
    , action : List Action
    , roundPlayed : Int
    }


type Selection
    = HexSel
    | TileSel
    | None


type Action
    = IncPowerI Int
    | EcoDoubleI
    | DisableEvolveI
    | DisableEvolve Float
    | NoAction
