module Tile exposing (..)

import Geometry exposing (..)
import List.Extra as LE exposing (..)


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


type alias City =
    { tilesIndex : List Tile
    }


initCity : Int -> List ( Int, Int ) -> City
initCity tilepeo l =
    let
        tiles =
            initTiles tilepeo l
    in
    City tiles


sumPopulation : City -> Int
sumPopulation city =
    city.tilesIndex
        |> List.map (\x -> x.population)
        |> List.sum


sumSick : City -> Int
sumSick city =
    city.tilesIndex
        |> List.map (\x -> x.sick)
        |> List.sum


sumDead : City -> Int
sumDead city =
    city.tilesIndex
        |> List.map (\x -> x.dead)
        |> List.sum


initTile : ( Int, Int ) -> Int -> Tile
initTile ( x, y ) population =
    Tile ( x, y ) population 0 0 0 True False False False


initTiles : Int -> List ( Int, Int ) -> List Tile
initTiles p l =
    List.map (\x -> initTile x p) l


sickupdate : List Tile -> List ( Int, Int ) -> Int -> List Tile
sickupdate t lstvir inf =
    List.map
        (\x ->
            let
                s =
                    LE.count ((==) x.indice) lstvir * inf

                cure =
                    x.cureEff
            in
            if x.hos then
                if s + x.sick - cure <= x.population && s + x.sick - cure >= 0 then
                    { x
                        | sick = s + x.sick - cure
                    }

                else if s + x.sick - cure < 0 then
                    { x
                        | sick = 0
                    }

                else
                    { x
                        | sick = x.population
                    }

            else
                { x
                    | sick = min (x.sick + s) x.population
                }
        )
        t


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


neighborSick : List Tile -> Tile -> Int
neighborSick tlst t =
    let
        lstn =
            generateZone t.indice
    in
    List.filter (\x -> List.member x.indice lstn && x.population > 0 && not x.qua) tlst
        |> List.map (\x -> x.sick)
        |> List.sum


quarantineTiles : List Tile -> List ( Int, Int )
quarantineTiles tlst =
    tlst
        |> List.filter (\x -> x.qua == True)
        |> List.map (\x -> x.indice)


hospitalTiles : List Tile -> List ( Int, Int )
hospitalTiles tlst =
    tlst
        |> List.filter (\x -> x.hos == True)
        |> List.map (\x -> x.indice)


warehouseTiles : List Tile -> List ( Int, Int )
warehouseTiles tlst =
    tlst
        |> List.filter (\x -> x.wareHouse == True)
        |> List.map (\x -> x.indice)
