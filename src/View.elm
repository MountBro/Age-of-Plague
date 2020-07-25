module View exposing (..)

import Debug exposing (log, toString)
import GameView exposing (..)
import GameViewBasic exposing (..)
import GameViewButtons exposing (..)
import Html exposing (..)
import Html.Attributes as HA
import Html.Events as HE
import Message exposing (..)
import Model exposing (..)
import Svg exposing (..)
import Svg.Attributes as SA
import SvgSrc exposing (..)
import Tile exposing (..)
import ViewCards as VC exposing (..)
import ViewMP as MP exposing (..)


type alias Document msg =
    { title : String
    , body : List (Html msg)
    }


viewAll : Model -> Document Msg
viewAll model =
    case model.state of
        Model.Playing ->
            Document "game" [ view model ]

        Model.HomePage ->
            Document "main" [ MP.viewAll ]

        Model.CardPage ->
            Document "card" VC.viewCard

        _ ->
            Document "game" [ view model ]


view : Model -> Html Msg
view model =
    let
        film =
            case model.selHex of
                SelHexOn ->
                    List.foldl (\x -> \y -> x ++ y) [] (List.map (renderTileFilm model) model.city.tilesIndex)

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
                    ([ background model.theme ]
                        ++ List.foldl (\x -> \y -> x ++ y) [] (List.map (renderTile model.theme) model.city.tilesIndex)
                        ++ renderVirus model.virus
                        ++ renderantiVirus model.av
                        ++ [ renderLevelProgress model ]
                        --++ renderFlags [ 5, 10, 15 ]
                        ++ renderHands model
                        ++ renderConsole model
                        ++ renderVirusInf model.virus
                        --++ [ renderNextRound ]
                        ++ [ nextButton_ ]
                        ++ [ drawButton_ model ]
                        ++ [ powerInfo model ]
                        ++ (if (lr model == ( 1, 1 ) || lr model == ( 1, 2 )) && not (List.isEmpty model.hands) then
                                [ hand2FirstCard ]

                            else
                                []
                           )
                        ++ (if List.member (lr model) [ ( 1, 2 ), ( 2, 1 ), ( 2, 2 ), ( 2, 3 ), ( 2, 4 ) ] && List.isEmpty model.hands then
                                [ hand2NextRound ]

                            else
                                []
                           )
                        ++ (if model.currentLevel <= 3 then
                                renderGuide model

                            else
                                []
                           )
                        ++ film
                    )

                --, evolveButton
                , nextRoundButton model
                , Html.text ("round " ++ String.fromInt model.currentRound ++ ". ")
                , Html.text ("sumPopulation: " ++ Debug.toString (sumPopulation model.city) ++ ". ")

                --, div [] (List.map cardButton allCards)
                , Html.button [ HE.onClick (Message.Alert "Yo bro!") ] [ Html.text "hello" ]
                , Html.text (Debug.toString model.todo)
                , Html.button [ HE.onClick (LevelBegin 3) ] [ Html.text "begin level0" ]
                , Html.button [ HE.onClick DrawACard ] [ Html.text "Draw card" ]
                , Html.text ("economy: " ++ String.fromInt model.economy)
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
                    ([ background model.theme ]
                        ++ renderInitCards model
                        ++ [ GameViewBasic.caption 20 200 "white" "click on card to replace" 20 ]
                        ++ [ GameViewBasic.caption 20 250 "white" ("you still have " ++ String.fromInt model.replaceChance ++ " chances.") 20 ]
                    )
                , Html.button [ HE.onClick StartRound1 ] [ Html.text "Start round 1" ]
                ]

        Finished ->
            div [] [ Html.text "finished" ]

        Wasted ->
            div [] [ Html.text "wasted" ]

        _ ->
            div [] []
