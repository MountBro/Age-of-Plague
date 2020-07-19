module GameView exposing (..)

import Card exposing (..)
import Debug exposing (log, toString)
import Geometry exposing (..)
import Html exposing (..)
import Html.Events exposing (..)
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


caption : Float -> Float -> String -> String -> Int -> Svg Msg
caption x y cstr text fontSize =
    text_
        [ fontSize |> String.fromInt |> SA.fontSize
        , SA.fontFamily "sans-serif"
        , x |> String.fromFloat |> SA.x
        , y |> String.fromFloat |> SA.y
        , cstr |> SA.fill
        ]
        [ text |> Svg.text
        ]


onClick : msg -> Svg.Attribute msg
onClick message =
    on "click" (D.succeed message)


onOver : msg -> Svg.Attribute msg
onOver message =
    on "mouseover" (D.succeed message)


cardButton : Card -> Html Msg
cardButton card =
    Html.button [ onClick (PlayCard card) ] [ Html.text card.name ]


powerEcoInfo : Model -> Html Msg
powerEcoInfo model =
    let
        p =
            String.fromInt model.power

        ec =
            String.fromInt model.economy
    in
    Html.text ("power: " ++ p ++ ". " ++ "economy: " ++ ec ++ ". ")


evolveButton : Html Msg
evolveButton =
    Html.button [ onClick VirusEvolve ] [ Html.text "EVOLVE" ]


nextRoundButton : Html Msg
nextRoundButton =
    Html.button [ onClick NextRound ] [ Html.text "next round" ]


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


renderFlags : List Int -> List (Html Msg)
renderFlags li =
    List.map renderFlag li


renderLevelProgress : Model -> Html Msg
renderLevelProgress model =
    let
        wg =
            toFloat (min model.currentRound 20) / 20.0 * para.wlp
    in
    svg []
        [ rect
            [ para.xlp |> String.fromFloat |> SA.x
            , para.ylp |> String.fromFloat |> SA.y
            , para.wlp |> String.fromFloat |> SA.width
            , para.hlp |> String.fromFloat |> SA.height
            , SA.fill "#666666"
            ]
            []
        , rect
            [ para.xlp |> String.fromFloat |> SA.x
            , para.ylp |> String.fromFloat |> SA.y
            , wg |> String.fromFloat |> SA.width
            , para.hlp |> String.fromFloat |> SA.height
            , SA.fill "green"
            ]
            []
        ]


renderHex : String -> Float -> ( Int, Int ) -> Html Msg
renderHex cstr opa ( i, j ) =
    let
        ( x0, y0 ) =
            para.tileOrigin

        a =
            para.a

        h =
            a / sqrt 3

        ( x, y ) =
            posAdd (rc ( i, j )) ( x0, y0 )
    in
    svg []
        [ polygon
            [ polyPoint [ x + a, x, x - a, x - a, x, x + a ]
                [ y + h, y + 2 * h, y + h, y - h, y - 2 * h, y - h ]
                |> SA.points
            , cstr |> SA.fill
            , opa |> String.fromFloat |> SA.fillOpacity
            ]
            []
        ]


renderFilm : Model -> ( Int, Int ) -> Html Msg
renderFilm model ( i, j ) =
    let
        ( x0, y0 ) =
            para.tileOrigin

        a =
            para.a

        h =
            a / sqrt 3

        ( x, y ) =
            posAdd (rc ( i, j )) ( x0, y0 )

        tint =
            if ( i, j ) == model.mouseOver then
                polygon
                    [ polyPoint [ x + a, x, x - a, x - a, x, x + a ]
                        [ y + h, y + 2 * h, y + h, y - h, y - 2 * h, y - h ]
                        |> SA.points
                    , 0.3 |> String.fromFloat |> SA.fillOpacity
                    , SA.fill "yellow"
                    ]
                    []

            else
                polygon [] []
    in
    svg
        ([ onOver (MouseOver i j) ]
            ++ (if judgeBuild model ( i, j ) then
                    []

                else
                    [ onClick (SelectHex i j) ]
               )
        )
        (if judgeBuild model ( i, j ) then
            []

         else
            [ tint ]
                ++ [ polygon
                        [ polyPoint [ x + a, x, x - a, x - a, x, x + a ]
                            [ y + h, y + 2 * h, y + h, y - h, y - 2 * h, y - h ]
                            |> SA.points
                        , 0.0 |> String.fromFloat |> SA.fillOpacity
                        , SA.fill "white"
                        ]
                        []
                   ]
        )



-- k1, k2, K1, K2
-- K1 = k2 + 2k1; K2 = 3k2 - k1
-- aK1 + bK2 = (2a -b) k1 + (a + 3b) k2


