module Tile exposing (..)

import Geometry exposing (..)


type alias Tile =
    { indice : ( Int, Int )
    , population : Int
    , sick : Int
    , dead : Int
    , cureEff : Int
    , peoFlow : Bool -- whether population will flow or not (different from quarantine)
    , hos : Bool
    , qua : Bool
    , wareHouse : Bool
    }


initTile : ( Int, Int ) -> Int -> Tile
initTile ( x, y ) population =
    Tile ( x, y ) population 0 0 0 True False False False


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
    if not t.qua && t.peoFlow then
        List.filter (\x -> List.member x.indice lstn && x.population > 0 && not x.qua) tlst

    else
        []


quarantineTiles : List Tile -> List (Int, Int)
quarantineTiles tlst =
    tlst
        |> List.filter (\x -> x.qua == True)
        |> List.map (\x -> x.indice)

hospitalTiles : List Tile -> List (Int, Int)
hospitalTiles tlst =
    tlst
        |> List.filter (\x -> x.hos == True)
        |> List.map (\x -> x.indice)

warehouseTiles : List Tile -> List (Int, Int)
warehouseTiles tlst =
    tlst
        |> List.filter (\x -> x.wareHouse == True)
        |> List.map (\x -> x.indice)