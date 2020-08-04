module Todo exposing (..)

import Card exposing (..)


type alias Queue =
    ( ( Bool, List Action ), Card )


finishedEmptyQueue =
    ( ( False, [] ), Card NoSel 0 [ NoAction ] " " " " " " )


type alias Todo =
    List Queue


finished : Todo -> Bool
finished todo =
    List.isEmpty (List.filter (\( ( x, y ), z ) -> x) todo)
