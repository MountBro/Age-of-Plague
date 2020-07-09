module Model exposing (..)

import Card exposing (..)
import Tile exposing (..)


type alias Model =
    { todo : List Card
    , city : City
    , behavior : Behavior
    }


type alias City =
    { population : Int
    , totalsick : Int
    , totaldead : Int
    , tilesindex : List Tile
    }


type alias Behavior =
    { populationFlow : Bool
    , virusEvolve : Bool
    }
