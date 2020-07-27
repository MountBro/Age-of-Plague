module GameViewButtons exposing (..)

import Card exposing (..)
import ColorScheme exposing (..)
import GameViewBasic exposing (..)
import Geometry exposing (..)
import Html exposing (..)
import Message exposing (..)
import Model exposing (..)
import Parameters exposing (..)
import Svg exposing (..)
import Svg.Attributes as SA


cardButton : Card -> Html Msg
cardButton card =
    Html.button [ onClick (PlayCard card) ] [ Html.text card.name ]


newlevelButton : Model -> Html Msg
newlevelButton model =
    Html.button [ onClick (LevelBegin (model.currentLevel + 1)) ] [ Html.text "Enter the next level" ]


evolveButton : Html Msg
evolveButton =
    Html.button [ onClick VirusEvolve ] [ Html.text "EVOLVE" ]



--renderNextRound : Html Msg
--renderNextRound =
--    svg [ GameViewBasic.onClick NextRound ]
--        [ rect
--            [ para.repx - para.repr |> String.fromFloat |> SA.x
--            , para.repy - para.repr |> String.fromFloat |> SA.y
--            , para.repr |> String.fromFloat |> SA.rx
--            , para.nrbc |> SA.fill
--            , 6.0 * para.repr |> String.fromFloat |> SA.width
--            , 2.0 * para.repr |> String.fromFloat |> SA.height
--            ]
--            []
--        , GameViewBasic.caption (para.repx + 2.0 * para.repr - 33.0) (para.repy + 3.0) "white" "Next Round" 20
--        ]


nextRoundButton : Model -> Html Msg
nextRoundButton model =
    --if judgeWin model == Win then
    --    Html.button [ onClick (LevelBegin (model.currentLevel + 1)) ] [ Html.text "Next Level" ]
    --else if judgeWin model == Lost then
    --    Html.button [ onClick (LevelBegin model.currentLevel) ] [ Html.text "Restart level" ]
    --else
    --
    Html.button [ onClick NextRound ] [ Html.text "Next round" ]


nextButton : Float -> Float -> Float -> Html Msg
nextButton x y w =
    svg [ onClick NextRound ]
        [ Svg.image
            [ x |> String.fromFloat |> SA.x
            , y |> String.fromFloat |> SA.y
            , "./assets/icons/next-button.png" |> SA.xlinkHref
            , w |> String.fromFloat |> SA.width
            ]
            []
        , Svg.rect
            [ x |> String.fromFloat |> SA.x
            , y |> String.fromFloat |> SA.y
            , w |> String.fromFloat |> SA.width
            , w |> String.fromFloat |> SA.height
            , "transparent" |> SA.fill
            ]
            []
        ]


nextButton_ =
    nextButton para.nextButtonX para.nextButtonY para.nextButtonW


renderEconomyProgress : Float -> Float -> Float -> Model -> Html Msg
renderEconomyProgress x y r model =
    let
        t =
            model.theme

        cs =
            colorScheme t

        eco =
            model.economy

        ratio =
            (toFloat eco / toFloat para.ecoThreshold) |> Basics.min 1 |> Basics.max 0

        offSet =
            2.0 * pi * r * ratio

        offSetComp =
            2.0 * pi * r * (1.0 - ratio)

        arr =
            String.fromFloat offSet ++ " " ++ String.fromFloat offSetComp

        rotArg =
            "rotate(-90,"
                ++ String.fromFloat x
                ++ ","
                ++ String.fromFloat y
                ++ ")"

        txt =
            String.fromInt model.economy
                ++ "/"
                ++ String.fromInt para.ecoThreshold
    in
    svg []
        [ circle
            [ SA.stroke cs.drawStroke
            , SA.strokeWidth "4"
            , SA.fill "transparent"
            , arr |> SA.strokeDasharray
            , r |> String.fromFloat |> SA.r
            , x |> String.fromFloat |> SA.cx
            , y |> String.fromFloat |> SA.cy
            , rotArg |> SA.transform
            ]
            []
        , circle
            [ SA.fill
                (if eco < para.ecoThreshold then
                    cs.drawBkg

                 else
                    "green"
                )
            , SA.fillOpacity "0.9"
            , r |> String.fromFloat |> SA.r
            , x |> String.fromFloat |> SA.cx
            , y |> String.fromFloat |> SA.cy
            ]
            []
        , GameViewBasic.caption (x - 6.0) (y + 3.0) "white" txt 10
        ]


