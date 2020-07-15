module Tile exposing (..)

import Geometry exposing (..)


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
    | NoConstruction


initTile : ( Int, Int ) -> Int -> Tile
initTile ( x, y ) population =
    Tile ( x, y ) population 0 0 NoConstruction 0


cartesianProduct : List a -> List b -> List ( a, b )
cartesianProduct l1 l2 =
    List.foldr (\li1 -> \li2 -> li1 ++ li2)
        []
        (List.map (\x -> List.map (\y -> ( x, y )) l2) l1)


initTiles : Int -> List ( Int, Int ) -> List Tile
initTiles p l =
    List.map (\x -> initTile x p) l


validNeighborTile : List Tile -> Tile -> List Tile
validNeighborTile tlst t =
    let
        lstn =
            generateZone t.indice
    in
    if t.construction /= Qua then
        List.filter (\x -> List.member x.indice lstn && x.population > 0 && x.construction /= Qua) tlst
    else
        []


quarantineTiles : List Tile -> List (Int, Int)
quarantineTiles tlst =
    tlst
        |> List.filter (\x -> x.construction == Qua)
        |> List.map (\x -> x.indice)

hospitalTiles : List Tile -> List (Int, Int)
hospitalTiles tlst =
    tlst
        |> List.filter (\x -> x.construction == Hos)
        |> List.map (\x -> x.indice)