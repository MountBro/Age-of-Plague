module NextRound exposing (..)

import Card exposing (..)
import Geometry exposing (..)
import List.Extra as LE
import Message exposing (Msg(..))
import Model exposing (..)
import Parameters exposing (..)
import Population exposing (..)
import Tile exposing (..)
import Virus exposing (..)


toNextRound : Model -> ( Model, Cmd Msg )
toNextRound model =
    if model.currentLevel == 1 then
        if model.currentRound == 1 && model.hands == [] then
            ( { model
                | currentRound = 2
                , hands = [ hospital, hospital, hospital, warehouse, quarantine ]
              }
                |> initLog
                |> clearCurrentRoundTodo
            , Cmd.none
            )

        else if model.hands == [] && model.currentRound == 2 then
            ( { model
                | currentRound = 3
              }
                |> initLog
                |> clearCurrentRoundTodo
            , Cmd.none
            )

        else if model.currentRound == 3 && model.hands /= [] then
            ( { model | currentRound = 4 }
                |> initLog
                |> clearCurrentRoundTodo
                |> judgeWin
            , Cmd.none
            )

        else
            ( model, Cmd.none )

    else if model.currentLevel == 2 then
        if model.currentRound == 1 then
            ( { model
                | currentRound = model.currentRound + 1
                , hands = [ goingViral ]
              }
                |> virusEvolve
                |> clearCurrentRoundTodo
                |> powerInc
                |> initLog
            , Cmd.none
            )

        else if model.currentRound < 4 && model.hands == [] then
            ( { model
                | currentRound = model.currentRound + 1
              }
                |> virusEvolve
                |> clearCurrentRoundTodo
                |> powerInc
                |> initLog
            , Cmd.none
            )

        else if model.currentRound == 4 then
            ( { model
                | currentRound = model.currentRound + 1
                , power = 6
                , virus = virus2
                , hands = [ cut, quarantine, megaCut, megaCut, cut, megaCut, hospital ]
              }
                |> virusEvolve
                |> clearCurrentRoundTodo
                |> powerInc
                |> initLog
            , Cmd.none
            )

        else if model.currentRound > 4 then
            ( { model | currentRound = model.currentRound + 1 }
                |> renewStatus
            , Cmd.none
            )

        else
            ( model, Cmd.none )

    else if model.behavior.virusEvolve then
        ( { model | currentRound = model.currentRound + 1, drawChance = 1 }
            |> renewStatus
        , Cmd.none
        )

    else
        ( { model | currentRound = model.currentRound + 1, behavior = initBehavior, drawChance = 1 }
            |> clearCurrentRoundTodo
            |> powerInc
            |> initLog
            |> judgeWin
            |> endlessVirCreator
        , Cmd.none
        )


renewStatus : Model -> Model
renewStatus model =
    model
        |> virusEvolve
        |> powerInc
        |> initLog
        |> judgeWin
        |> clearCurrentRoundTodo
        |> endlessVirCreator


powerInc : Model -> Model
powerInc model =
    if model.power + round (model.powRatio * toFloat para.basicPowerInc) >= model.maxPower then
        let
            w =
                "Maximum Power reached. " |> Warning
        in
        { model | power = model.maxPower, actionDescribe = w :: model.actionDescribe }

    else
        { model | power = model.power + round (model.powRatio * toFloat para.basicPowerInc) }


virusEvolve : Model -> Model
virusEvolve model =
    let
        vir =
            model.virus

        size =
            List.length vir.pos

        rules =
            vir.rules

        frozeTile =
            model.freezeTile

        newrules =
            List.filter (\x -> not (List.member x rules)) (List.range 2 6)
                |> List.take 1
                |> List.append rules
                |> List.sort

        freezePos =
            List.filter (\x -> List.member (converHextoTile x) frozeTile) vir.pos

        ( virus_, av ) =
            change vir model.av model.city

        virPos =
            List.filter (\x -> not (List.member (converHextoTile x) frozeTile)) virus_.pos ++ freezePos

        virus =
            { virus_ | pos = virPos }

        city =
            updateCity model
    in
    { model
        | city = city
        , virus = virus
        , av = av
    }
        |> mutate newrules
        |> takeOver
        |> unBlockable
        |> revenge size
        |> horrify


