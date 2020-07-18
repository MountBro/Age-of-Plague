module View exposing (..)

import Card exposing (..)
import Debug exposing (log, toString)
import GameView exposing (..)
import Geometry exposing (..)
import Html exposing (..)
import Html.Events as HE
import Json.Decode as D
import Message exposing (..)
import Model exposing (..)
import Parameters exposing (..)
import Svg exposing (..)
import Svg.Attributes as SA
import Svg.Events as SE
import SvgSrc exposing (..)
import Tile exposing (..)
import Virus exposing (..)


view : Model -> Html Msg
view model =
    let
        film =
            case model.selHex of
                SelHexOn ->
                    List.foldl (\x -> \y -> x ++ y) [] (List.map (renderTileFilm model) model.city.tilesindex)

                _ ->
                    []
    in
    case model.state of
        Playing ->
            div []
                [ svg
                    [ SA.viewBox "0 0 1000 600"
                    , SA.height "600"
                    , SA.width "1000"
                    , SA.width (model.screenSize |> Tuple.first |> String.fromFloat)
                    , SA.height (model.screenSize |> Tuple.second |> String.fromFloat)
                    ]
                    ([ bkg ]
                        ++ List.foldl (\x -> \y -> x ++ y) [] (List.map renderTile model.city.tilesindex)
                        ++ renderVirus model.virus
                        ++ renderantiVirus model.av
                        ++ [ renderLevelProgress model ]
                        ++ renderFlags [ 5, 10, 15 ]
                        ++ film
                        ++ [ GameView.caption 15 70 "green" "green: healthy population" 15
                           , GameView.caption 15 90 "orange" "orange: infected population" 15
                           , GameView.caption 15 110 "red" "red: dead population" 15
                           , GameView.caption 15 130 "purple" "purple hex: Virus" 15
                           , GameView.caption 15 150 "blue" "blue hex: AntiVirus" 15
                           ]
                    )
                , evolveButton
                , nextRoundButton
                , Html.text ("round " ++ String.fromInt model.currentRound ++ ". ")
                , Html.text ("sumPopulation: " ++ Debug.toString (sumPopulation model.city) ++ ". ")
                , powerEcoInfo model
                , div [] (List.map cardButton allCards)
                , Html.text (Debug.toString model.todo ++ Debug.toString model.actionDescribe)
                , Html.button [ HE.onClick (Message.Alert "Yo bro!") ] [ Html.text "hello" ]
                , Html.text (Debug.toString model.todo)
                , Html.button [ HE.onClick (LevelBegin 0) ] [ Html.text "begin level0" ]
                ]

        Drawing ->
            div []
                [ svg
                    [ SA.viewBox "0 0 1000 600"
                    , SA.height "600"
                    , SA.width "1000"
                    , SA.width (model.screenSize |> Tuple.first |> String.fromFloat)
                    , SA.height (model.screenSize |> Tuple.second |> String.fromFloat)
                    ]
                    ([ bkg ]
                        ++ renderInitCards model
                        ++ [ GameView.caption 20 200 "white" "click on card to replace" 20 ]
                        ++ [ GameView.caption 20 250 "white" ("you still have " ++ String.fromInt model.replaceChance ++ " chances.") 20 ]
                    )
                , Html.button [ onClick StartRound1 ] [ Html.text "Start round 1" ]
                ]

        _ ->
            div [] []


bkg : Svg Msg
bkg =
    rect
        [ SA.x "0"
        , SA.y "0"
        , SA.width "1000"
        , SA.height "600"
        , SA.fill "#2A363b"
        ]
        []
