module ViewHome exposing (..)


import Html as H exposing (..)
import Html.Attributes as HA exposing (..)
import Html.Events as HE exposing (..)
import Message as M exposing (..)


viewHome : List (Html Msg)
viewHome =
    [ H.p [ id "t1" ]
        [ H.text "Age of Plague"
        , br [] []
        ]
    , H.p [ id "t2" ] [ H.text "After the Apocalypse" ]
    , div [ HA.id "ctnr" ]
        [ H.a [ HE.onClick (M.Click "startGame") ] [ H.text "Start the Game" ]
        , H.a [ HE.onClick (M.Click "card") ] [ H.text "Card Gallery" ]
        , H.a [ HE.onClick (M.Click "about") ] [ H.text "About Us" ]
        ]
    ]
