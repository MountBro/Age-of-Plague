module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as D



-- MAIN


main : Html msg
main =
    div [ style "id" "box" ]
        [ img
            [ src "https://i.loli.net/2020/06/15/qneQ1A8UE39d2Wu.png"
            , style "height" "200px"
            ]
            []
        ]
