module InitLevel exposing (..)

import Model exposing (..)


levelInit : Int -> Model -> Model
levelInit n model =
    if n < 3 then
        { model
            | behavior = initBehavior
            , state = Playing
            , city = initlevelmap n
            , currentLevel = n
            , hands = Tuple.first (initHandsVirus n)
            , virus = Tuple.second (initHandsVirus n)
            , currentRound = 1
            , economy = 50
            , power = 50
            , actionDescribe = []
            , counter = 3
            , flowrate = 1
        }

    else
        { model
            | behavior = initBehavior
            , city = initlevelmap n
            , state = Drawing
            , currentLevel = n
            , replaceChance = 3
            , hands = []
            , actionDescribe = []
            , virus = Tuple.second (initHandsVirus n) -- virus for each level
            , currentRound = 1
            , counter = 3
            , flowrate = 1
            , economy = 5
            , power = 5
        }
