module Model exposing (..)

import Browser.Dom exposing (Error, Viewport)
import Card exposing (..)
import ColorScheme exposing (..)
import Geometry exposing (..)
import List.Extra as LE
import Message exposing (..)
import Parameters exposing (..)
import Random exposing (Generator, list, map)
import Random.List exposing (choose)
import Task
import Tile exposing (..)
import Todo exposing (..)
import Virus exposing (..)


type alias Model =
    { city : City
    , behavior : Behavior
    , state : Gamestatus
    , currentRound : Int
    , screenSize : ( Float, Float )
    , viewport : Maybe Viewport
    , virus : Virus
    , region : Region
    , cardSelected : CardSelected
    , todo : Todo
    , roundTodoCleared : Bool
    , av : AntiVirus
    , power : Int
    , maxPower : Int
    , warehouseNum : Int
    , powRatio : Float
    , selectedHex : ( Int, Int )
    , mouseOver : ( Int, Int )
    , selHex : SelHex
    , hands : List Card
    , deck : List Card
    , mouseOverCardToReplace : Int
    , mouseOverCard : Int
    , replaceChance : Int
    , drawChance : Int
    , actionDescribe : List MyLog
    , currentLevel : Int
    , theme : Theme
    , counter : Int -- deadly up
    , flowRate : Int -- population flow rate
    , virusInfo : Bool
    , waveNum : Int
    , freezeTile : List ( Int, Int ) -- for defenseline
    }


initModel : () -> ( Model, Cmd Msg )
initModel _ =
    ( { city =
            initCity 20
                []
      , behavior = initBehavior
      , currentRound = 1
      , state = HomePage
      , screenSize = ( 600, 800 )
      , viewport = Nothing
      , virus = initHandsVirus 1 |> Tuple.second
      , region = NoRegion
      , cardSelected = NoCard
      , todo = []
      , roundTodoCleared = False
      , av = initAntiVirus
      , power = 50
      , maxPower = 10
      , warehouseNum = 0
      , powRatio = 1.0
      , selectedHex = ( -233, -233 )
      , mouseOver = ( -233, -233 )
      , selHex = SelHexOff
      , hands = initHandsVirus 1 |> Tuple.first --megaClone
      , deck = allCards
      , mouseOverCardToReplace = negate 1
      , mouseOverCard = negate 1
      , replaceChance = 3
      , drawChance = 0
      , actionDescribe = []
      , counter = 3
      , currentLevel = 1 --1
      , theme = Polar
      , flowRate = 1
      , virusInfo = False
      , waveNum = 0
      , freezeTile = []
      }
    , Task.perform GotViewport Browser.Dom.getViewport
    )


type MyLog
    = CardPlayed Card
    | Warning String
    | Feedback String


isWarning : MyLog -> Bool
isWarning l =
    case l of
        Warning str ->
            True

        _ ->
            False


type Gamestatus
    = Playing
    | Drawing
    | Playcard
    | Stopped
    | HomePage
    | CardPage
    | Finished Int
    | Wasted


initLog : Model -> Model
initLog model =
    { model | actionDescribe = [] }


type Region
    = NoRegion
    | SelectRegion ( Int, Int )


type SelHex
    = SelHexOn
    | SelHexOff


type CardSelected
    = NoCard
    | SelectCard Card


type alias Behavior =
    { populationFlow : Bool
    , virusEvolve : Bool
    }


initBehavior =
    { populationFlow = True, virusEvolve = True }


judgeBuild : Model -> ( Int, Int ) -> Bool
judgeBuild model ( i, j ) =
    let
        hostilelst =
            hospitalTiles model.city.tilesIndex

        quatilelst =
            quarantineTiles model.city.tilesIndex

        waretilelst =
            warehouseTiles model.city.tilesIndex
    in
    model.cardSelected
        == SelectCard hospital
        && List.member (converHextoTile ( i, j )) hostilelst
        || model.cardSelected
        == SelectCard quarantine
        && List.member (converHextoTile ( i, j )) quatilelst
        || model.cardSelected
        == SelectCard warehouse
        && List.member (converHextoTile ( i, j )) waretilelst


