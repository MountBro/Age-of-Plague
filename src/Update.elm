module Update exposing (..)

import Browser.Dom exposing (Error, Viewport)
import Card exposing (..)
import Debug exposing (log, toString)
import Message exposing (Msg(..))
import Model exposing (..)
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
            ( { model
                | city = updateCity model.city model.virus
                , virus = change model.virus model.av |> Tuple.first
                , av = change model.virus model.av |> Tuple.second
              }
            , Cmd.none
            )

        NextRound prob ->
            ( model, Random.generate (NextRoundRandom prob) (Random.float 0 1) )

        NextRoundRandom prob f ->
            let
                inc =
                    if f < prob then
                        1

                    else
                        0
            in
            ( { model | currentRound = model.currentRound + inc } |> clearCurrentRoundTodo, Cmd.none )

        PlayCard card ->
            ( { model | todo = model.todo ++ [ ( True, card.action ) ] }, Cmd.none )


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

        _ ->
            ( model, Cmd.none )
