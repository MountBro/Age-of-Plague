module Model exposing (..)


type alias Model =
    { todo : List Card
    , city : City
    , behavior : Behavior
    }


type alias Behavior =
    { populationFlow : Bool
    , virusEvolve : Bool
    }
