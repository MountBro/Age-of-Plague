module GameView exposing (..)

import Action exposing (..)
import ColorScheme exposing (..)
import Debug exposing (log, toString)
import GameViewBasic exposing (..)
import GameViewButtons exposing (..)
import GameViewCards exposing (..)
import GameViewTiles exposing (..)
import Geometry exposing (..)
import Html exposing (..)
import Html.Events as HE exposing (..)
import Message exposing (..)
import Model exposing (..)
import Parameters exposing (..)
import Svg exposing (..)
import Svg.Attributes as SA
import SvgDefs exposing (..)
import SvgSrc exposing (..)
import Tile exposing (..)
import Virus exposing (..)


viewGame : Model -> Html Msg
viewGame model =
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
                        ++ List.foldl (\x -> \y -> x ++ y) [] (List.map (renderTile model) model.city.tilesIndex)
                        ++ renderVirus model model.virus
                        ++ renderantiVirus model model.av
                        ++ (if List.member model.currentLevel [ 3, 4, 5 ] then
                                [ renderLevelProgress model ]

                            else
                                []
                           )
                        --++ renderFlags [ 5, 10, 15 ]
                        ++ [ renderConsole model ]
                        --++ [ renderNextRound ]
                        ++ [ nextButton_ ]
                        ++ [ drawButton_ model ]
                        ++ [ powerInfo model ]
                        ++ [ powerIncInfo model ]
                        ++ [ houseButton_ ]
                        ++ (if model.currentLevel <= 3 then
                                renderGuide model

                            else
                                []
                           )
                        ++ (if model.currentLevel == 6 then
                                [ endlessLevelProgress model ]

                            else
                                []
                           )
                        ++ (if List.member model.currentLevel [ 1, 2 ] then
                                [ virusInfoButtonTutorial ]

                            else if List.member model.currentLevel [ 3, 4, 5 ] then
                                [ renderVirusSkills model, virusInfoButton_ ]

                            else
                                [ renderVirusSkills model, virusInfoButtonEndless ]
                           )
                        ++ renderHands model
                        ++ renderHand model
                        ++ film
                        ++ (if model.virusInfo then
                                [ renderVirusInf model ]

                            else
                                []
                           )
                    )
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
                        ++ [ GameViewBasic.caption
                                20
                                500
                                "white"
                                (if model.replaceChance > 0 then
                                    "Start the level directly or click on card to replace, "
                                        ++ "you still have "
                                        ++ String.fromInt model.replaceChance
                                        ++ " chances."

                                 else
                                    ""
                                )
                                20
                           ]
                        ++ (if model.replaceChance == 0 then
                                [ hand2IcStart ]

                            else
                                []
                           )
                        ++ [ icGameStart model ]
                        ++ [ houseButton_ ]
                    )
                ]

        Finished n ->
            renderFinished n model

        Wasted ->
            renderWasted model

        _ ->
            div [] []


renderFinished : Int -> Model -> Html Msg
renderFinished n model =
    let
        home =
            houseButtonCentral

        next =
            if n < 6 then
                [ finishGateButton (LevelBegin (model.currentLevel + 1)) ]

            else
                []
    in
    div []
        [ svg
            [ SA.viewBox "0 0 1000 600"
            , SA.height "600"
            , SA.width "1000"
            , SA.width (model.screenSize |> Tuple.first |> String.fromFloat)
            , SA.height (model.screenSize |> Tuple.second |> String.fromFloat)
            ]
            ([ home ] ++ next)
        ]


renderWasted : Model -> Html Msg
renderWasted model =
    let
        home =
            houseButtonCentral

        retry =
            retryButton_ (LevelBegin model.currentLevel)
    in
    div []
        [ svg
            [ SA.viewBox "0 0 1000 600"
            , SA.height "600"
            , SA.width "1000"
            , SA.width (model.screenSize |> Tuple.first |> String.fromFloat)
            , SA.height (model.screenSize |> Tuple.second |> String.fromFloat)
            ]
            [ deadHead_, home, retry ]
        ]


background : Theme -> Svg Msg
background t =
    let
        cs =
            colorScheme t
    in
    rect
        [ SA.x "0"
        , SA.y "0"
        , SA.width "1000"
        , SA.height "600"
        , SA.fill cs.bkg
        ]
        []


powerInfo : Model -> Svg Msg
powerInfo model =
    GameViewBasic.caption
        para.pix
        para.piy
        (model.theme
            |> colorScheme
            |> .powerColor
        )
        (String.fromInt model.power)
        para.pifs


