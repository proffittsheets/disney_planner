var sel='beachclub',activeFireworks='pontoon',activeEvening='pandora',season='off',nights=5,wantBands=true,clubLevel=false,wantMemMaker=true,wantStroller=false,tripDate=null,travelMode='fly',tripMult=1.0,inflYears=3,inflRate=0.05,timelineEverOpened=false;
function gi(id){return document.getElementById(id)}
function fmt(n){if(n===0)return'Free';return'$'+Math.round(n).toLocaleString()}
function p(n){return Math.round(n*tripMult);}
function allH(){return hotels.deluxe.concat(hotels.assoc)}
function getH(){return allH().filter(function(h){return h.key===sel})[0]}
function buildItems(){
  var h=getH(),items=fi.slice();
  var fw=fireworksDNs[activeFireworks],ev=eveningDNs[activeEvening];
  if(activeFireworks!=='none') items.push({bk:'special',label:fw.l,note:fw.note,hotelNote:fw.hotel,color:'#E8B84B',off:fw.off,peak:fw.peak,special:true,adults:true,isFW:true,free:fw.free});
  if(activeEvening!=='none') items.push({bk:'special',label:ev.l,note:ev.note,hotelNote:ev.hotel,color:'#00B4D8',off:ev.off,peak:ev.peak,special:true,adults:true,isEV:true,free:ev.free});
  var hRate=Math.round(p(h[season])/5);
  var clubExtra=clubLevel&&h.club?Math.round(p(h.club[season==='off'?'offExtra':'peakExtra'])):0;
  items.push({bk:'hotel',label:h.name+(clubLevel&&h.club?' — '+h.club.name:''),note:h.note+' · '+nights+' night'+(nights===1?'':'s')+(clubLevel&&h.club?' · '+h.club.perks:''),color:'#023E8A',off:(hRate+clubExtra)*nights,peak:(hRate+clubExtra)*nights,isHotel:true});
  return items.filter(function(i){
    if(i.isFly&&travelMode==='drive') return false;
    if(i.isDrive&&travelMode==='fly') return false;
    if(i.isMemMaker&&!wantMemMaker) return false;
    if(i.isStroller&&!wantStroller) return false;
    if(i.isBand&&!wantBands) return false;
    return true;
  });
}
function calcCats(){
  var s=season,cats={flights:0,hotel:0,park:0,dining:0,special:0,transport:0,misc:0};
  buildItems().forEach(function(i){cats[i.bk]+=p(i[s])});
  return cats;
}

