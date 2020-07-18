module Main exposing (..)

import Browser exposing (..)
import Browser.Events exposing (onResize)
import Json.Decode
import Message exposing (..)
import Model exposing (..)
import Time exposing (..)
import Update exposing (..)
import View exposing (..)


main : Program () Model.Model Message.Msg
main =
    Browser.document
        { init = initModel
        , subscriptions = subscriptions
        , update = update
        , view = View.viewAll
        }


subscriptions : Model.Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Browser.Events.onKeyDown (Json.Decode.map AddKey keyDecoder)
        , if model.state == Playing then
            Sub.batch
                [ Time.every 50 Tick
                , Browser.Events.onResize Resize
                ]

          else
            Sub.none
        ]
