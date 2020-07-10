module Tile exposing (..)

import Geometry exposing (..)


type alias Tile =
    { indice : TileIndice
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


initTiles : ( Int, Int ) -> Int -> Tile
initTiles ( x, y ) population =
    Tile ( x, y ) population 0 0 None 0


initListTiles : ( Int, Int ) -> Int -> List Tile
initListTiles ( sizex, sizey ) peo =
    let
        lstx =
            List.range 1 sizex

        lsty =
            List.range 1 sizey

        lstIndice =
            List.map2 Tuple.pair lstx lsty
    in
    List.map (\x -> initTiles x peo) lstIndice
