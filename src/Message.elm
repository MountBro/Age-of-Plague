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
    [ [ "Welcome to the tutorial! In this tutorial,\nyou will learn the basics about this game.\nPlease click on the card [MegaClone] now."
      , "After you had played the card, the card's action was\nlogged in the console. To know about the population distribution,\nplease notice the numbers on the map.\nNow, please click next round."
      , "On a tile, different kinds of buildings could co-exist\nbut the same kind can't\nNow try the rest of the cards."
      , "Hint: Playing cards costs your power\nPower and economy would accumulate over turns\nPlease click next round now."
      , "When economy reaches 6, click draw to draw a card\nPlease click draw."
      , "Congrats! You've finished tutorial1.\nNow please click next level to proceed to next level."
      ]
    , [ "In the previous tutorial, you've learned about cards and\nentering next rounds. The purple stuff on the map is\nthe [virus]. You can find information about it on the\nright side of the screen. Now please use [Cut] and [MegaCut]\nand click next round"
      , "As you might have noticed, [MegaCut] clears virus on one tile\nwhile [cut] clears virus on one hexagon.\nNow please use [Going Viral]"
      , "Anti-virus (Blue) can be released by player,\nit exterminate local virus units and could survive three rounds\nPlease proceed to next turn to witness its spread."
      , "Win or lose is decided by the remaining population after\ncertain rounds. In this tutorial, however,\nyou have to eliminate all the virus on the map.\nHint: remember to draw new cards or click next round\nto accumulate resource."
      , "Please be aware of populationFlow between tiles.\nIn each round, exchange of at most 2 population\n(could include patients) occurs between neighboring tiles.\nPlease keep on fighting!"
      , "Great job!\nClick next turn to finish the tutorial."
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
