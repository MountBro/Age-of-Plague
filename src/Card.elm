module Card exposing (..)


type alias Card =
    { cost : Int
    , action : List Action
    , medUnitCost : Int
    , roundPlayed : Int
    }


type Action
    = DisablePopulationFlow
    | BlaBla
