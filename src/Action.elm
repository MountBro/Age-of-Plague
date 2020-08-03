module Action exposing (..)

import Card exposing (..)
import Debug exposing (log, toString)
import Geometry exposing (..)
import Message exposing (..)
import Model exposing (..)
import Parameters exposing (..)
import Population exposing (..)
import Random exposing (float, generate)
import Tile exposing (..)
import Todo exposing (..)
import Virus exposing (..)


updateLog : Card -> Model -> Model
updateLog card model =
    let
        log =
            [ CardPlayed card ]
    in
    { model | actionDescribe = model.actionDescribe ++ log }


createGuide : Model -> List String
createGuide model =
    let
        str =
            List.take model.currentLevel tutorial
                |> List.foldl (\x -> \y -> x ++ y) []

        card =
            List.map Tuple.second model.todo
    in
    case model.currentLevel of
        1 ->
            if model.hands == [ megaClone ] && model.currentRound == 1 then
                str |> getElement 1

            else if card == [ megaClone ] && model.currentRound == 1 then
                str |> getElement 2

            else if List.length model.hands > 0 && model.currentRound == 2 then
                str |> getElement 3

            else if model.hands == [] && model.currentRound == 2 then
                str |> getElement 4

            else if model.hands == [] && model.currentRound == 3 then
                str |> getElement 5

            else
                str |> getElement 6

        2 ->
            if model.currentRound == 1 then
                str |> getElement 1

            else if model.currentRound == 2 then
                str |> getElement 2

            else if model.currentRound < 5 then
                str |> getElement 3

            else if model.currentRound /= 6 && not (List.isEmpty model.virus.pos) then
                str |> getElement 4

            else if model.currentRound == 6 then
                str |> getElement 5

            else
                getElement 6 str

        _ ->
            []


pickAction : Model -> ( Model, Cmd Msg )
pickAction model =
    let
        ( finished, unfinished_ ) =
            List.partition (\( ( x, y ), z ) -> not x) model.todo

        headQueue_ =
            unfinished_
                |> List.head
                |> Maybe.withDefault finishedEmptyQueue

        headAction =
            headQueue_
                |> Tuple.first
                |> Tuple.second
                |> List.head
                |> Maybe.withDefault NoAction

        headQueue =
            ( ( False, headQueue_ |> Tuple.first |> Tuple.second ), Tuple.second headQueue_ )

        card =
            Tuple.second headQueue_

        todo =
            finished ++ [ headQueue ] ++ List.drop 1 unfinished_
    in
    { model | todo = todo } |> performAction card headAction


