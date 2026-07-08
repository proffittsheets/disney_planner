/* ============================================================
   Disney Planner — shared budget engine
   Pure functions ported faithfully from the original app.js so
   every redesign produces identical numbers. No DOM, no React.
   Depends on globals from data/: hotels, hotelDetails, parks,
   fireworksDNs, eveningDNs, fi, resortRests.
   ============================================================ */
window.PlannerEngine = (function () {
  function fmt(n) { if (n === 0) return 'Free'; return '$' + Math.round(n).toLocaleString(); }
  function money(n) { return '$' + Math.round(n).toLocaleString(); }
  function computeTripMult(inflRate, inflYears) {
    return Math.pow(1 + inflRate, inflYears);
  }
  function p(n, tripMult) { return Math.round(n * tripMult); }
  function pItem(item, season, tripMult) { return item.noInfl ? item[season] : p(item[season], tripMult); }
  function allH() { return hotels.deluxe.concat(hotels.assoc); }
  function getH(sel) { return allH().filter(function (h) { return h.key === sel; })[0]; }

  // default state factory
  function defaultState() {
    return {
      sel: 'beachclub',
      activeFireworks: ['dessert'],
      activeEvening: 'pandora',
      season: 'off',
      nights: 5,
      wantBands: true,
      clubLevel: false,
      wantMemMaker: true,
      wantStroller: false,
      tripDate: null,        // Date or null
      travelMode: 'drive',
      inflRate: 0.05,
      inflYears: 1,
      tripMult: computeTripMult(0.05, 1),
      activeDeal: null,
      kidsEatFree: false,
      activeDaytime: ['crt', 'bbb'],
    };
  }

  function strollerPrice(nights) {
    if (nights <= 3)  return 70;
    if (nights <= 7)  return 90;
    if (nights <= 10) return 110;
    if (nights <= 14) return 130;
    if (nights <= 18) return 150;
    return 170;
  }

  function buildItemsRaw(s) {
    var h = getH(s.sel), items = fi.slice().map(function(i) {
      if (!i.isStroller) return i;
      var price = strollerPrice(s.nights);
      return Object.assign({}, i, { off: price, peak: price });
    }), tm = s.tripMult;
    var ev = eveningDNs[s.activeEvening];
    s.activeFireworks.forEach(function (k) {
      var fw = fireworksDNs[k];
      items.push({ bk: 'special', label: fw.l, note: fw.note, hotelNote: fw.hotel, color: '#E8B84B', off: fw.off, peak: fw.peak, special: true, adults: !fw.family, isFW: true, free: fw.free, warn: fw.warn });
    });
    if (s.activeEvening !== 'none') items.push({ bk: 'special', label: ev.l, note: ev.note, hotelNote: ev.hotel, color: '#00B4D8', off: ev.off, peak: ev.peak, special: true, adults: true, isEV: true, free: ev.free });
    (s.activeDaytime || []).forEach(function (k) { var dt = daytimeDNs[k]; items.push({ bk: 'special', label: dt.l, note: dt.note, color: '#E8B84B', off: dt.off, peak: dt.peak, special: true }); });
    var hRateRaw = h[s.season] / 5;
    var clubExtraRaw = s.clubLevel && h.club ? h.club[s.season === 'off' ? 'offExtra' : 'peakExtra'] : 0;
    items.push({ bk: 'hotel', label: h.name + (s.clubLevel && h.club ? ' — ' + h.club.name : ''), note: h.note + ' · ' + s.nights + ' night' + (s.nights === 1 ? '' : 's') + (s.clubLevel && h.club ? ' · ' + h.club.perks : ''), color: '#023E8A', off: (hRateRaw + clubExtraRaw) * s.nights, peak: (hRateRaw + clubExtraRaw) * s.nights, isHotel: true });
    var babyNights = s.activeFireworks.filter(function (k) { return !fireworksDNs[k].family; }).length + (s.activeEvening !== 'none' ? 1 : 0);
    if (babyNights > 0) items.push({ bk: 'misc', label: 'In-room babysitting', note: "Kid's Nite Out · " + babyNights + ' evening' + (babyNights > 1 ? 's' : '') + ' · ~5 hrs each', color: '#90E0EF', off: babyNights * 220, peak: babyNights * 220 });
    return items.filter(function (i) {
      if (i.isFly && s.travelMode === 'drive') return false;
      if (i.isDrive && s.travelMode === 'fly') return false;
      if (i.isMemMaker && !s.wantMemMaker) return false;
      if (i.isStroller && !s.wantStroller) return false;
      if (i.isBand && !s.wantBands) return false;
      return true;
    });
  }

  function buildItems(s) {
    return buildItemsRaw(s).map(function (i) {
      if (s.activeDeal === 'room' && i.bk === 'hotel') return Object.assign({}, i, { off: Math.round(i.off * 0.75), peak: Math.round(i.peak * 0.75) });
      if (s.activeDeal === 'dining' && i.bk === 'dining' && i.label !== 'Snacks & drinks') return Object.assign({}, i, { off: 0, peak: 0 });
      if (s.kidsEatFree && s.activeDeal !== 'dining' && i.bk === 'dining') return Object.assign({}, i, { off: Math.round(i.off * 0.80), peak: Math.round(i.peak * 0.80) });
      return i;
    });
  }

  function dealSavings(s) {
    if (!s.activeDeal && !s.kidsEatFree) return 0;
    var season = s.season, raw = buildItemsRaw(s), adj = buildItems(s);
    return raw.reduce(function (sum, item, idx) { return sum + pItem(item, season, s.tripMult) - pItem(adj[idx], season, s.tripMult); }, 0);
  }

  function calcCats(s) {
    var season = s.season, cats = { flights: 0, hotel: 0, park: 0, dining: 0, special: 0, transport: 0, misc: 0 };
    buildItems(s).forEach(function (i) { cats[i.bk] += pItem(i, season, s.tripMult); });
    return cats;
  }

  function totals(s) {
    var cats = calcCats(s);
    var total = Object.values(cats).reduce(function (a, b) { return a + b; }, 0);
    var season = s.season;
    var spTot = buildItems(s).filter(function (i) { return i.special; }).reduce(function (a, i) { return a + pItem(i, season, s.tripMult); }, 0);
    return { cats: cats, total: total, perPerson: Math.round(total / 4), hotel: cats.hotel, special: spTot };
  }

  // grouped budget sections (mirrors renderBudget's secs)
  function sections(s) {
    var items = buildItems(s);
    return [
      { key: 'travel', h: 'Getting there', items: items.filter(function (i) { return (i.bk === 'flights' || i.bk === 'transport') && !i.isHotel; }) },
      { key: 'hotel', h: 'Staying there', items: items.filter(function (i) { return i.isHotel; }) },
      { key: 'park', h: 'The parks', items: items.filter(function (i) { return i.bk === 'park'; }) },
      { key: 'dining', h: 'Food & dining', items: items.filter(function (i) { return i.bk === 'dining'; }) },
      { key: 'special', h: 'Special experiences', items: items.filter(function (i) { return i.special; }) },
      { key: 'misc', h: 'Everything else', items: items.filter(function (i) { return i.bk === 'misc'; }) },
    ];
  }

  var CATS = [
    { k: 'flights', label: 'Flights', color: '#023E8A' },
    { k: 'hotel', label: 'Hotel', color: '#03045E' },
    { k: 'park', label: 'Park', color: '#0077B6' },
    { k: 'dining', label: 'Dining', color: '#00B4D8' },
    { k: 'special', label: 'Special', color: '#E8B84B' },
    { k: 'transport', label: 'Transport', color: '#48CAE4' },
    { k: 'misc', label: 'Misc', color: '#90E0EF' },
  ];

  // ---- dates / timeline ----
  function isPeakDate(d) {
    var m = d.getMonth() + 1, day = d.getDate();
    if (m === 1 && day <= 6) return true;
    if (m === 3 && day >= 12) return true;
    if (m === 4 && day <= 19) return true;
    if (m === 6 || m === 7) return true;
    if (m === 8 && day <= 14) return true;
    if (m === 11 && day >= 21) return true;
    if (m === 12 && day >= 19) return true;
    return false;
  }
  function addDays(d, n) { var r = new Date(d); r.setDate(r.getDate() + n); return r; }
  function fmtDate(d) { if (!d) return ''; return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }); }
  function fmtShort(d) { if (!d) return ''; return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }

  function timelineStatus(date) {
    if (!date) return { label: 'Plan ahead', tone: 'neutral' };
    var t = new Date(); t.setHours(0, 0, 0, 0);
    var d = new Date(date); d.setHours(0, 0, 0, 0);
    if (d < t) return { label: 'Window open now', tone: 'go' };
    var days = Math.round((d - t) / 864e5);
    if (days === 0) return { label: 'Today!', tone: 'warn' };
    return { label: days + ' days away', tone: 'neutral' };
  }

  function timeline(s) {
    if (!s.tripDate) return null;
    var ci = s.tripDate;
    var d60 = addDays(ci, -60), d7 = addDays(ci, -7), d30 = addDays(ci, -30), d2 = addDays(ci, -2);
    var pkgYear = ci.getFullYear() - 1;
    var hasParty = s.activeFireworks.some(function (k) { return k === 'mnsshp' || k === 'mvmcp'; });
    var partyLabel = s.activeFireworks.filter(function (k) { return k === 'mnsshp' || k === 'mvmcp'; }).map(function (k) { return k === 'mnsshp' ? "Mickey's Not-So-Scary Halloween Party" : "Mickey's Very Merry Christmas Party"; }).join(' + ');
    var lastNight = addDays(ci, s.nights - 1);
    var partyRow = hasParty ? [partyLabel + ' tickets go on sale', 'Party tickets release in May/June of the year before the event — months before your 60-day dining window. Some dates sell out within hours. Buy immediately when released.'] : null;
    var summary = fmtShort(ci) + ' check-in · ' + s.nights + ' nights · ' + fmtShort(addDays(ci, s.nights)) + ' check-out';
    var secs = [
      { label: 'Book now — Hotel reservation', color: '#023E8A', date: null, rows: [
        ['Book your hotel immediately', 'Disney deluxe rooms sell up to 20 months in advance. Polynesian, Beach Club, and Grand Floridian fill fastest for December. ' + ci.getFullYear() + ' dates expected to open around May/June ' + (ci.getFullYear() - 1) + '.'],
        ['Call (407) 939-5277 after booking', 'Link two-room reservations and add your connecting room request as a note. Repeat at check-in.'],
      ] },
      { label: '~May/June ' + pkgYear + ' — Packages and party tickets', color: '#0077B6', date: new Date(pkgYear, 4, 1), rows: (partyRow ? [['Vacation packages go on sale', 'Disney releases the following year packages in May/June. Booking early locks in current pricing and any launch promotions.'], partyRow] : [['Vacation packages go on sale', 'Disney releases the following year packages in May/June. Booking early locks in current pricing and any launch promotions.']]) },
      { label: 'Your 60-day window — ' + fmtDate(d60), color: '#00B4D8', date: d60, rows: [
        ['Set an alarm: 5:45 AM ET on ' + fmtShort(d60), 'Reservations technically open at 6:00 AM but have been seen going live a few minutes early. Have My Disney Experience open, party size entered, and restaurant pre-selected before 6:00 AM.'],
        ['Resort guest advantage — book your entire stay', 'As a Disney resort guest you book all ' + s.nights + ' nights on this single date. Your last night (' + fmtShort(lastNight) + ') is effectively available ' + (s.nights + 59) + ' days in advance.'],
        ['Book in this exact priority order', '1. Cinderella Royal Table (sells in seconds) 2. Bibbidi Bobbidi Boutique 3. GEO-82 (extremely limited, adults 21+) 4. Be Our Guest dinner 5. Akershus / Crystal Palace 6. Ohana 7. All other table service 8. Beak and Barrel lounge 9. Ferrytale cruise 10. Starlight Safari 11. Caring for Giants'],
        ['Victoria and Albert Chef Table — phone only', 'Call (407) 939-3862 between 10 AM and 4 PM ET. Cannot be booked online. Still opens at 60 days. Main dining room and Queen Victoria Room can be booked via MDE.'],
        ['California Grill and Celebration at the Top', 'Both book via MDE at 60 days. Book California Grill right after character dining priorities above.'],
        ['Pontoon cruise, dessert parties, all special experiences', 'All book at 60 days via MDE or (407) 939-7529.'],
      ] },
      { label: '30 days out — ' + fmtShort(d30), color: '#E8B84B', date: d30, rows: [
        ['Purchase Memory Maker', 'Can be bought any time before or during the trip but buying before arrival is slightly cheaper. Activates the moment you purchase.'],
        ['Confirm stroller delivery', 'If using Kingdom Strollers, confirm delivery date and hotel. Stroller should arrive at bell services before check-in.'],
        ['Measure your daughter', 'She needs 38 inches for Seven Dwarfs Mine Train, Big Thunder Mountain, and Slinky Dog Dash. Measure before you leave home.'],
      ] },
      { label: 'Day 7 — Lightning Lane — ' + fmtDate(d7), color: '#48CAE4', date: d7, rows: [
        ['7:00 AM — Buy Lightning Lane Multi Pass', 'Resort guests can purchase LLMP 7 days before each park day. Set an alarm for each park morning.'],
        ['Complete online check-in', 'MDE app · Select arrival time window · Re-confirm connecting room request · Set up MagicMobile if not using MagicBands.'],
      ] },
      { label: '1 to 3 days out — ' + fmtShort(d2), color: '#90E0EF', date: d2, rows: [
        ['Pack ponchos and layers', 'Orlando in early December is 60 to 70 degrees F with afternoon rain likely. Ponchos are $12 inside the parks and $2 on Amazon.'],
        ['Download everything to MDE', 'Park tickets, Lightning Lane, dining reservations — screenshot all confirmations in case you lose cell signal.'],
        ['Review your daily plan', 'Check park hours, parade and fireworks times, and any last-minute changes to your reservations.'],
      ] },
    ];
    return { summary: summary, sections: secs };
  }

  function inflationNote(s) {
    var ratePct = Math.round(s.inflRate * 100);
    var pct = Math.round((Math.pow(1 + ratePct / 100, s.inflYears) - 1) * 100);
    var targetYear = 2026 + s.inflYears;
    return s.tripDate
      ? 'Prices adjusted for ' + s.tripDate.getFullYear() + ' (+' + pct + '% from 2026 · ' + ratePct + '%/yr)'
      : targetYear + ' baseline (+' + pct + '% from 2026 · ' + ratePct + '%/yr)';
  }

  return {
    fmt: fmt, money: money, p: p, pItem: pItem, computeTripMult: computeTripMult, strollerPrice: strollerPrice,
    defaultState: defaultState, allH: allH, getH: getH,
    buildItems: buildItems, buildItemsRaw: buildItemsRaw, dealSavings: dealSavings,
    calcCats: calcCats, totals: totals, sections: sections, CATS: CATS,
    isPeakDate: isPeakDate, addDays: addDays, fmtDate: fmtDate, fmtShort: fmtShort,
    timeline: timeline, timelineStatus: timelineStatus, inflationNote: inflationNote,
  };
})();
