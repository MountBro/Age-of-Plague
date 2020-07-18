module ViewHome exposing (..)

import Browser exposing (..)
import Browser.Events exposing (..)
import Html as H exposing (..)
import Html.Attributes as HA exposing (..)
import Html.Events as HE exposing (..)
import Message as M exposing (..)


viewHome : List (Html Msg)
viewHome =
    [ H.p []
        [ H.text "Age of Plague:"
        , br [] []
        , H.text "After the Apocalypse"
        ]
    , div [ HA.id "ctnr" ]
        [ H.a [ HE.onClick (M.Click "startGame") ]
            [ H.span [] []
            , H.span [] []
            , H.span [] []
            , H.span [] []
            , H.text "Start the Game"
            ]
        , H.a [ HE.onClick (M.Click "card") ]
            [ H.span [] []
            , H.span [] []
            , H.span [] []
            , H.span [] []
            , H.text "Card Gallery"
            ]
        , H.a [ HE.onClick (M.Click "about") ]
            [ H.span [] []
            , H.span [] []
            , H.span [] []
            , H.span [] []
            , H.text "About Us"
            ]
        ]
    ]
