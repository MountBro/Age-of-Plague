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
    { rules = [2,3,4] -- [2, 4]
    , pos = [ (0,1),(0,2),(1,1),( 1, 2 ), ( 1, 3 )]--[ ( 1, 2 ), ( 1, 3 ), ( 2, 2 ), ( 2, 4 ), ( 2, 3 ), ( 1, 4 ), ( 2, 4 ), ( 0, 3 ) ]
    , number = 0
    , infect = 1
    , kill = 0
    }


initAntiVirus : AntiVirus
initAntiVirus =
    { rules = [ 0, 1, 2, 3, 4,5,6]
    , pos = []
    , life = 0
    }


createAV : ( Int, Int ) -> AntiVirus
createAV hlst =
    { rules = [ 0, 1, 2, 3, 4]
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


searchValidNeighbor : List ( Int, Int ) -> List ( Int, Int ) -> List (Int, Int)
searchValidNeighbor virlst lst=
    List.map (\x -> generateZone x) virlst
        |> List.concat
        |> LE.unique
        |> List.filter (\x -> List.member (converHextoTile x) lst)


judgeAlive : List ( Int, Int ) -> Virus -> List ( Int, Int ) -> AntiVirus -> List ( Int, Int ) -> ( Virus, AntiVirus )
judgeAlive lstvir vir lstanti anti lstquatile =
    let
        lstv =
            List.filter (\x -> List.member (countInfectedNeighbor x vir.pos) vir.rules && not (List.member x anti.pos) && not (List.member (converHextoTile x) lstquatile)) lstvir

        lsta =
            if anti.life > 0 then
                List.filter (\x -> List.member (countavNeighbor x anti.pos) anti.rules && not (List.member (converHextoTile x) lstquatile)) lstanti

            else
                []
    in
    ( { vir | pos = lstv }, { anti | pos = lsta, life = max (anti.life - 1) 0 } )


virus =
    [ virus1, virus2]

virus1 =
    Virus [ ] [] 0 1 0

virus2 =
    Virus [2,3,4] [(1,3),(1,4),(1,5),(2,4),(2,3),(0,4),(0,5),(0,1),(0,2),(0,3),(0,-1),(0,0),(1,-1),(1,0)] 0 1 0

