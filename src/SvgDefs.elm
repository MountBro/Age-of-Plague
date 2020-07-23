module SvgDefs exposing (..)

import Message exposing (..)
import Svg exposing (..)
import Svg.Attributes as SA


sh1 : Svg Msg
sh1 =
    Svg.filter
        [ SA.id "rectShadow" ]
        [ Svg.feOffset
            [ SA.result "offOut"
            , SA.in_ "SourceGraphic"
            , SA.dx "4"
            , SA.dy "20"
            ]
            []

        --, Svg.feColorMatrix
        --    [ SA.result "matrixOut"
        --    , SA.in_ "offOut"
        --    , SA.type_ "matrix"
        --    , SA.values "0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0"
        --    ]
        --    []
        , Svg.feGaussianBlur
            [ SA.result "blurOut"
            , SA.in_ "offOut"
            , SA.stdDeviation "10"
            ]
            []
        , Svg.feBlend
            [ SA.in_ "SourceGraphic"
            , SA.in2 "blurOut"
            , SA.mode "normal"
            ]
            []
        ]


sh2 : Svg Msg
sh2 =
    Svg.filter
        [ SA.x "-50%"
        , SA.y "-50%"
        , SA.width "200%"
        , SA.height "200%"
        , SA.filterUnits "objectBoundingBox"
        , SA.id "shadow-filter"
        ]
        [ Svg.feOffset
            [ SA.dx "0"
            , SA.dy "4"
            , SA.in_ "SourceAlpha"
            , SA.result "shadowOffsetOuter1"
            ]
            []
        , Svg.feGaussianBlur
            [ SA.stdDeviation "10"
            , SA.in_ "shadowOffsetOuter1"
            ]
            []
        , Svg.feColorMatrix
            [ SA.values "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.2 0"
            , SA.in_ "shadowBlurOuter1"
            , SA.type_ "matrix"
            , SA.result "shadowMatrixOuter1"
            ]
            []
        , Svg.feMerge
            []
            [ feMergeNode [ SA.in_ "shadowMatrixOuter1" ] []
            , feMergeNode [ SA.in_ "SourceGraphic" ] []
            ]
        ]
