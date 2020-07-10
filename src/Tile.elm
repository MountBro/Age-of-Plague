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


cartesianProduct : List a -> List b -> List ( a, b )
cartesianProduct l1 l2 =
    List.foldr (\li1 -> \li2 -> li1 ++ li2)
        []
        (List.map (\x -> List.map (\y -> ( x, y )) l2) l1)


initListTiles : ( Int, Int ) -> Int -> List Tile
initListTiles ( sizex, sizey ) peo =
    let
        lstx =
            List.range 1 sizex

        lsty =
            List.range 1 sizey

        lstIndice =
            cartesianProduct lstx lsty
    in
    List.map (\x -> initTiles x peo) lstIndice
