module GameViewCards exposing (..)

import Card exposing (..)
import ColorScheme exposing (..)
import GameViewBasic exposing (..)
import Html exposing (..)
import Message exposing (..)
import Model exposing (..)
import Parameters exposing (..)
import Svg exposing (..)
import Svg.Attributes as SA


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

        --, GameViewBasic.caption (x + 10.0) (y + 10.0) "white" c.name 10
        ]


renderCardPng : Float -> Float -> Float -> Card -> Html Msg
renderCardPng width x y c =
    svg []
        [ Svg.image
            [ x |> String.fromFloat |> SA.x
            , c |> toPngUrl |> SA.xlinkHref
            , y |> String.fromFloat |> SA.y
            , width |> String.fromFloat |> SA.width
            , 1.6 * width |> String.fromFloat |> SA.height
            ]
            []
        ]


renderInitCardFilm : Float -> Int -> Float -> Float -> Card -> Model -> Html Msg
renderInitCardFilm width n x y c model =
    let
        t =
            model.theme

        cs =
            colorScheme t

        indexed =
            c.fd |> String.lines |> List.indexedMap Tuple.pair

        indexedLength =
            List.length indexed

        h =
            toFloat indexedLength * para.cdlp + para.cdm

        w =
            para.cdw

        cdy =
            y + 1.6 * para.icw

        cdx =
            x + 0.55 * para.icw

        vbArg =
            "0 0 " ++ String.fromFloat w ++ " " ++ String.fromFloat h

        lt =
            indexed
                |> List.map
                    (\( n_, str ) ->
                        ( para.cdm + toFloat n_ * para.cdlp, str )
                    )
                |> List.map
                    (\( y_, str ) ->
                        GameViewBasic.caption para.cdm (y_ + 0.5 * para.cdm) cs.cdText str para.cdfs
                    )

        cardDescription =
            svg
                [ cdx |> String.fromFloat |> SA.x
                , cdy |> String.fromFloat |> SA.y
                , SA.viewBox vbArg
                , w |> String.fromFloat |> SA.width
                , h |> String.fromFloat |> SA.height
                ]
                ([ rect
                    [ w |> String.fromFloat |> SA.width
                    , h |> String.fromFloat |> SA.height
                    , "0" |> SA.x
                    , "0" |> SA.y
                    , cs.cdBkg |> SA.fill
                    , "0.5" |> SA.fillOpacity
                    ]
                    []
                 ]
                    ++ lt
                )

        tint =
            if n == model.mouseOverCardToReplace && model.replaceChance > 0 then
                svg []
                    [ rect
                        [ x |> String.fromFloat |> SA.x
                        , y |> String.fromFloat |> SA.y
                        , "yellow" |> SA.fill
                        , SA.fillOpacity "0.3"
                        , width |> String.fromFloat |> SA.width
                        , 1.6 * width |> String.fromFloat |> SA.height
                        ]
                        []
                    , cardDescription
                    ]

            else
                rect [] []
    in
    svg [ GameViewBasic.onClick (SelectCardToReplace c), onOver (MouseOverCardToReplace n) ]
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
        t =
            model.theme

        cs =
            colorScheme t

        indexed =
            c.fd |> String.lines |> List.indexedMap Tuple.pair

        indexedLength =
            List.length indexed

        h =
            toFloat indexedLength * para.cdlp + para.cdm

        w =
            para.cdw

        cdy =
            y + 1.6 * para.hcw

        cdx =
            x + 0.25 * para.hcw

        vbArg =
            "0 0 " ++ String.fromFloat w ++ " " ++ String.fromFloat h

        lt =
            indexed
                |> List.map
                    (\( n_, str ) ->
                        ( para.cdm + toFloat n_ * para.cdlp, str )
                    )
                |> List.map
                    (\( y_, str ) ->
                        GameViewBasic.caption para.cdm (y_ + 0.55 * para.cdm) cs.cdText str para.cdfs
                    )

        cardDescription =
            svg
                [ cdx |> String.fromFloat |> SA.x
                , cdy |> String.fromFloat |> SA.y
                , SA.viewBox vbArg
                , w |> String.fromFloat |> SA.width
                , h |> String.fromFloat |> SA.height
                ]
                ([ rect
                    [ w |> String.fromFloat |> SA.width
                    , h |> String.fromFloat |> SA.height
                    , "0" |> SA.x
                    , "0" |> SA.y
                    , cs.cdBkg |> SA.fill
                    , "0.5" |> SA.fillOpacity
                    ]
                    []
                 ]
                    ++ lt
                )

        tint =
            if n == model.mouseOverCard then
                svg []
                    [ rect
                        [ x |> String.fromFloat |> SA.x
                        , y |> String.fromFloat |> SA.y
                        , "yellow" |> SA.fill
                        , SA.fillOpacity "0.3"
                        , width |> String.fromFloat |> SA.width
                        , 1.6 * width |> String.fromFloat |> SA.height
                        ]
                        []
                    , cardDescription
                    ]

            else
                rect [] []
    in
    svg [ GameViewBasic.onClick (PlayCard c), onOver (MouseOverCard n) ]
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
        digitNum =
            if model.economy < 10 then
                1.0

            else if model.economy < 100 then
                2.0

            else
                3.0

        hands =
            model.hands |> List.sortWith cardComparison

        indexed =
            List.indexedMap Tuple.pair hands
                |> List.map
                    (\( n, c ) ->
                        ( n, ( para.hclm + para.hcdi + (para.hcw + para.hcg) * toFloat n, para.hctm ), c )
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
