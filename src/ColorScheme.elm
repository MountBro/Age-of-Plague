module ColorScheme exposing (..)


type Theme
    = Polar
    | Urban
    | Minimum
    | Plain


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
    , consoleOpacity : Float
    , cdBkg : String
    , cdStroke : String
    , cdText : String
    , infBkg : String
    , infStroke : String
    , infText : String
    , infOpacity : Float
    , constructionCaption : String
    }


colorScheme : Theme -> ColorScheme
colorScheme t =
    case t of
        Minimum ->
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
            , consoleOpacity = 1.0
            , cdBkg = "#f2f2f0"
            , cdStroke = ""
            , cdText = "black"
            , infBkg = "purple"
            , infStroke = "#2e3f48"
            , infText = "white"
            , infOpacity = 0.8
            , constructionCaption = "white"
            }

        Plain ->
            { bkg = "#435749"
            , guideBkg = "#a5bcc0"
            , guideStroke = "#6f787e"
            , guideTextColor = "black"
            , tile = "#627c12"
            , tileStroke = "white"
            , drawBkg = "#535455"
            , drawStroke = "white"
            , nextRoundBkg = "#6a8ee2"
            , levelProgressBkg = "#2c364b"
            , levelProgressStroke = "#f6f6f6"
            , levelProgressFill = "#e4fad2"
            , powerColor = "#e4fad2"
            , consoleBkg = "#2a3645"
            , consoleText = "#86868d"
            , consoleStroke = "#4d454a"
            , consoleOpacity = 1.0
            , cdBkg = "#f2f2f0"
            , cdStroke = ""
            , cdText = "black"
            , infBkg = "purple"
            , infStroke = "#2e3f48"
            , infText = "white"
            , infOpacity = 0.8
            , constructionCaption = "white"
            }

        Urban ->
            { bkg = "#071e26"
            , guideBkg = "#a5bcc0"
            , guideStroke = "#6f787e"
            , guideTextColor = "black"
            , tile = "#02c5ce"
            , tileStroke = "#b957ce"
            , drawBkg = "#535455"
            , drawStroke = "white"
            , nextRoundBkg = "#6a8ee2"
            , levelProgressBkg = "#131231"
            , levelProgressStroke = "#f6f6f6"
            , levelProgressFill = "#71c1d8"
            , powerColor = "#e4fad2"
            , consoleBkg = "black"
            , consoleText = "#23ff12"
            , consoleStroke = "#4d454a"
            , consoleOpacity = 0.7
            , cdBkg = "#f2f2f0"
            , cdStroke = ""
            , cdText = "black"
            , infBkg = "purple"
            , infStroke = "#2e3f48"
            , infText = "white"
            , infOpacity = 0.8
            , constructionCaption = "white"
            }

        Polar ->
            { bkg = "#8698af"
            , guideBkg = "#a5bcc0"
            , guideStroke = "#6f787e"
            , guideTextColor = "black"
            , tile = "#547286"
            , tileStroke = "white"
            , drawBkg = "#535455"
            , drawStroke = "white"
            , nextRoundBkg = "#6a8ee2"
            , levelProgressBkg = "#1e1e1f"
            , levelProgressStroke = "#f6f6f6"
            , levelProgressFill = "#e4fad2"
            , powerColor = "#e4fad2"
            , consoleBkg = "#f8f8f8"
            , consoleText = "#1c3981"
            , consoleStroke = "#97b2dc"
            , consoleOpacity = 0.7
            , cdBkg = "#f2f2f0"
            , cdStroke = ""
            , cdText = "black"
            , infBkg = "purple"
            , infStroke = "#2e3f48"
            , infText = "white"
            , infOpacity = 0.8
            , constructionCaption = "#3276c2"
            }
