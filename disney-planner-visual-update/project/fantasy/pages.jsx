/* ============================================================
   fantasy/pages.jsx — Park + Hotel detail pages (Starlight theme)
   ============================================================ */
(function () {
  var React = window.React;
  var h = React.createElement;

  function Back(props) { return h('button', { className: 'fy-back', onClick: props.onClick }, '← Back to planner'); }

  /* ---------------- PARK PAGE ---------------- */
  function ParkPage(props) {
    var p = window.parks.filter(function (x) { return x.id === props.id; })[0];
    if (!p) return null;
    return h('div', { className: 'fy-wrap fy-rise' },
      h(Back, { onClick: props.onBack }),
      p.img
        ? h('div', { className: 'fy-detailhero' }, h('img', { src: 'images/' + p.img, alt: p.name }),
            h('div', { className: 'fy-detailhero-body', style: { background: 'linear-gradient(transparent 30%, ' + p.hbg + 'dd)' } },
              h('h2', null, p.name), h('p', null, p.tag)))
        : h('div', { className: 'fy-detailhero', style: { background: p.hbg, height: 'auto', padding: '28px 30px' } }, h('h2', { style: { color: p.htxt } }, p.name), h('p', { style: { color: p.htxt } }, p.tag)),
      h('div', { className: 'fy-note-info' }, p.age),
      p.coming ? h('div', { className: 'fy-note-amber' }, h('b', null, 'Coming attractions: '), p.coming) : null,
      p.festivals ? h('div', null,
        h('div', { className: 'fy-subsec' }, 'Seasonal festivals'),
        h('div', { className: 'fy-twocol' }, p.festivals.map(function (f, i) {
          return h('div', { key: i, className: 'fy-box', style: { borderLeft: '3px solid ' + f.color } },
            h('div', { style: { fontSize: 'calc(11px * var(--fz))', color: 'var(--fy-ink3)', fontWeight: 700 } }, f.months),
            h('div', { style: { fontWeight: 800, color: 'var(--fy-ink)', margin: '3px 0 5px' } }, f.name),
            h('div', { style: { fontSize: 'calc(12.5px * var(--fz))', color: 'var(--fy-ink2)', lineHeight: 1.5 } }, f.nt));
        }))
      ) : null,
      h('div', { className: 'fy-subsec' }, 'Day & night plan'),
      h('div', { className: 'fy-twocol' },
        h('div', { className: 'fy-box' }, h('h4', null, '☀ Day plan'), h('ul', null, p.day.map(function (d, i) { return h('li', { key: i }, d); }))),
        h('div', { className: 'fy-box' }, h('h4', null, '✦ Night highlights'), h('ul', null, p.night.map(function (n, i) { return h('li', { key: i }, n); })))
      ),
      h('div', { className: 'fy-subsec' }, 'Rides she can do'),
      h('div', { className: 'fy-hint', style: { marginBottom: 8 } }, 'All rides below have no height requirement — or 32", which she should clear at almost 4.'),
      h('div', { className: 'fy-card', style: { padding: '6px 20px' } }, p.rAll.map(function (r, i) {
        return h('div', { key: i, className: 'fy-tl-row' }, h('b', null, r.n), h('p', null, r.nt));
      })),
      h('div', { className: 'fy-divider' }),
      h('div', { className: 'fy-subsec' }, 'Food'),
      h('div', { className: 'fy-hint', style: { marginBottom: 8 } }, 'Estimated for family of 4 · 2029 projected from 2026.'),
      h('div', { className: 'fy-twocol' },
        h('div', null, h('div', { className: 'fy-microlabel', style: { marginBottom: 8 } }, 'Must-try snacks'), h('div', { className: 'fy-card', style: { padding: '6px 18px' } }, p.snacks.map(function (s, i) {
          return h('div', { key: i, className: 'fy-tl-row' }, h('b', null, s.n + ' '), h('span', { style: { color: 'var(--fy-gold)', fontWeight: 700, fontSize: 'calc(12px * var(--fz))' } }, s.p), s.w ? h('p', { style: { color: 'var(--fy-cyan)' } }, s.w) : null, h('p', null, s.nt));
        }))),
        h('div', null, h('div', { className: 'fy-microlabel', style: { marginBottom: 8 } }, 'Restaurants (est. for 4)'), h('div', { className: 'fy-card', style: { padding: '6px 18px' } }, p.rests.map(function (r, i) {
          return h('div', { key: i, className: 'fy-tl-row' }, h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 7 } }, h('b', null, r.n), h('span', { className: 'fy-tag ' + (r.t === 'qs' ? 'fr' : 'sp') }, r.t === 'qs' ? 'Quick service' : 'Table service'), h('span', { style: { color: 'var(--fy-gold)', fontWeight: 700, fontSize: 'calc(12px * var(--fz))' } }, r.p + ' for 4')), h('p', null, r.nt));
        })))
      ),
      h('div', { className: 'fy-divider' }),
      h('div', { className: 'fy-subsec' }, 'Shops'),
      h('div', { className: 'fy-card', style: { padding: '6px 20px' } }, p.shops.map(function (s, i) {
        if (s.section) return h('div', { key: i, className: 'fy-microlabel', style: { color: 'var(--fy-gold)', margin: '12px 0 4px', paddingTop: i ? 10 : 0, borderTop: i ? '1px solid var(--fy-stroke)' : 'none' } }, s.section);
        return h('div', { key: i, className: 'fy-tl-row' }, h('b', null, s.n), h('p', null, s.nt));
      })),
      h('div', { style: { height: 40 } })
    );
  }

  /* ---------------- HOTEL PAGE ---------------- */
  function HotelPage(props) {
    var d = window.hotelDetails[props.id];
    var htl = window.PlannerEngine.allH().filter(function (x) { return x.key === props.id; })[0];
    if (!d) return h('div', { className: 'fy-wrap' }, h(Back, { onClick: props.onBack }), h('p', null, 'Details coming soon.'));
    return h('div', { className: 'fy-wrap fy-rise' },
      h(Back, { onClick: props.onBack }),
      d.img
        ? h('div', { className: 'fy-detailhero' }, h('img', { src: 'images/' + d.img, alt: d.name }),
            h('div', { className: 'fy-detailhero-body', style: { background: 'linear-gradient(transparent 30%, ' + d.color + 'dd)' } }, h('h2', null, d.name), h('p', null, d.tagline)))
        : h('div', { className: 'fy-detailhero', style: { background: d.color, height: 'auto', padding: '28px 30px' } }, h('h2', null, d.name), h('p', null, d.tagline)),
      h('div', { className: 'fy-note-info', style: { background: 'rgba(127,110,200,.08)', color: 'var(--fy-ink2)', borderColor: 'var(--fy-stroke)' } }, d.overview),
      h('div', { className: 'fy-subsec' }, 'Connecting rooms', d.connecting === 'best' ? h('span', { className: 'fy-hbadge best', style: { marginLeft: 8, verticalAlign: 'middle' } }, 'Best bet') : null),
      h('div', { style: { fontSize: 'calc(13px * var(--fz))', color: 'var(--fy-ink2)', lineHeight: 1.55, marginBottom: 10 } }, d.connectingNote),
      htl && htl.eeh ? h('div', { className: 'fy-note-info' }, '✓ Includes Extended Evening Hours — 2 extra hours in select parks after close, with far smaller crowds. Disney-owned deluxe resorts only.') : h('div', { className: 'fy-note-amber' }, '✗ No Extended Evening Hours (a perk exclusive to Disney-owned deluxe resorts).'),
      h('div', { className: 'fy-note-info', style: { background: 'rgba(127,230,255,.06)' } }, 'Disney hotel reservations: ', h('b', null, '(407) 939-5277'), ' · Book both rooms first, then call to link & request connecting · Ask again at check-in.'),
      d.villas ? h('div', null, h('div', { className: 'fy-subsec' }, 'DVC villas option'), h('div', { style: { fontWeight: 700, color: 'var(--fy-violet)', marginBottom: 4 } }, d.villas), h('div', { style: { fontSize: 'calc(13px * var(--fz))', color: 'var(--fy-ink2)', lineHeight: 1.5 } }, d.villaNote)) : null,
      h('div', { className: 'fy-divider' }),
      h('div', { className: 'fy-twocol' },
        h('div', null,
          h('div', { className: 'fy-subsec', style: { marginTop: 0 } }, 'Room types — Dec 2025 rates'),
          h('div', { className: 'fy-hint', style: { marginBottom: 8 } }, 'Dec 1–14 rack rates · 2029 est. at ~7%/yr inflation.'),
          h('div', { className: 'fy-card', style: { padding: '4px 16px' } }, d.rooms.map(function (r, i) { return h('div', { key: i, className: 'fy-tl-row', style: { fontSize: 'calc(12.5px * var(--fz))', color: 'var(--fy-ink2)', lineHeight: 1.5 } }, r); })),
          d.suites && d.suites.length ? h('div', null, h('div', { className: 'fy-subsec' }, 'Suites & large-group options'), d.suites.map(function (s, i) {
            return h('div', { key: i, className: 'fy-card', style: { padding: '12px 16px', marginBottom: 8 } },
              h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 6 } }, h('b', { style: { fontSize: 'calc(14px * var(--fz))' } }, s.n), h('span', { className: 'fy-tag sp' }, 'Sleeps ' + s.sleeps)),
              h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 12, margin: '5px 0' } }, h('span', { style: { fontSize: 'calc(12px * var(--fz))', color: 'var(--fy-gold)', fontWeight: 700 } }, 'Dec 2025: ' + s.dec25), h('span', { style: { fontSize: 'calc(12px * var(--fz))', color: 'var(--fy-ink3)' } }, '2029 est: ' + s.dec29)),
              h('div', { style: { fontSize: 'calc(12.5px * var(--fz))', color: 'var(--fy-ink2)', lineHeight: 1.5 } }, s.note));
          })) : null
        ),
        h('div', null,
          h('div', { className: 'fy-subsec', style: { marginTop: 0 } }, 'Pool'),
          h('div', { style: { fontSize: 'calc(13px * var(--fz))', color: 'var(--fy-ink2)', lineHeight: 1.55, marginBottom: 14 } }, d.pool),
          h('div', { className: 'fy-subsec' }, 'Getting to the parks'),
          h('div', { style: { fontSize: 'calc(13px * var(--fz))', color: 'var(--fy-ink2)', lineHeight: 1.55 } }, d.transport)
        )
      ),
      h('div', { className: 'fy-divider' }),
      h('div', { className: 'fy-subsec' }, 'Insider tips'),
      h('div', { className: 'fy-box' }, h('ul', null, d.tips.map(function (t, i) { return h('li', { key: i }, t); }))),
      h('div', { style: { height: 40 } })
    );
  }

  Object.assign(window, { FY_ParkPage: ParkPage, FY_HotelPage: HotelPage });
})();
