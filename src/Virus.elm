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


initVirus : Virus
initVirus =
    { rules = [ 2, 4 ]
    , pos = [ ( 1, 2 ), ( 1, 3 ), ( 2, 2 ), ( 2, 4 ), ( 2, 3 ) ]

    --, pos = cartesianProduct (List.range -5 5) (List.range -5 5)
    , number = 0
    , infect = 1
    , kill = 0.1
    }


initAntiVirus : AntiVirus
initAntiVirus =
    { rules = [ 0, 1, 2, 3 ]
    , pos = []
    , life = 0
    }


createAV : ( Int, Int ) -> AntiVirus
createAV hlst =
    { rules = [ 0, 1, 2, 3 ]
    , pos = [ hlst ]
    , life = 3
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


searchNeighbor : List ( Int, Int ) -> List ( Int, Int )
searchNeighbor virlst =
    List.map (\x -> generateZone x) virlst
        |> List.concat
        |> LE.unique


judgeAlive : List ( Int, Int ) -> Virus -> List ( Int, Int ) -> AntiVirus -> List ( Int, Int ) -> ( Virus, AntiVirus )
judgeAlive lstvir vir lstanti anti lstquatile =
    let
        lstv =
            List.filter (\x -> List.member (countInfectedNeighbor x vir.pos) vir.rules && not (List.member x anti.pos) && not (List.member (converHextoTile x) lstquatile)) lstvir

        lsta =
            if anti.life > 0 then
                List.filter (\x -> List.member (countavNeighbor x anti.pos) anti.rules && not (List.member x vir.pos) && not (List.member (converHextoTile x) lstquatile)) lstanti

            else
                []
    in
    ( { vir | pos = lstv }, { anti | pos = lsta, life = max (anti.life - 1) 0 } )
