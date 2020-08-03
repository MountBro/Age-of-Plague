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
                        ++ renderPopulationGuide model
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
                        ++ (if List.member model.currentLevel [ 3, 4, 5, 6 ] then
                                [ livingPopulationInfo model ]

                            else
                                []
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
                        ++ [ renderCityInfo model ]
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
        (para.pix + 30.0)
        (para.piy + 20.0)
        (model.theme
            |> colorScheme
            |> .powerColor
        )
        ("/"
            ++ String.fromInt model.maxPower
            ++ ", +"
            ++ String.fromInt para.basicPowerInc
            ++ " per round."
        )
        10


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
            ("💬 " ++ "[" ++ c.name ++ "]: \n" ++ c.describe)
                |> String.lines
                |> List.reverse

        Feedback str ->
            ("⨀ " ++ str) |> String.lines |> List.reverse

        CardPlayed_ c str ->
            ("💬 " ++ "[" ++ c.name ++ "]: \n" ++ str)
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
            model.actionDescribe |> List.reverse

        indexed =
            myLog
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


renderPopulationGuide : Model -> List (Html Msg)
renderPopulationGuide model =
    let
        t =
            model.theme

        cs =
            colorScheme t

        bkg_ =
            svg []
                [ Svg.defs []
                    [ sh2 ]
                , rect
                    [ 270 |> String.fromFloat |> SA.width
                    , 95 |> String.fromFloat |> SA.height
                    , cs.guideBkg |> SA.fill
                    , 640 |> String.fromFloat |> SA.x
                    , 300 |> String.fromFloat |> SA.y
                    , "5" |> SA.rx
                    , "2" |> SA.strokeWidth
                    , cs.guideStroke |> SA.stroke
                    , SA.filter "url(#shadow-filter)"
                    ]
                    []
                ]
    in
    if model.currentLevel == 1 && model.currentRound == 2 then
        bkg_
            :: [ GameViewBasic.caption 650.0 320.0 "green" "Green figures: healthy population." 16
               , GameViewBasic.caption 650.0 350.0 "yellow" "Yellow figures: sick population." 16
               , GameViewBasic.caption 650.0 380.0 "red" "Red figures: dead number." 16
               ]

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
                    ++ "☣ Unblockable: \nA quarantine would fall if patients nearby > 3 x quarantine\npopulation."
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
<<<<<<< HEAD
                    ++ [ "☣ Unblockable: \nA quarantine would fall if patients nearby > 3 x quarantine\npopulation." ]
=======
                    ++ [ "☣ Unblockable: \na quarantine would fall if\npatients nearby > 3 x quarantine population." ]
>>>>>>> 7e13fe1aeb5dc6beb557758797c1b9ca09073747
                    ++ [ unfold ]
                    |> List.map String.lines
                    |> List.foldl (\x -> \y -> x ++ y) []

            else if model.currentLevel == 6 then
                inf_
                    ++ [ unfold ]
                    |> List.map String.lines
                    |> List.foldl (\x -> \y -> x ++ y) []

            else if model.currentLevel == 2 then
                [ "\u{1FA78} Infect rate:\neach virus cell would infect "
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
    let
        r =
            model.currentRound

        digitNum =
            if r < 10 then
                1

            else if r < 100 then
                2

            else
                3
    in
    GameViewBasic.caption
        (810 - 30 * (digitNum - 1))
        (para.houseButtonY + 45.0)
        "white"
        (String.fromInt model.currentRound)
        60


cityInfo : Model -> String
cityInfo model =
    case model.currentLevel of
        3 ->
            """Atlanta is a city with plain terrain and a 
temperate climate, making it highly
susceptible to viruses. Fortunately, some
nano-virus technologies were found
from a virus research institute before
the nuclear war. With special programs,
the nano-virus can kill some
microorganisms, including the viruses.

========SPECIAL CARDS==========
🃟 Defensive Line
🃟 Sacrifice 
🃟 Going Viral
🃟 Judgement

========OBJECTIVE==========
No less than 140 surviving population.
"""

        4 ->
            """Before the devastating war, Amber was
a "Tech City" whose citizens were mainly
made up of researchers and scholars.
Fortunately, Amber didn't take much
damage in the war. Therefore, it kept
many cutting-edge technologies and
later became the most populated area
in the world. To make up for the labor
loss, a highly advanced cloning system
was developed.

========SPECIAL CARDS==========
🃟 Mega Clone 
🃟 Organ Clone
🃟 Resurgence
🃟 Purification

========OBJECTIVE==========
No less than 160 surviving population.
"""

        5 ->
            """Welcome to St.Petersburg, the
northernmost city with a population
over 50,000. The climate here is
extremely cold and dry. The resources
harvested from land are very limited.
Therefore, people created a weather
control system to adapt to the
environment.

========SPECIAL CARDS==========
🃟 Blizzard 
🃟 Drought

=========OBJECTIVE==========
No less than 80 surviving population.
"""

        6 ->
            """        Welcome to the endless mode!!!
Unlike the former levels, there will be
endless waves of virus. Between two
waves, there will be a few buffer rounds
and a population bonus. As game goes
on, virus would be stronger and more
deadly. The game will end once the total
population drops below the required
amount.

========SPECIAL CARDS==========
🃟 Mega Clone        🃟 Drought
🃟 Organ Clone      🃟 Defensive Line
🃟 Resurgence        🃟 Sacrifice
🃟 Purification       🃟 Going Viral
🃟 Blizzard               🃟 Judgement

=========OBJECTIVE==========
No less than 50 surviving population.
"""
        _ ->
            ""


cityInfoText : Model -> List (Html Msg)
cityInfoText model =
    let
        t =
            model.theme

        cs =
            colorScheme t

        indexed =
            cityInfo model
                |> String.lines
                |> List.indexedMap Tuple.pair
    in
    indexed
        |> List.map (\( n, str ) -> ( para.inflm, para.inftm + para.clh * toFloat n, str ))
        |> List.map (\( x, y, str ) -> GameViewBasic.caption x y cs.consoleText str 12)


renderCityInfo : Model -> Html Msg
renderCityInfo model =
    let
        t =
            model.theme

        cs =
            colorScheme t

        x =
            para.iclm + 5.0 * (para.icw + para.icg)

        y =
            para.ictm

        w =
            1000.0 - x - para.icg * 0.5

        h =
            2.0 * 1.6 * para.icw + para.icg

        vbArg =
            "0 0 " ++ String.fromFloat w ++ " " ++ String.fromFloat h

        bkg =
            rect
                [ w |> String.fromFloat |> SA.width
                , h |> String.fromFloat |> SA.height
                , SA.stroke cs.consoleStroke
                , SA.strokeWidth "4"
                , SA.fill cs.consoleBkg
                , cs.consoleOpacity |> String.fromFloat |> SA.fillOpacity
                ]
                []

        txt =
            cityInfoText model
    in
    svg
        [ x |> String.fromFloat |> SA.x
        , y |> String.fromFloat |> SA.y
        , SA.viewBox vbArg
        , w |> String.fromFloat |> SA.width
        , h |> String.fromFloat |> SA.height
        ]
        (bkg :: txt)


livingPopulationInfo : Model -> Html Msg
livingPopulationInfo model =
    let
        x =
            if model.currentLevel /= 6 then
                750.0

            else
                780.0

        y =
            if model.currentLevel /= 6 then
                410.0

            else
                418.0

        fs =
            if model.currentLevel /= 6 then
                15

            else
                13

        living =
            sumPopulation model.city

        win =
            case model.currentLevel of
                3 ->
                    140

                4 ->
                    160

                5 ->
                    80

                6 ->
                    50

                _ ->
                    0

        str =
            "Living population/objective: "
                ++ String.fromInt living
                ++ "/"
                ++ String.fromInt win

        color =
            if living < (win |> toFloat |> (*) 1.2 |> floor) then
                "#a90b08"

            else if living < (win |> toFloat |> (*) 1.5 |> floor) then
                "#fd2d29"

            else if living < win * 2 then
                "#fb8d8d"

            else
                "white"
    in
    GameViewBasic.caption x y color str fs
