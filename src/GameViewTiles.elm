module GameViewTiles exposing (..)

import ColorScheme exposing (..)
import GameViewBasic exposing (..)
import Geometry exposing (..)
import Html exposing (..)
import Message exposing (..)
import Model exposing (..)
import Parameters exposing (..)
import Svg exposing (..)
import Svg.Attributes as SA
import SvgSrc exposing (..)
import Tile exposing (..)


origin : Model -> Pos
origin model =
    case model.currentLevel of
        2 ->
            para.tileOrigin |> posAdd para.l2shift

        3 ->
            para.tileOrigin |> posAdd para.l3shift

        4 ->
            para.tileOrigin |> posAdd para.l4shift

        5 ->
            para.tileOrigin |> posAdd para.l5shift

        6 ->
            para.tileOrigin |> posAdd para.l6shift

        _ ->
            para.tileOrigin


renderHex : Model -> String -> Float -> ( Int, Int ) -> Html Msg
renderHex model cstr opa ( i, j ) =
    let
        ( x0, y0 ) =
            origin model

        a =
            para.a

        h =
            a / sqrt 3

        ( x, y ) =
            posAdd (rc ( i, j )) ( x0, y0 )
    in
    svg []
        [ polygon
            [ polyPoint [ x + a, x, x - a, x - a, x, x + a ]
                [ y + h, y + 2 * h, y + h, y - h, y - 2 * h, y - h ]
                |> SA.points
            , cstr |> SA.fill
            , opa |> String.fromFloat |> SA.fillOpacity
            ]
            []
        ]


renderFilm : Model -> ( Int, Int ) -> Html Msg
renderFilm model ( i, j ) =
    let
        ( x0, y0 ) =
            origin model

        a =
            para.a

        h =
            a / sqrt 3

        ( x, y ) =
            posAdd (rc ( i, j )) ( x0, y0 )

        tint =
            if ( i, j ) == model.mouseOver then
                polygon
                    [ polyPoint [ x + a, x, x - a, x - a, x, x + a ]
                        [ y + h, y + 2 * h, y + h, y - h, y - 2 * h, y - h ]
                        |> SA.points
                    , 0.3 |> String.fromFloat |> SA.fillOpacity
                    , SA.fill "yellow"
                    ]
                    []

            else
                polygon [] []
    in
    svg
        ([ onOver (MouseOver i j) ]
            ++ (if judgeBuild model ( i, j ) then
                    []

                else
                    [ GameViewBasic.onClick (SelectHex i j) ]
               )
        )
        (if judgeBuild model ( i, j ) then
            []

         else
            [ tint ]
                ++ [ polygon
                        [ polyPoint [ x + a, x, x - a, x - a, x, x + a ]
                            [ y + h, y + 2 * h, y + h, y - h, y - 2 * h, y - h ]
                            |> SA.points
                        , 0.0 |> String.fromFloat |> SA.fillOpacity
                        , SA.fill "white"
                        ]
                        []
                   ]
        )


