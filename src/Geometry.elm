module Geometry exposing (..)

import Parameters exposing (..)


type alias TileIndice =
    ( Int, Int )


type alias HexIndice =
    ( Int, Int )


type alias Pos =
    ( Float, Float )


posAdd : Pos -> Pos -> Pos
posAdd ( x1, y1 ) ( x2, y2 ) =
    ( x1 + x2, y1 + y2 )


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


generateZone : ( Int, Int ) -> List ( Int, Int )
generateZone pos =
    let
        i =
            Tuple.first pos

        j =
            Tuple.second pos
    in
    [ ( i, j - 1 ), ( i, j + 1 ), ( i + 1, j ), ( i + 1, j - 1 ), ( i - 1, j ), ( i - 1, j + 1 ) ]


converHextoTile : ( Int, Int ) -> ( Int, Int )
converHextoTile ( i, j ) =
    (( i, j ) :: generateZone ( i, j ))
        |> List.map (\( x, y ) -> ( toFloat x, toFloat y ))
        |> List.map (\( x, y ) -> ( (3 * x + y) / 7, (2 * y - x) / 7 ))
        |> List.filter (\( x, y ) -> isInt x && isInt y)
        |> List.head
        |> Maybe.withDefault ( 0, 0 )
        |> (\( x, y ) -> ( round x, round y ))


converTiletoHex : ( Int, Int ) -> List ( Int, Int )
converTiletoHex ( i, j ) =
    ( 2 * i - j, i + 3 * j ) :: generateZone ( 2 * i - j, i + 3 * j )


converTiletoHex_ : ( Int, Int ) -> ( Int, Int )
converTiletoHex_ ( i, j ) =
    ( 2 * i - j, i + 3 * j )


isInt : Float -> Bool
isInt x =
    abs (x - toFloat (round x)) < 0.00001


cartesianProduct : List a -> List b -> List ( a, b )
cartesianProduct l1 l2 =
    List.foldr (\li1 -> \li2 -> li1 ++ li2)
        []
        (List.map (\x -> List.map (\y -> ( x, y )) l2) l1)


getElement : Int -> List a -> List a
getElement n lst =
    lst
        |> List.take n
        |> List.drop (n - 1)