function renderHotels(){
  ['deluxe','assoc'].forEach(function(type){
    var key=type==='deluxe'?'gd':'ga';
    gi(key).innerHTML=hotels[type].map(function(h){
      var svg=hotelSvgs[h.key]?'<div class="hsvg">'+hotelSvgs[h.key]+'</div>':'';
      var d=hotelDetails[h.key];
      var connectBadge=d&&d.connecting==='best'?'<span style="font-size:9px;padding:1px 5px;border-radius:8px;background:#F5F0CC;color:#5C4A00;display:inline-block;margin-top:3px">Best bet — connecting rooms</span>':'';
      var eehBadge=h.eeh?'<span style="font-size:9px;padding:1px 5px;border-radius:8px;background:var(--bgs);color:var(--ts);display:inline-block;margin-top:3px">Extended Evening Hours</span>':'<span style="font-size:9px;padding:1px 5px;border-radius:8px;background:var(--bg2);color:var(--t3);display:inline-block;margin-top:3px">No Extended Evening Hours</span>';
      var isSelected=sel===h.key;
      var clubToggle='';
      if(isSelected&&h.club){
        var extraPerNight=h.club[season==='off'?'offExtra':'peakExtra'];
        clubToggle='<div style="margin-top:6px;padding-top:6px;border-top:.5px solid rgba(100,87,166,0.2)">'
          +'<div style="font-size:9px;color:var(--ti);text-transform:uppercase;letter-spacing:.06em;font-weight:500;margin-bottom:4px">Room tier</div>'
          +'<div style="display:flex;gap:4px">'
          +'<button onclick="event.stopPropagation();setClub(false)" style="flex:1;padding:4px 0;font-size:10px;border-radius:6px;cursor:pointer;font-family:var(--f);font-weight:'+(clubLevel?'400':'600')+';background:'+(clubLevel?'transparent':'var(--bi)')+';color:'+(clubLevel?'var(--t2)':'#fff')+';border:'+(clubLevel?'.5px solid var(--bmd)':'none')+'">Standard</button>'
          +'<button onclick="event.stopPropagation();setClub(true)" style="flex:1;padding:4px 0;font-size:10px;border-radius:6px;cursor:pointer;font-family:var(--f);font-weight:'+(clubLevel?'600':'400')+';background:'+(clubLevel?'var(--bi)':'transparent')+';color:'+(clubLevel?'#fff':'var(--t2)')+';border:'+(clubLevel?'none':'.5px solid var(--bmd)')+'">'+h.club.name+' <span style="opacity:.8">+$'+extraPerNight+'/nt</span></button>'
          +'</div>'
          +(clubLevel?'<div style="font-size:9px;color:var(--ti);margin-top:5px;line-height:1.4">'+h.club.perks+'</div>':'')
          +'</div>';
      }
      return'<div class="hc '+(isSelected?'sel':'')+'" onclick="selH(\''+h.key+'\')">'
        +svg
        +'<div class="hbody">'
        +'<div class="hn">'+h.name+'</div>'
        +'<div class="hp">'+nights+' night'+(nights===1?'':'s')+' <span>$'+Math.round((p(h[season])/5+(isSelected&&clubLevel&&h.club?p(h.club[season==='off'?'offExtra':'peakExtra']):0))*nights).toLocaleString()+'</span></div>'
        +'<div class="tbr">'+h.tl.map(function(l,i){return'<span class="tb '+h.trans[i]+'">'+l+'</span>'}).join('')+'</div>'
        +'<div class="hnt">'+h.note+'</div>'
        +connectBadge+eehBadge
        +(h.assoc?'<span class="atag">Partner hotel</span>':'')
        +clubToggle
        +'<div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">'
        +(h.url?'<a href="'+h.url+'" target="_blank" style="font-size:10px;color:var(--ti);text-decoration:none">View hotel ↗</a>':'<span></span>')
        +'<button onclick="event.stopPropagation();openHotel(\''+h.key+'\')" style="font-size:10px;color:var(--ti);background:none;border:none;cursor:pointer;font-family:var(--f);padding:0">Details →</button>'
        +'</div>'
        +'</div></div>';
    }).join('');
  });
}
function renderBudget(){
  var s=season,cats=calcCats(),total=Object.values(cats).reduce(function(a,b){return a+b},0);
  var spTot=buildItems().filter(function(i){return i.special}).reduce(function(a,i){return a+i[s]},0);
  gi('m-total').textContent='$'+Math.round(total).toLocaleString();
  gi('m-pp').textContent='$'+Math.round(total/4).toLocaleString();
  gi('m-hotel').textContent='$'+Math.round(cats.hotel).toLocaleString();
  gi('m-hotel-lbl').textContent='hotel ('+nights+' night'+(nights===1?'':'s')+')';
  gi('sb-total').textContent='$'+Math.round(total).toLocaleString();
  gi('sb-pp').textContent='$'+Math.round(total/4).toLocaleString();
  gi('sb-hotel').textContent='$'+Math.round(cats.hotel).toLocaleString();
  gi('sb-hotel-lbl').textContent='hotel ('+nights+' night'+(nights===1?'':'s')+')';
  gi('sb-special').textContent='$'+Math.round(spTot).toLocaleString();
  var inflEl=gi('m-infl-note');
  if(inflEl){var pct=Math.round((Math.pow(1+inflRate,inflYears)-1)*100);var basePct=Math.round((Math.pow(1+inflRate,3)-1)*100);inflEl.textContent=tripDate?'Prices adjusted for '+tripDate.getFullYear()+' (+'+pct+'% from 2026 · '+Math.round(inflRate*100)+'%/yr)':'2029 baseline (+'+basePct+'% from 2026 · '+Math.round(inflRate*100)+'%/yr)';};
  gi('m-special').textContent='$'+Math.round(spTot).toLocaleString();
  var colors={flights:'#023E8A',hotel:'#03045E',park:'#0077B6',dining:'#00B4D8',special:'#E8B84B',transport:'#48CAE4',misc:'#90E0EF'};
  gi('bar').innerHTML=Object.keys(cats).map(function(k){
    return'<div class="bs" style="background:'+colors[k]+';width:'+(total>0?(cats[k]/total*100).toFixed(1):0)+'%"></div>';
  }).join('');
  var secs=[
    {h:'Getting there',   items:buildItems().filter(function(i){return(i.bk==='flights'||i.bk==='transport')&&!i.isHotel&&!i.isDN}),isTravel:true},
    {h:'Staying there',   items:buildItems().filter(function(i){return i.isHotel})},
    {h:'The parks',       items:buildItems().filter(function(i){return i.bk==='park'})},
    {h:'Food & dining',   items:buildItems().filter(function(i){return i.bk==='dining'})},
    {h:'Special experiences',items:buildItems().filter(function(i){return i.special}),isDN:true},
    {h:'Everything else', items:buildItems().filter(function(i){return i.bk==='misc'}),isMisc:true},
  ];
  gi('lis').innerHTML=secs.map(function(sec){
    var picker='';
    if(sec.isDN){
      var fwBtns=Object.keys(fireworksDNs).map(function(k){var v=fireworksDNs[k];return'<button class="ob '+(activeFireworks===k?'on':'')+'" onclick="selFW(\''+k+'\')">'+v.l+'</button>';}).join('');
      var evBtns=Object.keys(eveningDNs).map(function(k){var v=eveningDNs[k];return'<button class="ob '+(activeEvening===k?'on':'')+'" onclick="selEV(\''+k+'\')">'+v.l+(v.free?' (free)':'')+'</button>';}).join('');
      picker='<div style="padding:6px 0 4px">'
        +'<div style="margin-bottom:6px"><span class="slb">Fireworks experience — pick one:</span><div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:3px">'+fwBtns+'</div></div>'
        +'<div><span class="slb">Evening experience — pick one:</span><div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:3px">'+evBtns+'</div></div>'
        +'</div>';
    }
    if(sec.isTravel){
      picker='<div style="padding:4px 0 4px"><div style="display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin-bottom:3px"><span class="slb">How are you getting there?</span>'
        +'<button class="ob '+(travelMode==='fly'?'on':'')+'" id="btn-fly">Fly from Atlanta</button>'
        +'<button class="ob '+(travelMode==='drive'?'on':'')+'" id="btn-drive">Drive from Marietta</button>'
        +(travelMode==='drive'?'<span style="font-size:10px;color:var(--t3)">→6–7 hrs each way · I-75 S then Florida Turnpike · free parking at Disney resort · saves ~$1,000+ vs flying</span>':'<span style="font-size:10px;color:var(--t3)">ATL→MCO · ~2 hr flight · Mears Connect shuttle to resort</span>')
        +'</div></div>';
    }
    if(sec.isMisc){
      picker='<div style="padding:4px 0 2px">'
        +'<div style="display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin-bottom:4px"><span class="slb">Memory Maker:</span><button class="ob '+(wantMemMaker?'on':'')+'" onclick="toggleMemMaker()">Include (~$230)</button><span style="font-size:10px;color:var(--t3)">Unlimited PhotoPass downloads for your whole stay · Ride photos included</span></div>'
        +'<div style="display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin-bottom:4px"><span class="slb">Stroller rental:</span><button class="ob '+(wantStroller?'on':'')+'" onclick="toggleStroller()">Include (~$260)</button><span style="font-size:10px;color:var(--t3)">Kingdom Strollers · ~$65/day · delivered to hotel · 4 park days</span></div>'
        +'<div style="display:flex;flex-wrap:wrap;align-items:center;gap:5px"><span class="slb">MagicBand+:</span><button class="ob '+(wantBands?'on':'')+'" onclick="toggleBands()">Include (~$210)</button><span style="font-size:10px;color:var(--t3)">Lights up during Happily Ever After, Luminous &amp; Fantasmic!</span></div>'
        +'</div>';
    }
    var rows=sec.items.map(function(item){
      var bdgs=(item.special?'<span class="bdg bsp">Special</span>':'')+(item.adults?'<span class="bdg bad">Adults only</span>':'')+(item.free?'<span class="bdg bfr">Free</span>':'');
      var htl=item.hotelNote?'<div class="lh" style="margin-left:15px">Hotel tip: '+item.hotelNote+'</div>':'';
      return'<div class="li" style="'+(item.sub?'padding-left:14px':'')+'"><div style="flex:1"><div style="font-size:13px;color:var(--t);display:flex;align-items:flex-start;gap:6px;flex-wrap:wrap"><span class="ld" style="background:'+item.color+'"></span><span>'+item.label+bdgs+'</span></div><div class="lnt" style="margin-left:15px">'+item.note+'</div>'+htl+'</div><div class="lv'+(item.free?' fr':'')+'">'+fmt(p(item[s]))+'</div></div>';
    }).join('');
    var sub=sec.items.length>1?'<div style="display:flex;justify-content:space-between;padding:5px 0 1px;font-size:11px;color:var(--t2)"><span>subtotal</span><span style="font-weight:500">$'+Math.round(sec.items.reduce(function(a,i){return a+p(i[s]);},0)).toLocaleString()+'</span></div>':'';
    return'<div class="sl" style="padding-top:8px">'+sec.h+'</div>'+picker+rows+sub;
  }).join('');
}
function renderParkNav(){
  gi('pk-nav').innerHTML=parks.map(function(p){
    var pills=p.pills.map(function(pl){return'<span class="pk-pill">'+pl+'</span>'}).join('');
    return'<div class="pk-nav" onclick="openPark(\''+p.id+'\')">'
      +'<div class="pk-nav-head" style="background:'+p.hbg+';color:'+p.htxt+'">'
      +'<div class="pk-nav-name">'+p.name+'</div>'
      +'<div class="pk-nav-tag">'+p.tag+'</div>'
      +'<div style="margin-top:6px">'+pills+'</div>'
      +'</div>'
      +'<div class="pk-nav-foot"><span>Rides · Food · Shops · Day plan</span><span style="font-size:13px;color:var(--t3)">&#8594;</span></div>'
      +'</div>';
  }).join('');
}
function buildShops(shops){
  return shops.map(function(s){
    if(s.section) return'<div class="sh-hdr">'+s.section+'</div>';
    return'<div class="sh-item"><div class="sh-name">'+s.n+'</div><div class="sh-nt">'+s.nt+'</div></div>';
  }).join('');
}
function buildParkPage(p){
  var rAll=p.rAll.map(function(r){return'<div class="ri-item"><span>'+r.n+'</span><div class="ri-sub">'+r.nt+'</div></div>'}).join('');
  var snacks=p.snacks.map(function(s){return'<div class="sn-item"><div class="sn-name">'+s.n+'<span class="sn-price">'+s.p+'</span></div>'+(s.w?'<div class="sn-where">'+s.w+'</div>':'')+'<div class="sn-nt">'+s.nt+'</div></div>'}).join('');
  var rests=p.rests.map(function(r){return'<div class="rt-item"><div><span style="font-weight:500">'+r.n+'</span><span class="rt-type '+(r.t==='qs'?'rqs':'rts')+'">'+(r.t==='qs'?'Quick service':'Table service')+'</span><span class="rt-price">'+r.p+' for 4</span></div><div class="sn-nt">'+r.nt+'</div></div>'}).join('');
  var shopsHtml=buildShops(p.shops);
  var dayLi=p.day.map(function(d){return'<li>'+d+'</li>'}).join('');
  var nightLi=p.night.map(function(n){return'<li>'+n+'</li>'}).join('');
  var comingHtml=p.coming?'<div class="coming-note"><strong>Coming attractions:</strong> '+p.coming+'</div>':'';
  var festivalsHtml='';
  if(p.festivals){
    festivalsHtml='<div class="sect">Seasonal festivals</div>'
      +'<div style="font-size:10px;color:var(--t3);margin-bottom:.5rem">EPCOT transforms completely during its four annual festivals — check your travel dates against this calendar</div>'
      +'<div class="fest-grid">'
      +p.festivals.map(function(f){
        return'<div class="fest-card" style="border-left-color:'+f.color+'">'
          +'<div class="fest-months">'+f.months+'</div>'
          +'<div class="fest-name">'+f.name+'</div>'
          +'<div class="fest-nt" style="margin-top:4px">'+f.nt+'</div>'
          +'</div>';
      }).join('')
      +'</div>';
  }
  var parkHeader=p.img
    ?'<div class="img-head"><img src="images/'+p.img+'" alt="'+p.name+'" class="img-head-photo"><div class="img-head-overlay" style="background:linear-gradient(transparent 30%,'+p.hbg+'dd)"><h2>'+p.name+'</h2><p>'+p.tag+'</p></div></div>'
    :'<div class="pk-head" style="background:'+p.hbg+';color:'+p.htxt+'"><h2>'+p.name+'</h2><p>'+p.tag+'</p></div>';
  return'<button class="pk-back" onclick="closePark()">&#8592; Back to planner</button>'
    +parkHeader
    +'<div class="age-note">'+p.age+'</div>'
    +(p.maps?'<div class="dv"></div>'
      +'<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;margin-bottom:.5rem">'
      +'<div style="font-size:11px;font-weight:500;color:var(--t)">Park map</div>'
      +'<div style="display:flex;gap:8px">'
      +'<a href="'+p.maps.official+'" target="_blank" style="font-size:10px;color:var(--ti);text-decoration:none;padding:3px 8px;border:.5px solid var(--bi);border-radius:var(--rm)">Map guide \u2197</a>'
      +'<a href="'+p.maps.pdf+'" target="_blank" style="font-size:10px;color:var(--ti);text-decoration:none;padding:3px 8px;border:.5px solid var(--bi);border-radius:var(--rm)">PDF / print \u2197</a>'
      +'</div></div>'
      +'<div style="border-radius:var(--rm);overflow:hidden;border:.5px solid var(--bm);margin-bottom:.75rem">'
      +'<iframe src="'+p.maps.gmaps+'" width="100%" height="260" style="border:0;display:block" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
      +'</div>'
      :'')
    +comingHtml
    +festivalsHtml
    +'<div class="sect">Day &amp; night plan</div>'
    +'<div class="two-col"><div class="box"><h4>Day plan</h4><ul>'+dayLi+'</ul></div><div class="box"><h4>Night highlights</h4><ul>'+nightLi+'</ul></div></div>'
    +'<div class="sect">Rides she can do</div>'
    +'<div style="font-size:10px;color:var(--t3);margin-bottom:.4rem">All rides below have no height requirement — or 32" which she should clear at almost 4</div>'
    +rAll
    +'<div class="dv"></div>'
    +'<div class="sect">Food</div>'
    +'<div class="price-key">Prices are estimated for family of 4 (2 adults + 1 child + 1 grandparent) · 2029 prices projected from 2026</div>'
    +'<div class="two-col"><div><div style="font-size:10px;font-weight:500;color:var(--t2);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.3rem">Must-try snacks (per item)</div>'+snacks+'</div>'
    +'<div><div style="font-size:10px;font-weight:500;color:var(--t2);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.3rem">Restaurants (est. for 4)</div>'+rests+'</div></div>'
    +'<div class="dv"></div>'
    +'<div class="sect">Shops</div>'
    +shopsHtml
    +'<div style="height:2rem"></div>';
}
function openPark(id){
  var p=parks.filter(function(x){return x.id===id})[0];
  gi('content-'+id).innerHTML=buildParkPage(p);
  document.querySelectorAll('.page').forEach(function(pg){pg.classList.remove('active')});
  gi('pg-'+id).classList.add('active');
  var bar=gi('sticky-bar');if(bar)bar.classList.remove('visible');
  window.scrollTo(0,0);
}
function closePark(){
  document.querySelectorAll('.page').forEach(function(pg){pg.classList.remove('active')});
  gi('pg-main').classList.add('active');
  window.scrollTo(0,0);
}
function toggleRR(i){
  var body=gi('rr-body-'+i),arr=gi('rr-arr-'+i);
  var open=body.style.display==='block';
  body.style.display=open?'none':'block';
  arr.style.transform=open?'':'rotate(180deg)';
}
function toggleBands(){wantBands=!wantBands;render();}
function toggleMemMaker(){wantMemMaker=!wantMemMaker;render();}
function setTravel(m){travelMode=m;render();}
function setInflRate(v){inflRate=parseFloat(v)/100;var lbl=gi('infl-rate-lbl');if(lbl)lbl.textContent=v+'%';if(tripDate){tripMult=Math.pow(1+inflRate,inflYears)/Math.pow(1+inflRate,3);}render();}
function toggleBookingTimeline(){
  var b=gi('booking-timeline-body'),c=gi('booking-caret');
  if(!b)return;
  var open=b.style.display==='block';
  b.style.display=open?'none':'block';
  if(c)c.style.transform=open?'':'rotate(180deg)';
}
function toggleStroller(){wantStroller=!wantStroller;render();}
function changeNights(d){
  nights=Math.min(7,Math.max(1,nights+d));
  gi('nights-val').textContent=nights;
  render();
}

