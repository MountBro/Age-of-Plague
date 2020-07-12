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


judgeAlivevir : List ( Int, Int ) -> Virus -> List ( Int, Int ) -> AntiVirus -> ( Virus, AntiVirus )
judgeAlivevir lstvir vir lstanti anti =
    let
        lstv =
            List.partition (\x -> List.member (countInfectedNeighbor x vir.pos) vir.rules && not (List.member x anti.pos)) lstvir
                |> Tuple.first

        lsta =
            List.partition (\x -> List.member (countavNeighbor x anti.pos) anti.rules && not (List.member x vir.pos)) lstanti
                |> Tuple.first
    in
    ( { vir | pos = lstv }, { anti | pos = lsta } )


change : Virus -> AntiVirus -> ( Virus, AntiVirus )
change virus anti =
    let
        lstvir =
            searchNeighbor virus.pos

        lstanti =
            searchNeighbor anti.pos
    in
    judgeAlivevir lstvir virus lstanti anti
