module Update exposing (..)

import Browser.Dom exposing (Error, Viewport)
import Card exposing (..)
import Debug exposing (log, toString)
import Geometry exposing (..)
import Message exposing (Msg(..))
import Model exposing (..)
import Parameters exposing (..)
import Ports as P exposing (..)
import Random exposing (..)
import Tile exposing (..)
import Todo exposing (..)
import Virus exposing (..)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Resize w h ->
            ( { model | screenSize = ( toFloat w, toFloat h ) }, Cmd.none )

        Tick newTime ->
            if not (finished model.todo) then
                model |> pickAction |> mFillRegion

            else
                ( model, Cmd.none ) |> mFillRegion

        AddKey kv ->
            ( model, Cmd.none )

        GotViewport viewport ->
            ( { model | viewport = Just viewport, screenSize = ( viewport.viewport.width, viewport.viewport.height ) }
            , Cmd.none
            )

        VirusEvolve ->
            ( model |> virusEvolve
            , Cmd.none
            )

        NextRound ->
            if model.behavior.virusEvolve then
                ( { model | currentRound = model.currentRound + 1 } |> clearCurrentRoundTodo |> virusEvolve |> ecoInc |> initlog, Cmd.none )

            else
                ( { model | currentRound = model.currentRound + 1, behavior = initBehavior } |> clearCurrentRoundTodo |> ecoInc |> initlog, Cmd.none )

        PlayCard card ->
            if card.cost <= model.power && para.ecoThreshold <= model.economy then
                if List.member card targetCardlst then
                    ( { model
                        | cardSelected = SelectCard card
                        , selHex = SelHexOn
                        , power = model.power - card.cost
                        , economy = model.economy - para.ecoThreshold
                      }
                    , P.cardToMusic ""
                    )

                else
                    ( { model
                        | cardSelected = SelectCard card
                        , todo = model.todo ++ [ ( True, card.action ) ]
                        , power = model.power - card.cost
                        , economy = model.economy - para.ecoThreshold
                      }
                    , Cmd.none
                    )

            else
                ( model, Cmd.none )

        FreezeRet prob rand ->
            let
                behavior_ =
                    model.behavior

                behavior =
                    { behavior_ | virusEvolve = not (rand < prob) }
            in
            ( { model | behavior = behavior }, Cmd.none )

        SelectHex i j ->
            let
                log1 =
                    log "i, j: " ( i, j )
            in
            ( { model | selectedHex = ( i, j ) }, Cmd.none )

        MouseOver i j ->
            let
                log2 =
                    log "over" ( i, j )
            in
            ( { model | mouseOver = ( i, j ) }, Cmd.none )

        HosInvalid ->
            ( { model
                | power = model.power + 4
                , economy = model.economy + para.ecoThreshold
              }
            , Cmd.none
            )

        Message.Alert txt ->
            ( model, sendMsg txt )

        KillTileVir ((i, j), prob) rand ->
            let
                (ti, tj) =
                    converHextoTile (i, j)

                virus_ =
                    model.virus

                vir =
                    if prob <= rand then
                        { virus_ |
                            pos = List.filter (\x -> (converHextoTile x) /= (ti, tj)) virus_.pos }

                    else
                        virus_

            in
            ( { model | virus = vir }, Cmd.none)

        JudgeVirPeo ((i, j), prob) rand ->
            let
                (ti, tj) =
                    converHextoTile (i, j)

                virus =
                    model.virus

                tilelst =
                    model.city.tilesindex

                city =
                    model.city

                virus_ =
                    if prob <= rand then
                        { virus |
                            pos = List.filter (\x -> (converHextoTile x) /= (ti, tj)) virus.pos }

                    else
                        virus

                city_ =
                    if prob > rand then
                        { city |
                            tilesindex = List.map (\x -> if x.indice == (ti, tj) then
                                                                { x | dead = x.population + x.dead
                                                                    , sick = 0
                                                                    , population = 0 }
                                                         else
                                                            x
                                                         ) tilelst }

                    else
                        city
            in
            ({ model | city = city_, virus = virus_}, Cmd.none)