renderTile : Tile -> List (Html Msg)
renderTile t =
    let
        a =
            para.a

        h =
            a / sqrt 3

        ind =
            t.indice

        t1 =
            Tuple.first ind

        t2 =
            Tuple.second ind

        i =
            2 * t1 - t2

        j =
            t1 + 3 * t2

        lst =
            [ ( i, j )
            , ( i, j - 1 )
            , ( i, j + 1 )
            , ( i + 1, j )
            , ( i + 1, j - 1 )
            , ( i - 1, j )
            , ( i - 1, j + 1 )
            ]

        ( x0, y0 ) =
            para.tileOrigin

        ( x, y ) =
            posAdd (rc ( i, j )) ( x0, y0 )

        ( x1, y1 ) =
            posAdd (rc ( i, j + 1 )) ( x0, y0 )

        ( x2, y2 ) =
            posAdd (rc ( i - 1, j + 1 )) ( x0, y0 )

        ( x3, y3 ) =
            posAdd (rc ( i - 1, j )) ( x0, y0 )

        ( x4, y4 ) =
            posAdd (rc ( i, j - 1 )) ( x0, y0 )

        ( x5, y5 ) =
            posAdd (rc ( i + 1, j - 1 )) ( x0, y0 )

        ( x6, y6 ) =
            posAdd (rc ( i + 1, j )) ( x0, y0 )

        borderX =
            [ x1, x1 + a, x1 + a ]
                ++ [ x2 + a, x2 + a, x2 ]
                ++ [ x3 + a, x3, x3 - a ]
                ++ [ x4, x4 - a, x4 - a ]
                ++ [ x5 - a, x5 - a, x5 ]
                ++ [ x6 - a, x6, x6 + a ]
                ++ [ x1, x1 + a, x1 + a ]

        borderY =
            [ y1 - 2 * h, y1 - h, y1 + h ]
                ++ [ y2 - h, y2 + h, y2 + 2 * h ]
                ++ [ y3 + h, y3 + 2 * h, y3 + h ]
                ++ [ y4 + 2 * h, y4 + h, y4 - h ]
                ++ [ y5 + h, y5 - h, y5 - 2 * h ]
                ++ [ y6 - h, y6 - 2 * h, y6 - h ]
                ++ [ y1 - 2 * h, y1 - h, y1 + h ]

        border =
            svg []
                [ polyline
                    [ polyPoint borderX borderY |> SA.points
                    , SA.strokeWidth "2"
                    , SA.stroke "orange"
                    , SA.fill "#99b898"
                    , SA.fillOpacity "0"
                    ]
                    []
                ]

        constructionCaption =
            if t.hos && t.qua && t.wareHouse then
                "H&Q&W"

            else if t.qua && t.wareHouse then
                "Q&W"

            else if t.hos && t.wareHouse then
                "H&W"

            else if t.hos && t.qua then
                "H&Q"

            else if t.hos then
                "H"

            else if t.wareHouse then
                "W"

            else if t.qua then
                "Q"

            else
                "N"

        cons =
            svg []
                [ text_
                    [ SA.fontSize "10"
                    , SA.fontFamily "sans-serif"
                    , x - 5.0 |> String.fromFloat |> SA.x
                    , y + 5.0 |> String.fromFloat |> SA.y
                    , SA.fill "white"
                    ]
                    [ constructionCaption |> Svg.text ]
                ]

        populationInfo =
            svg []
                [ text_
                    [ SA.fontSize "15"
                    , SA.fontFamily "sans-serif"
                    , x - 15.0 |> String.fromFloat |> SA.x
                    , y - 10.0 |> String.fromFloat |> SA.y
                    , SA.fill "green"
                    ]
                    [ t.population - t.sick |> String.fromInt |> Svg.text ]
                , text_
                    [ SA.fontSize "15"
                    , SA.fontFamily "sans-serif"
                    , x + 3.0 |> String.fromFloat |> SA.x
                    , y - 10.0 |> String.fromFloat |> SA.y
                    , SA.fill "orange"
                    ]
                    [ t.sick |> String.fromInt |> Svg.text ]
                , text_
                    [ SA.fontSize "15"
                    , SA.fontFamily "sans-serif"
                    , x - 5.0 |> String.fromFloat |> SA.x
                    , y + 23.0 |> String.fromFloat |> SA.y
                    , SA.fill "red"
                    ]
                    [ t.dead |> String.fromInt |> Svg.text ]
                ]

        tiles =
            List.map (\( u, v ) -> myTile u v) [ ( x, y ), ( x1, y1 ), ( x2, y2 ), ( x3, y3 ), ( x4, y4 ), ( x5, y5 ), ( x6, y6 ) ]

        -- list of positions of the seven hexs in a tile.
    in
    tiles ++ [ border ] ++ [ cons ] ++ [ populationInfo ]


