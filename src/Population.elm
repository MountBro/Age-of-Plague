module Population exposing (..)

import Geometry exposing (..)
import List.Extra as LE
import Model exposing (..)
import Tile exposing (..)
import Virus exposing (..)


virusKill : Virus -> City -> City
virusKill vir city =
    let
        dr =
            vir.kill

        patients =
            sumSick city

        estimateddeath =
            if dr /= 0 then
                max (floor (toFloat patients * dr)) 1

            else
                0

        ( lstInfected1, lstInfectedn ) =
            city.tilesIndex
                |> List.filter (\x -> x.sick > 0)
                |> List.sortBy .sick
                |> List.partition (\x -> x.sick < 2)

        deathn =
            lstInfectedn
                |> List.map (\x -> round (dr * toFloat x.sick))
                |> List.sum

        ( dn, d1 ) =
            if deathn >= estimateddeath && estimateddeath > 0 then
                ( List.take (floor ((toFloat deathn / toFloat estimateddeath) * toFloat (List.length lstInfectedn))) lstInfectedn, [] )

            else if deathn < estimateddeath then
                ( lstInfectedn, List.take (estimateddeath - deathn) lstInfected1 )

            else
                ([],[])

        tilesIndex =
            List.map
                (\x ->
                    if List.member x (dn ++ d1) then
                        deathTile x dr

                    else
                        x
                )
                city.tilesIndex
    in
    { city | tilesIndex = tilesIndex }


deathTile : Tile -> Float -> Tile
deathTile x dr =
    let
        dead =
            max (round (toFloat x.sick * dr)) 1
    in
    { x
        | sick = x.sick - dead
        , population = x.population - dead
        , dead = x.dead + dead
    }


infect : Virus -> City -> City
infect virus city =
    let
        inf =
            virus.infect

        lstTile =
            city.tilesIndex

        lstvirHexIndice =
            virus.pos

        lstvirTilesIndice =
            List.map (\x -> converHextoTile x) lstvirHexIndice
    in
    { city
        | tilesIndex = sickupdate lstTile lstvirTilesIndice inf
    }


pFlow : Model -> City -> City
pFlow model city =
    let
        validtileslst =
            city.tilesIndex
                |> List.filter (\x -> x.population > 0)

        flowstructure =
            List.map (\x -> flowStructure model x) validtileslst
                |> List.foldr (++) []

        newcitytiles =
            List.map (\x -> uPlow flowstructure x) city.tilesIndex
    in
    { city | tilesIndex = newcitytiles }


flowStructure : Model -> Tile -> List ( ( Int, Int ), ( Int, Int ) )
flowStructure model t =
    let
        citytileslst =
            model.city.tilesIndex

        flow =
            model.flowRate

        nindex =
            validNeighborTile citytileslst t
                |> List.sortBy
                    (\x ->
                        if x.hos then
                            x.sick

                        else
                            x.sick + x.dead * 2
                    )
                |> List.map (\x -> x.indice)

        numLeave =
            min (flow * List.length nindex) t.population

        leaveLstn =
            List.take (floor (toFloat numLeave / toFloat flow)) nindex

        leaveLst1 =
            nindex
                |> List.drop (floor (toFloat numLeave / toFloat flow))
                |> List.take (modBy flow numLeave)

        numsickLeave =
            round (toFloat numLeave * (toFloat t.sick / toFloat t.population))

        sick1 =
            if modBy 2 numsickLeave == 0 then
                []

            else
                leaveLst1

        sickn =
            List.take (floor (toFloat numsickLeave / toFloat flow)) leaveLstn
    in
    ( t.indice, ( 0 - numLeave, 0 - numsickLeave ) )
        :: List.map
            (\x ->
                if List.member x sickn then
                    ( x, ( flow, flow ) )

                else if List.member x sick1 then
                    ( x, ( 1, 1 ) )

                else if List.member x leaveLst1 then
                    ( x, ( 1, 0 ) )

                else if List.member x leaveLstn then
                    ( x, ( flow, 0 ) )

                else
                    ( x, ( 0, 0 ) )
            )
            nindex


uPlow : List ( ( Int, Int ), ( Int, Int ) ) -> Tile -> Tile
uPlow lst t =
    let
        lstindice =
            List.filter (\x -> Tuple.first x == t.indice) lst

        ( leavelst, sicklst ) =
            List.unzip lstindice
                |> Tuple.second
                |> List.unzip

        leave =
            List.sum leavelst

        sick =
            List.sum sicklst
    in
    { t | population = t.population + leave, sick = t.sick + sick }


updateCity : Model -> City
updateCity model =
    let
        city =
            model.city

        vir =
            model.virus

        city_ =
            virusKill vir city
                |> pFlow model
                |> infect vir
    in
    city_


evacuate : Tile -> City -> List Tile
evacuate t city =
    let
        lstnTile =
            validNeighborTile city.tilesIndex t
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
        city.tilesIndex


change : Virus -> AntiVirus -> City -> ( Virus, AntiVirus )
change virus anti city =
    let
        validlst =
            List.map (\x -> x.indice) city.tilesIndex

        lstvir =
            searchValidNeighbor virus.pos validlst

        lstanti =
            searchValidNeighbor anti.pos validlst

        lstquatile =
            quarantineTiles city.tilesIndex
    in
    judgeAlive lstvir virus lstanti anti lstquatile