ecoInc : Model -> Model
ecoInc model =
    { model
        | economy =
            model.economy
                + (model.basicEcoOutput + model.warehouseNum * para.warehouseOutput)
                * model.ecoRatio
        , ecoRatio = 1
    }


virusEvolve : Model -> Model
virusEvolve model =
    { model
        | city = updateCity model.city model.virus
        , virus = change model.virus model.av model.city |> Tuple.first
        , av = change model.virus model.av model.city |> Tuple.second
    }


clearCurrentRoundTodo : Model -> Model
clearCurrentRoundTodo model =
    let
        todo_ =
            model.todo

        todo =
            List.map (\( x, y ) -> ( x, List.drop 1 y )) todo_
                |> List.filter (\( x, y ) -> not (List.isEmpty y))
                |> List.map (\( x, y ) -> ( True, y ))
    in
    { model | todo = todo, roundTodoCleared = False }


pickAction : Model -> ( Model, Cmd Msg )
pickAction model =
    let
        ( finished, unfinished_ ) =
            List.partition (\( x, y ) -> not x) model.todo

        headQueue_ =
            unfinished_
                |> List.head
                |> Maybe.withDefault finishedEmptyQueue

        headAction =
            headQueue_
                |> Tuple.second
                |> List.head
                |> Maybe.withDefault NoAction

        headQueue =
            ( False, Tuple.second headQueue_ )

        todo =
            finished ++ [ headQueue ] ++ List.drop 1 unfinished_
    in
    { model | todo = todo } |> performAction headAction


