module Tile exposing (..)


type alias Tile =
    { indice : ( Int, Int )
    , population : Int
    , sick : Int
    , dead : Int
    , construction : Construction
    , cureEff : Int
    }


type Construction
    = Hos -- Hospital
    | Qua --Quarantine
    | None


initTiles : (Int, Int) -> Int -> Tile
initTiles (x,y) population =
    Tile (x,y) population 0 0 None 0