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
                , economy = 6
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
                |> clearCurrentRoundTodo
                |> virusEvolve
                |> ecoInc
                |> powerInc
                |> initLog
            , Cmd.none
            )

        else if model.currentRound < 4 && model.hands == [] then
            ( { model
                | currentRound = model.currentRound + 1
              }
                |> clearCurrentRoundTodo
                |> virusEvolve
                |> ecoInc
                |> powerInc
                |> initLog
            , Cmd.none
            )

        else if model.currentRound == 4 then
            ( { model
                | currentRound = model.currentRound + 1
                , economy = 6
                , power = 6
                , virus = virus2
                , hands = [ cut, quarantine, megaCut, megaCut, cut, megaCut, hospital ]
              }
                |> clearCurrentRoundTodo
                |> virusEvolve
                |> ecoInc
                |> powerInc
                |> initLog
            , Cmd.none
            )

        else if model.currentRound > 4 then
            ( { model | currentRound = model.currentRound + 1 }
                |> clearCurrentRoundTodo
                |> virusEvolve
                |> ecoInc
                |> powerInc
                |> initLog
                |> judgeWin
            , Cmd.none
            )

        else
            ( model, Cmd.none )

    else if model.behavior.virusEvolve then
        ( { model | currentRound = model.currentRound + 1, drawChance = 1 }
            |> clearCurrentRoundTodo
            |> virusEvolve
            |> ecoInc
            |> powerInc
            |> initLog
            |> judgeWin
        , Cmd.none
        )

    else
        ( { model | currentRound = model.currentRound + 1, behavior = initBehavior, drawChance = 1 }
            |> clearCurrentRoundTodo
            |> ecoInc
            |> powerInc
            |> initLog
            |> judgeWin
        , Cmd.none
        )


ecoInc : Model -> Model
ecoInc model =
    { model
        | economy =
            round
                (toFloat
                    (model.economy
                        + (model.basicEcoOutput + model.warehouseNum * para.warehouseOutput)
                    )
                    * model.ecoRatio
                )
        , ecoRatio = 1.0
    }


powerInc : Model -> Model
powerInc model =
    { model | power = model.power + para.basicPowerInc }


virusEvolve : Model -> Model
virusEvolve model =
    let
        size =
            List.length model.virus.pos

        rules =
            model.virus.rules

        newrules =
            List.filter (\x -> not (List.member x rules)) (List.range 2 6)
                |> List.take 1
                |> List.append rules
                |> List.sort

        ( virus, av ) =
            change model.virus model.av model.city

        city =
            updateCity model
    in
   -- if model.currentLevel /= 6 then
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
   -- else


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
    { model | todo = todo, roundTodoCleared = False }


judgeWin : Model -> Model
judgeWin model =
    if model.currentLevel == 1 && model.currentRound == 4 then
        { model | state = Finished 1 }

    else if model.currentLevel == 2 && model.currentRound >= 4 && List.isEmpty model.virus.pos then
        { model | state = Finished 2 }

    else if model.currentRound == 21 && model.currentLevel > 2 && model.currentLevel < 6 && sumPopulation model.city >= List.sum (getElement (model.currentLevel - 2) winCondition) then
        { model | state = Finished model.currentLevel }

    else if model.currentLevel == 6 && sumPopulation model.city > 0 then
        model

    else if model.currentRound < 21 then
        model

    else
        { model | state = Wasted }


takeOver : Model -> Model
takeOver model =
    let
        city =
            model.city

        vir =
            model.virus

        tilelst =
            if model.currentLevel /= 6 && model.currentRound == para.tor then
                List.filter (\x -> (x.population - x.sick) * 3 <= x.dead && model.currentRound == 16) city.tilesIndex
                    |> List.map (\x -> x.indice)

            else if model.currentLevel == 6 then
                List.filter (\x -> (x.population - x.sick) * 3 <= x.dead && model.currentRound == 16) city.tilesIndex
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

        vir_ =
            { vir | pos = pos }
    in
    { model | virus = vir_ }


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
                    [ Warning "Emergency!!!\nOne Quarantine down!!!\nPatients nearby > 3 * (quarantine population)\nPatients broke into a quarantine.\n" ]
                        ++ model.actionDescribe

                else
                    [ Warning ("Emergency!!!\n" ++ Debug.toString num ++ " Quarantines down!!!\nPatients nearby > 3 * (quarantine population)\nPatients broke into a quarantine.\n") ]
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
                --special round of the virus skill
                { vir_ | rules = rule }

            else if model.currentLevel == 6 && modBy 10 model.currentRound == 0 then
                { vir_ | rules = rule }

            else
                vir_
    in
    { model | virus = vir }


revenge : Int -> Model -> Model
revenge size model =
    if model.currentLevel == 3 then
        if size > List.length model.virus.pos && model.counter == 0 then
            let
                virus_ =
                    model.virus

                virus =
                    { virus_
                        | kill = min (virus_.kill * 1.1) 0.6
                        , infect = min (virus_.infect + 1) 2
                    }
            in
            { model | virus = virus, counter = 3 }

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
        if sumSick city + sumDead city >= sumPopulation city then
            { model | flowRate = 2 }

        else
            { model | flowRate = 1 }

    else
        model
