module Model exposing (..)

import Browser.Dom exposing (Error, Viewport)
import Geometry exposing (..)
import Message exposing (..)
import Task
import Tile exposing (..)
import Virus exposing (..)
import List.Extra as LE


type alias Model =
    { -- to do : List Card
      city : City
    , behavior : Behavior
    , state : Gamestatus
    , currentRound : Int
    , screenSize : ( Float, Float )
    , viewport : Maybe Viewport
    , virus : Virus
    }


type alias City =
    { tilesindex : List Tile
    }


type alias Behavior =
    { populationFlow : Bool
    , virusEvolve : Bool
    }


initCity : Int -> List ( Int, Int ) -> City
initCity tilepeo l =
    let
        tiles =
            initTiles tilepeo l
    in
    City tiles


sumPopulation : List Tile -> Int
sumPopulation lst =
    lst
        |> List.map (\x -> x.population)
        |> List.sum


initVirus : Virus
initVirus =
    { rules = [ 2, 4 ]
    , pos = [ ( 1, 2 ), ( 1, 3 ), ( 2, 2 ), ( 2, 4 ), ( 2, 3 ) ]
    , number = 0
    , infect = 1
    , kill = 0.5
    }


initModel : () -> ( Model, Cmd Msg )
initModel _ =
    ( { city =
            initCity 10
                [ ( 0, 0 )
                , ( 0, 1 )
                , ( 0, 2 )
                , ( 1, -1 )
                , ( 1, 0 )
                , ( 1, 1 )
                , ( 2, -1 )
                , ( 2, 0 )
                , ( 2, 1 )
                , ( 3, -1 )
                ]
      , behavior =
            { populationFlow = True
            , virusEvolve = True
            }
      , state = Playing
      , currentRound = 0
      , screenSize = ( 600, 800 )
      , viewport = Nothing
      , virus = initVirus
      }
    , Task.perform GotViewport Browser.Dom.getViewport
    )


sickupdate : List Tile -> List (Int, Int) -> Int -> List Tile
sickupdate t lstvir inf =
    List.map (\x ->
                if List.member x.indice lstvir && x.sick + inf <= x.population then
                    { x |
                        sick = x.sick + inf}
                else
                    x
                    ) t


--virusKill :
infect : City -> Virus -> City
infect city virus =
    let
        inf =
            virus.infect

        lstTile =
            city.tilesindex

        lstvirHexIndice =
            virus.pos

        lstvirTilesIndice =
            List.map (\x -> converHextoTile x) lstvirHexIndice

    in
    { city |
        tilesindex = sickupdate lstTile lstvirTilesIndice inf
        }


populationFlow : Tile -> List Tile -> List Tile
populationFlow t citytilesindex  =
    let
        {-[t] =
            List.take 1 citytilesindex-}

        lstnTile =
            validNeighborTile citytilesindex t --not include tile t itself

        numNeig = --number of valid neighbor tiles (not including t)
            List.length lstnTile

        sickleave = --the number of leaving patients
            if t.population > numNeig then
                round (toFloat(t.sick * numNeig) / (toFloat t.population))

            else
                t.sick

        leaveLst = --List of tiles people would go. Compatible for population < numNeig
            List.sortBy (\x -> x.sick + x.dead * 2) lstnTile
                |> List.map (\x -> x.indice)
                |> List.take t.population

        sickLst =
            leaveLst
                |> List.take sickleave

    in
    if t.population >= numNeig then
        List.map (\x -> if x == t then
                            { x | population = x.population - numNeig
                                , sick = x.sick - sickleave}

                        else if List.member x.indice sickLst then
                            { x | population = x.population + 1
                                , sick = x.sick + 1}

                        else if List.member x.indice leaveLst then
                            { x | population = x.population + 1}

                        else
                            x

                        ) citytilesindex

    else
        List.map (\x -> if x == t then
                            { x | population = 0
                                , sick = 0
                                }

                        else if List.member x.indice sickLst then
                            { x | population = x.population + 1
                                , sick = x.sick + 1}

                        else if List.member x.indice leaveLst then
                            { x | population = x.population + 1}

                        else
                            x

                        ) citytilesindex


{-cityPopulationFlow : City -> City
cityPopulationFlow city =
    let
        citytilesindex = city.tilesindex
    in
    {city |
        tilesindex = List.map (\x -> populationFlow x citytilesindex) citytilesindex}-}