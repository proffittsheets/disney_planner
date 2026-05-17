# Disney World Trip Planner

An interactive single-page trip planner for a Disney World 2029 trip — 2 adults, 1 child (almost 4), and 1 grandparent flying from Atlanta. Built to cut through the analysis paralysis of planning a Disney trip with a toddler.

## What it does

- **Budget calculator** — estimates total trip cost with adjustable nights, inflation rate, and peak/off-peak season (auto-detected from your trip date, or manually overridden); breaks down flights, hotel, park tickets, dining, special experiences, and misc
- **Hotel picker** — compare Disney deluxe resorts and partner hotels side-by-side with transport options, prices, and club level upgrades; click through to full detail pages with room types, suites, connecting room info, and insider tips
- **Park day plans** — per-park guides covering rides the child can do, day/night itinerary, must-try snacks, restaurants, and shops; includes upcoming attractions (Tropical Americas, Monstropolis, Villains Land)
- **Special experiences** — fireworks dinner options (pontoon cruise, dessert parties, California Grill, etc.) and evening add-ons (Pandora at night, Starlight Safari, Disney After Hours) with costs factored into the budget
- **Booking timeline** — enter your check-in date and get personalised booking deadlines calculated automatically (60-day dining window, 7-day Lightning Lane, etc.)
- **Resort restaurants** — curated dining guide for each hotel area including Michelin-starred options and character dining

## File structure

```
index.html        — HTML skeleton and page layout
styles.css        — all styling, CSS variables, dark mode
js/
  hotels.js       — hotel data, SVG illustrations, and detailed hotel info (rooms, suites, tips)
  parks.js        — per-park data (rides, snacks, restaurants, shops, day plans)
  budget.js       — budget line items, fireworks/evening options, resort restaurant data
  app.js          — state, all render functions, and event handling
images/           — resized (max 1400px) local copies of all CC-licensed photos
terraform/        — AWS infrastructure (S3 + CloudFront); see terraform/README.md
```

## Running locally

Open `index.html` directly in a browser — no build step or server required.

## Hosting

The site is hosted as a static site on AWS S3 behind CloudFront. Infrastructure is managed with Terraform. See [terraform/README.md](terraform/README.md) for setup and deployment instructions.

## Image credits

All images are hosted locally from Wikimedia Commons originals. Waldorf Astoria and Four Seasons use colour headers (no CC-licensed photos available on Wikimedia for those properties).

### Main page hero

| Image | Photographer | License | Source |
|-------|-------------|---------|--------|
| Cinderella Castle, Magic Kingdom (2024) | Jedi94 (2024) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia](https://commons.wikimedia.org/wiki/File:Cinderella_Castle,_Magic_Kingdom_Walt_Disney_World_(2024).jpg) |

### Parks

| Image | Photographer | License | Source |
|-------|-------------|---------|--------|
| Magic Kingdom — Main Street toward Cinderella Castle | Louiemantia (2018) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia](https://commons.wikimedia.org/wiki/File:Magic_Kingdom_Main_Street.jpg) |
| EPCOT — Spaceship Earth | Jedi94 (2022) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia](https://commons.wikimedia.org/wiki/File:Spaceship_Earth,_EPCOT.jpg) |
| Hollywood Studios — Hollywood Boulevard | Jedi94 (2024) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia](https://commons.wikimedia.org/wiki/File:Hollywood_Boulevard,_Disney%27s_Hollywood_Studios_(2024).jpg) |
| Animal Kingdom — Tree of Life | Jedi94 (2019) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia](https://commons.wikimedia.org/wiki/File:Tree_of_Life,_Disney%27s_Animal_Kingdom.jpg) |

### Hotels

| Image | Photographer | License | Source |
|-------|-------------|---------|--------|
| Wilderness Lodge at dusk | Sam Howzit / Steven A. Miller (2015) | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Wikimedia](https://commons.wikimedia.org/wiki/File:Disney%27s_Wilderness_Lodge_at_dusk.jpg) |
| Animal Kingdom Lodge exterior | BestofWDW / Darren (2005) | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Wikimedia](https://commons.wikimedia.org/wiki/File:Disneys_Animal_Kingdom_Lodge_(2831923112).jpg) |
| Beach Club Resort exterior | Benoît Prieur (2022) | [CC0 / Public Domain](https://creativecommons.org/publicdomain/zero/1.0/) | [Wikimedia](https://commons.wikimedia.org/wiki/File:Disney%27s_Beach_Club_Resort_en_janvier_2022.JPG) |
| Contemporary Resort A-frame tower | Spmartin15 (2022) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia](https://commons.wikimedia.org/wiki/File:Contemporary_A_Frame.jpg) |
| Polynesian Village Resort at sunset | Lexi Scott / lxsscott (2015) | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Wikimedia](https://commons.wikimedia.org/wiki/File:Polynesian_Village_Resort_at_Sunset.jpg) |
| Grand Floridian from Seven Seas Lagoon | Sixflashphoto (2010) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia](https://commons.wikimedia.org/wiki/File:Disney%27s_Grand_Floridian_Resort_%26_Spa_1.jpg) |
| Swan Hotel exterior | Napnet (2005) | [Public Domain](https://en.wikipedia.org/wiki/Public_domain) | [Wikimedia](https://commons.wikimedia.org/wiki/File:Wdw-swan-hotel.jpg) |

