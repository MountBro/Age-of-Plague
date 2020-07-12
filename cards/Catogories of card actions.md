# Catogories of card actions
resource
    power -> IncPowerI Int
    economy -> EcoDoubleI, 
virus(tile?)
    freeze -> DisableEvolveI, DisableEvolve Float, DisableEvolveTileI (Int, Int)
    kill/cut -> CutHexI (Int, Int), CutHex (Int, Int) Float, CutTileI (Int, Int), CutTile (Int, Int) Float
    translate
population
    healthy population -> CloneDoubleI (Int, Int)
    infected population -> OrganCloneI, HealAllI, ResurgenceI (Int, Int)
    dead population -> AltDeathRateI Float
    overall population -> MegaCloneI Float
    flow -> SetAttractorI, DistributeToNeighborsI (Int, Int)
tile
    quarantine -> SetQuaI (Int, Int)
    warehouse -> BuildWarehouse (Int, Int)
    hospital -> AltCureEffI (Int, Int) Int -> BuildHospitalI (Int, Int)  
generate anti-virus -> PlaceAntiVirusI (Int, Int), AntiVirusEvolveI, AntiVirusClearI 
summoncard -> SummonCardI (List Card)
hybrid -> EcoHalfI_Cut (Int, Int) Float， Judgement Float, EcoDouble_Freeze Float, SacrificeI (Int, Int)

None