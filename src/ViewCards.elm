module ViewCards exposing (..)

import Browser exposing (..)
import Browser.Events exposing (..)
import Card exposing (..)
import Html as H exposing (..)
import Html.Attributes as HA exposing (..)
import Html.Events as HE exposing (..)
import List.Extra as LE exposing (..)
import Message exposing (..)


viewSingleCard : Int -> Card -> Html Msg
viewSingleCard n card =
    div
        [ class "ctnr"
        , id ("c" ++ String.fromInt (n + 1))
        , attribute "data-info" card.fd
        , HA.style "background-image" ("url(./assets/cardPNG/" ++ card.name ++ ".png)")
        ]
        [ div [ class "story" ]
            [ div [ class "info" ]
                [ h3 [] []
                ]
            ]
        ]


filteredCards =
    [ powerOverload
    , onStandby
    , coldWave
    , blizzard
    , rain
    , cut
    , megaCut
    , fubao
    , organClone
    , humanClone
    , megaClone
    , purification
    , sacrifice
    , resurgence
    , defenseline
    , hospital
    , quarantine
    , enhancedHealing
    , cellBroadcast
    , drought
    , warehouse
    , warmwave
    , goingViral
    , judgement
    , lowSoundWave
    , compulsoryMR
    , firstAid
    , medMob
    ]


cardsArray : List (Html Msg)
cardsArray =
    filteredCards
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
