module Virus exposing (..)

import Geometry exposing (..)
import List.Extra as LE


type alias Virus =
    { rules : List Int
    , pos : List ( Int, Int )
    , number : Int -- number of virus
    , infect : Int -- inflection per round
    , kill : Float -- deathrate
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


searchNeighbor : List ( Int, Int ) -> List ( Int, Int )
searchNeighbor virlst =
    List.map (\x -> generateZone x) virlst
        |> List.concat
        |> LE.unique


judgeAlive : List ( Int, Int ) -> Virus -> Virus
judgeAlive lstp vir =
    let
        lst =
            List.partition (\x -> List.member (countInfectedNeighbor x vir.pos) vir.rules) lstp
                |> Tuple.first

    in
    { vir
        | pos = lst
    }


change : Virus -> Virus
change virus =
    let
        lstn =
            searchNeighbor virus.pos

    in
    judgeAlive lstn virus
