module View exposing (..)

import Debug exposing (log, toString)
import GameView exposing (..)
import GameViewBasic exposing (..)
import GameViewButtons exposing (..)
import GameViewCards exposing (..)
import GameViewTiles exposing (..)
import Html exposing (..)
import Html.Attributes as HA
import Html.Events as HE
import Message exposing (..)
import Model exposing (..)
import Svg exposing (..)
import Svg.Attributes as SA
import SvgSrc exposing (..)
import Tile exposing (..)
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
            Document "game" [ viewGame model ]

        Model.HomePage ->
            Document "main" [ MP.viewAll ]

        Model.CardPage ->
            Document "card" VC.viewCard

        _ ->
            Document "game" [ viewGame model ]
