module View exposing (..)

import Debug exposing (log, toString)
import Geometry exposing (..)
import Html exposing (..)
import Message exposing (..)
import Model exposing (..)
import Parameters exposing (..)
import Svg exposing (..)
import Svg.Attributes as SA
import Tile exposing (..)


view : Model -> Html Msg
view model =
    let
        l1 =
            log "tiles" model.city.tilesindex
    in
    svg
        [ SA.viewBox "0 0 1000 600"
        , SA.height "600"
        , SA.width "1000"
        , SA.width (model.screenSize |> Tuple.first |> String.fromFloat)
        , SA.height (model.screenSize |> Tuple.second |> String.fromFloat)
        ]
        (List.foldl (\x -> \y -> x ++ y) [] (List.map renderTile model.city.tilesindex))


renderHex : ( Int, Int ) -> Html Msg
renderHex ( i, j ) =
    let
        ( x0, y0 ) =
            para.tileOrigin

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
            ]
            []
        ]



-- k1, k2, K1, K2
-- K1 = k2 + 2k1; K2 = 3k2 - k1
-- aK1 + bK2 = (2a -b) k1 + (a + 3b) k2


renderTile : Tile -> List (Html Msg)
renderTile t =
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

        lst =
            [ ( i, j )
            , ( i, j - 1 )
            , ( i, j + 1 )
            , ( i + 1, j )
            , ( i + 1, j - 1 )
            , ( i - 1, j )
            , ( i - 1, j + 1 )
            ]

        ( x0, y0 ) =
            para.tileOrigin

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

        borderY =
            [ y1 - 2 * h, y1 - h, y1 + h ]
                ++ [ y2 - h, y2 + h, y2 + 2 * h ]
                ++ [ y3 + h, y3 + 2 * h, y3 + h ]
                ++ [ y4 + 2 * h, y4 + h, y4 - h ]
                ++ [ y5 + h, y5 - h, y5 - 2 * h ]
                ++ [ y6 - h, y6 - 2 * h, y6 - h ]

        border =
            svg []
                [ polyline
                    [ polyPoint borderX borderY |> SA.points
                    , SA.strokeWidth "2"
                    , SA.stroke "orange"
                    ]
                    []
                ]

        constructionCaption =
            case t.construction of
                Hos ->
                    "H"

                Qua ->
                    "Q"

                None ->
                    "N"

        cons =
            svg []
                [ text_
                    [ SA.fontSize "10"
                    , SA.fontFamily "sans-serif"
                    , x - 5.0 |> String.fromFloat |> SA.x
                    , y + 5.0 |> String.fromFloat |> SA.y
                    , SA.fill "white"
                    ]
                    [ constructionCaption |> Svg.text ]
                ]

        -- list of positions of the seven hexs in a tile.
    in
    List.map renderHex lst ++ [ border ] ++ [ cons ]



{- rendermap : Model -> List (Html Msg)
   rendermap model =
       List.map (\x -> renderTile x) model.city.tilesindex
-}
