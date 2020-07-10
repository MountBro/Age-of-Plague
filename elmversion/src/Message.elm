module Message exposing (..)
import Time exposing (..)
import Json.Decode as Decode


type Msg
    = Resize Int Int
    | Tick Time.Posix
    | AddKey KeyValue

type Gamestatus
    = Playing
    | Drawing
    | Playcard
    | NextRound
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


inKey : Char -> Keyin
inKey char =
    case char of
        "tab" ->
            Tab

        _ ->
            Other