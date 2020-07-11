# Catogories of card actions
resource
    power
    economy -> EcoDoubleI, 
virus(tile?)
    freeze -> DisableEvolveI, DisableEvolve Float, DisableEvolveTileI (Int, Int)
    kill/cut -> CutI (Int, Int), Cut (Int, Int) Float
    translate
population
    healthy population
    infected population
    dead population -> AltDeathRateI Float
    overall population
    flow -> SetAttractorI
tile
    quarantine
    warehouse
    hospital -> AltCureEffI Int 
generate anti-virus -> PlaceAntiVirusI (Int, Int), AntiVirusEvolve, AntiVirusClear 
summoncard -> SummonCardI Card
hybrid -> EcoHalfI_Cut (Int, Int) Float 