renderTileFilm : Model -> Tile -> List (Html Msg)
renderTileFilm model t =
    let
        a =
            para.a

        h =
            a / sqrt 3

        ind =
            t.indice

        t1 =
            Tuple.first ind

        t2 =
            Tuple.second ind

        i =
            2 * t1 - t2

        j =
            t1 + 3 * t2

        lst =
            [ ( i, j )
            , ( i, j - 1 )
            , ( i, j + 1 )
            , ( i + 1, j )
            , ( i + 1, j - 1 )
            , ( i - 1, j )
            , ( i - 1, j + 1 )
            ]

        -- list of positions of the seven hexs in a tile.
    in
    List.map (renderFilm model) lst


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


renderCard : Float -> Int -> Float -> Float -> Card -> Html Msg
renderCard width n x y c =
    svg []
        [ rect
            [ x |> String.fromFloat |> SA.x
            , y |> String.fromFloat |> SA.y
            , "black" |> SA.fill
            , width |> String.fromFloat |> SA.width
            , 1.6 * width |> String.fromFloat |> SA.height
            ]
            []
        , caption (x + 10.0) (y + 10.0) "white" c.name 10
        ]


renderCardPng : Float -> Float -> Float -> Card -> Html Msg
renderCardPng width x y c =
    let
        l =
            String.length c.url
    in
    if l == 0 then
        div [] []

    else
        svg []
            [ Svg.image
                [ c.url |> SA.xlinkHref
                , x |> String.fromFloat |> SA.x
                , y |> String.fromFloat |> SA.y
                , width |> String.fromFloat |> SA.width
                , 1.6 * width |> String.fromFloat |> SA.height
                ]
                []
            ]


renderInitCardFilm : Float -> Int -> Float -> Float -> Card -> Model -> Html Msg
renderInitCardFilm width n x y c model =
    let
        tint =
            if n == model.mouseOverCardToReplace && model.replaceChance > 0 then
                rect
                    [ x |> String.fromFloat |> SA.x
                    , y |> String.fromFloat |> SA.y
                    , "yellow" |> SA.fill
                    , SA.fillOpacity "0.3"
                    , width |> String.fromFloat |> SA.width
                    , 1.6 * width |> String.fromFloat |> SA.height
                    ]
                    []

            else
                rect [] []
    in
    svg [ onClick (SelectCardToReplace c), onOver (MouseOverCardToReplace n) ]
        [ tint
        , rect
            [ x |> String.fromFloat |> SA.x
            , y |> String.fromFloat |> SA.y
            , "white" |> SA.fill
            , SA.fillOpacity "0.0"
            , width |> String.fromFloat |> SA.width
            , 1.6 * width |> String.fromFloat |> SA.height
            ]
            []
        ]


renderCardFilm : Float -> Int -> Float -> Float -> Card -> Model -> Html Msg
renderCardFilm width n x y c model =
    let
        tint =
            if n == model.mouseOverCard then
                rect
                    [ x |> String.fromFloat |> SA.x
                    , y |> String.fromFloat |> SA.y
                    , "yellow" |> SA.fill
                    , SA.fillOpacity "0.3"
                    , width |> String.fromFloat |> SA.width
                    , 1.6 * width |> String.fromFloat |> SA.height
                    ]
                    []

            else
                rect [] []
    in
    svg [ onClick (PlayCard c), onOver (MouseOverCard n) ]
        [ tint
        , rect
            [ x |> String.fromFloat |> SA.x
            , y |> String.fromFloat |> SA.y
            , "white" |> SA.fill
            , SA.fillOpacity "0.0"
            , width |> String.fromFloat |> SA.width
            , 1.6 * width |> String.fromFloat |> SA.height
            ]
            []
        ]


renderInitCards : Model -> List (Html Msg)
renderInitCards model =
    let
        hands =
            model.hands |> List.sortWith cardComparison

        indexed =
            List.indexedMap Tuple.pair hands
                |> List.map
                    (\( n, c ) ->
                        ( n, ( para.iclm + (para.icw + para.icg) * toFloat (modBy 5 n), para.ictm + toFloat (n // 5) * (1.6 * para.icw + para.icg) ), c )
                    )
    in
    List.map
        (\( n, ( x, y ), c ) -> renderCard para.icw n x y c)
        indexed
        ++ List.map
            (\( n, ( x, y ), c ) -> renderCardPng para.icw x y c)
            indexed
        ++ List.map
            (\( n, ( x, y ), c ) -> renderInitCardFilm para.icw n x y c model)
            indexed


renderHands : Model -> List (Html Msg)
renderHands model =
    let
        hands =
            model.hands |> List.sortWith cardComparison

        indexed =
            List.indexedMap Tuple.pair hands
                |> List.map
                    (\( n, c ) ->
                        ( n, ( para.xlp + para.wlp + 50.0 + (para.hcw + para.hcg) * toFloat n, para.hctm ), c )
                    )
    in
    List.map
        (\( n, ( x, y ), c ) -> renderCard para.hcw n x y c)
        indexed
        ++ List.map
            (\( n, ( x, y ), c ) -> renderCardPng para.hcw x y c)
            indexed
        ++ List.map
            (\( n, ( x, y ), c ) -> renderCardFilm para.hcw n x y c model)
            indexed
