module ColorScheme exposing (..)


type Theme
    = Polar
    | Urban
    | Minimum
    | Plane


type alias ColorScheme =
    { bkg : String
    , guideBkg : String
    , guideStroke : String
    , guideTextColor : String
    , tile : String
    , tileStroke : String
    , drawBkg : String
    , drawStroke : String
    , nextRoundBkg : String
    , levelProgressBkg : String
    , levelProgressStroke : String
    , levelProgressFill : String
    , powerColor : String
    , consoleBkg : String
    , consoleText : String
    , consoleStroke : String
    }


colorScheme : Theme -> ColorScheme
colorScheme t =
    case t of
        _ ->
            { bkg = "#191620"
            , guideBkg = "#a5bcc0"
            , guideStroke = "#6f787e"
            , guideTextColor = "black"
            , tile = "#acb0b1"
            , tileStroke = "white"
            , drawBkg = "#535455"
            , drawStroke = "white"
            , nextRoundBkg = "#6a8ee2"
            , levelProgressBkg = "#1e1e1f"
            , levelProgressStroke = "#f6f6f6"
            , levelProgressFill = "#e4fad2"
            , powerColor = "#e4fad2"
            , consoleBkg = "#191620"
            , consoleText = "#86868d"
            , consoleStroke = "#4d454a"
            }
