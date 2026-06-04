/* ============================================================
   fantasy/budget.jsx — the interactive cost breakdown
   ============================================================ */
(function () {
  var React = window.React;
  var h = React.createElement;
  var E = window.PlannerEngine;
  var money = function (n) { return '$' + Math.round(n).toLocaleString(); };
  var fmt = function (n) { return n === 0 ? 'Free' : money(n); };

  function Bar(props) {
    var cats = props.totals.cats, total = props.totals.total;
    return h(React.Fragment, null,
      h('div', { className: 'fy-bar' }, E.CATS.map(function (c) {
        var w = total > 0 ? (cats[c.k] / total * 100) : 0;
        return h('div', { key: c.k, className: 'fy-bar-seg', style: { width: w + '%', background: c.color, color: c.color } });
      })),
      h('div', { className: 'fy-legend' }, E.CATS.map(function (c) {
        return h('span', { key: c.k }, h('span', { className: 'fy-dot', style: { background: c.color, color: c.color } }), c.label);
      }))
    );
  }

  function LineItem(props) {
    var i = props.item, st = props.st;
    var badges = [];
    if (i.special) badges.push(h('span', { key: 'sp', className: 'fy-tag sp' }, 'Special'));
    if (i.adults) badges.push(h('span', { key: 'ad', className: 'fy-tag ad' }, 'Adults only'));
    if (i.free) badges.push(h('span', { key: 'fr', className: 'fy-tag fr' }, 'Free'));
    return h('div', { className: 'fy-li' },
      h('div', { style: { flex: 1 } },
        h('div', { className: 'fy-li-label' }, h('span', { className: 'fy-dot', style: { background: i.color, color: i.color } }), i.label, badges),
        h('div', { className: 'fy-li-note' }, i.note),
        i.hotelNote ? h('div', { className: 'fy-tip' }, '✦ Hotel tip: ' + i.hotelNote) : null,
        i.warn ? h('div', { className: 'fy-warn' }, '⚠ ' + i.warn) : null
      ),
      h('div', { className: 'fy-li-val' + (i.free ? ' free' : '') }, fmt(E.p(i[st.season], st.tripMult)))
    );
  }

  function Deals(props) {
    var pl = props.planner, st = pl.state, a = pl.actions;
    var sav = pl.d.dealSavings;
    var kefDisabled = st.activeDeal === 'dining';
    return h('div', null,
      h('div', { className: 'fy-sl' }, h('span', { className: 'spark' }, '✦'), 'Disney deals'),
      h('div', { style: { marginBottom: 8 } },
        h('div', { className: 'fy-microlabel', style: { marginBottom: 6 } }, 'Deal scenario — pick one'),
        h('div', { className: 'fy-rowwrap' },
          h('button', { className: 'fy-chip' + (st.activeDeal === null ? ' on' : ''), onClick: function () { a.setDeal(null); } }, 'No deal'),
          h('button', { className: 'fy-chip' + (st.activeDeal === 'room' ? ' on' : ''), onClick: function () { a.setDeal('room'); } }, 'Room discount (25% off hotel)'),
          h('button', { className: 'fy-chip' + (st.activeDeal === 'dining' ? ' on' : ''), onClick: function () { a.setDeal('dining'); } }, 'Free dining')
        )
      ),
      h('div', { className: 'fy-rowwrap', style: { marginTop: 8 } },
        h('button', { className: 'fy-chip' + (st.kidsEatFree && !kefDisabled ? ' on' : ''), style: kefDisabled ? { opacity: .4, pointerEvents: 'none' } : null, onClick: function () { a.toggleKEF(); } }, 'Kids eat free'),
        h('span', { className: 'fy-hint' }, 'Free dining plan for ages 3–9 · stackable with room discount' + (kefDisabled ? ' · superseded by free dining' : ''))
      ),
      (st.activeDeal || st.kidsEatFree) && sav > 0 ? h('div', { style: { fontSize: 'calc(13px * var(--fz))', color: 'var(--fy-cyan)', background: 'rgba(127,230,255,.1)', border: '1px solid rgba(127,230,255,.2)', borderRadius: 12, padding: '8px 13px', marginTop: 10, fontWeight: 700 } }, '✨ Estimated savings with this scenario: ' + money(sav)) : null,
      h('div', { className: 'fy-hint', style: { marginTop: 8 } }, 'Deals are typically announced 4–6 months before travel · scenarios, not guarantees.')
    );
  }

  function TravelPicker(props) {
    var pl = props.planner, st = pl.state, a = pl.actions;
    return h('div', { style: { padding: '4px 0 6px' } },
      h('div', { className: 'fy-rowwrap' },
        h('span', { className: 'fy-microlabel' }, 'How are you getting there?'),
        h('button', { className: 'fy-chip' + (st.travelMode === 'fly' ? ' on' : ''), onClick: function () { a.setTravel('fly'); } }, 'Fly from Atlanta'),
        h('button', { className: 'fy-chip' + (st.travelMode === 'drive' ? ' on' : ''), onClick: function () { a.setTravel('drive'); } }, 'Drive from Marietta')
      ),
      h('div', { className: 'fy-hint', style: { marginTop: 6 } }, st.travelMode === 'drive' ? '6–7 hrs each way · I-75 S then Florida Turnpike · free resort parking · saves ~$1,000+ vs flying' : 'ATL→MCO · ~2 hr flight · Mears Connect shuttle to resort')
    );
  }

  function SpecialPicker(props) {
    var pl = props.planner, st = pl.state, a = pl.actions;
    var activeDaytime = st.activeDaytime || [];
    return h('div', { style: { padding: '4px 0 8px' } },
      h('div', { style: { marginBottom: 10 } },
        h('div', { className: 'fy-microlabel', style: { marginBottom: 6 } }, 'Daytime experiences — pick up to three'),
        h('div', { className: 'fy-rowwrap' },
          h('button', { className: 'fy-chip' + (activeDaytime.length === 0 ? ' on' : ''), onClick: function () { a.clearDT(); } }, 'None'),
          Object.keys(window.daytimeDNs).map(function (k) {
            return h('button', { key: k, className: 'fy-chip gold' + (activeDaytime.indexOf(k) !== -1 ? ' on' : ''), onClick: function () { a.selDT(k); } }, window.daytimeDNs[k].l);
          })
        )
      ),
      h('div', { style: { marginBottom: 10 } },
        h('div', { className: 'fy-microlabel', style: { marginBottom: 6 } }, 'Fireworks experiences — pick up to two'),
        h('div', { className: 'fy-rowwrap' },
          h('button', { className: 'fy-chip' + (st.activeFireworks.length === 0 ? ' on' : ''), onClick: function () { a.clearFW(); } }, 'None'),
          Object.keys(window.fireworksDNs).map(function (k) {
            return h('button', { key: k, className: 'fy-chip gold' + (st.activeFireworks.indexOf(k) !== -1 ? ' on' : ''), onClick: function () { a.selFW(k); } }, window.fireworksDNs[k].l);
          })
        )
      ),
      h('div', null,
        h('div', { className: 'fy-microlabel', style: { marginBottom: 6 } }, 'Evening experience — pick one'),
        h('div', { className: 'fy-rowwrap' }, Object.keys(window.eveningDNs).map(function (k) {
          var v = window.eveningDNs[k];
          return h('button', { key: k, className: 'fy-chip' + (st.activeEvening === k ? ' on' : ''), onClick: function () { a.selEV(k); } }, v.l + (v.free ? ' (free)' : ''));
        }))
      )
    );
  }

  function MiscPicker(props) {
    var pl = props.planner, st = pl.state, a = pl.actions;
    function row(label, on, toggle, hint) {
      return h('div', { className: 'fy-rowwrap', style: { marginBottom: 6 } },
        h('span', { className: 'fy-microlabel' }, label),
        h('button', { className: 'fy-chip' + (on ? ' on' : ''), onClick: toggle }, on ? 'Included' : 'Add'),
        h('span', { className: 'fy-hint' }, hint)
      );
    }
    return h('div', { style: { padding: '4px 0 4px' } },
      row('Memory Maker', st.wantMemMaker, a.toggleMemMaker, '~$230 · unlimited PhotoPass downloads + ride photos'),
      row('Stroller rental', st.wantStroller, a.toggleStroller, '~$260 · Kingdom Strollers · delivered to hotel · 4 park days'),
      row('MagicBand+', st.wantBands, a.toggleBands, '~$210 · lights up during Happily Ever After, Luminous & Fantasmic!')
    );
  }

  function BudgetBreakdown(props) {
    var pl = props.planner, st = pl.state;
    var secs = pl.d.sections;
    return h('div', { className: 'fy-card' },
      h('div', { style: { fontWeight: 800, fontSize: 'calc(14px * var(--fz))', marginBottom: 14, color: 'var(--fy-gold)' } }, '✦ Cost breakdown'),
      h(Bar, { totals: pl.d.totals }),
      h(Deals, { planner: pl }),
      secs.map(function (sec) {
        var picker = null;
        if (sec.key === 'travel') picker = h(TravelPicker, { planner: pl });
        if (sec.key === 'special') picker = h(SpecialPicker, { planner: pl });
        if (sec.key === 'misc') picker = h(MiscPicker, { planner: pl });
        var subtotal = sec.items.length > 1 ? Math.round(sec.items.reduce(function (acc, it) { return acc + E.p(it[st.season], st.tripMult); }, 0)) : null;
        return h('div', { key: sec.key },
          h('div', { className: 'fy-sl' }, h('span', { className: 'spark' }, '✦'), sec.h),
          picker,
          sec.items.map(function (it, i) { return h(LineItem, { key: i, item: it, st: st }); }),
          subtotal != null ? h('div', { className: 'fy-subtotal' }, h('span', null, 'subtotal'), h('span', { style: { color: 'var(--fy-gold)' } }, money(subtotal))) : null
        );
      })
    );
  }

  window.FY_BudgetBreakdown = BudgetBreakdown;
})();