performAction : Action -> Model -> ( Model, Cmd Msg )
performAction action model =
    case action of
        IncPowerI inc ->
            ( { model | power = model.power + inc } |> updatelog, Cmd.none )

        Freeze prob ->
            ( model |> updatelog, Random.generate (FreezeRet prob) (Random.float 0 1) )

        FreezeI ->
            let
                behavior_ =
                    model.behavior

                behavior =
                    { behavior_ | virusEvolve = False }
            in
            ( { model | behavior = behavior } |> updatelog, Cmd.none )

        EcoDoubleI_Freeze prob ->
            ( { model | ecoRatio = 2 * model.ecoRatio } |> updatelog, Random.generate (FreezeRet prob) (Random.float 0 1) )

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
            ( { model | virus = virus } |> updatelog, Cmd.none )

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
            ( { model | virus = virus } |> updatelog, Cmd.none )

        Activate996I ->
            let
                virus_ =
                    model.virus

                dr =
                    1.024 * virus_.kill

                virus =
                    { virus_ | kill = dr }
            in
            ( { model | ecoRatio = 2 * model.ecoRatio, virus = virus } |> updatelog, Cmd.none )

        OrganCloneI ( i, j ) ->
            let
                city_ =
                    model.city

                tilelst_ =
                    model.city.tilesindex

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
                    { city_ | tilesindex = tilelst }
            in
            ( { model | city = city } |> updatelog, Cmd.none )

        HumanCloneI ( i, j ) ->
            let
                city_ =
                    model.city

                tilelst_ =
                    model.city.tilesindex

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
                    { city_ | tilesindex = tilelst }
            in
            ( { model | city = city } |> updatelog, Cmd.none )

        MegaCloneI ->
            let
                city_ =
                    model.city

                tilelst_ =
                    model.city.tilesindex

                tilelst =
                    List.map (\x -> { x | population = round (toFloat x.population * 1.5) }) tilelst_

                city =
                    { city_ | tilesindex = tilelst }
            in
            ( { model | city = city } |> updatelog, Cmd.none )

        PurificationI ( i, j ) ->
            let
                city_ =
                    model.city

                tilelst_ =
                    model.city.tilesindex

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
                    { city_ | tilesindex = tilelst }
            in
            ( { model | city = city } |> updatelog, Cmd.none )

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
                    model.city.tilesindex

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
                    { city_ | tilesindex = tilelst }

                virus =
                    { virus_ | pos = virpos }
            in
            ( { model | city = city, virus = virus } |> updatelog, Cmd.none )

        ResurgenceI ( i, j ) ->
            let
                city_ =
                    model.city

                tilelst_ =
                    model.city.tilesindex

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
                    { city_ | tilesindex = tilelst }
            in
            ( { model | city = city } |> updatelog, Cmd.none )

        FreezevirusI ( i, j ) ->
            let
                pos =
                    converHextoTile ( i, j )

                virus_ =
                    model.virus

                virpos =
                    List.filter (\x -> converHextoTile x /= pos) virus_.pos

                virus =
                    { virus_ | pos = virpos }
            in
            ( { model | virus = virus } |> updatelog, Cmd.none )

        HospitalI (i, j) ->
            let
                (ti, tj) =
                    converHextoTile (i, j)

                city_ =
                    model.city

                city =
                    { city_ | tilesindex = List.map (\x ->
                                                        if x.indice == (ti, tj) then
                                                            { x | hos = True
                                                                , cureEff = 2}

                                                        else
                                                            x ) city_.tilesindex
                            }


            in
            ( { model | city = city } |> updatelog, Cmd.none)

        QuarantineI ( i, j ) ->
            let
                ( ti, tj ) =
                    converHextoTile ( i, j )

                city_ =
                    model.city

                city =
                    { city_
                        | tilesindex =
                            List.map
                                (\x ->
                                    if x.indice == ( ti, tj ) then
                                        { x | qua = True }

                                    else
                                        x
                                )
                                city_.tilesindex
                    }
            in
            ( { model | city = city } |> updatelog, Cmd.none )

        EnhanceHealingI ->
            let
                city_ =
                    model.city

                city =
                    { city_
                        | tilesindex =
                            List.map
                                (\x ->
                                    if x.hos then
                                        { x | cureEff = x.cureEff + 1 }

                                    else
                                        x
                                )
                                city_.tilesindex
                    }
            in
            ( { model | city = city } |> updatelog, Cmd.none )

        AttractPeoI ( i, j ) ->
            let
                ( ti, tj ) =
                    converHextoTile ( i, j )

                city_ =
                    model.city

                city =
                    { city_
                        | tilesindex =
                            List.map
                                (\x ->
                                    if x.indice == ( ti, tj ) then
                                        { x | peoFlow = False }

                                    else
                                        x
                                )
                                city_.tilesindex
                    }
            in
            ( { model | city = city } |> updatelog, Cmd.none )

        StopAttractI ( i, j ) ->
            let
                ( ti, tj ) =
                    converHextoTile ( i, j )

                city_ =
                    model.city

                city =
                    { city_
                        | tilesindex =
                            List.map
                                (\x ->
                                    if x.indice == ( ti, tj ) then
                                        { x | peoFlow = True }

                                    else
                                        x
                                )
                                city_.tilesindex
                    }
            in
            ( { model | city = city }, Cmd.none )

        DroughtI_Kill ((i, j), prob) ->
            ( { model | ecoRatio = round (0.5 * toFloat model.ecoRatio) } |> updatelog, Random.generate (KillTileVir ((i, j), prob)) (Random.float 0 1) )

        WarehouseI (i, j) ->
            let
                ( ti, tj ) =
                    converHextoTile ( i, j )

                city_ =
                    model.city

                city =
                    { city_ | tilesindex = List.map (\x -> if x.indice == (ti, tj) then
                                                                { x | wareHouse = True}

                                                           else
                                                                x ) city_.tilesindex }

                num =
                    model.warehouseNum + 1
            in
            ( { model | city = city, warehouseNum = num }, Cmd.none)

        Warmwave_KIA ((i, j), prob) ->
            ( model |> updatelog, Random.generate (KillTileVir ((i, j), prob)) (Random.float 0 1) )

        AVI (i, j) ->
            ( { model | av = createAV (i, j) } |> updatelog, Cmd.none)

        JudgeI_Kill ((i, j), prob) ->
            ( model |> updatelog, Random.generate (JudgeVirPeo ((i, j), prob)) (Random.float 0 1))

        EvacuateI (i, j) ->
            let
                (ti, tj) =
                    converHextoTile (i, j)

                tlst =
                    model.city.tilesindex

                t =
                    List.filter (\x -> x.indice == (ti, tj)) tlst
                        |> List.head
                        |> Maybe.withDefault (Tile ( -100, -100 ) 0 0 0 0 True False False False)

                city =
                    model.city

                city_ =
                    { city | tilesindex =
                                evacuate t city}

            in
            ( { model | city = city_ } |> updatelog, Cmd.none )

        _ ->
            ( model, Cmd.none )


