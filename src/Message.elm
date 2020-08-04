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
      , "After you had played the card, the card's action was logged in the\nconsole. In the map, one big block is called a [tile]. Each tile contains\n seven hexagons [hex]. Now, please click next round."
      , "On a tile, different kinds of buildings could co-exist but the same\nkind can't. Please try the rest of the cards. Concerning the\npopulation distribution, please notice the numbers on the map."
      , "Costs of card is demonstrated on the card. Playing a\ncard costs your power. Your power is displayed on the left\ntop corner. It would accumulate over turns.\nNow, please click next round."
      , "The 'deck-like' pattern on the left down corner\nis draw button. Drawing a card costs 2 power.\nNow please click draw."
      , "Congrats! You've finished tutorial1.\nNow please click next level to proceed to next level."
      , "Notice: hospital could heal 2 local patients each round. Its heal\neffect can be enhanced by [Enhanced Healing] to at most 5 cured\nper round."
      ]
    , [ "In the previous tutorial, you've learned about cards and entering\nnext rounds. The colored stuff on the map is the [virus]. For details\n(spread pattern, special skills) about the virus, click the [i] button\non the right. Now, please try the button and the cards.\nOr you could just skip to next round."
      , "As you might have noticed, [MegaCut] clears virus on one tile while\n[cut] only clear a hexagon. Now please use [Going Viral]."
      , "Anti-virus (always blue) can be released by player, it exterminate\nlocal virus units and could survive three rounds\nPlease proceed to next turn to witness its spread."
      , "Win or lose is decided by the remaining population after certain\nrounds (except the endless mode). In this tutorial, however, you\nhave to eliminate all the virus on the map.\nHint: remember to draw new cards and accumulate resource\n(power & economy) by clicking next round."
      , "Please be aware of populationFlow between tiles. In each round,\nexchange of at most 2 population (including patients) occurs\nbetween neighboring tiles.\nPlease keep on fighting!"
      , "Great job!\nClick next turn to finish the tutorial."
      ]
    ]


populationGuide =
    [ "Green figures: healthy population."
    , "Yellow figures: sick population."
    , "Red figures: dead number." ]


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
