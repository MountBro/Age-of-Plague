module ViewCards exposing (..)

import Browser exposing (..)
import Browser.Events exposing (..)
import Card exposing (..)
import Html as H exposing (..)
import Html.Attributes as HA exposing (..)
import Html.Events as HE exposing (..)
import Message exposing (..)


viewSingleCard : Int -> Card -> Html Msg
viewSingleCard n card =
    div
        [ class "ctnr"
        , id ("c" ++ String.fromInt (n + 1))
        , attribute "data-info" card.describe
        ]
        [ div [ class "story" ]
            [ div [ class "info" ]
                [ h3 []
                    [ text card.name ]
                ]
            ]
        ]


cardsArray : List (Html Msg)
cardsArray =
    allCards
        |> List.indexedMap Tuple.pair
        |> List.map (\( n, c ) -> viewSingleCard n c)


backToHome : Html Msg
backToHome =
    H.a
        [ HE.onClick (Message.Click "home")
        , HA.id "cardsBack"
        ]
        [ H.text "Back" ]


viewCard : List (Html Msg)
viewCard =
    [ p [ id "cardsTitle" ] [ text "Cards Gallery" ]
    , div [ class "wrpr" ]
        (cardsArray
            ++ [ backToHome ]
        )
    ]
