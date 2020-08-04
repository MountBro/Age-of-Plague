module View exposing (..)


import GameView exposing (..)
import Html exposing (..)
import Message exposing (..)
import Model exposing (..)
import ViewCards as VC exposing (..)
import ViewMP as MP exposing (..)


type alias Document msg =
    { title : String
    , body : List (Html msg)
    }


viewAll : Model -> Document Msg
viewAll model =
    case model.state of
        Model.Playing ->
            Document "Game" [ viewGame model ]

        Model.HomePage ->
            Document "Age of Plague" MP.viewAll

        Model.CardPage ->
            Document "Card Gallery" VC.viewCard

        _ ->
            Document "Game" [ viewGame model ]
