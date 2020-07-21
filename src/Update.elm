module Update exposing (..)

import Action exposing (..)
import Browser.Dom exposing (Error, Viewport)
import Card exposing (..)
import Debug exposing (log, toString)
import Geometry exposing (..)
import List.Extra as LE
import Message exposing (Msg(..))
import Model exposing (..)
import Parameters exposing (..)
import Population exposing (..)
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
<<<<<<< HEAD
            if model.behavior.virusEvolve then
=======
            if model.currentlevel == 1 then
                if model.currentRound == 1 && model.hands == [] then
                    ( { model
                        | currentRound = model.currentRound + 1
                        , hands = [ hospital, hospital, hospital, warehouse, quarantine ]
                      }
                        |> initlog
                        |> clearCurrentRoundTodo
                    , Cmd.none
                    )

                else if model.hands == [] && model.currentRound == 2 then
                    ( { model | currentRound = model.currentRound + 1 }
                        |> initlog
                        |> clearCurrentRoundTodo
                    , Cmd.none
                    )

                else
                    ( model, Cmd.none )
            else if model.currentlevel == 2 then
                if model.currentRound == 1 then
                    ( { model
                        | currentRound = model.currentRound + 1
                        , hands = [ goingViral ]
                      }
                        |> clearCurrentRoundTodo
                        |> virusEvolve
                        |> ecoInc
                        |> powerInc
                        |> initlog
                    , Cmd.none
                    )
                else if model.currentRound == 2 && model.hands /= [] then
                    ( model, Cmd.none )
                else if model.currentRound == 4 then
                    ( { model
                        | currentRound = model.currentRound + 1
                        , hands = [ cut, quarantine, megaCut, megaCut, cut, megaCut, hospital ]
                      }
                        |> clearCurrentRoundTodo
                        |> virusEvolve
                        |> ecoInc
                        |> powerInc
                        |> initlog
                    , Cmd.none
                    )
                else if model.currentRound > 1 && model.virus.pos /= [] then
                    ( { model | currentRound = model.currentRound + 1 }
                        |> clearCurrentRoundTodo
                        |> virusEvolve
                        |> ecoInc
                        |> powerInc
                        |> initlog
                    , Cmd.none
                    )
                else
                    ( model, Cmd.none )

            else if model.behavior.virusEvolve then
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8
                ( { model | currentRound = model.currentRound + 1, drawChance = 1 }
                    |> clearCurrentRoundTodo
                    |> virusEvolve
                    |> ecoInc
                    |> powerInc
                    |> initlog
                , Cmd.none
                )

            else
                ( { model | currentRound = model.currentRound + 1, behavior = initBehavior, drawChance = 1 }
                    |> clearCurrentRoundTodo
                    |> ecoInc
                    |> powerInc
                    |> initlog
                , Cmd.none
                )

        DrawACard ->
<<<<<<< HEAD
            if para.ecoThreshold <= model.economy then
=======
            if model.currentlevel == 1 && para.ecoThreshold <= model.economy then
                if model.currentRound == 3 && model.todo == [] then
                    ( { model | economy = model.economy - para.ecoThreshold }, Random.generate DrawCard cardGenerator )

                else
                    ( model, Cmd.none )
            else if model.currentlevel == 2 && model.currentRound <= 4 then
                ( model, Cmd.none )

            else if para.ecoThreshold <= model.economy then
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8
                ( { model | economy = model.economy - para.ecoThreshold }, Random.generate DrawCard cardGenerator )

            else
                ( model, Cmd.none )

        DrawCard c ->
<<<<<<< HEAD
            ( { model | hands = c :: model.hands }, Cmd.none )
=======
                ( { model | hands = c :: model.hands }, Cmd.none )
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8

        PlayCard card ->
            if card.cost <= model.power then
                --&& para.ecoThreshold <= model.economy
                if List.member card targetCardlst then
                    ( { model
                        | cardSelected = SelectCard card
                        , selHex = SelHexOn
                        , power = model.power - card.cost
<<<<<<< HEAD
                        , economy = model.economy - para.ecoThreshold
                        , hands = LE.remove card model.hands
                        , actionDescribe = ("[" ++ card.name ++ "]: Please select a hexagon") :: model.actionDescribe
=======

                        --, economy = model.economy - para.ecoThreshold
                        , hands = LE.remove card model.hands
                        , actionDescribe = model.actionDescribe ++ [ "[" ++ card.name ++ "]:\nPlease select a hexagon" ]
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8
                      }
                    , P.cardToMusic ""
                    )

                else
                    ( { model
                        | cardSelected = SelectCard card
                        , todo = model.todo ++ [ ( ( True, card.action ), card ) ]
                        , power = model.power - card.cost
<<<<<<< HEAD
                        , economy = model.economy - para.ecoThreshold
=======

                        --, economy = model.economy - para.ecoThreshold
>>>>>>> d0308d5a54b40a33687f760cef16b88a458c99f8
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
            ( { model | state = Playing, drawChance = 1 }, Cmd.none )

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
                    model.city.tilesindex

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
                            | tilesindex =
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


ecoInc : Model -> Model
ecoInc model =
    { model
        | economy =
            model.economy
                + (model.basicEcoOutput + model.warehouseNum * para.warehouseOutput)
                * model.ecoRatio
        , ecoRatio = 1
    }


powerInc : Model -> Model
powerInc model =
    { model | power = model.power + para.basicPowerInc }


virusEvolve : Model -> Model
virusEvolve model =
    { model
        | city = updateCity model.city model.virus
        , virus = change model.virus model.av model.city |> Tuple.first
        , av = change model.virus model.av model.city |> Tuple.second
    }


clearCurrentRoundTodo : Model -> Model
clearCurrentRoundTodo model =
    let
        todo_ =
            model.todo

        todo =
            List.map (\( ( x, y ), z ) -> ( ( x, List.drop 1 y ), z )) todo_
                |> List.filter (\( ( x, y ), z ) -> not (List.isEmpty y))
                |> List.map (\( ( x, y ), z ) -> ( ( True, y ), z ))
    in
    { model | todo = todo, roundTodoCleared = False }


levelInit : Int -> Model -> Model
levelInit n model =
    { model
        | behavior = initBehavior
        , state = Drawing
        , currentlevel = n
    }


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