renderTile : Model -> Tile -> List (Html Msg)
renderTile model t =
    let
        theme =
            model.theme

        cs =
            colorScheme theme

        a =
            para.a

        h =
            a / sqrt 3

        ind =
            t.indice

        t1 =
            Tuple.first ind

        t2 =
            Tuple.second ind

        i =
            2 * t1 - t2

        j =
            t1 + 3 * t2

        ( x0, y0 ) =
            origin model

        ( x, y ) =
            posAdd (rc ( i, j )) ( x0, y0 )

        ( x1, y1 ) =
            posAdd (rc ( i, j + 1 )) ( x0, y0 )

        ( x2, y2 ) =
            posAdd (rc ( i - 1, j + 1 )) ( x0, y0 )

        ( x3, y3 ) =
            posAdd (rc ( i - 1, j )) ( x0, y0 )

        ( x4, y4 ) =
            posAdd (rc ( i, j - 1 )) ( x0, y0 )

        ( x5, y5 ) =
            posAdd (rc ( i + 1, j - 1 )) ( x0, y0 )

        ( x6, y6 ) =
            posAdd (rc ( i + 1, j )) ( x0, y0 )

        borderX =
            [ x1, x1 + a, x1 + a ]
                ++ [ x2 + a, x2 + a, x2 ]
                ++ [ x3 + a, x3, x3 - a ]
                ++ [ x4, x4 - a, x4 - a ]
                ++ [ x5 - a, x5 - a, x5 ]
                ++ [ x6 - a, x6, x6 + a ]
                ++ [ x1, x1 + a, x1 + a ]

        borderY =
            [ y1 - 2 * h, y1 - h, y1 + h ]
                ++ [ y2 - h, y2 + h, y2 + 2 * h ]
                ++ [ y3 + h, y3 + 2 * h, y3 + h ]
                ++ [ y4 + 2 * h, y4 + h, y4 - h ]
                ++ [ y5 + h, y5 - h, y5 - 2 * h ]
                ++ [ y6 - h, y6 - 2 * h, y6 - h ]
                ++ [ y1 - 2 * h, y1 - h, y1 + h ]

        borderStrokeColor =
            case theme of
                Polar ->
                    "cyan"

                Urban ->
                    "gray"

                Minimum ->
                    "#2e85ca"

                _ ->
                    "orange "

        border =
            svg []
                [ polyline
                    [ polyPoint borderX borderY |> SA.points
                    , SA.strokeWidth ".5"
                    , SA.stroke cs.tileStroke
                    , SA.fillOpacity "0.0"
                    ]
                    []
                ]

        constructionCaption =
            if t.hos && t.qua && t.wareHouse then
                "H&Q&W"

            else if t.qua && t.wareHouse then
                "Q&W"

            else if t.hos && t.wareHouse then
                "H&W"

            else if t.hos && t.qua then
                "H&Q"

            else if t.hos then
                "H"

            else if t.wareHouse then
                "W"

            else if t.qua then
                "Q"

            else
                "N"

        cons =
            svg []
                [ text_
                    [ SA.fontSize "10"
                    , SA.fontFamily "sans-serif"
                    , x - 5.0 |> String.fromFloat |> SA.x
                    , y + 5.0 |> String.fromFloat |> SA.y
                    , SA.fill cs.constructionCaption
                    ]
                    [ constructionCaption |> Svg.text ]
                ]

        populationInfo =
            svg []
                [ text_
                    [ SA.fontSize "15"
                    , SA.fontFamily "sans-serif"
                    , x - 15.0 |> String.fromFloat |> SA.x
                    , y - 10.0 |> String.fromFloat |> SA.y
                    , SA.fill "#4ddd81"
                    ]
                    [ t.population - t.sick |> String.fromInt |> Svg.text ]
                , text_
                    [ SA.fontSize "15"
                    , SA.fontFamily "sans-serif"
                    , x + 3.0 |> String.fromFloat |> SA.x
                    , y - 10.0 |> String.fromFloat |> SA.y
                    , SA.fill "orange"
                    ]
                    [ t.sick |> String.fromInt |> Svg.text ]
                , text_
                    [ SA.fontSize "15"
                    , SA.fontFamily "sans-serif"
                    , x - 5.0 |> String.fromFloat |> SA.x
                    , y + 23.0 |> String.fromFloat |> SA.y
                    , SA.fill "red"
                    ]
                    [ t.dead |> String.fromInt |> Svg.text ]
                ]

        hexCoordinates =
            [ ( x, y ), ( x1, y1 ), ( x2, y2 ), ( x3, y3 ), ( x4, y4 ), ( x5, y5 ), ( x6, y6 ) ]

        tiles =
            case theme of
                Minimum ->
                    List.map (renderHex model cs.tile 1.0) (( i, j ) :: generateZone ( i, j ))

                Plain ->
                    List.map (renderHex model cs.tile 1.0) (( i, j ) :: generateZone ( i, j ))

                Polar ->
                    List.map (\( u, v ) -> st1 u v) hexCoordinates

                Urban ->
                    List.map (renderHex model cs.tile 1.0) (( i, j ) :: generateZone ( i, j ))

        --            _ ->
        --              List.map (\( u, v ) -> myTile u v) hexCoordinates
        -- list of positions of the seven hexs in a tile.
    in
    tiles ++ [ border ] ++ [ populationInfo ] ++ [ cons ]


renderTileFilm : Model -> Tile -> List (Html Msg)
renderTileFilm model t =
    let
        a =
            para.a

        h =
            a / sqrt 3

        ind =
            t.indice

        t1 =
            Tuple.first ind

        t2 =
            Tuple.second ind

        i =
            2 * t1 - t2

        j =
            t1 + 3 * t2
    in
    List.map (renderFilm model) (( i, j ) :: generateZone ( i, j ))
