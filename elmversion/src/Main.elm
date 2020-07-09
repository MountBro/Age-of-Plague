module Main exposing (..)
import Browser exposing (..)
import Message exposing (..)
import Browser.Events exposing (onResize)
import Time exposing (..)
import View exposing(..)
import Json.Decode


main : Program () Model.Model Message.Msg
main = Browser.element
       { view = view
       , init = initmodel
       , update = update
       , subscriptions = Cmd.none
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

