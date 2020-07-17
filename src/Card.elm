module Card exposing (..)


type alias Card =
    { selMode : Selection
    , cost : Int
    , action : List Action
    , name : String
    , describe : String
    }


type Selection
    = HexSel
    | TileSel
    | NoSel


type Action
    = IncPowerI Int
    | FreezeI
    | Freeze Float
    | EcoDoubleI
    | EcoDoubleI_Freeze Float
    | DisableEvolveI
    | DisableEvolve Float
    | NoAction
    | CutHexI ( Int, Int )
    | CutTileI ( Int, Int )
    | Summon (List Card)
    | Activate996I
    | OrganCloneI ( Int, Int )
    | HumanCloneI ( Int, Int )
    | MegaCloneI
    | PurificationI ( Int, Int )
    | SacrificeI ( Int, Int )
    | ResurgenceI ( Int, Int )
    | FreezevirusI ( Int, Int )
    | HospitalI (Int, Int)
    | QuarantineI (Int, Int)
    | EnhanceHealingI

-- Card -> String


powerOverload =
    Card NoSel 0 [ IncPowerI 3, IncPowerI (negate 3) ] "Power Overload" "+3 power, next round -3 power."


onStandby =
    Card NoSel 0 [ IncPowerI 2 ] "On Standby" "+2 power"


coldWave =
    Card NoSel 1 [ Freeze 0.5 ] "Cold Wave" "There is a probability of 50% to freeze the spread of viruses spread for 1 round."


blizzard =
    Card NoSel 8 [ FreezeI, FreezeI, FreezeI ] "Blizzard" "Freeze the spread of viruses spread for 3 rounds."


rain =
    Card NoSel 3 [ EcoDoubleI, EcoDoubleI_Freeze 0.5 ] "Rain" "In two rounds, there is a probability of 50% to freeze the spread of viruses for 1 round. The economy output doubles for two rounds."


cut =
    Card HexSel 1 [ CutHexI ( 0, 0 ) ] "Cut" "Eliminate the virus on the chosen hex."


megaCut =
    Card TileSel 5 [ CutTileI ( 0, 0 ) ] "Mega Cut" "Eliminate the virus on the chosen tile."


fubao =
    Card NoSel 1 [ Activate996I, Activate996I ] "996" "The next 2 rounds, economy temporarily doubles, but the death rate permanently rises 5%."


organClone =
    Card TileSel 3 [ OrganCloneI ( 0, 0 ) ] "Organ Clone" "Each one of the dead on the selected tile could save one infected."


humanClone =
    Card TileSel 3 [ HumanCloneI ( 0, 0 ) ] "Human Clone" "Double the population of a certain tile."


megaClone =
    Card NoSel 8 [ MegaCloneI ] "Mega Clone" "The whole population x1.25."


purification =
    Card TileSel 3 [ PurificationI ( 0, 0 ) ] "Purification" "Heal all patients in a certain tile."


sacrifice =
    Card TileSel 4 [ SacrificeI ( 0, 0 ) ] "Sacrifice" "Select a tile. Kill both the viruses and the infected people."


resurgence =
    Card TileSel 8 [ ResurgenceI ( 0, 0 ) ] "Resurgence" "For each tile, restore 20% of the dead."


defenseline =
    Card TileSel 2 [ FreezevirusI ( 0, 0 ), FreezevirusI ( 0, 0 ) ] "Defenseline" "Froze the spread of viruses for 2 rounds."


hospital =
    Card TileSel 4 [ HospitalI (0, 0) ] "Build Hospital" "Put a hospital on a tile."


quarantine =
    Card TileSel 4 [ QuarantineI (0, 0) ] "Build Quarantine" "Put one tile in quarantine."


enhanceHealing =
    Card NoSel 4 [ EnhanceHealingI ] "Enhance healing" "Raise the efficiency of hospital healing by 1."





targetCardlst =
    [ cut, megaCut, organClone, humanClone, sacrifice, purification, resurgence, defenseline, hospital, quarantine ]

