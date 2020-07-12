module Update exposing (..)

import Browser.Dom exposing (Error, Viewport)
import Card exposing (..)
import Debug exposing (log, toString)
import Message exposing (Msg(..))
import Model exposing (..)
import Parameters exposing (..)
import Random exposing (..)
import Todo exposing (..)
import Virus exposing (..)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Resize w h ->
            ( { model | screenSize = ( toFloat w, toFloat h ) }, Cmd.none )

        Tick newTime ->
            if not (finished model.todo) then
                pickAction model

            else
                ( model, Cmd.none )

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
                ( { model | currentRound = model.currentRound + 1 } |> clearCurrentRoundTodo |> virusEvolve |> ecoInc, Cmd.none )

            else
                ( { model | currentRound = model.currentRound + 1, behavior = initBehavior } |> clearCurrentRoundTodo |> ecoInc, Cmd.none )

        PlayCard card ->
            if card.cost < model.power && para.ecoThreshold < model.economy then
                ( { model
                    | todo = model.todo ++ [ ( True, card.action ) ]
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
        , virus = change model.virus model.av |> Tuple.first
        , av = change model.virus model.av |> Tuple.second
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
            ( { model | power = model.power + inc }, Cmd.none )

        Freeze prob ->
            ( model, Random.generate (FreezeRet prob) (Random.float 0 1) )

        FreezeI ->
            let
                behavior_ =
                    model.behavior

                behavior =
                    { behavior_ | virusEvolve = False }
            in
            ( { model | behavior = behavior }, Cmd.none )

        EcoDoubleI ->
            ( { model | ecoRatio = 2 }, Cmd.none )

        EcoDoubleI_Freeze prob ->
            ( { model | ecoRatio = 2 }, Random.generate (FreezeRet prob) (Random.float 0 1) )

        _ ->
            ( model, Cmd.none )
