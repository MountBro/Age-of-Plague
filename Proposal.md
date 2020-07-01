# Wiki

**_Age of Plague_**
Turn-based strategy( **TBS** )
Our game is organized around the spread of bio-weapon and related defense.

## Map

The two-dimension map consists of a large number of hexagonal tiles, each of which has certain characteristics and outputs.
On the hexagonal-grid map, the player can do things as follows:

- Control units to move and interact with the tiles;
- Build constructions on the tiles;
- Harvest resources from tiles; (etc.)

Every tile is independent of others. Usually, a tile can only contain one building and one unit.
The whole map is visible during the game.

## Defense

The player plays as a governor and is offered a city at the beginning of a game. The objective is to protect the city from the epidemic and get as many scores as possible after a certain number of turns.
/City: The city consists of a city center and some tiles around the center. Citizens live in the city, who work for the city and are protected by the governor. There is no specific border of the city, but generally, the city can cover more tiles as its suburb when the population grows. The city center occupies a tile, where most production activities take place. Every turn, the city generates some yields according to the work done by the citizens./
In order to fight against the epidemic, the player should make use of the yields of the city to:

- Develop new technologies;
- Train units;
- Build constructions;(etc.)

The yields are limited, so the player needs to balance the resource allocation.
When the plague arrives at the land of the city, citizens have a certain probability of dying. The player needs to adjust the position of the citizens to directly keep them from polluted land. Besides, technologies bring benefits and unlock new units and constructions. Units like doctors can treat the patient and avoid deaths. Institutions like the academy can accelerate the training of units. Also, the city can work on special projects like building a sewerage system for global benefits. After a certain number of turns, the epidemic ends. And the player gets scores according to his or her performance in the war against the disease. The scoring standard is mainly based on the population.

## Artstyle

We currently plan to use 2D style for visual elements. 2.5D style will be considered if we have enough time left for the design of the visual elements.
An example of the visual elements is included in `IconDesign.jpg` in files.

<div>
<picture>
  <img src="http://focs.ji.sjtu.edu.cn:2143/attachments/11">
</picture>
</div>

## Prospect

At the first stage, we're only considering the **defense system** . In other words, only one game mode is offered for the players: defense.
If time is sufficient, we'll add an attack system (the player has control over the virus) and write an AI capacity of implementing attack and defense. Then there'll be three modes: **defense, attack and skirmish** .
The ideal order of development is listed as follows:

1. defense system
2. AI capable of defense
3. attack system
4. AI capable of attack

## Story settings

Our story is set in a future world when an **epidemic** happens.
The main characters are countries, and the storyline foucses on how they defeat the disease and survive the big crisis of the world.
Also, the relationship between the countries is tricky, and they have to compete with each other to get more resource. Thus, fierce competition will take place.
In more specific aspects, there are many small components of a country.
They are respectively:

- Medics: they are hold accountable for curing the sick and help keep the quarantine;
- Teachers: they can give out useful knowledge and help the tech develop;
- Technical staff: they are the direct drive of the tech development;
- Normal people: they are just ordinary ones living in the country.
