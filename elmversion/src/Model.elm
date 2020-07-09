module Model exposing (..)
import Tile exposing (..)


type alias Model =
    { -- to do : List Card
    city : City
    , behavior : Behavior
    }


type alias City =
    { population : Int
    , totalsick : Int
    , totaldead : Int
    , tilesindex : List(Tile)
    }



type alias Behavior =
    { populationFlow : Bool
    , virusEvolve : Bool
    }