function renderResortRests(){
  gi('rr-grid').innerHTML=resortRests.map(function(area,ai){
    var hotelsHtml=area.hotels.map(function(h){
      var restsHtml=h.rests.map(function(r){
        var badges=(r.michelin&&!r.michelinRec?'<span class="hr-badge hb-m">&#9733; Michelin Star</span>':'')
          +(r.michelin&&r.michelinRec?'<span class="hr-badge hb-m">&#9733; Michelin Star</span>':'')
          +(!r.michelin&&r.michelinRec?'<span class="hr-badge hb-mr">Michelin Recommended</span>':'');
        var specialHtml=r.special?'<div class="hr-special">&#10024; '+r.special+'</div>':'';
        var warnHtml=r.warn?'<div class="hr-warn">&#9888; '+r.warn+'</div>':'';
        return'<div class="hr-item">'
          +'<div><span style="font-weight:500;font-size:11px">'+r.n+'</span>'
          +'<span class="rt-type '+(r.t==='qs'?'rqs':'rts')+'">'+(r.t==='qs'?'Quick service':'Table service')+'</span>'
          +'<span class="hr-price">'+r.p+'</span>'
          +badges+'</div>'
          +'<div class="sn-nt">'+r.nt+'</div>'
          +specialHtml+warnHtml+'</div>';
      }).join('');
      return'<div style="margin-bottom:.75rem">'
        +'<div class="hr-hotel">'+h.name+'</div>'
        +restsHtml+'</div>';
    }).join('');
    return'<div class="card" style="border-top:3px solid '+area.color+';margin-bottom:8px;padding:0">'
      +'<div onclick="toggleRR('+ai+')" style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;padding:.75rem 1rem">'
      +'<div style="font-size:11px;font-weight:500;color:var(--t)">'+area.area+'</div>'
      +'<span id="rr-arr-'+ai+'" style="font-size:13px;color:var(--t3);transition:transform .2s;display:inline-block">&#9660;</span>'
      +'</div>'
      +'<div id="rr-body-'+ai+'" style="display:none;padding:0 1rem .75rem">'
      +hotelsHtml+'</div></div>';
  }).join('');
}



