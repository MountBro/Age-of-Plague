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
    { -- to do : List Card
      city : City
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
    , actionDescribe : List String
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
      , state = HomePage
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
      , actionDescribe = []
      }
    , Task.perform GotViewport Browser.Dom.getViewport
    )


type Gamestatus
    = Playing
    | Drawing
    | Playcard
    | Stopped
    | HomePage
    | CardPage


updatelog : Model -> Model
updatelog model =
    case model.cardSelected of
        NoCard ->
            model

        SelectCard card ->
            { model | actionDescribe = List.append model.actionDescribe [ "Used card : " ++ card.name ++ ". " ++ card.describe ] }


initlog : Model -> Model
initlog model =
    { model | actionDescribe = [] }


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
    , kill = 0.1
    }


initAntiVirus : AntiVirus
initAntiVirus =
    { rules = [ 0, 1, 2, 3 ]
    , pos = []
    , life = 0
    }


createAV : ( Int, Int ) -> AntiVirus
createAV hlst =
    { rules = [ 0, 1, 2, 3 ]
    , pos = [ hlst ]
    , life = 3
    }


initBehavior =
    { populationFlow = True, virusEvolve = True }


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
                |> List.partition (\x -> x.sick > 7)

        estimateDeath =
            round (List.sum (List.map (\x -> toFloat x.sick) lstInfectedn) * dr)

        deathlst =
            if death < estimateDeath then
                List.take (max (round (0.2 * toFloat death / toFloat estimateDeath) * List.length lstInfectedn) 1) lstInfectedn

            else
                lstInfectedn ++ List.take (max (round (toFloat (death - estimateDeath) * 0.2)) 1) lstInfected1
    in
    { city
        | tilesindex =
            List.map
                (\x ->
                    if List.member x deathlst then
                        { x
                            | sick = x.sick - max (round (toFloat x.sick * dr)) 1
                            , dead = x.dead + max (round (toFloat x.sick * dr)) 1
                            , population = x.population - max 1 (round (toFloat x.sick * dr))
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
                |> Maybe.withDefault (Tile ( -100, -100 ) 0 0 0 0 True False False False)

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
            if t.peoFlow then
                List.sortBy (\x -> x.sick + x.dead * 2) lstnTile
                    |> List.map (\x -> x.indice)
                    |> List.take t.population
                    |> List.take numNeig

            else
                []

        sickLst =
            leaveLst
                |> List.take sickleave
    in
    if n <= List.length citytileslst then
        let
            newcitytileslst =
                if t.population >= numNeig && t.peoFlow then
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

                else if t.peoFlow then
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

                else
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


evacuate : Tile -> City -> List Tile
evacuate t city =
    let
        lstnTile =
            validNeighborTile city.tilesindex t
                |> List.sortBy .sick

        l =
            List.length lstnTile

        a =
            if t.population == 0 then
                0

            else
                modBy l t.population

        b =
            if t.population == 0 then
                0

            else
                round (toFloat (t.population - a) / toFloat l)

        sa =
            if t.sick == 0 then
                0

            else
                modBy l t.sick

        sb =
            if t.sick == 0 then
                0

            else
                round (toFloat (t.sick - sa) / toFloat l)

        leavelst =
            lstnTile
                |> List.take t.population

        ln =
            List.take a leavelst

        l1 =
            List.drop a leavelst

        sicklst1 =
            List.drop sa leavelst
    in
    List.map
        (\x ->
            if List.member x ln then
                if List.member x sicklst1 then
                    { x
                        | population = x.population + b + 1
                        , sick = x.sick + sb
                    }

                else
                    { x
                        | population = x.population + b + 1
                        , sick = x.sick + sb + 1
                    }

            else if List.member x l1 then
                if List.member x sicklst1 then
                    { x
                        | population = x.population + b
                        , sick = x.sick + sb
                    }

                else
                    { x
                        | population = x.population + b
                        , sick = x.sick + sb + 1
                    }

            else if x == t then
                { x
                    | population = 0
                    , sick = 0
                }

            else
                x
        )
        city.tilesindex


change : Virus -> AntiVirus -> City -> ( Virus, AntiVirus )
change virus anti city =
    let
        lstvir =
            searchNeighbor virus.pos

        lstanti =
            searchNeighbor anti.pos

        lstquatile =
            quarantineTiles city.tilesindex
    in
    judgeAlive lstvir virus lstanti anti lstquatile


judgeBuild : Model -> ( Int, Int ) -> Bool
judgeBuild model ( i, j ) =
    let
        hostilelst =
            hospitalTiles model.city.tilesindex

        quatilelst =
            quarantineTiles model.city.tilesindex

        waretilelst =
            warehouseTiles model.city.tilesindex
    in
    model.cardSelected
        == SelectCard hospital
        && List.member (converHextoTile ( i, j )) hostilelst
        || model.cardSelected
        == SelectCard quarantine
        && List.member (converHextoTile ( i, j )) quatilelst
        || model.cardSelected
        == SelectCard warehouse
        && List.member (converHextoTile ( i, j )) waretilelst
