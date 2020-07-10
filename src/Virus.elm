module Virus exposing (..)
import Geometry exposing (..)
import List.Extra as LE

type alias Virus =
    { rules : List (Int)
    , pos : List (Pos)
    , number : Int -- number of virus
    , inflect : Int -- inflection per round
    , kill : Float -- deathrate
    }

countValidNeighbor : Pos -> List Pos -> Int
countValidNeighbor pos lstv =
    let
        lstn =  --List of indexes of neighbours
            generateNeighbor pos
    in
    lstn
        |> List.map (\x ->
                        if List.member x lstv then
                            1

                        else
                            0
                )
        |> List.sum


searchNeighbor : List Pos -> List Pos
searchNeighbor virlst =
    List.map (\x -> generateNeighbor x) virlst
        |> List.concat
        |> LE.unique


judgeAlive : List Pos -> Virus -> Virus
judgeAlive lstp vir =
    let
        lst =
            List.partition (\x -> List.member (countValidNeighbor x lstp) vir.rules) lstp
                |> Tuple.first
    in

    { vir |
        pos = lst
        }

change : Virus -> Virus
change virus =
    let
        lstn = searchNeighbor virus.pos
    in
    judgeAlive lstn virus
