module Model exposing (..)

import Browser.Dom exposing (Error, Viewport)
import Geometry exposing (..)
import Message exposing (..)
import Task
import Tile exposing (..)


type alias Model =
    { -- to do : List Card
      city : City
    , behavior : Behavior
    , state : Gamestatus
    , screenSize : ( Float, Float )
    , viewport : Maybe Viewport
    , virus
    --, map : List Tile
    }


type alias City =
    { totalpopulation : Int
    , sizex : Int -- Number of tiles on x direction
    , sizey : Int -- Number of tiles on y direction
    , totalsick : Int
    , totaldead : Int
    , tilesindex : List Tile
    }


type alias Behavior =
    { populationFlow : Bool
    , virusEvolve : Bool
    }


initCity : Int -> ( Int, Int ) -> City
initCity tilepeo ( sizex, sizey ) =
    let
        lstTiles =
            initListTiles ( sizex, sizey ) tilepeo

        totalpeo =
            sumPopulation lstTiles
    in
    City totalpeo sizex sizey 0 0 lstTiles


sumPopulation : List Tile -> Int
sumPopulation lst =
    lst
        |> List.map (\x -> x.population)
        |> List.sum


initModel : () -> ( Model, Cmd Msg )
initModel _ =
    ( { city = initCity 10 ( 3, 3 )
      , behavior =
            { populationFlow = True
            , virusEvolve = True
            }
      , state = Playing
      , screenSize = ( 600, 800 )
      , viewport = Nothing
      }
    , Task.perform GotViewport Browser.Dom.getViewport
    )
