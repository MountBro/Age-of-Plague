module Geometry exposing (..)

import Parameters exposing (..)


type alias TileIndice =
    ( Int, Int )


type alias HexIndice =
    ( Int, Int )


type alias Pos =
    ( Float, Float )


-- the center position of hex (i, j)


rc : HexIndice -> Pos
rc ( i, j ) =
    let
        a =
            para.a

        x =
            a * (toFloat i + 2 * toFloat j)

        y =
            a * toFloat i * sqrt 3 |> negate
    in
    ( x, y )



-- convert Xlist and Ylist to points in svg.polygon


polyPoint : List Float -> List Float -> String
polyPoint l1 l2 =
    if List.isEmpty l1 || List.isEmpty l2 then
        ""

    else
        let
            head1 =
                List.head l1 |> Maybe.withDefault 0.0

            s1 =
                String.fromFloat head1

            head2 =
                List.head l2 |> Maybe.withDefault 0.0

            s2 =
                String.fromFloat head2

            s =
                s1 ++ "," ++ s2 ++ " "
        in
        s ++ polyPoint (List.drop 1 l1) (List.drop 1 l2)

pointAdd : Pos -> Pos -> Pos
pointAdd ( x1, y1 ) ( x2, y2 ) =
    ( x1 + x2, y1 + y2 )


judgeNeighbor : Pos -> Pos -> Bool
judgeNeighbor ( x1, y1 ) ( x2, y2 ) =
    if abs (x2 - x1) == 1 && abs (y2 - y1) == 1 then
        True

    else
        False


generateNeighbor : Pos -> List Pos
generateNeighbor pos =
    let
        i = Tuple.first pos

        j = Tuple.second pos

    in
    [ ( i, j - 1 ), ( i, j + 1 ), ( i + 1, j ), ( i + 1, j - 1 ), ( i - 1, j ), ( i - 1, j + 1 ) ]
