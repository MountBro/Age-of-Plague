port module Ports exposing (..)

import Message exposing (Msg)


port cardToMusic : String -> Cmd msg


port playBgm : String -> Cmd msg
