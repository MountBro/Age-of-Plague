module Model exposing (..)

import Browser.Dom exposing (Error, Viewport)
import Card exposing (..)
import Debug
import Geometry exposing (..)
import List.Extra as LE
import Message exposing (..)
import Parameters exposing (..)
import Population exposing (..)
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
    , currentlevel : Int
    , theme : Theme
    }


initModel : () -> ( Model, Cmd Msg )
initModel _ =
    ( { city =
            initCity 10
                map1

      {- [ ( 0, 0 )
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
      -}
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
      , hands = initHandsVirus 1 |> Tuple.first --megaClone
      , deck = allCards
      , mouseOverCardToReplace = negate 1
      , mouseOverCard = negate 1
      , replaceChance = 3
      , drawChance = 0
      , actionDescribe = []
      , currentlevel = 1 --1
      , theme = Polar
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
    | Finished
    | Wasted


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


type alias Behavior =
    { populationFlow : Bool
    , virusEvolve : Bool
    }


type Theme
    = Polar
    | Urban
    | Minimum
    | Plane


initBehavior =
    { populationFlow = True, virusEvolve = True }


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
    initCity 10 citytile


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


levelModel : Int -> Model -> Model
levelModel n model =
    if n <= 2 then
        { model
            | behavior = initBehavior
            , state = Playing
            , currentlevel = n
            , hands = Tuple.first (initHandsVirus n)
            , virus = Tuple.second (initHandsVirus n)
        }

    else
        { model
            | behavior = initBehavior
            , state = Drawing
            , currentlevel = n
            , replaceChance = 3
            , hands = []
            , actionDescribe = []
            , virus = Tuple.second (initHandsVirus n) -- virus for each level
        }
