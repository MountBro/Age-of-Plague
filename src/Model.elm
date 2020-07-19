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
    }


initModel : () -> ( Model, Cmd Msg )
initModel _ =
    ( { city =
            initCity 10
                [ ( 0, 0 )
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
      , power = 300
      , economy = 500
      , basicEcoOutput = para.basicEcoOutput
      , warehouseNum = 0
      , ecoRatio = 1
      , selectedHex = ( -233, -233 )
      , mouseOver = ( -233, -233 )
      , selHex = SelHexOff
      , hands = [ powerOverload ]
      , deck = allCards
      , mouseOverCardToReplace = negate 1
      , mouseOverCard = negate 1
      , replaceChance = 3
      , drawChance = 0
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
