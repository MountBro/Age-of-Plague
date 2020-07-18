module Model exposing (..)

import Browser.Dom exposing (Error, Viewport)
import Card exposing (..)
import Debug
import Geometry exposing (..)
import List.Extra as LE
import Message exposing (..)
import Parameters exposing (..)
import Task
import Tile exposing (..)
import Todo exposing (..)
import Virus exposing (..)


type alias Model =
    { city : City
    , behavior : Behavior
    , state : Gamestatus
    , currentRound : Int
    , screenSize : ( Float, Float )
    , viewport : Maybe Viewport
    , virus : Virus
    , region : Region
    , cardSelected : CardSelected
    , todo : Todo
    , roundTodoCleared : Bool
    , av : AntiVirus
    , power : Int
    , economy : Int
    , basicEcoOutput : Int
    , warehouseNum : Int
    , ecoRatio : Int
    , selectedHex : ( Int, Int )
    , mouseOver : ( Int, Int )
    , selHex : SelHex
    , hands : List Card
    , deck : List Card
    , mouseOverCardToReplace : Int
    , replaceChance : Int
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
      , behavior = initBehavior
      , currentRound = 1
      , state = Playing
      , screenSize = ( 600, 800 )
      , viewport = Nothing
      , virus = initVirus
      , region = NoRegion
      , cardSelected = NoCard
      , todo = []
      , roundTodoCleared = False
      , av = initAntiVirus
      , power = 10000
      , economy = 10000
      , basicEcoOutput = para.basicEcoOutput
      , warehouseNum = 0
      , ecoRatio = 1
      , selectedHex = ( -233, -233 )
      , mouseOver = ( -233, -233 )
      , selHex = SelHexOff
      , hands = []
      , deck = allCards
      , mouseOverCardToReplace = 0
      , replaceChance = 3
      }
    , Task.perform GotViewport Browser.Dom.getViewport
    )


type Gamestatus
    = Playing
    | Drawing
    | Playcard
    | Stopped


type Region
    = NoRegion
    | SelectRegion ( Int, Int )


type SelHex
    = SelHexOn
    | SelHexOff


type CardSelected
    = NoCard
    | SelectCard Card


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


sumPopulation : City -> Int
sumPopulation city =
    city.tilesindex
        |> List.map (\x -> x.population)
        |> List.sum


sumSick : City -> Int
sumSick city =
    city.tilesindex
        |> List.map (\x -> x.sick)
        |> List.sum


sumDead : City -> Int
sumDead city =
    city.tilesindex
        |> List.map (\x -> x.dead)
        |> List.sum


initVirus : Virus
initVirus =
    { rules = [ 2, 4 ]
    , pos = [ ( 1, 2 ), ( 1, 3 ), ( 2, 2 ), ( 2, 4 ), ( 2, 3 ) ]

    --, pos = cartesianProduct (List.range -5 5) (List.range -5 5)
    , number = 0
    , infect = 1
    , kill = 0.5
    }


initAntiVirus : AntiVirus
initAntiVirus =
    { rules = [ 2 ]
    , pos = [ ( 3, 2 ), ( 3, 3 ) ]
    }


initBehavior =
    { populationFlow = True, virusEvolve = True }


sickupdate : List Tile -> List ( Int, Int ) -> Int -> List Tile
sickupdate t lstvir inf =
    List.map
        (\x ->
            if
                (LE.count ((==) x.indice) lstvir > 0)
                    && x.sick
                    + inf
                    * LE.count ((==) x.indice) lstvir
                    <= x.population
            then
                { x
                    | sick = x.sick + inf * LE.count ((==) x.indice) lstvir
                }

            else if LE.count ((==) x.indice) lstvir > 0 then
                { x
                    | sick = x.population
                }

            else
                x
        )
        t


virusKill : Virus -> City -> City
virusKill vir city =
    let
        dr =
            vir.kill

        patients =
            toFloat (sumSick city)

        death =
            patients
                * dr
                |> round

        ( lstInfectedn, lstInfected1 ) =
            city.tilesindex
                |> List.partition (\x -> x.sick > 0)
                |> Tuple.first
                |> List.sortBy .sick
                |> List.partition (\x -> x.sick > 1)

        estimateDeath =
            List.map (\x -> round (toFloat x.sick * (0.05 + dr))) lstInfectedn
                |> List.sum

        deathlst =
            if death <= estimateDeath then
                List.take
                    (round (toFloat death / toFloat estimateDeath) * List.length lstInfectedn)
                    lstInfectedn

            else
                lstInfectedn ++ List.take (death - estimateDeath) lstInfected1
    in
    { city
        | tilesindex =
            List.map
                (\x ->
                    if List.member x deathlst then
                        { x
                            | sick = x.sick - round (toFloat x.sick * dr)
                            , dead = x.dead + round (toFloat x.sick * dr)
                            , population = x.population - round (toFloat x.sick * dr)
                        }

                    else
                        x
                )
                city.tilesindex
    }


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
    { city
        | tilesindex = sickupdate lstTile lstvirTilesIndice inf
    }


populationFlow : Int -> City -> City
populationFlow n city =
    let
        citytileslst =
            city.tilesindex

        t =
            List.take n citytileslst
                |> List.drop (n - 1)
                |> List.head
                |> Maybe.withDefault (Tile ( -100, -100 ) 100 0 0 NoConstruction 0)

        lstnTile =
            --not include tile t itself
            validNeighborTile citytileslst t

        numNeig =
            --number of valid neighbor tiles around tile t (not including tile t)
            List.length lstnTile

        sickleave =
            --the number of leaving patients
            if t.population > numNeig then
                round (toFloat (t.sick * numNeig) / toFloat t.population)

            else
                t.sick

        leaveLst =
            -- make a ordered list of tiles people would go. Compatible for population < numNeig
            List.sortBy (\x -> x.sick + x.dead * 2) lstnTile
                |> List.map (\x -> x.indice)
                |> List.take t.population

        sickLst =
            leaveLst
                |> List.take sickleave
    in
    if n <= List.length citytileslst then
        let
            newcitytileslst =
                if t.population >= numNeig then
                    List.map
                        (\x ->
                            if x == t then
                                { x
                                    | population = x.population - numNeig
                                    , sick = x.sick - sickleave
                                }

                            else if List.member x.indice sickLst then
                                { x
                                    | population = x.population + 1
                                    , sick = x.sick + 1
                                }

                            else if List.member x.indice leaveLst then
                                { x | population = x.population + 1 }

                            else
                                x
                        )
                        citytileslst

                else
                    List.map
                        (\x ->
                            if x == t then
                                { x
                                    | population = 0
                                    , sick = 0
                                }

                            else if List.member x.indice sickLst then
                                { x
                                    | population = x.population + 1
                                    , sick = x.sick + 1
                                }

                            else if List.member x.indice leaveLst then
                                { x | population = x.population + 1 }

                            else
                                x
                        )
                        citytileslst

            newcity =
                { city
                    | tilesindex = newcitytileslst
                }
        in
        populationFlow (n + 1) newcity

    else
        city


updateCity : City -> Virus -> City
updateCity city vir =
    infect city vir
        |> virusKill vir
        |> populationFlow 1