powerIncInfo : Model -> Svg Msg
powerIncInfo model =
    GameViewBasic.caption
        (para.pix + 40.0)
        (para.piy + 15.0)
        (model.theme
            |> colorScheme
            |> .powerColor
        )
        "(+2)"
        15


renderFlag : Int -> Html Msg
renderFlag i =
    let
        wg =
            toFloat (min i 20) / 20 * para.wlp

        a =
            para.af
    in
    svg []
        [ line
            [ para.xlp + wg |> String.fromFloat |> SA.x1
            , para.ylp + para.hlp |> String.fromFloat |> SA.y1
            , para.xlp + wg |> String.fromFloat |> SA.x2
            , para.ylp |> String.fromFloat |> SA.y2
            , 1.0 |> String.fromFloat |> SA.strokeWidth
            , "black" |> SA.stroke
            ]
            []
        , polygon
            [ polyPoint [ para.xlp + wg, para.xlp + wg + sqrt 3 / 2 * a, para.xlp + wg ]
                [ para.ylp, para.ylp - a / 2, para.ylp - a ]
                |> SA.points
            , "orange" |> SA.fill
            ]
            []
        ]


renderHand : Model -> List (Html Msg)
renderHand model =
    let
        toCard =
            if (lr model == ( 1, 1 ) || lr model == ( 1, 2 )) && not (List.isEmpty model.hands) then
                [ hand2FirstCard model ]

            else
                []

        toNext =
            if List.member (lr model) [ ( 1, 1 ), ( 1, 2 ), ( 2, 1 ), ( 2, 2 ), ( 2, 3 ), ( 2, 4 ) ] && List.isEmpty model.hands then
                [ hand2NextRound ]

            else
                []

        toDraw =
            if List.member (lr model) [ ( 1, 3 ) ] && List.isEmpty model.hands then
                [ hand2Draw ]

            else
                []
    in
    toCard ++ toNext ++ toDraw


renderFlags : List Int -> List (Html Msg)
renderFlags li =
    List.map renderFlag li


renderLevelProgress : Model -> Html Msg
renderLevelProgress model =
    let
        t =
            model.theme

        cs =
            colorScheme t

        wg =
            toFloat (min model.currentRound 20) / 20.0 * para.wlp
    in
    svg []
        [ rect
            [ para.xlp |> String.fromFloat |> SA.x
            , para.ylp |> String.fromFloat |> SA.y
            , para.wlp |> String.fromFloat |> SA.width
            , para.hlp |> String.fromFloat |> SA.height
            , "1" |> SA.strokeWidth
            , cs.levelProgressStroke |> SA.stroke
            , SA.fill cs.levelProgressBkg
            ]
            []
        , rect
            [ para.xlp |> String.fromFloat |> SA.x
            , para.ylp |> String.fromFloat |> SA.y
            , wg |> String.fromFloat |> SA.width
            , para.hlp |> String.fromFloat |> SA.height
            , SA.fill cs.levelProgressFill
            ]
            []
        ]


renderVirus : Model -> Virus -> List (Html Msg)
renderVirus model v =
    let
        pos =
            v.pos
    in
    List.map (renderHex model "purple" 0.5) pos


renderantiVirus : Model -> AntiVirus -> List (Html Msg)
renderantiVirus model av =
    let
        pos =
            av.pos
    in
    List.map (renderHex model "blue" 0.5) pos



--GameViewBasic.caption x y cstr text fontSize =


ml2s : MyLog -> List String
ml2s m =
    case m of
        Warning str ->
            ("⚠" ++ " " ++ str) |> String.lines |> List.reverse

        CardPlayed c ->
            ("💬" ++ "[" ++ c.name ++ "]: \n" ++ c.describe)
                |> String.lines
                |> List.reverse


consoleText : Model -> List (Html Msg)
consoleText model =
    let
        t =
            model.theme

        cs =
            colorScheme t

        tm =
            para.hctm + 1.6 * para.hcw + 10.0

        lm =
            para.consolelm

        myLog =
            model.actionDescribe

        ( w, a ) =
            List.partition isWarning myLog

        indexed =
            w
                ++ a
                |> List.map ml2s
                |> List.foldl (\x -> \y -> x ++ y) []
                |> List.indexedMap Tuple.pair

        indexedLength =
            List.length indexed

        lt =
            indexed
                |> List.map
                    (\( n, str ) ->
                        ( toFloat (indexedLength - n) * para.consolelp, str )
                    )
                |> List.map
                    (\( y, str ) ->
                        GameViewBasic.caption (lm * 0.3) y cs.consoleText str para.consolefs
                    )
    in
    lt