function buildHotelPage(key){
  var d=hotelDetails[key];
  if(!d) return'<button class="pk-back" onclick="closeHotel()">&#8592; Back to planner</button><p>Details coming soon.</p>';
  var roomsHtml=d.rooms.map(function(r){return'<div class="ri-item" style="font-size:10px;line-height:1.6;color:var(--t)">'+r+'</div>';}).join('');
  var suitesHtml='';
  if(d.suites&&d.suites.length){
    suitesHtml='<div class="dv"></div><div class="sect">Suites &amp; large-group options</div>'
      +'<div style="font-size:10px;color:var(--t3);margin-bottom:.5rem">For groups of 5\u201312 \u00b7 Dec 1\u201314 2025 rack rates \u00b7 2029 est. applies ~31% inflation (7%/yr \xd7 4 yrs)</div>'
      +d.suites.map(function(s){
        return'<div class="ri-item">'
          +'<div style="display:flex;flex-wrap:wrap;align-items:baseline;gap:5px">'
          +'<span style="font-weight:500;font-size:11px;color:var(--t)">'+s.n+'</span>'
          +'<span class="rt-type rts">Sleeps '+s.sleeps+'</span>'
          +'</div>'
          +'<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:2px">'
          +'<span style="font-size:10px;color:var(--tw);font-weight:500">Dec 2025: '+s.dec25+'</span>'
          +'<span style="font-size:10px;color:var(--t3)">2029 est: '+s.dec29+'</span>'
          +'</div>'
          +'<div class="ri-sub">'+s.note+'</div>'
          +'</div>';
      }).join('');
  }
  var tipsHtml=d.tips.map(function(t){return'<li>'+t+'</li>';}).join('');
  var connectBadge=d.connecting==='best'?'<span class="hr-badge hb-m" style="margin-left:6px">Best bet for connecting</span>':'';
  var villaHtml=d.villas?'<div class="dv"></div><div class="sect">DVC villas option</div><div style="font-size:10px;color:var(--ti);font-weight:500;margin-bottom:3px">'+d.villas+'</div><div style="font-size:11px;color:var(--t2);line-height:1.5">'+d.villaNote+'</div>':'';
  var hotelHeader=d.img
    ?'<div class="img-head"><img src="images/'+d.img+'" alt="'+d.name+'" class="img-head-photo"><div class="img-head-overlay" style="background:linear-gradient(transparent 30%,'+d.color+'dd)"><h2>'+d.name+'</h2><p>'+d.tagline+'</p></div></div>'
    :'<div class="pk-head" style="background:'+d.color+';color:#fff"><h2>'+d.name+'</h2><p>'+d.tagline+'</p></div>';
  return'<button class="pk-back" onclick="closeHotel()">&#8592; Back to planner</button>'
    +hotelHeader
    +'<div class="age-note" style="background:var(--bg2);color:var(--t2)">'+d.overview+'</div>'
    +'<div class="sect">Connecting rooms'+connectBadge+'</div>'
    +'<div style="font-size:11px;color:var(--t2);line-height:1.5;margin-bottom:.5rem">'+d.connectingNote+'</div>'
    +(hotelDetails[Object.keys(hotelDetails).find(function(k){return hotelDetails[k]===d;})]&&hotels.deluxe.concat(hotels.assoc).find(function(h){return hotelDetails[h.key]===d;})&&hotels.deluxe.concat(hotels.assoc).find(function(h){return hotelDetails[h.key]===d;}).eeh?'<div style="font-size:10px;background:var(--bgs);color:var(--ts);border-radius:var(--rm);padding:.4rem .65rem;margin-bottom:.5rem">✓ This hotel includes Extended Evening Hours — 2 extra hours in select parks after close on specific nights, with dramatically reduced crowds. Exclusively for Disney-owned deluxe resort guests.</div>':'<div style="font-size:10px;background:var(--bg2);color:var(--t3);border-radius:var(--rm);padding:.4rem .65rem;margin-bottom:.5rem">✗ This hotel does not include Extended Evening Hours (a perk exclusive to Disney-owned deluxe resorts). Guests of Swan &amp; Dolphin, Waldorf, and Four Seasons miss this benefit.</div>')
    +'<div style="font-size:10px;background:var(--bgi);color:var(--ti);border-radius:var(--rm);padding:.4rem .65rem;margin-bottom:.75rem">Disney hotel reservations: <strong>(407) 939-1936</strong> · Book both rooms first, then call to link and request connecting · Ask again at check-in</div>'
    +villaHtml
    +'<div class="dv"></div>'
    +'<div class="two-col">'
    +'<div><div class="sect" style="margin-top:0">Room types — Dec 2025 rates</div>'+'<div style="font-size:10px;color:var(--t3);margin-bottom:.3rem">Dec 1–14 rack rates (no discount) · 2029 est. at ~7%/yr inflation · rates vary by day and availability</div>'+roomsHtml+suitesHtml+'</div>'
    +'<div><div class="sect" style="margin-top:0">Pool</div><div style="font-size:11px;color:var(--t2);line-height:1.5;margin-bottom:.75rem">'+d.pool+'</div>'
    +'<div class="sect">Getting to the parks</div><div style="font-size:11px;color:var(--t2);line-height:1.5">'+d.transport+'</div></div>'
    +'</div>'
    +'<div class="dv"></div>'
    +'<div class="sect">Insider tips</div>'
    +'<div class="box"><ul>'+tipsHtml+'</ul></div>'
    +'<div style="height:2rem"></div>';
}