drawButton : Float -> Float -> Float -> Model -> Html Msg
drawButton x y w model =
    svg [ onClick DrawACard ]
        [ Svg.image
            [ x |> String.fromFloat |> SA.x
            , y |> String.fromFloat |> SA.y
            , "./assets/icons/card-draw.png" |> SA.xlinkHref
            , w |> String.fromFloat |> SA.width
            ]
            []
        , Svg.rect
            [ x |> String.fromFloat |> SA.x
            , y |> String.fromFloat |> SA.y
            , w |> String.fromFloat |> SA.width
            , w |> String.fromFloat |> SA.height
            , "transparent" |> SA.fill
            ]
            []
        , renderEconomyProgress (x + 0.8 * w) (y + 0.8 * w) (0.2 * w) model
        ]


drawButton_ : Model -> Html Msg
drawButton_ =
    drawButton para.drawButtonX para.drawButtonY para.drawButtonW


houseButton : Float -> Float -> Float -> Html Msg
houseButton x y w =
    svg [ onClick (Message.Click "home") ]
        [ Svg.image
            [ x |> String.fromFloat |> SA.x
            , y |> String.fromFloat |> SA.y
            , "./assets/icons/house.png" |> SA.xlinkHref
            , w |> String.fromFloat |> SA.width
            ]
            []
        , Svg.rect
            [ x |> String.fromFloat |> SA.x
            , y |> String.fromFloat |> SA.y
            , w |> String.fromFloat |> SA.width
            , w |> String.fromFloat |> SA.height
            , "transparent" |> SA.fill
            ]
            []
        ]


houseButton_ : Html Msg
houseButton_ =
    houseButton para.houseButtonX para.houseButtonY para.houseButtonW


houseButtonCentral : Html Msg
houseButtonCentral =
    houseButton para.houseButtonCX para.houseButtonCY para.houseButtonCW


doorButton : Msg -> Float -> Float -> Float -> Html Msg
doorButton m x y w =
    svg [ onClick m ]
        [ Svg.image
            [ x |> String.fromFloat |> SA.x
            , y |> String.fromFloat |> SA.y
            , "./assets/icons/open-gate.png" |> SA.xlinkHref
            , w |> String.fromFloat |> SA.width
            ]
            []
        , Svg.rect
            [ x |> String.fromFloat |> SA.x
            , y |> String.fromFloat |> SA.y
            , w |> String.fromFloat |> SA.width
            , w |> String.fromFloat |> SA.height
            , "transparent" |> SA.fill
            ]
            []
        ]


finishGateButton : Msg -> Html Msg
finishGateButton m =
    doorButton m para.fgX para.fgY para.fgW


retryButton : Msg -> Float -> Float -> Float -> Html Msg
retryButton m x y w =
    svg [ onClick m ]
        [ Svg.image
            [ x |> String.fromFloat |> SA.x
            , y |> String.fromFloat |> SA.y
            , "./assets/icons/retry.png" |> SA.xlinkHref
            , w |> String.fromFloat |> SA.width
            ]
            []
        , Svg.rect
            [ x |> String.fromFloat |> SA.x
            , y |> String.fromFloat |> SA.y
            , w |> String.fromFloat |> SA.width
            , w |> String.fromFloat |> SA.height
            , "transparent" |> SA.fill
            ]
            []
        ]


retryButton_ : Msg -> Html Msg
retryButton_ m =
    retryButton m para.fgX para.fgY para.fgW


icGameStart : Model -> Html Msg
icGameStart model =
    let
        t =
            model.theme

        cs =
            colorScheme t
    in
    svg
        [ onClick StartRound1 ]
        [ polyline
            [ polyPoint [ para.icgsx, para.icgsx, para.icgsx + sqrt 3 / 2.0 * para.icgsa, para.icgsx ]
                [ para.icgsy, para.icgsy + para.icgsa, para.icgsy + 0.5 * para.icgsa, para.icgsy ]
                |> SA.points
            , "4" |> SA.rx
            , "white" |> SA.stroke
            , para.icgssw |> String.fromFloat |> SA.strokeWidth
            , "transparent" |> SA.fill
            ]
            []
        ]


