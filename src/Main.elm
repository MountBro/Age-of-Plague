module Main exposing (..)

import Browser
import Debug as DB
import Html exposing (..)
import Html.Attributes as HA
import Html.Events.Extra.Mouse as Mouse
import Svg as S


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
    let
        log1 =
            DB.log <| DB.toString event
    in
    div []
        [ p
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
            , HA.style "border-size" "2cm"
            , HA.style "border" "solid"
            , HA.style "border-color" "#8efe43"
            ]
            [ Debug.toString Mouse.Event |> text ]
        ]