function openHotel(key){
  var el=document.getElementById('content-hotel-'+key);
  if(el) el.innerHTML=buildHotelPage(key);
  document.querySelectorAll('.page').forEach(function(pg){pg.classList.remove('active')});
  var pg=document.getElementById('pg-hotel-'+key);
  if(pg) pg.classList.add('active');
  var bar=gi('sticky-bar');if(bar)bar.classList.remove('visible');
  window.scrollTo(0,0);
}

function closeHotel(){
  document.querySelectorAll('.page').forEach(function(pg){pg.classList.remove('active')});
  gi('pg-main').classList.add('active');
  window.scrollTo(0,0);
}

function setTripDate(v){
  tripDate=v?new Date(v+'T12:00:00'):null;
  if(tripDate){
    inflYears=Math.max(0,tripDate.getFullYear()-2026);
    tripMult=Math.pow(1+inflRate,inflYears)/Math.pow(1+inflRate,3);
  } else {inflYears=3;tripMult=1.0;}
  render();
}
function addDays(d,n){var r=new Date(d);r.setDate(r.getDate()+n);return r;}
function fmtDate(d){if(!d)return'';return d.toLocaleDateString('en-US',{weekday:'short',month:'long',day:'numeric',year:'numeric'});}
function fmtShort(d){if(!d)return'';return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});}
function statusPill(date){
  if(!date)return'<span style="font-size:9px;padding:1px 6px;border-radius:8px;background:var(--bg2);color:var(--t3)">Plan ahead</span>';
  var t=new Date();t.setHours(0,0,0,0);
  var d=new Date(date);d.setHours(0,0,0,0);
  if(d<t)return'<span style="font-size:9px;padding:1px 6px;border-radius:8px;background:var(--bgs);color:var(--ts)">Window open now</span>';
  var days=Math.round((d-t)/864e5);
  if(days===0)return'<span style="font-size:9px;padding:1px 6px;border-radius:8px;background:var(--bgw);color:var(--tw)">Today!</span>';
  return'<span style="font-size:9px;padding:1px 6px;border-radius:8px;background:var(--bg2);color:var(--t3)">'+days+' days away</span>';
}
function renderTimeline(){
  var el=gi('booking-timeline'),su=gi('trip-date-summary');
  if(!el)return;
  if(!tripDate){el.innerHTML='<div style="font-size:11px;color:var(--t3)">Enter your check-in date above to see your personalised booking dates</div>';if(su)su.innerHTML='';return;}
  var ci=tripDate;
  var d60=addDays(ci,-60),d7=addDays(ci,-7),d30=addDays(ci,-30),d2=addDays(ci,-2);
  var pkgYear=ci.getFullYear()-1;
  var hasParty=activeFireworks==='mnsshp'||activeFireworks==='mvmcp';
  var partyLabel=activeFireworks==='mnsshp'?"Mickey Not-So-Scary Halloween Party":activeFireworks==='mvmcp'?"Mickey Very Merry Christmas Party":'Seasonal party';
  var lastNight=addDays(ci,nights-1);
  if(su)su.innerHTML='<span style="font-weight:500;color:var(--ts)">'+fmtShort(ci)+'</span> check-in &nbsp;&bull;&nbsp; '+nights+' nights &nbsp;&bull;&nbsp; '+fmtShort(addDays(ci,nights))+' check-out';
  if(!timelineEverOpened){timelineEverOpened=true;var tbody=gi('booking-timeline-body');var ca=gi('booking-caret');if(tbody){tbody.style.display='block';if(ca)ca.style.transform='rotate(180deg)';}}
  var partyRow=hasParty?[partyLabel+' tickets go on sale','Party tickets release in May/June of the year before the event — months before your 60-day dining window. Some dates sell out within hours. Buy immediately when released.']:null;
  var secs=[
    {label:'Book now — Hotel reservation',color:'#023E8A',date:null,rows:[
      ['Book your hotel immediately','Disney deluxe rooms sell up to 20 months in advance. Polynesian, Beach Club, and Grand Floridian fill fastest for December. 2029 dates expected to open around May/June 2028.'],
      ['Call (407) 939-1936 after booking','Link two-room reservations and add your connecting room request as a note. Repeat at check-in.'],
    ]},
    {label:'~May/June '+pkgYear+' — Packages and party tickets',color:'#0077B6',date:new Date(pkgYear,4,1),rows:(partyRow?[['Vacation packages go on sale','Disney releases the following year packages in May/June. Booking early locks in current pricing and any launch promotions.'],partyRow]:[['Vacation packages go on sale','Disney releases the following year packages in May/June. Booking early locks in current pricing and any launch promotions.']])},
    {label:'Your 60-day window — '+fmtDate(d60),color:'#00B4D8',date:d60,rows:[
      ['Set an alarm: 5:45 AM ET on '+fmtShort(d60),'Reservations technically open at 6:00 AM but have been seen going live a few minutes early. Have My Disney Experience open, party size entered, and restaurant pre-selected before 6:00 AM.'],
      ['Resort guest advantage — book your entire stay','As a Disney resort guest you book all '+nights+' nights on this single date. Your last night ('+fmtShort(lastNight)+') is effectively available '+(nights+59)+' days in advance.'],
      ['Book in this exact priority order','1. Cinderella Royal Table (sells in seconds) 2. Bibbidi Bobbidi Boutique 3. GEO-82 (extremely limited, adults 21+) 4. Be Our Guest dinner 5. Akershus / Crystal Palace 6. Ohana 7. All other table service 8. Beak and Barrel lounge 9. Ferrytale cruise 10. Starlight Safari 11. Caring for Giants'],
      ["Victoria and Albert Chef Table — phone only","Call (407) 939-3862 between 10 AM and 4 PM ET. Cannot be booked online. Still opens at 60 days. Main dining room and Queen Victoria Room can be booked via MDE."],
      ['California Grill and Celebration at the Top','Both book via MDE at 60 days. Book California Grill right after character dining priorities above.'],
      ['Pontoon cruise, dessert parties, all special experiences','All book at 60 days via MDE or (407) 939-7529.'],
    ]},
    {label:'30 days out — '+fmtShort(d30),color:'#E8B84B',date:d30,rows:[
      ['Purchase Memory Maker','Can be bought any time before or during the trip but buying before arrival is slightly cheaper. Activates the moment you purchase.'],
      ['Confirm stroller delivery','If using Kingdom Strollers, confirm delivery date and hotel. Stroller should arrive at bell services before check-in.'],
      ['Measure your daughter','She needs 38 inches for Seven Dwarfs Mine Train, Big Thunder Mountain, and Slinky Dog Dash. Measure before you leave home.'],
    ]},
    {label:'Day 7 — Lightning Lane — '+fmtDate(d7),color:'#48CAE4',date:d7,rows:[
      ['7:00 AM — Buy Lightning Lane Multi Pass','Resort guests can purchase LLMP 7 days before each park day. Set an alarm for each park morning.'],
      ['Complete online check-in','MDE app · Select arrival time window · Re-confirm connecting room request · Set up MagicMobile if not using MagicBands.'],
    ]},
    {label:'1 to 3 days out — '+fmtShort(d2),color:'#90E0EF',date:d2,rows:[
      ['Pack ponchos and layers','Orlando in early December is 60 to 70 degrees F with afternoon rain likely. Ponchos are $12 inside the parks and $2 on Amazon.'],
      ['Download everything to MDE','Park tickets, Lightning Lane, dining reservations — screenshot all confirmations in case you lose cell signal.'],
      ['Review your daily plan','Check park hours, parade and fireworks times, and any last-minute changes to your reservations.'],
    ]},
  ];
  el.innerHTML=secs.map(function(sec){
    var rows=sec.rows.map(function(r){
      return'<div style="padding:5px 0;border-bottom:.5px solid var(--bm)">'
        +'<div style="font-size:11px;font-weight:500;color:var(--t)">'+r[0]+'</div>'
        +'<div style="font-size:10px;color:var(--t2);margin-top:2px;line-height:1.5">'+r[1]+'</div>'
        +'</div>';
    }).join('');
    return'<div style="border-left:3px solid '+sec.color+';padding:.5rem .75rem;margin-bottom:.6rem;background:var(--bg2);border-radius:0 var(--rm) var(--rm) 0">'
      +'<div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:.35rem">'
      +'<span style="font-size:11px;font-weight:500;color:var(--t)">'+sec.label+'</span>'
      +statusPill(sec.date)
      +'</div>'
      +rows+'</div>';
  }).join('');
}

function render(){renderHotels();renderBudget();renderParkNav();renderResortRests();renderTimeline();}
function setClub(v){clubLevel=v;render();}
function selH(k){sel=k;clubLevel=false;render();}
function selFW(k){activeFireworks=k;render();}
function selEV(k){activeEvening=k;render();}
function setSeason(s,btn){
  season=s;
  document.querySelectorAll('.tog').forEach(function(b){b.classList.remove('on')});
  btn.classList.add('on');
  render();
}
render();
document.addEventListener('click',function(e){
  if(e.target&&e.target.id==='btn-fly'){setTravel('fly');}
  if(e.target&&e.target.id==='btn-drive'){setTravel('drive');}
});
new IntersectionObserver(function(entries){
  var bar=gi('sticky-bar');
  if(bar)bar.classList.toggle('visible',!entries[0].isIntersecting&&gi('pg-main').classList.contains('active'));
},{threshold:0}).observe(document.querySelector('.mg'));
