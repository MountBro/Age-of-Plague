module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes as HA
import Html.Events.Extra.Mouse as Mouse


main : Program () MouseEvent MouseEvent
main =
    Browser.sandbox
        { init = None
        , view = view
        , update = always
        }


type MouseEvent
    = None
    | Down Mouse.Event
    | Move Mouse.Event
    | Up Mouse.Event
    | Click Mouse.Event
    | DoubleClick Mouse.Event
    | Over Mouse.Event
    | Out Mouse.Event
    | ContextMenu Mouse.Event


view : MouseEvent -> Html MouseEvent
view event =
    div []
        [ button
            [ Mouse.onDown Down
            , Mouse.onMove Move
            , Mouse.onUp Up
            , Mouse.onClick Click
            , Mouse.onDoubleClick DoubleClick
            , Mouse.onOver Over
            , Mouse.onOut Out
            , Mouse.onContextMenu ContextMenu
            , HA.style "height" "10cm"
            , HA.style "width" "10cm"
            ]
            [ text <| Debug.toString event ]
        ]
