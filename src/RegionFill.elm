module RegionFill exposing (..)

import Card exposing (..)
import Message exposing (..)
import Model exposing (..)
import Todo exposing (..)


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
        ( ( ( True, [ CutHexI sel ] ), card ), Cmd.none )

    else if card == megaCut then
        ( ( ( True, [ CutTileI sel ] ), card ), Cmd.none )

    else if card == organClone then
        ( ( ( True, [ OrganCloneI sel ] ), card ), Cmd.none )

    else if card == humanClone then
        ( ( ( True, [ HumanCloneI sel ] ), card ), Cmd.none )

    else if card == purification then
        ( ( ( True, [ PurificationI sel ] ), card ), Cmd.none )

    else if card == resurgence then
        ( ( ( True, [ ResurgenceI sel ] ), card ), Cmd.none )

    else if card == sacrifice then
        ( ( ( True, [ SacrificeI sel ] ), card ), Cmd.none )

    else if card == defenseline then
        ( ( ( True, [ FreezevirusI sel, FreezevirusI sel ] ), card ), Cmd.none )

    else if card == hospital then
        ( ( ( True, [ HospitalI sel ] ), card ), Cmd.none )

    else if card == quarantine then
        ( ( ( True, [ QuarantineI sel ] ), card ), Cmd.none )

    else if card == cellBroadcast then
        ( ( ( True, [ AttractPeoI sel, StopAttractI sel ] ), card ), Cmd.none )

    else if card == drought then
        ( ( ( True, [ DroughtI_Kill ( sel, 0.5 ), DroughtI_Kill ( sel, 0.5 ) ] ), card ), Cmd.none )

    else if card == warehouse then
        ( ( ( True, [ WarehouseI sel ] ), card ), Cmd.none )

    else if card == warmwave then
        ( ( ( True, [ Warmwave_KIA ( sel, 0.25 ) ] ), card ), Cmd.none )

    else if card == goingViral then
        ( ( ( True, [ AVI sel ] ), card ), Cmd.none )

    else if card == judgement then
        ( ( ( True, [ JudgeI_Kill ( sel, 0.5 ) ] ), card ), Cmd.none )

    else if card == lowSoundWave then
        ( ( ( True, [ EvacuateI sel, StopEVAI sel ] ), card ), Cmd.none )

    else
        ( finishedEmptyQueue, Cmd.none )
