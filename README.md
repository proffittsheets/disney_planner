# Disney World Trip Planner

An interactive single-page trip planner for a Disney World 2029 trip — 2 adults, 1 child (almost 4), and 1 grandparent flying from Atlanta. Built to cut through the analysis paralysis of planning a Disney trip with a toddler.

## What it does

- **Budget calculator** — estimates total trip cost with adjustable nights, inflation rate, and peak/off-peak season toggle; breaks down flights, hotel, park tickets, dining, special experiences, and misc
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
```

## Running it

Open `index.html` directly in a browser — no build step or server required.

