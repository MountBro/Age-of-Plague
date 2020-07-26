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
                        ++ List.foldl (\x -> \y -> x ++ y) [] (List.map (renderTile model.theme) model.city.tilesIndex)
                        ++ renderVirus model.virus
                        ++ renderantiVirus model.av
                        ++ [ renderLevelProgress model ]
                        --++ renderFlags [ 5, 10, 15 ]
                        ++ renderHands model
                        ++ [ renderConsole model ]
                        ++ renderVirusInf model.virus
                        --++ [ renderNextRound ]
                        ++ [ nextButton_ ]
                        ++ [ drawButton_ model ]
                        ++ [ powerInfo model ]
                        ++ [ houseButton_ ]
                        ++ renderHand model
                        ++ (if model.currentLevel <= 3 then
                                renderGuide model

                            else
                                []
                           )
                        ++ film
                    )
                , Html.text ("round " ++ String.fromInt model.currentRound ++ ". ")
                , Html.text ("sumPopulation: " ++ Debug.toString (sumPopulation model.city) ++ ". " ++ "sumDead: " ++ Debug.toString (sumDead model.city) ++ ". " ++ "sumSick: " ++ Debug.toString (sumSick model.city) ++ ". " ++ Debug.toString (model.currentLevel))

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

        Finished n ->
            renderFinished n model

        Wasted ->
            div [] [ Html.text "wasted" ]

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


renderVirus : Virus -> List (Html Msg)
renderVirus v =
    let
        pos =
            v.pos
    in
    List.map (renderHex "purple" 0.5) pos


renderantiVirus : AntiVirus -> List (Html Msg)
renderantiVirus av =
    let
        pos =
            av.pos
    in
    List.map (renderHex "blue" 0.5) pos



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

        bkg =
            svg []
                [ Svg.defs []
                    [ sh2 ]
                , rect
                    [ width |> String.fromFloat |> SA.width
                    , height |> String.fromFloat |> SA.height
                    , cs.guideBkg |> SA.fill
                    , para.clp + 230.0 |> String.fromFloat |> SA.x
                    , para.conbot - 70.0 |> String.fromFloat |> SA.y
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
                    |> List.map (\( n, str ) -> ( para.clp, para.conbot + para.clh * toFloat n, str ))
                    |> List.map (\( x, y, str ) -> GameViewBasic.caption (x + 250.0) (y - 50.0) cs.guideTextColor str 16)
               )

    else
        []


renderVirusInf : Virus -> List (Html Msg)
renderVirusInf vir =
    let
        rule =
            vir.rules
                |> List.map (\x -> Debug.toString x)
                |> String.join " or "

        infect =
            Debug.toString vir.infect

        inf =
            if vir.rules /= [] then
                [ "Infect: +" ++ infect ++ " per virus unit\n" ++ "Death rate: " ++ Debug.toString vir.kill ++ "\nSpread pattern:\nIf a hex is surrounded\nby " ++ rule ++ " virus units,\nthe virus would spread to\nthis hex next round." ]
                    |> List.map String.lines
                    |> List.foldl (\x -> \y -> x ++ y) []

            else
                [ "Spread rules:\nNo virus in Tutorial 1." ]
                    |> List.map String.lines
                    |> List.foldl (\x -> \y -> x ++ y) []
    in
    List.indexedMap Tuple.pair inf
        |> List.map (\( n, str ) -> ( para.clp, para.conbot + para.clh * toFloat n, str ))
        |> List.map (\( x, y, str ) -> GameViewBasic.caption (x + 820.0) y "red" str 12)
