#YouTube Cinema Mode

Improves the YouTube experience by maximizing video player real-estate and fixing some common annoyances.

* Maximizes player to fit the entire viewport area.
* Auto-hides the top bar on watch pages for maximum space utilization (will only display when mouse hovers over the top of the page).
* Auto-pauses other playing videos (in any tab) when playback is started/resumed (supports both watch pages and channel pages, but not embedded videos at the moment).
* Disables SPF (Structured Page Fragments, AKA red loading bar).
* Auto-expands video description.

Supports the HTML5 player only. Tested with both the latest Firefox and Chrome (using latest Greasemonkey/Tampermonkey). Works with both the old (black/red) player and the newer, transparent one, which can be enabled [here](https://www.youtube.com/testtube) (recommended).

I tried to organize the code so other developers could benefit from the individual features (feel free to copy/paste into your own scripts). Because of duplicate and conflicting behaviors, it doesn't seem to work well alongside YouTube Center though (that would also depend on the particular YTC settings used).