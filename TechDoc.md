
# Table of Contents

1.  [Architecture](#orge34c4bb)
2.  [elm files](#org792a96d)


<a id="orge34c4bb"></a>

# Architecture

The game is written mainly in elm, with the aid of css for styling and js for handling sound effects.
`Browser.document` is used for the overall architecture ( see [package Browser](https://package.elm-lang.org/packages/elm/browser/latest/Browser#document) for more details).


<a id="org792a96d"></a>

# elm files

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="org-left" />

<col  class="org-left" />
</colgroup>
<tbody>
<tr>
<td class="org-left">file name</td>
<td class="org-left">functionality</td>
</tr>


<tr>
<td class="org-left">--</td>
<td class="org-left">----</td>
</tr>


<tr>
<td class="org-left">Action.elm, InitLevel.elm, NextRound.elm, RegionFill.elm, Todo.elm, Update.elm</td>
<td class="org-left">funtions for update</td>
</tr>


<tr>
<td class="org-left">Card.elm</td>
<td class="org-left">definition of card</td>
</tr>


<tr>
<td class="org-left">ColorScheme.elm, GameViewBasic.elm, GameViewButtons, GameViewCards, GameView.elm, GameViewTiles.elm, SvgDefs.elm, SvgSrc.elm, ViewCards.elm, View.elm, ViewMP.elm</td>
<td class="org-left">view</td>
</tr>


<tr>
<td class="org-left">Geometry.elm, Parameters</td>
<td class="org-left">geometric definitions and parameters</td>
</tr>


<tr>
<td class="org-left">Main.elm</td>
<td class="org-left">declaration of architecture</td>
</tr>


<tr>
<td class="org-left">Message.elm</td>
<td class="org-left">messages</td>
</tr>


<tr>
<td class="org-left">Model.elm</td>
<td class="org-left">model</td>
</tr>


<tr>
<td class="org-left">Population.elm, Tile.elm, Map.elm</td>
<td class="org-left">types and functions for city</td>
</tr>


<tr>
<td class="org-left">Ports.elm</td>
<td class="org-left">Interaction with js</td>
</tr>


<tr>
<td class="org-left">Virus.elm</td>
<td class="org-left">types and functions for virus</td>
</tr>
</tbody>
</table>