renderConsole : Model -> Html Msg
renderConsole model =
    let
        t =
            model.theme

        cs =
            colorScheme t

        tm =
            para.hctm + 1.6 * para.hcw + 20.0

        lm =
            para.consolelm

        h =
            para.drawButtonY - 20.0 - tm

        w =
            para.consoleWidth

        vbArg =
            "0 0 " ++ String.fromFloat w ++ " " ++ String.fromFloat h

        consoleBkg =
            rect
                [ w |> String.fromFloat |> SA.width
                , h |> String.fromFloat |> SA.height
                , SA.stroke cs.consoleStroke
                , SA.strokeWidth "4"
                , SA.fill cs.consoleBkg
                , cs.consoleOpacity |> String.fromFloat |> SA.fillOpacity
                ]
                []
    in
    svg
        [ lm |> String.fromFloat |> SA.x
        , tm |> String.fromFloat |> SA.y
        , SA.viewBox vbArg
        , w |> String.fromFloat |> SA.width
        , h |> String.fromFloat |> SA.height
        ]
        ([ consoleBkg ] ++ consoleText model)



-- List.indexedMap Tuple.pair lstr
--   |> List.map (\( n, str ) -> ( para.clp, para.conbot - para.clh * toFloat (l - 1 - n), str ))
-- |> List.map (\( x, y, str ) -> GameViewBasic.caption x y "white" str 15)


renderGuide : Model -> List (Html Msg)
renderGuide model =
    let
        t =
            model.theme

        cs =
            colorScheme t

        lstr =
            createGuide model
                |> List.map String.lines
                |> List.foldl (\x -> \y -> x ++ y) []

        length =
            lstr |> List.length

        height =
            (length * 20)
                |> toFloat
                |> (+) 10.0

        width =
            500.0

        y_ =
            if List.member (lr model) [ ( 1, 1 ), ( 1, 2 ), ( 1, 3 ) ] then
                para.conbot - 40.0

            else
                para.conbot - 40.0

        bkg =
            svg []
                [ Svg.defs []
                    [ sh2 ]
                , rect
                    [ width |> String.fromFloat |> SA.width
                    , height |> String.fromFloat |> SA.height
                    , cs.guideBkg |> SA.fill
                    , para.clp + 230.0 |> String.fromFloat |> SA.x
                    , y_ |> String.fromFloat |> SA.y
                    , "5" |> SA.rx
                    , "2" |> SA.strokeWidth
                    , cs.guideStroke |> SA.stroke
                    , SA.filter "url(#shadow-filter)"
                    ]
                    []
                ]
    in
    if model.currentLevel == 1 || model.currentLevel == 2 then
        bkg
            :: (List.indexedMap Tuple.pair lstr
                    |> List.map (\( n, str ) -> ( para.clp, y_ + para.clh * toFloat n, str ))
                    |> List.map (\( x, y, str ) -> GameViewBasic.caption (x + 250.0) (y + 20.0) cs.guideTextColor str 16)
               )

    else
        []


