module View exposing (..)

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
        ( x, y ) =
            rc ( i, j )

        a =
            para.a

        h =
            a / sqrt 3
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
        ind =
            t.indice

        a =
            Tuple.first ind

        b =
            Tuple.second ind

        i =
            2 * a - b

        j =
            a + 3 * b

        lst =
            [ ( i, j ), ( i, j - 1 ), ( i, j + 1 ), ( i + 1, j ), ( i + 1, j - 1 ), ( i - 1, j ), ( i - 1, j + 1 ) ]

        -- list of positions of the seven hexs in a tile.
    in
    List.map (\x -> renderHex x) lst



{- rendermap : Model -> List (Html Msg)
   rendermap model =
       List.map (\x -> renderTile x) model.city.tilesindex
-}
