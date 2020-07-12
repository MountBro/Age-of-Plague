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
    = IncPowerI Int --
    | FreezeI
    | Freeze Float
    | EcoDoubleI
    | EcoDoubleI_Freeze Float
    | DisableEvolveI
    | DisableEvolve Float
    | NoAction
    | Summon (List Card)


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



-- warmwave =
--     Card NoSel 1 [, ] "Warm Wave"