type alias Sel =
    ( Int, Int )


mFillRegion : ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
mFillRegion ( model, cm ) =
    case model.cardSelected of
        NoCard ->
            ( model, cm )

        SelectCard card ->
            case model.selHex of
                SelHexOn ->
                    if model.selectedHex /= ( -233, -233 ) then
                        ( { model
                            | todo =
                                model.todo
                                    ++ [ Tuple.first (fillRegion card model.selectedHex) ]
                            , selHex = SelHexOff
                            , selectedHex = ( -233, -233 )
                          }
                        , Cmd.batch [ cm, Tuple.second (fillRegion card model.selectedHex) ]
                        )

                    else
                        ( model, cm )

                SelHexOff ->
                    ( model, cm )


fillRegion : Card -> Sel -> ( Queue, Cmd Msg )
fillRegion card sel =
    if card == cut then
        ( ( True, [ CutHexI sel ] ), Cmd.none )

    else if card == megaCut then
        ( ( True, [ CutTileI sel ] ), Cmd.none )

    else if card == organClone then
        ( ( True, [ OrganCloneI sel ] ), Cmd.none )

    else if card == humanClone then
        ( ( True, [ HumanCloneI sel ] ), Cmd.none )

    else if card == purification then
        ( ( True, [ PurificationI sel ] ), Cmd.none )

    else if card == resurgence then
        ( ( True, [ ResurgenceI sel ] ), Cmd.none )

    else if card == sacrifice then
        ( ( True, [ SacrificeI sel ] ), Cmd.none )

    else if card == defenseline then
        ( ( True, [ FreezevirusI sel, FreezevirusI sel ] ), Cmd.none )

    else if card == hospital then
        ( ( True, [ HospitalI sel ] ), Cmd.none )

    else if card == quarantine then
        ( ( True, [ QuarantineI sel ] ), Cmd.none )

    else if card == cellBroadcast then
        ( ( True, [ AttractPeoI sel, StopAttractI sel ] ), Cmd.none )

    else if card == drought then
        ( ( True, [ DroughtI_Kill ( sel, 0.5 ), DroughtI_Kill ( sel, 0.5 ) ] ), Cmd.none )

    else if card == warehouse then
        ( ( True, [ WarehouseI sel ] ), Cmd.none )

    else if card == warmwave then
        ( ( True, [ Warmwave_KIA (sel, 0.25) ] ), Cmd.none)

    else if card == goingViral then
        ( ( True, [ AVI sel ] ), Cmd.none )

    else if card == judgement then
        ( ( True, [ JudgeI_Kill (sel, 0.5) ] ), Cmd.none)

    else if card == lowSoundWaves then
        ( ( True, [ EvacuateI sel, StopEVAI sel ] ), Cmd.none )

    else
        ( finishedEmptyQueue, Cmd.none )
