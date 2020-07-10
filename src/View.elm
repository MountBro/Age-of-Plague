module View exposing (..)

import Geometry exposing (..)
import Html exposing (..)
import Parameters exposing (..)
import Svg exposing (..)
import Svg.Attributes as SA
import Tile exposing (..)
import Model exposing (..)
import Message exposing (..)


view : Model -> Html Msg
view model =
    svg
        [ SA.viewBox ("0 0 1000 600")
        , SA.height "600"
        , SA.width "1000"
        ]
        (List.map (\x -> renderTile x) model.city.tilesindex)


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


renderTile : Tile -> Html Msg
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

        lst = [( i, j ), ( i, j - 1 ), ( i, j + 1 ), ( i + 1, j ), ( i + 1, j + 1 ), ( i - 1, j ), (i - 1, j - 1)]
        -- list of positions of the seven hexs in a tile.

    in
    List.map (\x -> renderHex x) lst


{-rendermap : Model -> List (Html Msg)
rendermap model =
    List.map (\x -> renderTile x) model.city.tilesindex
-}