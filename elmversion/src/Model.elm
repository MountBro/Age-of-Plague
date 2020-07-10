module Model exposing (..)
import Tile exposing (..)
import Message exposing (..)
import Geometry exposing (..)

type alias Model =
    { -- to do : List Card
    city : City
    , behavior : Behavior
    , state : Gamestatus
    --, map : List Tile
    }


type alias City =
    { totalpopulation : Int
    , sizex : Int -- Number of tiles on x direction
    , sizey : Int -- Number of tiles on y direction
    , totalsick : Int
    , totaldead : Int
    , tilesindex : List(Tile)
    }



type alias Behavior =
    { populationFlow : Bool
    , virusEvolve : Bool
    }

initcity : Int -> (Int, Int) -> City
initcity tilepeo (sizex, sizey) =
    let
        lstTiles = initListTiles (sizex, sizey) tilepeo

        totalpeo = sumPopulation lstTiles

    in
    City totalpeo sizex sizey 0 0 lstTiles

sumPopulation : List Tile -> Int
sumPopulation lst =
    lst
        |> List.map (\x -> x.population)
        |> List.sum

initmodel : () -> Model
initmodel _ =
    { city = initcity 10 (3,3)
    , behavior =
        { populationFlow = True
        , virusEvolve = True
        }
    ,state = Playing
    }