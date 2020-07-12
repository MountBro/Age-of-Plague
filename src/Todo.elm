module Todo exposing (..)

import Card exposing (..)


type alias Queue =
    ( Bool, List Action )



-- True: Not Finished; False:Finished


finishedEmptyQueue =
    ( False, [] )


type alias Todo =
    List Queue


finished : Todo -> Bool
finished todo =
    List.isEmpty (List.filter Tuple.first todo)
