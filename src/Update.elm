module Update exposing (..)

import Action exposing (..)
import Browser.Dom exposing (Error, Viewport)
import Card exposing (..)
import ColorScheme exposing (..)
import Debug exposing (log, toString)
import Geometry exposing (..)
import InitLevel exposing (..)
import List.Extra as LE
import Message exposing (Msg(..))
import Model exposing (..)
import NextRound exposing (..)
import Parameters exposing (..)
import Ports as P exposing (..)
import Random exposing (..)
import RegionFill exposing (..)
import Tile exposing (..)
import Todo exposing (..)
import Virus exposing (..)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LevelBegin n ->
            if n <= 2 then
                ( levelInit n model |> loadTheme n, Cmd.none )

            else if n == 5 then
                ( levelInit n model |> loadTheme n, Random.generate InitializeHands (cardsGenerator model 5) )

            else
                ( levelInit n model |> loadTheme n, Random.generate InitializeHands (cardsGenerator model 4) )

        InitializeHands lc ->
            let
                loglc =
                    log "lc" lc

                specialCards =
                    if model.currentLevel == 5 then
                        --St.P
                        [ blizzard
                        , drought
                        , hospital
                        , quarantine
                        , cut
                        ]

                    else if model.currentLevel == 4 then
                        --Amber
                        [ megaClone
                        , organClone
                        , resurgence
                        , purification
                        , cut
                        , hospital
                        ]

                    else if model.currentLevel == 3 then
                        -- Atlanta
                        [ defenseline
                        , sacrifice
                        , goingViral
                        , judgement
                        , hospital
                        , cut
                        ]

                    else
                        [ quarantine
                        , hospital
                        , cut
                        , cut
                        , megaCut
                        , coldWave
                        ]
            in
            ( { model | hands = lc ++ specialCards }, Cmd.none )

        ReplaceCard c replacement ->
            let
                hands_ =
                    model.hands

                hands =
                    hands_
                        |> LE.remove c
                        |> List.append [ replacement ]
            in
            ( { model | hands = hands }, Cmd.none )

        Resize w h ->
            ( { model | screenSize = ( toFloat w, toFloat h ) }, Cmd.none )

        Tick newTime ->
            if not (finished model.todo) then
                model |> pickAction |> mFillRegion

            else
                ( model, Cmd.none ) |> mFillRegion

        AddKey kv ->
            ( model, Cmd.none )

        GotViewport viewport ->
            ( { model
                | viewport = Just viewport
                , screenSize = ( viewport.viewport.width, viewport.viewport.height )
              }
            , Cmd.none
            )

        VirusEvolve ->
            ( model |> virusEvolve
            , Cmd.none
            )

        NextRound ->
            toNextRound model

        DrawACard ->
            if model.power >= para.drawCardCost then
                if model.currentLevel == 1 then
                    if model.currentRound == 3 && model.todo == [] then
                        ( { model | power = model.power - para.drawCardCost }, Random.generate DrawCard (cardGenerator model) )

                    else
                        ( model, Cmd.none )

                else if model.currentLevel == 2 && model.currentRound <= 4 then
                    ( model, Cmd.none )

                else if List.length model.hands < 10 then
                    ( { model | power = model.power - para.drawCardCost }, Random.generate DrawCard (cardGenerator model) )

                else if List.length model.hands >= 10 then
                    let
                        w =
                            "Can't draw a card right now:\nmaximum number of hands (10)\nreached." |> Warning
                    in
                    ( { model | actionDescribe = model.actionDescribe ++ [ w ] }, Cmd.none )

                else
                    ( model, Cmd.none )

            else
                let
                    w =
                        Warning "Can't draw a card right now:\npower insufficient."
                in
                ( { model | actionDescribe = model.actionDescribe ++ [ w ] }, Cmd.none )

        DrawCard c ->
            ( { model | hands = c :: model.hands }, Cmd.none )

        PlayCard card ->
            if
                card.cost
                    <= model.power
            then
                if model.selHex == SelHexOff then
                    if List.member card targetCardlst then
                        ( { model
                            | cardSelected = SelectCard card
                            , selHex = SelHexOn
                            , power = model.power - card.cost
                            , hands = LE.remove card model.hands
                            , actionDescribe = model.actionDescribe ++ [ Warning ("[" ++ card.name ++ "]:\nPlease select a hexagon") ]
                          }
                        , card.name
                            |> String.replace " " ""
                            |> P.cardToMusic
                        )

                    else if judgeSummon card (List.length model.hands) <= 10 && List.member card (Tuple.first summonNum) then
                        ( { model
                            | cardSelected = SelectCard card
                            , todo = model.todo ++ [ ( ( True, card.action ), card ) ]
                            , power = model.power - card.cost
                            , hands = LE.remove card model.hands
                          }
                        , card.name
                            |> String.replace " " ""
                            |> P.cardToMusic
                        )

                    else if judgeSummon card (List.length model.hands) > 10 && List.member card (Tuple.first summonNum) then
                        ( { model | actionDescribe = model.actionDescribe ++ [ Warning "Can't summon, maximum number of\ncards (10) exceeded!!!" ] }
                        , Cmd.none
                        )

                    else
                        ( { model
                            | cardSelected = SelectCard card
                            , todo = model.todo ++ [ ( ( True, card.action ), card ) ]
                            , power = model.power - card.cost
                            , hands = LE.remove card model.hands
                          }
                        , card.name
                            |> String.replace " " ""
                            |> P.cardToMusic
                        )

                else
                    let
                        mc =
                            toCardSelected model
                    in
                    case mc of
                        Just c ->
                            ( { model
                                | actionDescribe = model.actionDescribe ++ [ Warning ("[" ++ c.name ++ "]:\nPlease select a hexagon") ]
                              }
                            , Cmd.none
                            )

                        Nothing ->
                            ( model, Cmd.none )

            else
                ( { model
                    | actionDescribe =
                        model.actionDescribe
                            ++ [ Warning ("[" ++ card.name ++ "]:\n" ++ "Insufficient power!") ]
                  }
                , Cmd.none
                )

        FreezeRet prob rand ->
            let
                behavior_ =
                    model.behavior

                behavior =
                    { behavior_ | virusEvolve = not (rand < prob) }

                log =
                    if rand < prob then
                        [ Feedback "Luckily, the virus is frozen." ]

                    else
                        [ Feedback "Oops, the virus isn't frozen." ]
            in
            ( { model
                | behavior = behavior
                , actionDescribe = model.actionDescribe ++ log
              }
            , Cmd.none
            )

        SelectHex i j ->
            ( { model | selectedHex = ( i, j ) }, Cmd.none )

        MouseOver i j ->
            ( { model | mouseOver = ( i, j ) }, Cmd.none )

        MouseOverCard n ->
            if model.state == Playing then
                ( { model | mouseOverCard = n }, Cmd.none )

            else
                ( model, Cmd.none )

        MouseOverCardToReplace n ->
            if model.state == Drawing then
                ( { model | mouseOverCardToReplace = n }, Cmd.none )

            else
                ( model, Cmd.none )

        SelectCardToReplace c ->
            model |> replaceCard c

        StartRound1 ->
            ( { model | state = Playing, drawChance = 0 }, Cmd.none )

        Message.Alert txt ->
            ( model, sendMsg txt )

        KillTileVir ( ( i, j ), prob ) rand ->
            let
                ( ti, tj ) =
                    converHextoTile ( i, j )

                virus_ =
                    model.virus

                ( vir, log ) =
                    if prob >= rand then
                        ( { virus_
                            | pos = List.filter (\x -> converHextoTile x /= ( ti, tj )) virus_.pos
                          }
                        , Feedback "Luckily, virus is killed"
                        )

                    else
                        ( virus_, Feedback "Oops, nothing changed" )
            in
            ( { model
                | virus = vir
                , actionDescribe = model.actionDescribe ++ [ log ]
              }
            , Cmd.none
            )

        JudgeVirPeo ( ( i, j ), prob ) rand ->
            let
                ( ti, tj ) =
                    converHextoTile ( i, j )

                virus =
                    model.virus

                tilelst =
                    model.city.tilesIndex

                city =
                    model.city

                virus_ =
                    if prob <= rand then
                        { virus
                            | pos = List.filter (\x -> converHextoTile x /= ( ti, tj )) virus.pos
                        }

                    else
                        virus

                city_ =
                    if prob > rand then
                        { city
                            | tilesIndex =
                                List.map
                                    (\x ->
                                        if x.indice == ( ti, tj ) then
                                            { x
                                                | dead = x.population + x.dead
                                                , sick = 0
                                                , population = 0
                                            }

                                        else
                                            x
                                    )
                                    tilelst
                        }

                    else
                        city

                log =
                    if prob <= rand then
                        Feedback "Luckily, virus is killed"

                    else
                        Feedback "Sorry, people are killed"
            in
            ( { model | city = city_, virus = virus_
                      , actionDescribe = model.actionDescribe ++ [ log ]}, Cmd.none )

        Message.Click "home" ->
            ( { model | state = Model.HomePage }, Cmd.none )

        Message.Click "card" ->
            ( { model | state = Model.CardPage }, Cmd.none )

        Message.Click "startGame" ->
            ( { model | state = Model.Playing }, Cmd.none )

        Message.Click _ ->
            ( model, Cmd.none )

        ViewVirusInfo ->
            ( { model | virusInfo = not model.virusInfo }, Cmd.none )


loadTheme : Int -> Model -> Model
loadTheme n model =
    case n of
        3 ->
            { model | theme = Plain }

        4 ->
            { model | theme = Urban }

        5 ->
            { model | theme = Polar }

        _ ->
            { model | theme = Minimum }


replaceCard : Card -> Model -> ( Model, Cmd Msg )
replaceCard c model =
    if List.member c model.hands && model.replaceChance > 0 then
        ( { model | replaceChance = model.replaceChance - 1 }, Random.generate (ReplaceCard c) (cardGenerator model) )

    else
        let
            logreplace =
                log "card to replace does not exist in hands!" ""
        in
        ( model, Cmd.none )


judgeSummon : Card -> Int -> Int
judgeSummon card n =
    let
        num_ =
            LE.elemIndex card (Tuple.first summonNum)
                |> Maybe.withDefault 0

        num =
            num_ + 1

        add =
            getElement num (Tuple.second summonNum)
                |> List.foldr (+) 0
    in
    add + n - 1
