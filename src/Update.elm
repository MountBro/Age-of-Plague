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
                ( levelInit n model, Cmd.none )

            else
                ( levelInit n model, Random.generate InitializeHands (cardsGenerator 10) )

        InitializeHands lc ->
            let
                loglc =
                    log "lc" lc
            in
            ( { model | hands = lc }, Cmd.none )

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
            let
                log1 =
                    log "selhex" model.selHex
            in
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
            if model.currentLevel == 1 && para.ecoThreshold <= model.economy then
                if model.currentRound == 3 && model.todo == [] then
                    ( { model | economy = model.economy - para.ecoThreshold }, Random.generate DrawCard cardGenerator )

                else
                    ( model, Cmd.none )

            else if model.currentLevel == 2 && model.currentRound <= 4 then
                ( model, Cmd.none )

            else if para.ecoThreshold <= model.economy then
                ( { model | economy = model.economy - para.ecoThreshold }, Random.generate DrawCard cardGenerator )

            else
                ( model, Cmd.none )

        DrawCard c ->
            ( { model | hands = c :: model.hands }, Cmd.none )

        PlayCard card ->
            if
                card.cost
                    <= model.power
            then
                if List.member card targetCardlst then
                    ( { model
                        | cardSelected = SelectCard card
                        , selHex = SelHexOn
                        , power = model.power - card.cost
                        , hands = LE.remove card model.hands
                        , actionDescribe = model.actionDescribe ++ [ Warning ("[" ++ card.name ++ "]:\nPlease select a hexagon") ]
                      }
                    , P.cardToMusic ""
                    )

                else
                    ( { model
                        | cardSelected = SelectCard card
                        , todo = model.todo ++ [ ( ( True, card.action ), card ) ]
                        , power = model.power - card.cost
                        , hands = LE.remove card model.hands
                      }
                    , Cmd.none
                    )

            else
                ( model, Cmd.none )

        FreezeRet prob rand ->
            let
                behavior_ =
                    model.behavior

                behavior =
                    { behavior_ | virusEvolve = not (rand < prob) }
            in
            ( { model | behavior = behavior }, Cmd.none )

        SelectHex i j ->
            let
                log1 =
                    log "i, j: " ( i, j )
            in
            ( { model | selectedHex = ( i, j ) }, Cmd.none )

        MouseOver i j ->
            let
                log2 =
                    log "over" ( i, j )
            in
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

        HosInvalid ->
            ( { model
                | power = model.power + 4
                , economy = model.economy + para.ecoThreshold
              }
            , Cmd.none
            )

        Message.Alert txt ->
            ( model, sendMsg txt )

        KillTileVir ( ( i, j ), prob ) rand ->
            let
                ( ti, tj ) =
                    converHextoTile ( i, j )

                virus_ =
                    model.virus

                vir =
                    if prob <= rand then
                        { virus_
                            | pos = List.filter (\x -> converHextoTile x /= ( ti, tj )) virus_.pos
                        }

                    else
                        virus_
            in
            ( { model | virus = vir }, Cmd.none )

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
            in
            ( { model | city = city_, virus = virus_ }, Cmd.none )

        Message.Click "home" ->
            ( { model | state = Model.HomePage }, Cmd.none )

        Message.Click "card" ->
            ( { model | state = Model.CardPage }, Cmd.none )

        Message.Click "startGame" ->
            ( { model | state = Model.Playing }, Cmd.none )

        Message.Click _ ->
            ( model, Cmd.none )


loadTheme : Int -> Model -> Model
loadTheme n model =
    case n of
        3 ->
            { model | theme = Polar }

        4 ->
            { model | theme = Urban }

        5 ->
            { model | theme = Plane }

        _ ->
            { model | theme = Minimum }


replaceCard : Card -> Model -> ( Model, Cmd Msg )
replaceCard c model =
    if List.member c model.hands && model.replaceChance > 0 then
        ( { model | replaceChance = model.replaceChance - 1 }, Random.generate (ReplaceCard c) cardGenerator )

    else
        let
            logreplace =
                log "card to replace does not exist in hands!" ""
        in
        ( model, Cmd.none )
