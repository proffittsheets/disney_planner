var fireworksDNs={
  none:{l:'None',off:0,peak:0,note:'No fireworks experience selected',hotel:''},
  pontoon:{l:'Private Pontoon Cruise',off:550,peak:600,
    note:'Private boat for up to 10 guests · Captain provided · Snacks and soft drinks included · Watch Happily Ever After from Seven Seas Lagoon · Can be decorated for special occasions · Book via My Disney Experience or (407) 939-7529 · 60-day booking window',
    hotel:'Departs from: Contemporary (Boat Nook), Polynesian (Seven Seas Marina), Grand Floridian (Captain\'s Shipyard), Wilderness Lodge (Teton), Fort Wilderness · EPCOT version also available'},
  dessert:{l:'MK Fireworks Dessert Party',off:220,peak:260,
    note:'Tomorrowland Terrace · Unlimited dessert buffet + beer/wine for adults · Reserved viewing area at Plaza Garden · Post-Party recommended — claim your spot early, watch fireworks, eat desserts while Main Street clears · Pre-Party and Seats & Sweets (seated, slightly off-center) also available · ~$99/adult + $59/child projected to 2029',
    hotel:'In-park experience — works from any hotel · Best from nearby monorail resorts for easy exit after'},
  ferrytale:{l:'Ferrytale Fireworks Dessert Cruise',off:295,peak:330,
    note:'Watch Happily Ever After from the iconic Magic Kingdom ferryboat on Seven Seas Lagoon · Desserts, drinks, glow-in-the-dark Hidden Mickey scavenger hunt, Mickey Vision fireworks lenses · Select Wednesday and Saturday evenings only · Check-in at Ticket and Transportation Center · ~$130/adult projected to 2029',
    hotel:'Departs from the TTC ferry dock — easy from any monorail resort (Polynesian, Contemporary, Grand Floridian) or the TTC parking lot'},
  celebration:{l:'Celebration at the Top',off:230,peak:260,
    note:'California Grill 15th floor · Small plates, sushi, desserts, cocktails + wine · Step onto the private outdoor viewing deck for MK fireworks · Adults-focused · Smart casual dress code · Not offered every night — check Disney website · Different from the California Grill dinner reservation',
    hotel:'Best from: Contemporary (elevator up — zero logistics) · Polynesian and Grand Floridian easy via monorail'},
  geo82:{l:'GEO-82 EPCOT Fireworks',off:385,peak:385,
    note:'Adults 21+ only · Inside Spaceship Earth at EPCOT · Gourmet tasting tower, 3 cocktails included · Fireworks over World Showcase Lagoon · Very limited capacity — book at exactly 60 days or you will miss it',
    hotel:'Best from: Beach Club or Swan & Dolphin (5-min walk into EPCOT International Gateway — no transport at all)'},
  cagrill:{l:'California Grill Dinner',off:420,peak:420,
    note:'Contemporary 15th floor · 3-course prix fixe + wine pairing · MK fireworks visible from your table or the private outdoor terrace · A full dinner rather than the Celebration at the Top cocktail event · Book at 60 days',
    hotel:'Best from: Contemporary (elevator up — zero logistics) · Polynesian and Grand Floridian easy via monorail'},
  mnsshp:{l:"Mickey's Not-So-Scary Halloween Party",off:420,peak:420,
    note:'Magic Kingdom · Aug–Oct select nights · 7pm–midnight · Includes: Disney\'s Not-So-Spooky Spectacular fireworks hosted by Jack Skellington, Boo-to-You Halloween Parade (headless horseman!), Hocus Pocus Villain Spelltacular stage show, trick-or-treating, exclusive character meets in Halloween costumes · ~$200/adult projected to 2029 · Dates sell out — book as soon as released, some dates sell out before Halloween',
    hotel:'Replaces a park day · Enter from 4pm with party ticket — no separate park admission needed · Great for the whole group including grandma and your daughter · Trick-or-treating is a highlight for almost-4'},
  mvmcp:{l:"Mickey's Very Merry Christmas Party",off:430,peak:430,
    note:'Magic Kingdom · Nov–Dec 21 select nights · 7pm–midnight · Includes: Minnie\'s Wonderful Christmastime Fireworks, Mickey\'s Once Upon a Christmastime Parade, Mickey\'s Most Merriest Celebration castle show, free hot cocoa and cookies throughout the park, festive overlays on Space Mountain and more · ~$205/adult projected to 2029 · Sells out — every date sold out in 2025',
    hotel:'Replaces a park day · Enter from 4pm · The most magical time of year at Magic Kingdom · Free hot cocoa and cookies are everywhere · Your daughter will love the Christmas parade · Snow falls on Main Street'},
};
var eveningDNs={
  none:{l:'None',off:0,peak:0,note:'No evening experience selected',hotel:''},
  pandora:{l:'Pandora at night',off:0,peak:0,free:true,
    note:"Arrive at dusk · Rum Blossoms from Pongu Pongu · Na'vi River Journey (glowing boat) · Flight of Passage via LL Single Pass · Wander bioluminescent paths under floating mountains · Included with park ticket — no extra cost",
    hotel:'Best from: Animal Kingdom Lodge (most immersive — end the night at Jiko or Victoria Falls Lounge)'},
  starlight:{l:'Starlight Safari',off:195,peak:195,
    note:'Animal Kingdom Lodge · 1-hour open-air nighttime safari through the resort savanna · Night vision goggles provided · 30+ species including zebras, giraffes, flamingos, and wildebeest · Runs at 8:30pm and 10pm nightly · Available to all guests · Book via My Disney Experience app',
    hotel:'Best from: Animal Kingdom Lodge (walk from your room to Kidani Village porte-cochère) · Pair with Jiko or Sanaa dinner for a full evening at AKL without leaving the resort · Works from any hotel via Uber/Lyft'},
  afterhours:{l:'Disney After Hours',off:420,peak:420,
    note:'Separate-ticket event · 10pm–1am (enter from 7pm) · Very limited capacity — near-empty parks · Major rides with minimal or no waits · Included popcorn, ice cream novelties, and bottled beverages throughout · Available at MK ($175–199/ticket in 2026), Hollywood Studios ($155–189), and EPCOT ($155–179) · Select nights only — check Disney website for 2029 dates · ~$200/adult projected to 2029',
    hotel:'Works from any hotel · Best used as an adult night at MK (TRON, Seven Dwarfs Mine Train, Space Mountain back-to-back with no waits) or HS (Rise of the Resistance, Slinky Dog Dash, Galaxy\'s Edge at night) while little one sleeps'},
};
var fi=[
  {bk:'flights',  label:'Flights',                  note:'ATL→MCO, 4 passengers, round trip',        color:'#023E8A',off:1050,peak:1350,isFly:true},
  {bk:'transport',label:'Airport transport',        note:'Mears Connect, round trip × 4 people',     color:'#48CAE4',off:140, peak:140,isFly:true},
  {bk:'transport',label:'Gas — Marietta to Orlando, return',note:'~440 miles each way × 2 = ~880 miles · est. 25 mpg · ~$3.30/gal projected 2029',color:'#023E8A',off:120,peak:120,isDrive:true},
  {bk:'transport',label:'Florida Turnpike tolls, return',note:'Georgia state line to Orlando and back · SunPass/E-ZPass rates',color:'#48CAE4',off:40, peak:40,isDrive:true},
  {bk:'park',     label:'Park tickets',             note:'4-day base tickets × 4 people',            color:'#0077B6',off:2050,peak:2350},
  {bk:'park',     label:'Lightning Lane Multi Pass',note:'4 park days × 4 people',                   color:'#0077B6',off:500, peak:650,sub:true},
  {bk:'dining',   label:'General dining',           note:'5 days · quick service + table service',   color:'#00B4D8',off:1200,peak:1500},
  {bk:'dining',   label:"Cinderella's Royal Table", note:'3 adults + 1 child · incl. tax & gratuity',color:'#00B4D8',off:300, peak:320,special:true},

  {bk:'special',  label:'Bibbidi Bobbidi Boutique', note:'Kingdom Package · 1 child · princess gown, crown, wand, hair',color:'#E8B84B',off:260,peak:260,special:true},
  {bk:'special',  label:'Caring for Giants',        note:'Animal Kingdom · 60-min elephant experience · all 4 guests',color:'#E8B84B',off:170,peak:170,special:true},
  {bk:'misc',     label:'Travel insurance',          note:'Trip protection · covers cancellation, medical, trip interruption · ~4–5% of total trip cost · Essential for a $9k–12k trip with a toddler',color:'#90E0EF',off:400,peak:500},
  {bk:'misc',     label:'Memory Maker / PhotoPass',  note:'Unlimited digital downloads of all Disney photographer shots · Ride photos included · Covers your whole party for the entire trip · Worth every cent with an almost-4-year-old at her first trip',color:'#90E0EF',off:230,peak:230,isMemMaker:true},
  {bk:'misc',     label:'Stroller rental',           note:'Kingdom Strollers (third-party) · ~$65/day · Delivered to your hotel before arrival · Much better than Disney in-park rentals ($35/day, lost when you leave a park) · 4 park days',color:'#90E0EF',off:260,peak:260,isStroller:true},
  {bk:'misc',     label:'Souvenirs',                 note:'Budgeted generously!',                     color:'#90E0EF',off:1650,peak:2400},
  {bk:'misc',     label:'In-room babysitting',      note:"Kid's Nite Out · 1 evening · ~5 hrs",      color:'#90E0EF',off:220, peak:220},
  {bk:'misc',     label:'MagicBand+',               note:'4 bands × ~$45 avg · Lights up + vibrates during Happily Ever After, Luminous, Fantasmic! + show interactions · Optional — free Key to the World card works for park entry, Lightning Lane & room key',color:'#90E0EF',off:210,peak:210,isBand:true},
];


