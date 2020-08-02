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
    | KillTileVir ( ( Int, Int ), Float ) Float
    | JudgeVirPeo ( ( Int, Int ), Float ) Float
    | Click String
    | DrawACard
    | DrawCard Card
    | ViewVirusInfo


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
    [ [ "Welcome to the tutorial!\nIn the tutorial, you will learn the basics about this game.\nPlease click on the card [MegaClone] now."
      , "After you had played the card, the card's action was\nlogged in the console. Concerning the population distribution,\nplease notice the numbers on the map. Now, please click next round."
      , "On a tile, different kinds of buildings could co-exist\nbut the same kind can't, please try the rest of the cards."
      , "Costs of card is demonstrated on the card. Playing a\ncard costs your power. Your power is displayed on the left\ntop corner. It would accumulate over turns.\nNow, please click next round."
      , "The 'deck-like' pattern on the left down corner\nis draw button. Drawing a card costs 2 power.\nNow please click draw."
      , "Congrats! You've finished tutorial1.\nNow please click next level to proceed to next level."
      ]
    , [ "In the previous tutorial, you've learned about cards and entering\nnext rounds. The colored stuff on the map is the [virus]\n. Detailed information and special virus\nskills will be demonstrated once the window on the right\nis clicked. Now please try [Cut] and [MegaCut]\nand click next round"
      , "As you might have noticed, [MegaCut] clears virus on one\ntile while [cut] only clear a hexagon. Now please use [Going Viral]"
      , "Anti-virus (always blue) can be released by player, it exterminate\nlocal virus units and could survive three rounds\nPlease proceed to next turn to witness its spread."
      , "Win or lose is decided by the remaining population after\ncertain rounds (except the endless mode). In this\ntutorial, however, you have to eliminate all the virus\non the map. Hint: remember to draw new cards and accumulate\n resource (power & economy) by clicking next round."
      , "Please be aware of populationFlow between tiles. In each\nround, exchange of at most 2 population (including\npatients) occurs between neighboring tiles.\nPlease keep on fighting!"
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
