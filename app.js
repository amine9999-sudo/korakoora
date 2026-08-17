const list=document.querySelector("#liveMatches");
function time(utc){return utc?new Intl.DateTimeFormat("ar-MA",{hour:"2-digit",minute:"2-digit",timeZone:"Africa/Casablanca"}).format(new Date(utc)):"--:--";}
async function load(){try{const r=await fetch("data/matches.json",{cache:"no-store"}),d=await r.json(),m=d.matches||[];
list.innerHTML=m.length?m.slice(0,30).map(x=>`<article class="match"><div class="team"><b>${x.home||"فريق"}</b><span>⚽</span></div><div class="time"><strong>${x.status==="FINISHED"?`${x.homeScore??"-"} - ${x.awayScore??"-"}`:time(x.utcDate)}</strong><small>${x.status==="LIVE"?"مباشر":(x.competition||"مباراة")}</small></div><div class="team"><span>⚽</span><b>${x.away||"فريق"}</b></div></article>`).join(""):'<div class="empty">لا توجد مباريات متاحة حاليًا.</div>'}catch(e){list.innerHTML='<div class="empty">تعذر تحميل المباريات حاليًا.</div>';}}
load();
