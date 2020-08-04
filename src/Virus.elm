module Virus exposing (..)

import Geometry exposing (..)
import List.Extra as LE


type alias Virus =
    { rules : List Int
    , pos : List ( Int, Int )
    , number : Int -- number of virus
    , infect : Int -- infection per round
    , kill : Float -- deathrate
    }


type alias AntiVirus =
    { rules : List Int
    , pos : List ( Int, Int )
    , life : Int
    }



initAntiVirus : AntiVirus
initAntiVirus =
    { rules = [ 0, 1, 2, 3, 4, 5, 6 ]
    , pos = []
    , life = 0
    }


createAV : ( Int, Int ) -> AntiVirus
createAV hlst =
    { rules = [ 0, 1, 2, 3, 4 ]
    , pos = [ hlst ]
    , life = 2
    }


countInfectedNeighbor : ( Int, Int ) -> List ( Int, Int ) -> Int
countInfectedNeighbor pos lstv =
    let
        lstn =
            --List of indexes of neighbours
            generateZone pos
    in
    lstn
        |> List.map
            (\x ->
                if List.member x lstv then
                    1

                else
                    0
            )
        |> List.sum


countavNeighbor : ( Int, Int ) -> List ( Int, Int ) -> Int
countavNeighbor pos lstv =
    let
        lstn =
            --List of indexes of neighbours
            generateZone pos
    in
    lstn
        |> List.map
            (\x ->
                if List.member x lstv then
                    1

                else
                    0
            )
        |> List.sum


searchValidNeighbor : List ( Int, Int ) -> List ( Int, Int ) -> List ( Int, Int )
searchValidNeighbor virlst lst =
    List.map (\x -> generateZone x) virlst
        |> List.concat
        |> LE.unique
        |> List.filter (\x -> List.member (converHextoTile x) lst)


judgeAlive : List ( Int, Int ) -> Virus -> List ( Int, Int ) -> AntiVirus -> List ( Int, Int ) -> ( Virus, AntiVirus )
judgeAlive lstvir vir lstanti anti lstquatile =
    let
        lsta =
            if anti.life > 0 then
                List.filter (\x -> List.member (countavNeighbor x anti.pos) anti.rules && not (List.member (converHextoTile x) lstquatile)) lstanti

            else
                []

        lstv =
            List.filter (\x -> List.member (countInfectedNeighbor x vir.pos) vir.rules && not (List.member x lsta) && not (List.member (converHextoTile x) lstquatile)) lstvir
    in
    ( { vir | pos = lstv }, { anti | pos = lsta, life = max (anti.life - 1) 0 } )


virus =
    [ virus1, virus2, virus3, virus4, virus5, virus6 ]


virus1 =
    Virus [] [] 1 1 0


virus2 =
    Virus [ 2, 3, 4 ] ([ ( 0, 1 ), ( 0, 2 ), ( 0, 3 ), ( 0, -1 ), ( 0, 0 ), ( 1, -1 ), ( 1, 0 ) ] ++ converTiletoHex ( 1, 0 ) ++ converTiletoHex ( 1, 1 )) 2 1 0


virus3 =
    Virus [ 2, 3 ] (cartesianProduct [ 1 ] [ 1, 2, 3 ] ++ cartesianProduct [ -1, 0 ] [ 1 ] ++ [ ( 0, 4 ), ( -3, 8 ), ( -4, 9 ) ] ++ generateZone (converTiletoHex_ ( 0, 2 ))) 5 1 0.12


virus4 =
    Virus [ 2, 4 ] ([ ( 1, -4 ), ( 2, -4 ), ( 2, -3 ), ( -2, -2 ), ( -3, -1 ), ( -3, 0 ), ( 3, 0 ), ( 3, 1 ) ] ++ converTiletoHex ( 1, -1 ) ++ converTiletoHex ( -1, -1 ) ++ converTiletoHex ( -1, 1 ) ++ generateZone (converTiletoHex_ ( 0, 3 ))) 4 1 0.2


virus5 =
    Virus [ 2, 3, 6 ] (cartesianProduct [ -1 ] [ 0, 1, 2 ] ++ cartesianProduct [ -2 ] [ 3, 4, 5 ] ++ cartesianProduct [ -3 ] [ 6, 7 ] ++ cartesianProduct [ -1, 0 ] [ 8 ] ++ generateZone (converTiletoHex_ ( 0, 3 )) ++ generateZone (converTiletoHex_ ( 2, 2 ))) 3 1 0.48


virus6 =
    Virus [ 2, 5 ] (cartesianProduct [ -2 ] [ 3, 4, 5 ] ++ [ ( -3, 6 ) ] ++ generateZone (converTiletoHex_ ( -1, 1 ))) 6 1 0.05


endlssVir =
    [ cartesianProduct [ -2 ] [ 4, 5 ] ++ [ ( -3, 6 ), ( -3, 7 ) ] ++ generateZone (converTiletoHex_ ( 0, 3 ))
    , generateZone (converTiletoHex_ ( 0, 3 )) ++ [ ( -3, 6 ), ( -3, 7 ) ]
    , generateZone (converTiletoHex_ ( -1, -1 )) ++ [ ( -2, -2 ), ( -3, 0 ), ( -3, -1 ) ]
    , generateZone (converTiletoHex_ ( 2, 3 )) ++ [ ( 4, 7 ), ( 3, 8 ), ( 2, 9 ) ]
    , generateZone (converTiletoHex_ ( 4, 0 )) ++ [ ( 7, 2 ), ( 7, 3 ) ]
    , generateZone (converTiletoHex_ ( 2, -3 )) ++ [ ( 7, -5 ), ( 5, -6 ) ]
    ]


ruleLst =
    [ [ 2, 5 ], [ 2, 4 ], [ 2, 3 ], [ 2, 3, 6 ], [ 2, 3, 5 ], [ 2, 4, 6 ], [ 2, 4, 5 ], [ 2, 3, 4 ] ]
