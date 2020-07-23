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
    | MouseOver Int Int
    | InitializeHands (List Card)
    | LevelBegin Int
    | SelectCardToReplace Card
    | MouseOverCardToReplace Int
    | MouseOverCard Int
    | ReplaceCard Card Card
    | StartRound1
    | Alert String
    | HosInvalid
    | KillTileVir ( ( Int, Int ), Float ) Float
    | JudgeVirPeo ( ( Int, Int ), Float ) Float
    | Click String
    | DrawACard
    | DrawCard Card


type Keyin
    = Tab
    | Other


type KeyValue
    = Control String
    | Character Char


type Levelstatus
    = Win
    | Lost
    | Gaming


tutorial =
    [ [ "Welcome to the tutorial!\nAs you can see, red number on tiles stands for local dead\nyellow for patients, green for healthy population\nClick a hand card to play it."
      , "Notice: Each round between two neighboring tile(population > 0)\nat most 2 population (may include patients) would be exchanged\nNow, please click next round."
      , "The live game log is displayed on the left\nSome cards require selecting tiles. Try these cards."
      , "On a tile, different kinds of buildings could co-exist\nbut the same kind can't\nNow try the rest of the cards."
      , "Hint: Playing cards costs your power\nPower and economy would accumulate over turns\nPlease click next round now."
      , "For each formal level, two special cards will be added to the deck\nWhen economy reaches 6, click draw to draw a card\nPlease click draw."
      , "Congratulation!\nClick Next round to finish this level."
      ]
    , [ "Information of virus (purple) are shown on the right\nThey can be exterminated by using card cut or Megacut\nGive them a try and click next turn."
      , "In the future, players may encounter anti-virus card\nPlease try the card [ Going Viral ] and click next turn."
      , "Anti-virus (Blue) can be released by player,\nit exterminate local virus units and could survive three rounds\nPlease click next turn to witness its spread."
      , "Win or lose is decided by the remaining population after\ncertain rounds. Now, try to use these cards to defeat\nyour very first virus in the next few turns\nHint: remeber to draw new cards or click next turn to accumulate resource."
      , "Great job!\nClick next turn to finish this level."
      ]
    ]


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