performAction : Card -> Action -> Model -> ( Model, Cmd Msg )
performAction card action model =
    case action of
        IncPowerI inc ->
            ( { model | power = model.power + inc } |> updateLog card, Cmd.none )

        Freeze prob ->
            ( model |> updateLog card, Random.generate (FreezeRet prob) (Random.float 0 1) )

        FreezeI ->
            let
                behavior_ =
                    model.behavior

                behavior =
                    { behavior_ | virusEvolve = False }
            in
            ( { model | behavior = behavior } |> updateLog card, Cmd.none )

        PowDoubleI_Freeze prob ->
            ( { model | power = model.power + 1 } |> updateLog card, Random.generate (FreezeRet prob) (Random.float 0 1) )

        CutHexI ( i, j ) ->
            let
                virus_ =
                    model.virus

                pos_ =
                    virus_.pos

                pos =
                    List.filter (\( x, y ) -> ( x, y ) /= ( i, j )) pos_

                virus =
                    { virus_ | pos = pos }
            in
            ( { model | virus = virus } |> updateLog card, Cmd.none )

        CutTileI ( i, j ) ->
            let
                ( t1, t2 ) =
                    converHextoTile ( i, j )

                ( c1, c2 ) =
                    ( 2 * t1 - t2, t1 + 3 * t2 )

                lc =
                    log "chosenTile" ( t1, t2 )

                virus_ =
                    model.virus

                pos_ =
                    virus_.pos

                pos =
                    List.filter
                        (\( x, y ) ->
                            not (List.member ( x, y ) (( c1, c2 ) :: generateZone ( c1, c2 )))
                        )
                        pos_

                virus =
                    { virus_ | pos = pos }
            in
            ( { model | virus = virus } |> updateLog card, Cmd.none )

        Activate996I ->
            let
                virus_ =
                    model.virus

                dr =
                    min (1.024 * virus_.kill) 0.6

                virus =
                    { virus_ | kill = dr }
            in
            ( { model | power = model.power + 1 , virus = virus } |> updateLog card, Cmd.none )

        OrganCloneI ( i, j ) ->
            let
                city_ =
                    model.city

                tilelst_ =
                    model.city.tilesIndex

                pos =
                    converHextoTile ( i, j )

                tilelst =
                    List.map
                        (\x ->
                            if x.indice == pos then
                                if x.sick - x.dead > 0 then
                                    { x | sick = x.sick - x.dead }

                                else
                                    { x | sick = 0 }

                            else
                                x
                        )
                        tilelst_

                city =
                    { city_ | tilesIndex = tilelst }
            in
            ( { model | city = city } |> updateLog card, Cmd.none )

        HumanCloneI ( i, j ) ->
            let
                city_ =
                    model.city

                tilelst_ =
                    model.city.tilesIndex

                pos =
                    converHextoTile ( i, j )

                tilelst =
                    List.map
                        (\x ->
                            if x.indice == pos then
                                { x | population = x.population * 2 }

                            else
                                x
                        )
                        tilelst_

                city =
                    { city_ | tilesIndex = tilelst }
            in
            ( { model | city = city } |> updateLog card, Cmd.none )

        MegaCloneI ->
            let
                city_ =
                    model.city

                tilelst_ =
                    model.city.tilesIndex

                tilelst =
                    List.map (\x -> { x | population = x.sick + ceiling (toFloat (x.population - x.sick) * 1.5) }) tilelst_

                city =
                    { city_ | tilesIndex = tilelst }
            in
            ( { model | city = city } |> updateLog card, Cmd.none )

        PurificationI ( i, j ) ->
            let
                city_ =
                    model.city

                tilelst_ =
                    model.city.tilesIndex

                pos =
                    converHextoTile ( i, j )

                tilelst =
                    List.map
                        (\x ->
                            if x.indice == pos then
                                { x | sick = 0 }

                            else
                                x
                        )
                        tilelst_

                city =
                    { city_ | tilesIndex = tilelst }
            in
            ( { model | city = city } |> updateLog card, Cmd.none )

        SacrificeI ( i, j ) ->
            let
                virus_ =
                    model.virus

                virpos_ =
                    virus_.pos

                virpos =
                    List.filter (\x -> converHextoTile x /= ( i, j )) virpos_

                city_ =
                    model.city

                tilelst_ =
                    model.city.tilesIndex

                tilepos =
                    converHextoTile ( i, j )

                tilelst =
                    List.map
                        (\x ->
                            if x.indice == tilepos then
                                { x
                                    | population = x.population - x.sick
                                    , sick = 0
                                    , dead = x.dead + x.sick
                                }

                            else
                                x
                        )
                        tilelst_

                city =
                    { city_ | tilesIndex = tilelst }

                virus =
                    { virus_ | pos = virpos }
            in
            ( { model | city = city, virus = virus } |> updateLog card, Cmd.none )

        ResurgenceI ( i, j ) ->
            let
                city_ =
                    model.city

                tilelst_ =
                    model.city.tilesIndex

                pos =
                    converHextoTile ( i, j )

                tilelst =
                    List.map
                        (\x ->
                            if x.indice == pos then
                                { x
                                    | population = x.population + round (toFloat x.dead / 2)
                                    , dead = x.dead - round (toFloat x.dead / 2)
                                }

                            else
                                x
                        )
                        tilelst_

                city =
                    { city_ | tilesIndex = tilelst }
            in
            ( { model | city = city } |> updateLog card, Cmd.none )

        FreezevirusI ( i, j ) ->
            let
                pos =
                    converHextoTile ( i, j )
            in
            ( { model | freezeTile = pos :: model.freezeTile } |> updateLog card, Cmd.none )

        HospitalI ( i, j ) ->
            let
                ( ti, tj ) =
                    converHextoTile ( i, j )

                city_ =
                    model.city

                city =
                    { city_
                        | tilesIndex =
                            List.map
                                (\x ->
                                    if x.indice == ( ti, tj ) then
                                        { x
                                            | hos = True
                                            , cureEff = 5
                                        }

                                    else
                                        x
                                )
                                city_.tilesIndex
                    }
            in
            ( { model | city = city } |> updateLog card, Cmd.none )

        QuarantineI ( i, j ) ->
            let
                ( ti, tj ) =
                    converHextoTile ( i, j )

                city_ =
                    model.city

                city =
                    { city_
                        | tilesIndex =
                            List.map
                                (\x ->
                                    if x.indice == ( ti, tj ) then
                                        { x | qua = True }

                                    else
                                        x
                                )
                                city_.tilesIndex
                    }
            in
            ( { model | city = city } |> updateLog card, Cmd.none )

        EnhancedHealingI ->
            let
                city_ =
                    model.city

                city =
                    { city_
                        | tilesIndex =
                            List.map
                                (\x ->
                                    if x.hos then
                                        { x | cureEff = x.cureEff + 1 }

                                    else
                                        x
                                )
                                city_.tilesIndex
                    }
            in
            ( { model | city = city } |> updateLog card, Cmd.none )

        AttractPeoI ( i, j ) ->
            let
                ( ti, tj ) =
                    converHextoTile ( i, j )

                city_ =
                    model.city

                city =
                    { city_
                        | tilesIndex =
                            List.map
                                (\x ->
                                    if x.indice == ( ti, tj ) then
                                        { x | peoFlow = False }

                                    else
                                        x
                                )
                                city_.tilesIndex
                    }
            in
            ( { model | city = city } |> updateLog card, Cmd.none )

        StopAttractI ( i, j ) ->
            let
                ( ti, tj ) =
                    converHextoTile ( i, j )

                city_ =
                    model.city

                city =
                    { city_
                        | tilesIndex =
                            List.map
                                (\x ->
                                    if x.indice == ( ti, tj ) then
                                        { x | peoFlow = True }

                                    else
                                        x
                                )
                                city_.tilesIndex
                    }
            in
            ( { model | city = city }, Cmd.none )

        DroughtI_Kill ( ( i, j ), prob ) ->
            ( { model | powRatio = 0.5 * model.powRatio } |> updateLog card, Random.generate (KillTileVir ( ( i, j ), prob )) (Random.float 0 1) )

        WarehouseI ( i, j ) ->
            let
                ( ti, tj ) =
                    converHextoTile ( i, j )

                city_ =
                    model.city

                city =
                    { city_
                        | tilesIndex =
                            List.map
                                (\x ->
                                    if x.indice == ( ti, tj ) then
                                        { x | wareHouse = True }

                                    else
                                        x
                                )
                                city_.tilesIndex
                    }
            in
            ( { model | city = city, maxPower = para.warehousePowerInc + model.maxPower } |> updateLog card, Cmd.none )

        Warmwave_KIA ( ( i, j ), prob ) ->
            ( model |> updateLog card, Random.generate (KillTileVir ( ( i, j ), prob )) (Random.float 0 1) )

        AVI ( i, j ) ->
            ( { model | av = createAV ( i, j ) } |> updateLog card, Cmd.none )

        JudgeI_Kill ( ( i, j ), prob ) ->
            ( model |> updateLog card, Random.generate (JudgeVirPeo ( ( i, j ), prob )) (Random.float 0 1) )

        EvacuateI ( i, j ) ->
            let
                ( ti, tj ) =
                    converHextoTile ( i, j )

                tlst =
                    model.city.tilesIndex

                t =
                    List.filter (\x -> x.indice == ( ti, tj )) tlst
                        |> List.head
                        |> Maybe.withDefault (Tile ( -100, -100 ) 0 0 0 0 True False False False)

                city =
                    model.city

                city_ =
                    { city
                        | tilesIndex =
                            evacuate t city
                    }
            in
            ( { model | city = city_ } |> updateLog card, Cmd.none )

        Summon cardlst ->
            let
                hands_ =
                    model.hands

                hands =
                    List.append hands_ cardlst
            in
            ( { model | hands = hands } |> updateLog card, Cmd.none )

        _ ->
            ( model, Cmd.none )
