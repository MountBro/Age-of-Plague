module View exposing (..)

import Geometry exposing (..)
import Html exposing (..)
import Parameters exposing (..)
import Svg exposing (..)
import Svg.Attributes as SA
import Tile exposing (..)
import Model exposing (..)

View : Model -> Html Msg
View model =
    List.map 

renderHex : ( Int, Int ) -> Html Msg
renderHex ( i, j ) =
    let
        ( x, y ) =
            rc ( i, j )

        a =
            param.a

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
            Tile.indice

        I =
            Tuple.first ind

        J =
            Tuple.second ind

        i =
            2 * I - J

        j =
            I + 3 * J
    in
    renderHex ( i, j )
