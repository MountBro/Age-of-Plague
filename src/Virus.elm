module Virus exposing (..)

import Geometry exposing (..)


type alias Virus =
    { rules : List Int
    , pos : List ( Int, Int )
    , number : Int -- number of virus
    , infect : Int -- inflection per round
    , kill : Float -- deathrate
    }


countValidNeighbor : ( Int, Int ) -> List ( Int, Int ) -> Int
countValidNeighbor pos lstv =
    let
        lstn =
            --List of indexes of neighbours
            generateNeighbor pos
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
    List.map (\x -> generateNeighbor x) virlst
        |> List.concat


judgeAlive : List ( Int, Int ) -> Virus -> Virus
judgeAlive lstp vir =
    let
        lst =
            List.partition (\x -> List.member (countValidNeighbor x lstp) vir.rules) lstp
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
