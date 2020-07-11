module Update exposing (..)

import Browser.Dom exposing (Error, Viewport)
import Message exposing (Msg(..))
import Model exposing (..)
import Random exposing (..)
import Virus exposing (..)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Resize w h ->
            ( { model | screenSize = ( toFloat w, toFloat h ) }, Cmd.none )

        Tick newTime ->
            ( model, Cmd.none )

        AddKey kv ->
            ( model, Cmd.none )

        GotViewport viewport ->
            ( { model | viewport = Just viewport, screenSize = ( viewport.viewport.width, viewport.viewport.height ) }
            , Cmd.none
            )

        VirusEvolve ->
            ( { model | virus = model.virus |> change }, Cmd.none )

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
            ( { model | currentRound = model.currentRound + inc }, Cmd.none )
