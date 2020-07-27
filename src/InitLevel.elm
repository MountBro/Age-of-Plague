module InitLevel exposing (..)

import ColorScheme exposing (..)
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
            , economy = 6
            , power = 26
            , actionDescribe = []
            , counter = 3
            , flowRate = 1
            , theme = Minimum
            , deck = updateDeck n
            , todo = []
            , selHex = SelHexOff
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
            , economy = 3
            , power = 6
            , flowRate = 1
            , deck = updateDeck n
            , todo = []
            , selHex = SelHexOff
        }
