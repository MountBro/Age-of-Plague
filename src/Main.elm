module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html.Events.Extra.Mouse as Mouse
import Json.Decode as D
import Playground exposing (..)


type Msg
    = MouseDownAt ( Float, Float )



-- Main


main =
    Browser.sandbox
        { init = init
        , update = always
        , view = view
        }


init =
    div [] [ text "hello!" ]


view msg =
    div
        [ Mouse.onDown (\event -> MouseDownAt event.offsetPos) ]
        [ text "click here" ]
