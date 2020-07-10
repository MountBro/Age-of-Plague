module Model exposing (..)

import Browser.Dom exposing (Error, Viewport)
import Geometry exposing (..)
import Message exposing (..)
import Task
import Tile exposing (..)
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



--virusKill :
