module Message exposing (..)

import Browser.Dom exposing (Error, Viewport)
import Card exposing (..)
import Json.Decode as Decode
import Time exposing (..)


type Msg
    = Resize Int Int
    | Tick Time.Posix
    | AddKey KeyValue
    | GotViewport Viewport
    | VirusEvolve
    | NextRound
    | PlayCard Card
    | FreezeRet Float Float
    | SelectHex Int Int


type Gamestatus
    = Playing
    | Drawing
    | Playcard
    | Stopped


type Keyin
    = Tab
    | Other


type KeyValue
    = Control String
    | Character Char


keyDecoder : Decode.Decoder KeyValue
keyDecoder =
    Decode.map toKeyValue (Decode.field "key" Decode.string)


toKeyValue : String -> KeyValue
toKeyValue string =
    let
        _ =
            Debug.log string
    in
    case String.uncons string of
        Just ( char, "" ) ->
            Character char

        _ ->
            Control string


inKey : String -> Keyin
inKey str =
    case str of
        "tab" ->
            Tab

        _ ->
            Other
