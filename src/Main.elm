module Main exposing (..)

import Browser exposing (..)
import View exposing (view)


main =
    Browser.element
        { view = view
        , init = init
        , update = update
        , subscriptions = Cmd.none
        }
