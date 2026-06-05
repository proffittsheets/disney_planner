/* ============================================================
   fantasy/ui.jsx — main-page UI building blocks (Starlight theme)
   Consumes the planner object from usePlanner(). Exports to window.
   ============================================================ */
(function () {
  var React = window.React;
  var h = React.createElement;
  var E = window.PlannerEngine;
  var CountUp = window.CountUp;
  var money = function (n) { return '$' + Math.round(n).toLocaleString(); };

  function SL(props) { // section label with sparkle
    return h('div', { className: 'fy-sl' }, h('span', { className: 'spark' }, '✦'), props.children);
  }

  function Chip(props) {
    return h('button', { className: 'fy-chip' + (props.on ? ' on' : '') + (props.gold ? ' gold' : ''), onClick: props.onClick, style: props.style }, props.children);
  }

  /* ---------- METRICS ---------- */
  function Metrics(props) {
    var t = props.planner.d.totals, st = props.planner.state, note = props.planner.d.inflationNote;
    var cards = [
      { l: 'Estimated total', v: t.total, hero: true, foot: note },
      { l: 'Per person', v: t.perPerson, foot: 'party of 4' },
      { l: 'Hotel · ' + st.nights + ' night' + (st.nights === 1 ? '' : 's'), v: t.hotel, foot: props.planner.d.hotel.name },
      { l: 'Special events', v: t.special, foot: (function () { var p = []; var dt = (st.activeDaytime || []).length; if (dt > 0) p.push(dt + ' daytime'); p.push(st.activeFireworks.length + ' fireworks'); p.push(st.activeEvening !== 'none' ? '1 evening' : 'no evening'); return p.join(' · '); })() },
    ];
    return h('div', { className: 'fy-metrics' }, cards.map(function (c, i) {
      return h('div', { key: i, className: 'fy-metric' + (c.hero ? ' hero-metric' : '') },
        h('div', { className: 'fy-metric-l' }, c.l),
        h(CountUp, { tag: 'div', className: 'fy-metric-v', value: c.v, format: function (n) { return money(n); } }),
        h('div', { className: 'fy-metric-foot' }, c.foot)
      );
    }));
  }

  /* ---------- CONTROL BAR ---------- */
  function ControlBar(props) {
    var pl = props.planner, st = pl.state, a = pl.actions;
    return h('div', { className: 'fy-card', style: { marginBottom: 14, display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center', justifyContent: 'space-between' } },
      h('div', { className: 'fy-hint', style: { maxWidth: 230 } }, 'Choose a hotel and your date-night magic — the budget re-casts its spell instantly.'),
      h('div', { className: 'fy-rowwrap', style: { gap: 18 } },
        h('div', { className: 'fy-rowwrap' },
          h('span', { className: 'fy-microlabel' }, 'Nights'),
          h('div', { className: 'fy-stepper' },
            h('button', { className: 'fy-stepbtn', onClick: function () { a.changeNights(-1); } }, '−'),
            h('span', { className: 'fy-stepval' }, st.nights),
            h('button', { className: 'fy-stepbtn', onClick: function () { a.changeNights(1); } }, '+')
          )
        ),
        h('div', { className: 'fy-rowwrap' },
          h('span', { className: 'fy-microlabel' }, 'Inflation'),
          h('input', { type: 'range', className: 'fy-range', min: 1, max: 10, step: 1, value: Math.round(st.inflRate * 100), onChange: function (e) { a.setInflRate(e.target.value); } }),
          h('span', { style: { fontWeight: 800, fontSize: 'calc(13px * var(--fz))', color: 'var(--fy-gold)' } }, Math.round(st.inflRate * 100) + '%/yr')
        )
      ),
      h('div', { className: 'fy-rowwrap' },
        h(Chip, { on: st.season === 'off', onClick: function () { a.setSeason('off'); } }, 'Off-peak'),
        h(Chip, { on: st.season === 'peak', onClick: function () { a.setSeason('peak'); } }, 'Peak season')
      )
    );
  }

  /* ---------- RESERVATIONS CARD ---------- */
  function Reservations() {
    var rows = [
      ['Hotel reservations', '(407) 934-7639'],
      ['Walt Disney World', '(407) 939-5277'],
      ['Dining reservations', '(407) 939-3463'],
    ];
    return h('div', { className: 'fy-card', style: { marginBottom: 8 } },
      h('div', { style: { fontWeight: 800, fontSize: 'calc(13px * var(--fz))', marginBottom: 10, color: 'var(--fy-gold)' } }, '☎  Disney reservations'),
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '14px 32px' } }, rows.map(function (r, i) {
        return h('div', { key: i, style: { minWidth: 130 } }, h('div', { style: { fontSize: 'calc(11px * var(--fz))', color: 'var(--fy-ink3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' } }, r[0]), h('div', { style: { fontSize: 'calc(16px * var(--fz))', fontWeight: 800, color: 'var(--fy-ink)', fontFamily: 'var(--fy-display)', marginTop: 3 } }, r[1]));
      })),
      h('div', { className: 'fy-hint', style: { marginTop: 10 } }, 'For connecting rooms, book both rooms first, then call (407) 939-5277 to link them. Not guaranteed — ask again at check-in.')
    );
  }

  /* ---------- BOOKING TIMELINE ---------- */
  function StatusPill(props) { var s = props.s; return h('span', { className: 'fy-status ' + s.tone }, s.label); }
  function BookingTimeline(props) {
    var pl = props.planner, st = pl.state;
    var _open = React.useState(false); var open = _open[0], setOpen = _open[1];
    React.useEffect(function () { if (st.tripDate) setOpen(true); }, [st.tripDate ? st.tripDate.getTime() : 0]);
    var tl = pl.d.timeline;
    var dateStr = st.tripDate ? st.tripDate.toISOString().slice(0, 10) : '';
    return h('div', { className: 'fy-card', style: { padding: 0, overflow: 'hidden' } },
      h('div', { style: { padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 } },
        h('div', { className: 'fy-rowwrap', style: { gap: 14, flex: 1 } },
          h('div', null,
            h('div', { style: { fontSize: 'calc(11px * var(--fz))', color: 'var(--fy-ink3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 } }, 'Check-in date'),
            h('input', { type: 'date', className: 'fy-date', value: dateStr, onChange: function (e) { pl.actions.setTripDate(e.target.value); } })
          ),
          tl ? h('div', { style: { fontSize: 'calc(12px * var(--fz))', color: 'var(--fy-ink2)', fontWeight: 600 } }, tl.summary) : h('div', { className: 'fy-hint' }, 'Enter your check-in date for a personalised booking spellbook')
        ),
        h('button', { style: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }, onClick: function () { setOpen(!open); } },
          h('span', { className: 'fy-caret' + (open ? ' open' : '') }, '▼')
        )
      ),
      open ? h('div', { style: { padding: '0 20px 18px' } },
        tl ? tl.sections.map(function (sec, i) {
          return h('div', { key: i, className: 'fy-tl-item', style: { borderLeftColor: sec.color } },
            h('div', { className: 'fy-tl-head' }, h('span', { className: 'fy-tl-label' }, sec.label), h(StatusPill, { s: E.timelineStatus(sec.date) })),
            sec.rows.map(function (r, j) { return h('div', { key: j, className: 'fy-tl-row' }, h('b', null, r[0]), h('p', null, r[1])); })
          );
        }) : h('div', { className: 'fy-hint' }, 'Enter your check-in date above to reveal your personalised booking dates.')
      ) : null
    );
  }

  /* ---------- HOTEL GRID ---------- */
  function HotelCard(props) {
    var pl = props.planner, st = pl.state, htl = props.h;
    var sel = st.sel === htl.key;
    var detail = window.hotelDetails[htl.key];
    var nightly = Math.round((E.p(htl[st.season], st.tripMult) / 5 + (sel && st.clubLevel && htl.club ? E.p(htl.club[st.season === 'off' ? 'offExtra' : 'peakExtra'], st.tripMult) : 0)) * st.nights);
    return h('div', { className: 'fy-hcard' + (sel ? ' sel' : ''), onClick: function () { pl.actions.selH(htl.key); } },
      (props.cardStyle === 'photo' && detail && detail.img)
        ? h('div', { className: 'fy-hphoto' }, h('img', { src: 'images/' + detail.img, alt: htl.name, loading: 'lazy' }), h('div', { className: 'fy-hphoto-veil' }))
        : (window.hotelSvgs[htl.key] ? h('div', { className: 'fy-hsvg', dangerouslySetInnerHTML: { __html: window.hotelSvgs[htl.key] } }) : null),
      h('div', { className: 'fy-hbody' },
        h('div', { className: 'fy-hname' }, htl.name),
        h('div', { className: 'fy-hprice' }, st.nights + ' night' + (st.nights === 1 ? '' : 's') + ' · ', h('b', null, money(nightly))),
        h('div', { className: 'fy-htags' }, htl.tl.map(function (l, i) { return h('span', { key: i, className: 'fy-htag' }, l); })),
        h('div', { className: 'fy-hnote' }, htl.note),
        h('div', { style: { display: 'flex', gap: 5, flexWrap: 'wrap' } },
          detail && detail.connecting === 'best' ? h('span', { className: 'fy-hbadge best' }, '✦ Best for connecting') : null,
          h('span', { className: 'fy-hbadge ' + (htl.eeh ? 'eeh' : 'noeeh') }, htl.eeh ? 'Extended Evening Hours' : 'No Extended Hours'),
          htl.assoc ? h('span', { className: 'fy-hbadge noeeh' }, 'Partner hotel') : null
        ),
        sel && htl.club ? h(ClubToggle, { planner: pl, h: htl }) : null,
        h('div', { className: 'fy-hlinks' },
          htl.url ? h('a', { className: 'fy-a', href: htl.url, target: '_blank', style: { fontSize: 'calc(11px * var(--fz))' }, onClick: function (e) { e.stopPropagation(); } }, 'View hotel ↗') : h('span'),
          h('button', { className: 'fy-hlink', onClick: function (e) { e.stopPropagation(); pl.navTo.hotel(htl.key); } }, 'Details →')
        )
      )
    );
  }
  function ClubToggle(props) {
    var pl = props.planner, st = pl.state, htl = props.h;
    var extra = htl.club[st.season === 'off' ? 'offExtra' : 'peakExtra'];
    return h('div', { style: { marginTop: 4, paddingTop: 10, borderTop: '1px solid var(--fy-stroke)' } },
      h('div', { className: 'fy-microlabel', style: { marginBottom: 6 } }, 'Room tier'),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
        h('button', { className: 'fy-chip' + (st.clubLevel ? '' : ' on'), style: { width: '100%', justifyContent: 'center', whiteSpace: 'normal', textAlign: 'center' }, onClick: function (e) { e.stopPropagation(); pl.actions.setClub(false); } }, 'Standard room'),
        h('button', { className: 'fy-chip gold' + (st.clubLevel ? ' on' : ''), style: { width: '100%', justifyContent: 'center', whiteSpace: 'normal', textAlign: 'center', lineHeight: 1.3 }, onClick: function (e) { e.stopPropagation(); pl.actions.setClub(true); } }, htl.club.name + ' · +$' + extra + '/nt')
      ),
      st.clubLevel ? h('div', { className: 'fy-tip', style: { marginTop: 7 } }, htl.club.perks) : null
    );
  }
  function HotelGrid(props) {
    var pl = props.planner, cs = props.cardStyle || 'photo';
    function setCs(v) { if (props.setCardStyle) props.setCardStyle(v); }
    return h(React.Fragment, null,
      h('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' } },
        h('div', { className: 'fy-sl', style: { flex: 1, minWidth: 180 } }, h('span', { className: 'spark' }, '✦'), 'Disney deluxe resorts'),
        h('div', { className: 'fy-rowwrap', style: { paddingBottom: 12 } },
          h('span', { className: 'fy-microlabel' }, 'Cards'),
          h('button', { className: 'fy-chip' + (cs === 'photo' ? ' on' : ''), onClick: function () { setCs('photo'); } }, 'Photos'),
          h('button', { className: 'fy-chip' + (cs === 'emblem' ? ' on' : ''), onClick: function () { setCs('emblem'); } }, 'Emblems')
        )
      ),
      h('div', { className: 'fy-hgrid' }, window.hotels.deluxe.map(function (hh) { return h(HotelCard, { key: hh.key, h: hh, planner: pl, cardStyle: cs }); })),
      h(SL, null, 'Disney-associated hotels'),
      h('div', { className: 'fy-hgrid' }, window.hotels.assoc.map(function (hh) { return h(HotelCard, { key: hh.key, h: hh, planner: pl, cardStyle: cs }); }))
    );
  }

  /* ---------- PARK NAV ---------- */
  function ParkNav(props) {
    var pl = props.planner;
    return h('div', { className: 'fy-parks' }, window.parks.map(function (p) {
      return h('div', { key: p.id, className: 'fy-parkcard', onClick: function () { pl.navTo.park(p.id); } },
        p.img ? h('img', { src: 'images/' + p.img, alt: p.name }) : null,
        h('div', { className: 'fy-parkcard-veil', style: { background: 'linear-gradient(transparent 25%, ' + p.hbg + 'ee)' } }),
        h('div', { className: 'fy-parkcard-body' },
          h('div', { className: 'fy-parkcard-name' }, p.name),
          h('div', { className: 'fy-parkcard-tag' }, p.tag),
          h('div', { className: 'fy-parkpills' }, p.pills.map(function (pl2, i) { return h('span', { key: i, className: 'fy-parkpill' }, pl2); }))
        )
      );
    }));
  }

  /* ---------- RESORT RESTAURANTS ---------- */
  function ResortRests() {
    var _o = React.useState(-1); var open = _o[0], setOpen = _o[1];
    return h('div', null, window.resortRests.map(function (area, ai) {
      var isOpen = open === ai;
      return h('div', { key: ai, className: 'fy-card', style: { padding: 0, marginBottom: 10, overflow: 'hidden', borderTop: '2px solid ' + area.color } },
        h('div', { className: 'fy-collapse-head', style: { padding: '15px 20px' }, onClick: function () { setOpen(isOpen ? -1 : ai); } },
          h('div', { style: { fontWeight: 800, fontSize: 'calc(14px * var(--fz))', color: 'var(--fy-ink)' } }, area.area),
          h('span', { className: 'fy-caret' + (isOpen ? ' open' : '') }, '▼')
        ),
        isOpen ? h('div', { style: { padding: '0 20px 16px' } }, area.hotels.map(function (htl, hi) {
          return h('div', { key: hi, style: { marginBottom: 14 } },
            h('div', { className: 'fy-subsec', style: { fontSize: 'calc(15px * var(--fz))', margin: '6px 0 6px' } }, htl.icon + ' ' + htl.name),
            htl.rests.map(function (r, ri) {
              return h('div', { key: ri, className: 'fy-tl-row' },
                h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 7 } },
                  h('b', null, r.n),
                  h('span', { className: 'fy-tag ' + (r.t === 'qs' ? 'fr' : 'sp') }, r.t === 'qs' ? 'Quick service' : 'Table service'),
                  h('span', { style: { fontSize: 'calc(12px * var(--fz))', color: 'var(--fy-gold)', fontWeight: 700 } }, r.p),
                  r.michelin ? h('span', { className: 'fy-tag sp' }, '★ Michelin Star') : (r.michelinRec ? h('span', { className: 'fy-tag ad' }, 'Michelin Rec') : null)
                ),
                h('p', { style: { fontSize: 'calc(12px * var(--fz))', color: 'var(--fy-ink3)', marginTop: 3, lineHeight: 1.5 } }, r.nt),
                r.special ? h('div', { className: 'fy-tip' }, '✦ ' + r.special) : null,
                r.warn ? h('div', { className: 'fy-warn' }, '⚠ ' + r.warn) : null
              );
            })
          );
        })) : null
      );
    }));
  }

  Object.assign(window, { FY_SL: SL, FY_Chip: Chip, FY_Metrics: Metrics, FY_ControlBar: ControlBar, FY_Reservations: Reservations, FY_BookingTimeline: BookingTimeline, FY_HotelGrid: HotelGrid, FY_ParkNav: ParkNav, FY_ResortRests: ResortRests });
})();
