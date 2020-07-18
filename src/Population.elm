module Population exposing (..)

import Geometry exposing (..)
import Tile exposing (..)
import Virus exposing (..)


virusKill : Virus -> City -> City
virusKill vir city =
    let
        dr =
            vir.kill

        patients =
            toFloat (sumSick city)

        death =
            patients
                * dr
                |> round

        ( lstInfectedn, lstInfected1 ) =
            city.tilesindex
                |> List.partition (\x -> x.sick > 0)
                |> Tuple.first
                |> List.sortBy .sick
                |> List.partition (\x -> x.sick > 7)

        estimateDeath =
            round (List.sum (List.map (\x -> toFloat x.sick) lstInfectedn) * dr)

        deathlst =
            if death < estimateDeath then
                List.take (max (round (0.2 * toFloat death / toFloat estimateDeath) * List.length lstInfectedn) 1) lstInfectedn

            else
                lstInfectedn ++ List.take (max (round (toFloat (death - estimateDeath) * 0.2)) 1) lstInfected1
    in
    { city
        | tilesindex =
            List.map
                (\x ->
                    if List.member x deathlst then
                        { x
                            | sick = x.sick - max (round (toFloat x.sick * dr)) 1
                            , dead = x.dead + max (round (toFloat x.sick * dr)) 1
                            , population = x.population - max 1 (round (toFloat x.sick * dr))
                        }

                    else
                        x
                )
                city.tilesindex
    }


infect : City -> Virus -> City
infect city virus =
    let
        inf =
            virus.infect

        lstTile =
            city.tilesindex

        lstvirHexIndice =
            virus.pos

        lstvirTilesIndice =
            List.map (\x -> converHextoTile x) lstvirHexIndice
    in
    { city
        | tilesindex = sickupdate lstTile lstvirTilesIndice inf
    }


populationFlow : Int -> City -> City
populationFlow n city =
    let
        citytileslst =
            city.tilesindex

        t =
            List.take n citytileslst
                |> List.drop (n - 1)
                |> List.head
                |> Maybe.withDefault (Tile ( -100, -100 ) 0 0 0 0 True False False False)

        lstnTile =
            --not include tile t itself
            validNeighborTile citytileslst t

        numNeig =
            --number of valid neighbor tiles around tile t (not including tile t)
            List.length lstnTile

        sickleave =
            --the number of leaving patients
            if t.population > numNeig then
                round (toFloat (t.sick * numNeig) / toFloat t.population)

            else
                t.sick

        leaveLst =
            -- make a ordered list of tiles people would go. Compatible for population < numNeig
            if t.peoFlow then
                List.sortBy (\x -> x.sick + x.dead * 2) lstnTile
                    |> List.map (\x -> x.indice)
                    |> List.take t.population
                    |> List.take numNeig

            else
                []

        sickLst =
            leaveLst
                |> List.take sickleave
    in
    if n <= List.length citytileslst then
        let
            newcitytileslst =
                if t.population >= numNeig && t.peoFlow then
                    List.map
                        (\x ->
                            if x == t then
                                { x
                                    | population = x.population - numNeig
                                    , sick = x.sick - sickleave
                                }

                            else if List.member x.indice sickLst then
                                { x
                                    | population = x.population + 1
                                    , sick = x.sick + 1
                                }

                            else if List.member x.indice leaveLst then
                                { x | population = x.population + 1 }

                            else
                                x
                        )
                        citytileslst

                else if t.peoFlow then
                    List.map
                        (\x ->
                            if x == t then
                                { x
                                    | population = 0
                                    , sick = 0
                                }

                            else if List.member x.indice sickLst then
                                { x
                                    | population = x.population + 1
                                    , sick = x.sick + 1
                                }

                            else if List.member x.indice leaveLst then
                                { x | population = x.population + 1 }

                            else
                                x
                        )
                        citytileslst

                else
                    citytileslst

            newcity =
                { city
                    | tilesindex = newcitytileslst
                }
        in
        populationFlow (n + 1) newcity

    else
        city


updateCity : City -> Virus -> City
updateCity city vir =
    infect city vir
        |> virusKill vir
        |> populationFlow 1


evacuate : Tile -> City -> List Tile
evacuate t city =
    let
        lstnTile =
            validNeighborTile city.tilesindex t
                |> List.sortBy .sick

        l =
            List.length lstnTile

        a =
            if t.population == 0 then
                0

            else
                modBy l t.population

        b =
            if t.population == 0 then
                0

            else
                round (toFloat (t.population - a) / toFloat l)

        sa =
            if t.sick == 0 then
                0

            else
                modBy l t.sick

        sb =
            if t.sick == 0 then
                0

            else
                round (toFloat (t.sick - sa) / toFloat l)

        leavelst =
            lstnTile
                |> List.take t.population

        ln =
            List.take a leavelst

        l1 =
            List.drop a leavelst

        sicklst1 =
            List.drop sa leavelst
    in
    List.map
        (\x ->
            if List.member x ln then
                if List.member x sicklst1 then
                    { x
                        | population = x.population + b + 1
                        , sick = x.sick + sb
                    }

                else
                    { x
                        | population = x.population + b + 1
                        , sick = x.sick + sb + 1
                    }

            else if List.member x l1 then
                if List.member x sicklst1 then
                    { x
                        | population = x.population + b
                        , sick = x.sick + sb
                    }

                else
                    { x
                        | population = x.population + b
                        , sick = x.sick + sb + 1
                    }

            else if x == t then
                { x
                    | population = 0
                    , sick = 0
                }

            else
                x
        )
        city.tilesindex


change : Virus -> AntiVirus -> City -> ( Virus, AntiVirus )
change virus anti city =
    let
        lstvir =
            searchNeighbor virus.pos

        lstanti =
            searchNeighbor anti.pos

        lstquatile =
            quarantineTiles city.tilesindex
    in
    judgeAlive lstvir virus lstanti anti lstquatile
