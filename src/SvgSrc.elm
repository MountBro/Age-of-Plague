module SvgSrc exposing (myTile)

import Html
import Message exposing (..)
import Svg exposing (..)
import Svg.Attributes exposing (..)


myTile : Float -> Float -> Html.Html Msg
myTile x1 x2 =
    svg
        [ version "1.0"
        , id "Layer_1"
        , x1 - 15.0 |> String.fromFloat |> x
        , x2 - 17.3 |> String.fromFloat |> y
        , viewBox "0 0 30 34.6"
        , Svg.Attributes.style "enable-background:new 0 0 30 34.6;"
        , width "30"
        , height "34.6"
        ]
        [ Svg.style
            [ type_ "text/css" ]
            [ text ".st0{fill:url(#SVGID_1_);}\n    .st1{fill:#006837;}\n    .st2{fill:none;}\n    .st3{fill:none;stroke:#000000;stroke-width:0.25;stroke-miterlimit:10;}\n" ]
        , g
            []
            [ Svg.radialGradient
                [ id "SVGID_1_", cx "15", cy "17.344", r "16.0435", gradientUnits "userSpaceOnUse" ]
                [ stop
                    [ offset "0", Svg.Attributes.style "stop-color:#FFFFFF" ]
                    []
                , stop
                    [ offset "0", Svg.Attributes.style "stop-color:#009245" ]
                    []
                , stop
                    [ offset "1", Svg.Attributes.style "stop-color:#006837" ]
                    []
                , stop
                    [ offset "1", Svg.Attributes.style "stop-color:#000000" ]
                    []
                ]
            , polygon
                [ class "st0", points "0.1,25.9 0.1,8.8 15,0.2 29.9,8.8 29.9,25.9 15,34.5   " ]
                []
            , Svg.path
                [ d "M15,0.3l14.7,8.5l0,17L15,34.4L0.3,25.8v-17L15,0.3 M15,0L0,8.7V26l15,8.6L30,26l0-17.3L15,0L15,0z" ]
                []
            ]
        , Svg.path
            [ class "st1", d "M20.7,14.4c-0.2,0.1-0.5,0.1-0.8,0.1c-0.1,0-0.2,0-0.3-0.1s-0.1-0.2-0.1-0.3c-0.3-0.2-0.4-0.7-0.2-1\n    c0.2-0.3,0.5-0.5,0.9-0.5c0.3-0.1,0.7,0,1,0c-0.1-0.3,0-0.7,0.3-0.9c0.2-0.2,0.6-0.3,0.9-0.4c0.2,0,0.3-0.1,0.5,0\n    c0.2,0.1,0.3,0.2,0.4,0.3c0.8,0.8,1.4,1.9,1.7,3c0,0.1,0.1,0.2,0,0.3c0,0.1-0.2,0.2-0.3,0.2c-0.4,0.2-0.8,0.5-1.2,0.7\n    c-0.2,0.1-0.4,0.2-0.6,0.2c-0.2-0.1-0.3-0.2-0.4-0.4c-0.3-0.2-0.6-0.3-1-0.5C21.2,15.2,20.8,14.7,20.7,14.4z" ]
            []
        , Svg.path
            [ class "st2", d "M-5.8,8.8c0,0.1-0.1,0.1-0.1,0.2" ]
            []
        , g
            []
            [ Svg.path
                [ class "st3", d "M21.3,14.5c0.6,0.2,1,0.6,1.1,1.2c0,0.3-0.1,0.7-0.1,1.1c0,0.8,0.2,1.5,0.3,2.3c0,0,0-0.1,0-0.1" ]
                []
            , Svg.path
                [ class "st3", d "M23,14.3C23,14.3,23,14.3,23,14.3C23,14.3,23,14.3,23,14.3c-0.3,0.2-0.5,0.5-0.6,0.9" ]
                []
            ]
        ]
