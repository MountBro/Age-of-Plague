module Model exposing (..)

import Browser.Dom exposing (Error, Viewport)
import Card exposing (..)
import ColorScheme exposing (..)
import Geometry exposing (..)
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
    , mouseOverCard : Int
    , replaceChance : Int
    , drawChance : Int
    , actionDescribe : List String
    , currentLevel : Int
    , theme : Theme
    , counter : Int -- deadly up
    , flowRate : Int -- population flow rate
    }


initModel : () -> ( Model, Cmd Msg )
initModel _ =
    ( { city =
            initCity 20
                map1
      , behavior = initBehavior
      , currentRound = 1
      , state = HomePage
      , screenSize = ( 600, 800 )
      , viewport = Nothing
      , virus = initHandsVirus 1 |> Tuple.second
      , region = NoRegion
      , cardSelected = NoCard
      , todo = []
      , roundTodoCleared = False
      , av = initAntiVirus
      , power = 50
      , economy = 10 --10
      , basicEcoOutput = para.basicEcoOutput
      , warehouseNum = 0
      , ecoRatio = 1
      , selectedHex = ( -233, -233 )
      , mouseOver = ( -233, -233 )
      , selHex = SelHexOff
      , hands = initHandsVirus 1 |> Tuple.first
      , deck = allCards
      , mouseOverCardToReplace = negate 1
      , mouseOverCard = negate 1
      , replaceChance = 3
      , drawChance = 0
      , actionDescribe = []
      , currentLevel = 1 --1
      , theme = Polar
      , counter = 3
      , flowRate = 1
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
    | Finished Int
    | Wasted


initLog : Model -> Model
initLog model =
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


type alias Behavior =
    { populationFlow : Bool
    , virusEvolve : Bool
    }


initBehavior =
    { populationFlow = True, virusEvolve = True }


judgeBuild : Model -> ( Int, Int ) -> Bool
judgeBuild model ( i, j ) =
    let
        hostilelst =
            hospitalTiles model.city.tilesIndex

        quatilelst =
            quarantineTiles model.city.tilesIndex

        waretilelst =
            warehouseTiles model.city.tilesIndex
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


map1 =
    cartesianProduct [ 0, 1 ] [ 0, 1 ]


initlevelmap : Int -> City
initlevelmap level =
    let
        citytile =
            getElement level map
                |> List.head
                |> Maybe.withDefault map1
    in
    initCity 20 citytile


map =
    [ cartesianProduct [ 0, 1 ] [ 0, 1 ]
    , cartesianProduct [ 0, 1 ] [ 0, 1 ]
    , [ ( 0, 0 )
      , ( 0, 1 )
      , ( 0, 2 )
      , ( 0, 3 )
      , ( 1, -1 )
      , ( 1, 0 )
      , ( 1, 1 )
      , ( 1, 2 )
      , ( 2, -2 )
      , ( 2, -1 )
      , ( 2, 0 )
      , ( 2, 1 )
      , ( 2, 2 )
      , ( 3, -1 )
      , ( 3, -2 )
      ]
    ]


tutorialHands =
    [ [ megaClone ], [ cut, megaCut ] ]


initHandsVirus : Int -> ( List Card, Virus )
initHandsVirus level =
    let
        hand =
            if level <= 2 then
                getElement level tutorialHands
                    |> List.foldr (\x -> \y -> x ++ y) []

            else
                []

        vir =
            getElement level virus
                |> List.head
                |> Maybe.withDefault (Virus [] [] 0 0 0)
    in
    ( hand, vir )


lr : Model -> ( Int, Int )
lr model =
    ( model.currentLevel, model.currentRound )
