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
    , H.a []
        [ H.span [] []
        , H.span [] []
        , H.span [] []
        , H.span [] []
        , H.button [ HE.onClick (M.Click "startGame") ] [ H.text "Game" ]
        ]
    ]