clearCurrentRoundTodo : Model -> Model
clearCurrentRoundTodo model =
    let
        todo_ =
            model.todo

        todo =
            List.map (\( ( x, y ), z ) -> ( ( x, List.drop 1 y ), z )) todo_
                |> List.filter (\( ( x, y ), z ) -> not (List.isEmpty y))
                |> List.map (\( ( x, y ), z ) -> ( ( True, y ), z ))
    in
    { model
        | todo = todo
        , roundTodoCleared = False
        , selHex = SelHexOff
        , freezeTile = []
    }


judgeWin : Model -> Model
judgeWin model =
    if model.currentLevel == 1 && model.currentRound == 4 then
        { model | state = Finished 1 }

    else if model.currentLevel == 2 && model.currentRound >= 4 && List.isEmpty model.virus.pos then
        { model | state = Finished 2 }

    else if model.currentRound == 21 && model.currentLevel > 2 && model.currentLevel < 6 && sumPopulation model.city >= List.sum (getElement (model.currentLevel - 2) winCondition) then
        { model | state = Finished model.currentLevel }

    else if model.currentLevel == 6 && sumPopulation model.city >= List.sum (getElement (model.currentLevel - 2) winCondition) then
        model

    else if model.currentRound < 21 && sumPopulation model.city > 0 then
        model

    else
        { model | state = Wasted }


endlessVirCreator : Model -> Model
endlessVirCreator model =
    let
        num =
            model.virus.number

        virus_ =
            model.virus

        virus =
            { virus_ | number = num - 1 }

        tiles_ =
            model.city.tilesIndex

        city_ =
            model.city

        tiles1 =
            List.map
                (\x ->
                    if x.qua then
                        { x | qua = False }

                    else
                        x
                )
                tiles_

        city1 =
            { city_ | tilesIndex = tiles1 }

        tiles2 =
            List.map
                (\x ->
                    { x | population = x.population + 2 }
                )
                tiles_

        city2 =
            { city_ | tilesIndex = tiles2 }
    in
    if model.currentLevel == 6 && num == 6 && List.isEmpty virus.pos then
        { model
            | actionDescribe = Warning ("Congrats!!\nYou've defeated one wave!\nAll quaratines reset.\nEmergency is temporarily gone.") :: model.actionDescribe
            , city = city1
            , virus = virus
            , waveNum = model.waveNum + 1
        }

    else if model.currentLevel == 6 && num == 5 && List.isEmpty virus.pos then
        { model
            | actionDescribe = Warning ("Next wave: 2 rounds\nPopulation bonus:\nSome refugees join your city.") :: model.actionDescribe
            , virus = virus
            , city = city2
        }

    else if model.currentLevel == 6 && num == 4 then
        { model
            | actionDescribe = Warning "Next wave: next turn\n" :: model.actionDescribe
            , virus = virus
        }

    else if model.currentLevel == 6 && num == 3 then
        { model | virus = selectVirus model.currentRound model.waveNum }

    else
        model


selectVirus : Int -> Int -> Virus
selectVirus n wave =
    let
        pos =
            if wave >= 3 && 1 + modBy 6 wave /= 1 + modBy 5 n then
                getElement (1 + modBy 6 wave) endlssVir
                    ++ getElement (1 + modBy 5 n) endlssVir
                    |> List.foldr (++) []
                    |> LE.unique

            else if wave >= 3 && 1 + modBy 6 wave == 1 + modBy 5 n then
                getElement (1 + modBy 6 wave) endlssVir
                    ++ getElement (1 + modBy 6 n) endlssVir
                    |> List.foldr (++) []
                    |> LE.unique

            else
                getElement (1 + modBy 6 wave) endlssVir
                    |> List.foldr (++) []

        rules =
            if wave > 8 then
                getElement (4 + modBy 5 wave) ruleLst
                    |> List.foldr (++) []

            else
                getElement (1 + modBy 3 n) ruleLst
                    |> List.foldr (++) []
    in
    Virus rules pos 6 1 (min (0.1 + toFloat wave * 0.04) 0.66)