virusSkillIcon : String -> Float -> Float -> Float -> Html Msg
virusSkillIcon skill x y w =
    case skill of
        "mutate" ->
            Svg.image
                [ x |> String.fromFloat |> SA.x
                , "./assets/icons/dna1.png" |> SA.xlinkHref
                , y |> String.fromFloat |> SA.y
                , w |> String.fromFloat |> SA.width
                ]
                []

        "revenge" ->
            Svg.image
                [ x |> String.fromFloat |> SA.x
                , "./assets/icons/scythe.png" |> SA.xlinkHref
                , y |> String.fromFloat |> SA.y
                , w |> String.fromFloat |> SA.width
                ]
                []

        "horrify" ->
            Svg.image
                [ x |> String.fromFloat |> SA.x
                , "./assets/icons/terror.png" |> SA.xlinkHref
                , y |> String.fromFloat |> SA.y
                , w |> String.fromFloat |> SA.width
                ]
                []

        "unblockable" ->
            Svg.image
                [ x |> String.fromFloat |> SA.x
                , "./assets/icons/demolish.png" |> SA.xlinkHref
                , y |> String.fromFloat |> SA.y
                , w |> String.fromFloat |> SA.width
                ]
                []

        "takeover" ->
            Svg.image
                [ x |> String.fromFloat |> SA.x
                , "./assets/icons/evil-hand.png" |> SA.xlinkHref
                , y |> String.fromFloat |> SA.y
                , w |> String.fromFloat |> SA.width
                ]
                []

        _ ->
            svg [] []


renderVirusSkills : Model -> Html Msg
renderVirusSkills model =
    let
        y =
            para.houseButtonY - 70.0

        mutate =
            virusSkillIcon "mutate" 870.0 y 50.0

        takeover =
            virusSkillIcon "takeover" 930.0 y 50.0

        str =
            case model.currentLevel of
                3 ->
                    "revenge"

                4 ->
                    "horrify"

                5 ->
                    "unblockable"

                _ ->
                    ""

        special =
            virusSkillIcon str 810.0 y 50.0
    in
    if List.member model.currentLevel [ 3, 4, 5 ] then
        svg [] [ mutate, takeover, special ]

    else
        svg []
            [ mutate
            , takeover
            , virusSkillIcon "unblockable" 810 y 50.0
            , virusSkillIcon "horrify" 750 y 50.0
            ]


virusInfoButton : Float -> Float -> Float -> Html Msg
virusInfoButton x y w =
    svg [ onClick ViewVirusInfo ]
        [ Svg.image
            [ x |> String.fromFloat |> SA.x
            , y |> String.fromFloat |> SA.y
            , "./assets/icons/virus-info.png" |> SA.xlinkHref
            , w |> String.fromFloat |> SA.width
            ]
            []
        , Svg.rect
            [ x |> String.fromFloat |> SA.x
            , y |> String.fromFloat |> SA.y
            , w |> String.fromFloat |> SA.width
            , w |> String.fromFloat |> SA.height
            , "transparent" |> SA.fill
            ]
            []
        ]


virusInfoButton_ =
    virusInfoButton 750 (para.houseButtonY - 70.0) 50.0


virusInfoButtonTutorial =
    virusInfoButton 930 (para.houseButtonY - 70.0) 50.0


virusInfoButtonEndless =
    virusInfoButton 870 para.houseButtonY 50.0


deadHead : Float -> Float -> Float -> Html Msg
deadHead x y w =
    Svg.image
        [ x |> String.fromFloat |> SA.x
        , "./assets/icons/dead-head.png" |> SA.xlinkHref
        , y |> String.fromFloat |> SA.y
        , w |> String.fromFloat |> SA.width
        ]
        []


deadHead_ : Html Msg
deadHead_ =
    deadHead para.dhx para.dhy para.dhw