initlevelmap : Int -> City
initlevelmap level =
    let
        citytile =
            getElement level map
                |> List.head
                |> Maybe.withDefault []
    in
    initCity 20 citytile


mapLevel =
    [ cartesianProduct [ 0, 1 ] [ 0, 1 ]
    , cartesianProduct [ 0, 1 ] [ 0, 1 ]
    , cartesianProduct [ 2 ] [ -3, -2, -1, 0, 1, 2 ] ++ cartesianProduct [ 1 ] [ -2, -1, 0, 1, 2 ] ++ cartesianProduct [ 0 ] [ -1, 0, 2, 3 ] ++ cartesianProduct [ 3 ] [ 0, 1 ] ++ [ ( 4, 0 ) ]
    , cartesianProduct [ -1, 0, 1 ] [ -1, 0, 1 ] ++ cartesianProduct [ 0, 1, 2 ] [ 2, 3 ] ++ [ ( 2, 1 ) ]
    , [ ( 0, 0 )
      , ( 0, 1 )
      , ( 0, 2 )
      , ( 0, 3 )
      , ( 1, -1 )
      , ( 1, 0 )
      , ( 1, 1 )
      , ( 1, 2 )
      , ( 2, -2 )
      , ( 2, -1 )
      , ( 2, 0 )
      , ( 2, 1 )
      , ( 2, 2 )
      , ( 3, -1 )
      , ( 3, -2 )
      ]
    ]


map =
    let
        map_ =
            List.drop 2 mapLevel
                |> List.foldr (++) []
                |> LE.unique
    in
    mapLevel ++ [ map_ ]


tutorialHands =
    [ [ megaClone ], [ cut, megaCut ] ]


initHandsVirus : Int -> ( List Card, Virus )
initHandsVirus level =
    let
        hand =
            if level <= 2 then
                getElement level tutorialHands
                    |> List.foldr (\x -> \y -> x ++ y) []

            else
                []

        vir =
            getElement level virus
                |> List.head
                |> Maybe.withDefault (Virus [] [] 0 0 0)
    in
    ( hand, vir )


lr : Model -> ( Int, Int )
lr model =
    ( model.currentLevel, model.currentRound )


updateDeck : Int -> List Card
updateDeck n =
    getElement n cardPiles
        |> List.foldr (++) []


adjustDeck : Model -> List Card
adjustDeck model =
    let
        deck0 =
            model.deck

        hands =
            model.hands

        city =
            model.city

        deck1 =
            if hosNum city.tilesIndex + LE.count ((==) hospital) hands < List.length city.tilesIndex then
                deck0

            else
                List.filter (\x -> x /= hospital) deck0

        deck2 =
            if quaNum city.tilesIndex + LE.count ((==) quarantine) hands < List.length city.tilesIndex then
                deck1

            else
                List.filter (\x -> x /= quarantine) deck1

        deck =
            if wareNum city.tilesIndex + LE.count ((==) warehouse) hands < List.length city.tilesIndex then
                deck2

            else
                List.filter (\x -> x /= warehouse) deck2
    in
    deck


cardGenerator : Model -> Generator Card
cardGenerator model =
    choose (adjustDeck model)
        |> Random.map (\( x, y ) -> Maybe.withDefault cut x)


cardsGenerator : Model -> Int -> Generator (List Card)
cardsGenerator model n =
    choose model.deck
        |> Random.map (\( x, y ) -> Maybe.withDefault cut x)
        |> Random.list n


winCondition =
    [ 140 -- Atlanta
    , 160 -- amber
    , 80 -- St.P
    , 50 -- Endless
    ]


toCardSelected : Model -> Maybe Card
toCardSelected model =
    let
        sel =
            model.cardSelected
    in
    case sel of
        SelectCard c ->
            Just c

        NoCard ->
            Nothing