takeOver : Model -> Model
takeOver model =
    let
        city =
            model.city

        vir =
            model.virus

        lv =
            model.currentLevel

        r =
            model.currentRound

        freezeTiles =
            model.freezeTile

        tilelst =
            if lv /= 6 && r == para.tor then
                List.filter (\x -> (x.population - x.sick) * 3 <= x.dead && not (List.member x.indice freezeTiles)) city.tilesIndex
                    |> List.map (\x -> x.indice)

            else if lv == 6 && vir.pos /= [] && modBy para.tor r == 0 then
                List.filter (\x -> (x.population - x.sick) * 6 <= x.dead && not (List.member x.indice freezeTiles)) city.tilesIndex
                    |> List.map (\x -> x.indice)

            else
                []

        extraVir =
            List.map (\x -> converTiletoHex x) tilelst
                |> List.concat

        pos =
            vir.pos
                ++ extraVir
                |> LE.unique

        message =
            if List.isEmpty extraVir then
                []

            else
                [ Warning ("Virus outbreaks in damaged areas\n" ++ "(Dead>=" ++ Debug.toString (3 * (r // 17 + 1)) ++ "xHealthy population)\n") ]

        vir_ =
            { vir | pos = pos }
    in
    { model
        | virus = vir_
        , actionDescribe = message ++ model.actionDescribe
    }


unBlockable : Model -> Model
unBlockable model =
    if List.member model.currentLevel [ 5, 6 ] then
        let
            city =
                model.city

            tlst =
                city.tilesIndex

            tilelst =
                List.map
                    (\x ->
                        if x.qua && neighborSick tlst x > ((x.population - x.sick) * 3) then
                            ( { x | qua = False }, 1 )

                        else
                            ( x, 0 )
                    )
                    tlst

            citytile =
                List.unzip tilelst
                    |> Tuple.first

            num =
                List.unzip tilelst
                    |> Tuple.second
                    |> List.sum

            city_ =
                { city | tilesIndex = citytile }

            actionDescribe =
                if num == 0 then
                    model.actionDescribe ++ []

                else if num == 1 then
                    [ Warning "Emergency!!!\nPatients broke into one quarantine!!\nPatients nearby>3x(quarantine population)\n\n" ]
                        ++ model.actionDescribe

                else
                    [ Warning ("Emergency!!!\nPatients broke into " ++ Debug.toString num ++ " quarantines!!\nPatients nearby>3x(quarantine population)\n") ]
                        ++ model.actionDescribe
        in
        { model
            | city = city_
            , actionDescribe = actionDescribe
        }

    else
        model


mutate : List Int -> Model -> Model
mutate rule model =
    let
        vir_ =
            model.virus

        vir =
            if model.currentRound == para.mr && model.currentLevel < 6 then
                { vir_ | rules = rule }

            else if model.currentLevel == 6 && modBy para.mr model.currentRound == 0 && List.length vir_.pos < 4 then
                { vir_ | rules = rule }

            else
                vir_
    in
    { model
        | virus = vir
        , actionDescribe =
            [ Warning "Spread pattern mutates!!!\n(See the virus info panel)\n" ]
                ++ model.actionDescribe
    }


revenge : Int -> Model -> Model
revenge size model =
    if model.currentLevel == 3 then
        if size > List.length model.virus.pos && model.counter == 0 then
            let
                virus_ =
                    model.virus

                virus =
                    { virus_
                        | kill = min (virus_.kill * 1.1) 0.66
                        , infect = min (virus_.infect + 1) 2
                    }
            in
            { model
                | virus = virus
                , counter = 3
                , actionDescribe =
                    [ Warning "Virus become stronger!!!\n(See the virus info panel)\n" ]
                        ++ model.actionDescribe
            }

        else if size < List.length model.virus.pos then
            { model | counter = model.counter - 1 }

        else
            model

    else
        model


horrify : Model -> Model
horrify model =
    if List.member model.currentLevel [ 4, 6 ] then
        let
            city =
                model.city
        in
        if sumSick city + sumDead city >= sumPopulation city && model.flowRate == 1 then
            { model
                | flowRate = 2
                , actionDescribe =
                    [ Warning "Terror spreads among citizens:\npopulation flow x2.\n (Healthy<dead+sick)\n" ]
                        ++ model.actionDescribe
            }

        else if sumSick city + sumDead city >= sumPopulation city then
            model

        else if model.flowRate == 2 then
            { model
                | flowRate = 1
                , actionDescribe =
                    [ Warning "Citzens calm down (Healthy<dead+sick)\nInitialize population flow rate.\n" ]
                        ++ model.actionDescribe
            }

        else
            model

    else
        model
