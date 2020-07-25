module GameViewBasic exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Json.Decode as D
import Message exposing (..)
import Svg exposing (..)
import Svg.Attributes as SA


caption : Float -> Float -> String -> String -> Int -> Svg Msg
caption x y cstr text fontSize =
    text_
        [ fontSize |> String.fromInt |> SA.fontSize
        , SA.fontFamily "sans-serif"
        , x |> String.fromFloat |> SA.x
        , y |> String.fromFloat |> SA.y
        , cstr |> SA.fill
        ]
        [ text |> Svg.text
        ]


onClick : msg -> Svg.Attribute msg
onClick message =
    on "click" (D.succeed message)


onOver : msg -> Svg.Attribute msg
onOver message =
    on "mouseover" (D.succeed message)