var resortRests=[
  {area:'Magic Kingdom resorts',color:'#023E8A',hotels:[
    {name:'Contemporary Resort',icon:'△',rests:[
      {n:'California Grill',t:'ts',p:'~$200–$260 (2 adults)',nt:'15th floor · Signature prix fixe + wine pairing · MK fireworks from the terrace · Already in your date night options',special:'Fireworks views from the 15th-floor observation deck — guests step outside mid-meal during the show'},
      {n:'Steakhouse 71',t:'ts',p:'~$140–$180',nt:"All-day American classics inspired by Walt's opening day · Breakfast is great value · More casual and family-friendly"},
      {n:'The Wave',t:'ts',p:'~$120–$160',nt:'Health-forward menu with local ingredients · Quieter and underrated · Good relaxed dinner before an evening park visit'},
    ]},
    {name:'Polynesian Village Resort',icon:'🌴',rests:[
      {n:"'Ohana",t:'ts',p:'~$160–$200',nt:"Family-style Hawaiian feast · Skewers, noodles, wings served to the table · Lilo & Stitch character breakfast · One of the most beloved restaurants at WDW · Book early",special:'Live Hawaiian music at dinner · Coconut races and hula dancing · Window tables overlook Seven Seas Lagoon',warn:"Fireworks views currently obstructed due to Polynesian exterior maintenance (began Jan 2026) — confirm current status before booking if views are the goal"},
      {n:'Kona Café',t:'ts',p:'~$100–$130',nt:"Casual Pan-Asian · Famous Tonga Toast breakfast · Much easier to book than 'Ohana"},
      {n:"Trader Sam's Grog Grotto",t:'ts',p:'~$60–$90 (drinks/apps)',nt:'Theatrical tiki bar · Adults only after 8pm · One of the most fun bars at WDW',special:'Cocktails trigger in-bar effects — thunder, rain, volcano eruptions, the ceiling floods depending on what you order · Each drink comes with a show'},
    ]},
    {name:'Grand Floridian Resort',icon:'👑',rests:[
      {n:"Victoria & Albert's",t:'ts',p:'~$400–$600 (2 adults)',nt:"AAA Five Diamond since 2000 · Forbes Five-Star · 500+ wine collection · Seasonal tasting menu",michelin:true,special:"The only Disney-owned restaurant with a Michelin Star · Chef's Table available as the most exclusive experience at all of WDW · Reserve months in advance, not just 60 days"},
      {n:'Citricos',t:'ts',p:'~$180–$230',nt:'Mediterranean-inspired · Castle view · Sophisticated and beautiful · Excellent wine list',michelinRec:true},
      {n:"Narcoosee's",t:'ts',p:'~$180–$240',nt:'Waterfront on Seven Seas Lagoon · Seafood-forward',special:'MK fireworks views from the waterfront verandah · Electrical Water Pageant also visible · Request a window table'},
      {n:'Grand Floridian Café',t:'ts',p:'~$120–$150',nt:'All-day casual dining in a bright Victorian room · Good breakfast or lunch · More accessible price point'},
    ]},
    {name:'Wilderness Lodge',icon:'🌲',rests:[
      {n:'Story Book Dining at Artist Point',t:'ts',p:'~$160–$200',nt:'Snow White character dining · Evil Queen, Dopey, and Grumpy · Stunning Arts & Crafts room',special:"Evil Queen is uniquely theatrical and villainous in a way most character dining isn't · Your daughter will love this"},
      {n:'Whispering Canyon Café',t:'ts',p:'~$100–$140',nt:'Rustic skillet meals',special:'Staff are notoriously rowdy and interactive — they play pranks, hold ketchup races, and involve the whole dining room · Kids absolutely love it'},
      {n:'Geyser Point Bar & Grill',t:'qs',p:'~$80–$100',nt:'Outdoor waterfront bar overlooks Bay Lake · Casual burgers and cocktails · Great sunset spot'},
    ]},
  ]},
  {area:'EPCOT & Hollywood Studios resorts',color:'#0077B6',hotels:[
    {name:'Beach Club Resort',icon:'⚓',rests:[
      {n:'Cape May Café',t:'ts',p:'~$140–$180',nt:'Casual and family-friendly · Best pre-EPCOT morning option',special:'Admiral Donald Duck character breakfast — Donald, Goofy, and Minnie in nautical gear · Fun, relaxed, and much easier to book than MK character dining'},
      {n:'Beaches & Cream Soda Shop',t:'ts',p:'~$60–$80',nt:'Classic American soda fountain · No reservations',special:'Famous Kitchen Sink sundae — every flavour, every topping, the literal kitchen sink · Designed to feed 4 · An unmissable WDW tradition'},
      {n:"Hurricane Hanna's",t:'qs',p:'~$50–$65',nt:'Poolside bar and grill · Casual burgers and drinks · Great for a lazy afternoon by Stormalong Bay'},
    ]},
    {name:'Swan & Dolphin',icon:'〰',rests:[
      {n:"Todd English's bluezoo",t:'ts',p:'~$180–$240',nt:'Upscale seafood in a stunning nautical room · One of the best restaurants in the EPCOT resort area'},
      {n:'Il Mulino New York Trattoria',t:'ts',p:'~$140–$180',nt:'Classic Italian · Handmade pasta and wood-fired dishes · Quieter than the parks restaurants'},
      {n:'Garden Grove',t:'ts',p:'~$140–$180',nt:'Character dining in a beautiful glass conservatory',special:'Goofy, Pluto, and friends at breakfast · One of the most underrated character dining rooms at WDW · The conservatory setting is genuinely beautiful'},
      {n:'Kimonos',t:'ts',p:'~$80–$110',nt:'Japanese restaurant + karaoke bar',special:'Private karaoke rooms available · Excellent sushi and sake · Great late-night adults option once the kids are asleep'},
    ]},
    {name:'Waldorf Astoria Orlando',icon:'🔑',rests:[
      {n:'Bull & Bear',t:'ts',p:'~$200–$280',nt:'Award-winning steakhouse inspired by the original New York Waldorf · Best splurge dinner in the EPCOT resort area · Forbes Four-Star hotel and restaurant'},
      {n:'Peacock Alley',t:'ts',p:'~$120–$160',nt:'All-day dining in the newly renovated lobby · More relaxed than Bull & Bear · Good for a family meal'},
    ]},
    {name:'Four Seasons Orlando',icon:'☀',rests:[
      {n:'Ravello',t:'ts',p:'~$160–$210',nt:'Italian-inspired · Beautiful open kitchen',michelin:true,michelinRec:true,special:'Mickey, Minnie, Goofy + Pluto character breakfast · Michelin-recommended · One of the most upscale character dining experiences at WDW'},
      {n:'Capa',t:'ts',p:'~$200–$270 (2 adults)',nt:'Spanish-influenced steakhouse · Tapas and hickory-grilled meats · Iberico pluma a standout',michelin:true,special:'Michelin-starred rooftop on the 17th floor · Unobstructed Disney fireworks views every night · The most impressive adults dinner setting at all of WDW'},
      {n:'PB&G',t:'qs',p:'~$60–$75',nt:'Poolside bar and grill · Casual · Great after a morning at the Four Seasons lazy river'},
    ]},
  ]},
  {area:'Animal Kingdom resort',color:'#023E8A',hotels:[
    {name:'Animal Kingdom Lodge',icon:'🌳',rests:[
      {n:'Jiko — The Cooking Place',t:'ts',p:'~$180–$240',nt:'African-inspired cuisine · One of the best resort restaurants at WDW',special:"One of the largest African wine collections outside the continent · Pairs perfectly with a Starlight Safari date night · Quiet and sophisticated"},
      {n:'Sanaa',t:'ts',p:'~$100–$130',nt:'Kidani Village · Indian-inspired',special:'Savanna views — giraffes and zebras visible from your table · Famous bread service with 9 accompaniments · A special meal at a very reasonable price'},
      {n:'Boma — Flavors of Africa',t:'ts',p:'~$130–$170',nt:'African buffet · 60+ dishes · One of the best buffets at WDW · Great for mixed-age groups',special:'Character breakfast with Donald Duck and friends in safari gear · Buffet is ideal for picky eaters'},
      {n:'Victoria Falls Lounge',t:'ts',p:'~$50–$80 (drinks/apps)',nt:'Overlooking the savanna · Cocktails and small plates · No reservation needed',special:"One of the most atmospheric bars at WDW · Savanna views at night · Perfect adults nightcap after Starlight Safari"},
    ]},
  ]},
];