renderVirusInf : Model -> Html Msg
renderVirusInf model =
    let
        vir =
            model.virus

        rule =
            vir.rules
                |> List.map (\x -> Debug.toString x)
                |> String.join " or "

        infect =
            String.fromInt vir.infect

        unfold =
            "===========================================\nClick ℹ again to fold."

        inf_ =
            if vir.rules /= [] && model.currentLevel /= 6 then
                [ "\u{1FA78} Infect rate:\nEach virus cell would infect "
                    ++ infect
                    ++ " local citizens per turn.\n"
                    ++ "Theoretical death rate: "
                    ++ String.fromInt (round (vir.kill * 100))
                    ++ "%.\n"
                    ++ "\u{1F9EC} Virus spread pattern:\nIf a hex is surrounded by "
                    ++ rule
                    ++ " virus units,\nthe virus would spread to this hex next round."
                ]
                    ++ [ "☣ Mutate: \nActivated at round 10, change the virus spread pattern.\n"
                            ++ "☣ TakeOver: \nActivated at round 16, for tiles where\nlocal dead >= 3 x local healthy population\nvirus would occupy all their hexes.\n"
                       ]

            else if model.currentLevel == 6 then
                [ "\u{1FA78} Infect rate:\nEach virus cell would infect "
                    ++ infect
                    ++ " local citizens per turn.\n"
                    ++ "Theoretical death rate: "
                    ++ String.fromInt (round (vir.kill * 100))
                    ++ "%.\n"
                    ++ "\u{1F9EC} Virus spread pattern:\nIf a hex is surrounded by "
                    ++ rule
                    ++ " virus units,\nthe virus would spread to this hex next round.\n"
                    ++ "☣ Mutate: \nif virus exists and length of\nexisting rules < 4, change the\nvirusspread pattern every 10 turns.\n"
                    ++ "☣ TakeOver: \nif virus exists, every 16 rounds\nvirus would occupy tiles where\nlocal dead >= 3 x local healthy population.\n"
                    ++ "☣ Horrify : \npopulation flow rate x2, if\ntotal dead + total sick > total healthy.\n"
                    ++ "☣ Unblockable: a quarantine would fall if\npatients nearby > 3 x quarantine population."
                ]

            else
                [ "No virus in Tutorial 1." ]

        inf =
            if model.currentLevel == 3 then
                inf_
                    ++ [ "☣ Revenge: \nincrease infect and death rate when size of virus \nkeeps shrinking for 3 rounds." ]
                    ++ [ unfold ]
                    |> List.map String.lines
                    |> List.foldl (\x -> \y -> x ++ y) []

            else if model.currentLevel == 4 then
                inf_
                    ++ [ "☣  Horrify: \npopulation flow rate x2, if\ntotal dead + total sick > total healthy." ]
                    ++ [ unfold ]
                    |> List.map String.lines
                    |> List.foldl (\x -> \y -> x ++ y) []

            else if model.currentLevel == 5 then
                inf_
                    ++ [ "☣ Unblockable: \na quarantine would fall if patients nearby > 3 x quarantine population." ]
                    ++ [ unfold ]
                    |> List.map String.lines
                    |> List.foldl (\x -> \y -> x ++ y) []

            else if model.currentLevel == 6 then
                inf_
                    ++ [ unfold ]
                    |> List.map String.lines
                    |> List.foldl (\x -> \y -> x ++ y) []

            else if model.currentLevel == 2 then
                [ "\u{1FA78} Infect rate:\neach virus cell would infect"
                    ++ infect
                    ++ " local citizens per turn.\n"
                    ++ "Theoretical death rate: "
                    ++ Debug.toString (round (vir.kill * 100))
                    ++ " percent."
                    ++ "\n\u{1F9EC} Virus spread pattern:\nIf a hex is surrounded by "
                    ++ rule
                    ++ " virus units,\nthe virus would spread to this hex next round."
                ]
                    ++ [ unfold ]
                    |> List.map String.lines
                    |> List.foldl (\x -> \y -> x ++ y) []

            else
                inf_
                    ++ [ unfold ]
                    |> List.map String.lines
                    |> List.foldl (\x -> \y -> x ++ y) []

        indexed =
            List.indexedMap Tuple.pair inf

        h =
            if model.currentLevel == 6 then
                para.infh + 80.0

            else
                para.infh

        t =
            model.theme

        cs =
            colorScheme t

        w =
            200.0

        vbArg =
            "0 0 " ++ String.fromFloat para.infw ++ " " ++ String.fromFloat para.infh

        bkg =
            rect
                [ para.infw |> String.fromFloat |> SA.width
                , h |> String.fromFloat |> SA.height
                , SA.stroke cs.infStroke
                , SA.strokeWidth "2"
                , SA.fill cs.infBkg
                , cs.infOpacity |> String.fromFloat |> SA.fillOpacity
                ]
                []

        txt =
            indexed
                |> List.map (\( n, str ) -> ( para.inflm, para.inftm + para.clh * toFloat n, str ))
                |> List.map (\( x, y, str ) -> GameViewBasic.caption x y cs.infText str 12)
    in
    svg
        [ para.infx |> String.fromFloat |> SA.x
        , para.infy |> String.fromFloat |> SA.y
        , SA.viewBox vbArg
        , para.infw |> String.fromFloat |> SA.width
        , h |> String.fromFloat |> SA.height
        ]
        (bkg :: txt)


endlessLevelProgress : Model -> Html Msg
endlessLevelProgress model =
    GameViewBasic.caption 810 (para.houseButtonY + 50.0) "white" (String.fromInt model.currentRound) 60
