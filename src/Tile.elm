module Tile exposing (..)


type alias Tile =
    { indice : ( Int, Int )
    , population : Int
    , sick : Int
    , dead : Int
    , construction : Construction
    , cureEff : Int
    }
