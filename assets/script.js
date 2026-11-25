function $(s){return document.querySelector(s)}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function waLink(num,text){return"https://wa.me/"+num+(text?"?text="+encodeURIComponent(text):"")}
function normWA(v){var d=String(v).replace(/\D/g,"");if(d.indexOf("0")===0)d="62"+d.slice(1);else if(d.indexOf("8")===0)d="62"+d;return/^628\d{8,12}$/.test(d)?d:null}
function pretty(n){return"+"+n.slice(0,2)+" "+n.slice(2,5)+" "+n.slice(5,9)+" "+n.slice(9)}
function loadReg(){try{return JSON.parse(localStorage.getItem("tp_reg")||"[]")}catch(e){return[]}}
function saveReg(a){try{localStorage.setItem("tp_reg",JSON.stringify(a))}catch(e){}}

function allT(){return DB.therapists}
function initials(n){return n.replace(/^(Ibu|Bapak)\s+/,"").split(" ").slice(0,2).map(function(w){return w.charAt(0)}).join("").toUpperCase()}

/* nav + routing */
$("#navlist").innerHTML=PAGES.map(function(p){return'<li><a href="#'+p[0]+'" data-p="'+p[0]+'">'+p[1]+'</a></li>'}).join("");
function route(){
  var h=location.hash.replace("#","");
  if(!PAGES.some(function(p){return p[0]===h}))h="beranda";
  document.querySelectorAll(".view").forEach(function(v){v.hidden=v.id!=="v-"+h});
  document.querySelectorAll("#navlist a").forEach(function(a){var on=a.dataset.p===h;a.classList.toggle("on",on);if(on)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
  $("#nav").classList.remove("open");$("#burger").setAttribute("aria-expanded","false");
  window.scrollTo(0,0);
}
window.addEventListener("hashchange",route);
$("#burger").onclick=function(){var o=$("#nav").classList.toggle("open");this.setAttribute("aria-expanded",o)};


/* faq */
$("#faq").innerHTML=FAQ.map(function(f){return"<details><summary>"+esc(f[0])+"</summary><p>"+esc(f[1])+"</p></details>"}).join("");

/* mitra tabs */
function setTab(t){
  document.querySelectorAll("#mtabs .tab").forEach(function(b){b.setAttribute("aria-selected",b.dataset.t===t)});
  ["list","reg"].forEach(function(k){$("#m-"+k).hidden=k!==t});
  gateReg();
}
function gateReg(){var u=me();$("#rgate").hidden=!!u;$("#rwrap").hidden=!u}
$("#mtabs").addEventListener("click",function(e){var b=e.target.closest(".tab");if(b)setTab(b.dataset.t)});

/* therapist list */
var area=-1;
function renderChips(){
  var c='<button class="chip" aria-pressed="'+(area===-1)+'" data-a="-1">Semua wilayah</button>';
  AREAS.forEach(function(a,i){c+='<button class="chip" aria-pressed="'+(area===i)+'" data-a="'+i+'">'+a+'</button>'});
  $("#chips").innerHTML=c;
}
var WAI='<svg class="wai" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2.1-1-.9.8c-1-.4-1.9-1.3-2.3-2.3l.8-.9-1-2.1z" fill="#fff"/></svg>';
function renderList(){
  var q=($("#tq")?$("#tq").value:"").trim().toLowerCase();var l=allT().filter(function(t){return(area===-1||t.a===area)&&(!q||(t.n+" "+(t.s||[]).join(" ")+" "+(t.d||"")+" "+AREAS[t.a]).toLowerCase().indexOf(q)>-1)});
  $("#tlist").innerHTML=l.length?l.map(function(t){
    var s=ST[t.st],ok=t.st==="v";
    return'<article class="card tc"><div class="th">'+(t.p?'<img class="tav" data-ini="'+esc(initials(t.n))+'" alt="Foto '+esc(t.n)+'" src="'+t.p+'">':'<div class="av big">'+esc(initials(t.n))+'</div>')+'<div><h3>'+esc(t.n)+'</h3><small>Wilayah: '+AREAS[t.a]+'</small></div></div>'+
    '<p><span class="badge '+s[1]+'">'+s[0]+'</span></p>'+(t.d?'<p class="tdesc">'+esc(t.d)+'</p>':'')+'<p>'+(t.s||[]).map(function(x){return'<span class="tag">'+esc(x)+'</span>'}).join("")+'</p>'+
    (ok?'<a class="btn sm wab" target="_blank" rel="noopener" href="'+waLink(t.w,"Halo "+t.n+", saya ingin memesan sesi totok punggung di "+AREAS[t.a]+".")+'">'+WAI+'<span>Hubungi lewat WhatsApp</span></a>':'<a class="btn sm wab" aria-disabled="true" href="#mitra" tabindex="-1">Menunggu verifikasi</a>')+'</article>';
  }).join(""):'<p>Belum ada terapis di wilayah ini.</p>';
}
$("#chips").addEventListener("click",function(e){var b=e.target.closest(".chip");if(!b)return;area=+b.dataset.a;renderChips();renderList()});
renderChips();renderList();

/* registration */
$("#r-a").innerHTML+=AREAS.map(function(a,i){return'<option value="'+i+'">'+a+'</option>'}).join("");
function setErr(id,m){$("#"+id).textContent=m||""}
$("#rform").addEventListener("submit",function(e){
  e.preventDefault();
  if(!me()){gateReg();return}
  var n=$("#r-n").value.trim(),a=$("#r-a").value,w=normWA($("#r-w").value),y=$("#r-y").value.trim(),s=$("#r-s").value.trim(),bad=false;
  setErr("e-n",n.length<3?"Tulis nama lengkap Anda.":"");if(n.length<3)bad=true;
  setErr("e-a",a===""?"Pilih wilayah praktek.":"");if(a==="")bad=true;
  var dup=w&&allT().some(function(t){return t.w===w});
  setErr("e-w",!w?"Masukkan nomor WhatsApp yang benar, misalnya 0812 3456 7890.":dup?"Nomor ini sudah terdaftar.":"");if(!w||dup)bad=true;
  setErr("e-y",(y===""||+y<0||+y>60)?"Isi lama pengalaman antara 0 sampai 60 tahun.":"");if(y===""||+y<0||+y>60)bad=true;
  setErr("e-s",s.length<5?"Ceritakan keahlian atau pelatihan Anda.":"");if(s.length<5)bad=true;
  if(bad)return;
  DB.therapists.push({id:uid(),n:n,a:+a,y:+y,s:[s.length>60?s.slice(0,57)+"…":s],d:s,p:"",st:"p",w:w});saveDB();
  var msg="Halo admin, saya "+n+" mendaftar sebagai calon terapis di "+AREAS[+a]+". Pengalaman "+y+" tahun. Keahlian: "+s+". WhatsApp: "+w+".";
  var ok=$("#rok");ok.hidden=false;
  ok.innerHTML="<h3>Pendaftaran diterima</h3><p>Pendaftaran Anda sudah tercatat. Kirim biodata ke admin agar tim kami dapat memulai peninjauan.</p><a class=\"btn\" target=\"_blank\" rel=\"noopener\" href=\""+waLink(WA,msg)+"\">Kirim ke admin lewat WhatsApp</a>";
  this.reset();renderList();ok.scrollIntoView({block:"nearest"});
});

/* produk + akademi */
$("#alist").innerHTML=COURSE.map(function(c,i){return'<article class="card ac"><span class="num">0'+(i+1)+'</span><h3>'+c[0]+'</h3><p><span class="tag gold">'+c[1]+'</span><span class="tag">'+c[2]+'</span></p>'+(c[5]?'<p>'+esc(c[5])+'</p>':'')+'<ul class="ck">'+c[4].map(function(m){return"<li>"+m+"</li>"}).join("")+'</ul><div class="price">'+c[3]+'</div><a class="btn sm" target="_blank" rel="noopener" href="'+waLink(WA,"Halo, saya ingin mendaftar kelas "+c[0]+".")+'">Daftar kelas</a></article>'}).join("");

/* artikel */
var cat="Semua",CATS=["Semua"].concat(ART.map(function(a){return a[0]}).filter(function(c,i,s){return s.indexOf(c)===i}));
function renderArt(){
  $("#achips").innerHTML=CATS.map(function(c){return'<button class="chip" aria-pressed="'+(c===cat)+'" data-c="'+c+'">'+c+'</button>'}).join("");
  $("#arlist").innerHTML=ART.map(function(a,i){return{a:a,i:i}}).filter(function(o){return cat==="Semua"||o.a[0]===cat}).map(function(o){
    return'<article class="card"><span class="tag gold">'+o.a[0]+'</span><h3>'+o.a[1]+'</h3><p>'+o.a[2]+'</p><button class="btn ghost sm" data-i="'+o.i+'">Baca selengkapnya</button></article>'}).join("");
}
$("#achips").addEventListener("click",function(e){var b=e.target.closest(".chip");if(b){cat=b.dataset.c;renderArt()}});
$("#arlist").addEventListener("click",function(e){
  var b=e.target.closest("button[data-i]");if(!b)return;var a=ART[+b.dataset.i];
  $("#dt").textContent=a[1];$("#db").innerHTML="<p>"+a[2]+"</p><p>"+a[3]+"</p>";
  var d=$("#dlg");if(d.showModal)d.showModal();else d.setAttribute("open","");
});
$("#dx").onclick=function(){$("#dlg").close()};
$("#dlg").addEventListener("click",function(e){if(e.target===this)this.close()});
renderArt();

/* hubungi */
$("#adm").textContent=pretty(WA);
function cmsg(){var n=$("#c-n").value.trim(),m=$("#c-m").value.trim();if(!n&&!m)return"";return"Halo, saya "+(n||"pengunjung website")+". Topik: "+$("#c-t").value+(m?". "+m:".")}
function cupd(){$("#cgo").href=waLink(WA,cmsg())}
["#c-n","#c-t","#c-m"].forEach(function(s){$(s).addEventListener("input",cupd);$(s).addEventListener("change",cupd)});cupd();
$("#cgo").addEventListener("mousedown",cupd);$("#cgo").addEventListener("touchstart",cupd);

$("#tq").addEventListener("input",renderList);
var cart=(function(){try{return JSON.parse(localStorage.getItem("tp_cart")||"{}")}catch(e){return{}}})();

var bar=document.createElement("div");bar.className="cartbar";bar.hidden=true;document.body.appendChild(bar);
var fab=document.createElement("a");fab.className="fab";fab.target="_blank";fab.rel="noopener";fab.textContent="Tanya lewat WhatsApp";fab.href=waLink(WA,"Halo, saya ingin bertanya tentang terapi totok punggung.");document.body.appendChild(fab);
var pd=$("#pdlg");
function openProd(i){var p=PROD[i],ph=(p[7]&&p[7].length)?p[7].slice():(p[4]?[p[4]]:[]),disc=p[5]>num(p[2]);pd.dataset.i=i;
  $("#pbody").innerHTML='<div class="pgal">'+(ph.length?'<div class="pmainw"><img class="pmain" id="pmain" alt="'+esc(p[0])+'" src="'+ph[0]+'"></div>'+(ph.length>1?'<div class="pthumbs">'+ph.map(function(u,j){return'<button type="button" class="pt'+(j?'':' on')+'" data-ph="'+j+'" aria-label="Foto '+(j+1)+'"><img alt="" src="'+u+'"></button>'}).join("")+'</div>':''):'<div class="pimg ph">Foto belum ada</div>')+'</div><div class="pinfo"><h2>'+esc(p[0])+'</h2><p><span class="tag">'+esc(p[1])+'</span></p><p>'+esc(p[3])+'</p><div class="price">'+p[2]+(disc?' <s class="old">'+money(p[5])+'</s>':'')+'</div>'+(p[6]==="habis"?'<span class="badge b-new">Stok habis</span>':'<button class="btn" type="button" id="pad">Tambah ke keranjang</button>')+'</div>';
  pd.dataset.photos=JSON.stringify(ph);pd.showModal()}
$("#pdx").onclick=function(){pd.close()};
pd.addEventListener("click",function(e){if(e.target===pd){pd.close();return}
  var t=e.target.closest("[data-ph]");if(t){var ph=JSON.parse(pd.dataset.photos);$("#pmain").src=ph[+t.dataset.ph];pd.querySelectorAll(".pt").forEach(function(x){x.classList.toggle("on",x===t)});return}
  if(e.target.id==="pad"){var i=pd.dataset.i;cart[i]=(cart[i]||0)+1;try{localStorage.setItem("tp_cart",JSON.stringify(cart))}catch(x){}renderProd();e.target.textContent="Ditambahkan ✓"}});
function renderProd(){
  $("#plist").innerHTML=PROD.map(function(p,i){var q=cart[i]||0,disc=p[5]>num(p[2]);
    return'<article class="card pc"><div class="pw" data-v="'+i+'">'+(p[4]?'<img class="pimg" alt="'+esc(p[0])+'" src="'+p[4]+'">':'<div class="pimg ph">Foto belum ada</div>')+(disc?'<span class="badge b-wait dsc">Diskon '+Math.round(100-num(p[2])/p[5]*100)+'%</span>':'')+'</div><div class="pb"><h3>'+esc(p[0])+'</h3><p><span class="tag">'+esc(p[1])+'</span></p><p class="pd">'+esc(p[3])+'</p><div class="price">'+p[2]+(disc?' <s class="old">'+money(p[5])+'</s>':'')+'</div><div class="pa"><button class="btn ghost sm" data-v="'+i+'">Lihat detail</button>'+(p[6]==="habis"?'<span class="badge b-new">Stok habis</span>':q?'<div class="qty"><button data-d="'+i+'" aria-label="Kurangi '+esc(p[0])+'">−</button><strong>'+q+'</strong><button data-a="'+i+'" aria-label="Tambah '+esc(p[0])+'">+</button></div>':'<button class="btn sm" data-a="'+i+'">Tambah ke keranjang</button>')+'</div></div></article>'}).join("");
  var n=0,tot=0,lines=[];
  Object.keys(cart).forEach(function(k){var q=cart[k];if(q>0){n+=q;tot+=q*parseInt(PROD[k][2].replace(/\D/g,""),10);lines.push("- "+PROD[k][0]+" x"+q)}});
  var show=n>0&&location.hash==="#produk";
  bar.hidden=!show;document.body.style.paddingBottom=show?"88px":"";fab.style.display=show?"none":"";
  bar.innerHTML='<span><strong>'+n+' produk</strong><br>Total '+money(tot)+'</span><a class="btn sm" target="_blank" rel="noopener" href="'+waLink(WA,"Halo, saya ingin memesan:\n"+lines.join("\n")+"\nTotal: "+money(tot))+'">Pesan lewat WhatsApp</a>';
}
$("#plist").addEventListener("click",function(e){var v=e.target.closest("[data-v]");if(v){openProd(+v.dataset.v);return}var b=e.target.closest("button");if(!b)return;
  if(b.dataset.a!==undefined){cart[b.dataset.a]=(cart[b.dataset.a]||0)+1}else if(b.dataset.d!==undefined){cart[b.dataset.d]=Math.max(0,(cart[b.dataset.d]||0)-1)}else return;
  try{localStorage.setItem("tp_cart",JSON.stringify(cart))}catch(x){}var y=window.scrollY;renderProd();window.scrollTo(0,y)});
window.addEventListener("hashchange",renderProd);
renderProd();
$("#hrs").textContent=DB.settings.hours;$("#bn").textContent=DB.settings.brand;document.title=DB.settings.brand;
bar.addEventListener("click",function(e){if(!e.target.closest("a.btn"))return;var it=[],tot=0;Object.keys(cart).forEach(function(k){var p=DB.products[k];if(p&&cart[k]>0){it.push({name:p.name,q:cart[k],price:p.price});tot+=p.price*cart[k]}});if(!it.length)return;var u=me();DB.orders.unshift({id:uid(),date:new Date().toISOString(),items:it,total:tot,name:u?u.name:"Tamu",contact:u?(u.email||u.user):"",status:"Baru"});saveDB();cart={};try{localStorage.removeItem("tp_cart")}catch(x){}setTimeout(renderProd,400)});
$("#cgo").addEventListener("click",function(){var n=$("#c-n").value.trim(),m=$("#c-m").value.trim();if(m){DB.msgs.unshift({id:uid(),date:new Date().toISOString(),name:n||"Pengunjung",topic:$("#c-t").value,text:m,status:"Baru"});saveDB()}});
var ad=$("#adlg"),amode="in";
function acct(){var u=me();$("#bin").hidden=$("#bup").hidden=!!u;$("#acct").hidden=!u;if(u)$("#acct").textContent="Akun: "+String(u.name||u.user||u.email).split(" ")[0]}
function panel(){var u=me(),h;
 if(u){h='<h2>Halo, '+esc(u.name)+'</h2><p>'+esc(u.email||u.user)+'</p>'+(u.role==="admin"?'<p><a class="btn sm" href="admin.html">Buka panel admin</a></p>':'')+'<button class="btn ghost sm" id="lo" type="button">Keluar</button>'}
 else if(amode==="in"){h='<h2>Masuk</h2><form id="af" data-m="in" novalidate><div><label for="af-e">Username atau email</label><input id="af-e" autocomplete="username"></div><div><label for="af-p">Kata sandi</label><input id="af-p" type="password" autocomplete="current-password"></div><p class="err" id="af-x"></p><div><button class="btn" type="submit">Masuk</button></div></form><p class="hint" style="margin-top:16px">Belum punya akun? <a href="#" data-sw="up"><strong>Klik daftar</strong></a></p>'}
 else{h='<h2>Daftar akun</h2><form id="af" data-m="up" novalidate><div><label for="af-u">Username</label><input id="af-u" autocomplete="username"></div><div><label for="af-e">Email</label><input id="af-e" type="email" autocomplete="email"></div><div><label for="af-t">No telepon</label><input id="af-t" type="tel" inputmode="tel" placeholder="0812 3456 7890" autocomplete="tel"></div><div><label for="af-c">Kota</label><input id="af-c" autocomplete="address-level2"></div><div><label for="af-p">Password</label><input id="af-p" type="password" autocomplete="new-password"><p class="hint">Minimal 6 karakter.</p></div><p class="err" id="af-x"></p><div><button class="btn" type="submit">Daftar</button></div></form><p class="hint" style="margin-top:16px">Sudah punya akun? <a href="#" data-sw="in"><strong>Masuk</strong></a></p>'}
 $("#abody").innerHTML=h}
function openAuth(m){amode=m;panel();if(!ad.open)ad.showModal()}
$("#bin").onclick=function(){openAuth("in")};$("#bup").onclick=function(){openAuth("up")};
$("#rgin").onclick=function(){openAuth("in")};$("#rgup").onclick=function(){openAuth("up")};
$("#acct").onclick=function(){panel();ad.showModal()};
$("#adx").onclick=function(){ad.close()};
ad.addEventListener("click",function(e){if(e.target===ad)ad.close()});
$("#abody").addEventListener("click",function(e){
 if(e.target.id==="lo"){logout();acct();gateReg();panel()}
 var sw=e.target.closest("[data-sw]");if(sw){e.preventDefault();amode=sw.dataset.sw;panel()}});
$("#abody").addEventListener("submit",function(e){e.preventDefault();var m=e.target.dataset.m,x=$("#af-x"),id=$("#af-e").value.trim(),pw=$("#af-p").value;
 if(m==="in"){if(!id||!pw){x.textContent="Isi username/email dan kata sandi.";return}var u=login(id,pw);if(!u){x.textContent="Username/email atau kata sandi salah.";return}}
 else{var un=$("#af-u").value.trim(),ph=normWA($("#af-t").value),ct=$("#af-c").value.trim();
  if(!/^[A-Za-z0-9_.]{3,20}$/.test(un)){x.textContent="Username 3-20 karakter: huruf, angka, titik, atau garis bawah.";return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)){x.textContent="Isi email yang benar.";return}
  if(!ph){x.textContent="Nomor telepon tidak valid, contoh 0812 3456 7890.";return}
  if(ct.length<2){x.textContent="Isi nama kota Anda.";return}
  if(pw.length<6){x.textContent="Password minimal 6 karakter.";return}
  if(DB.users.some(function(u){return String(u.user).toLowerCase()===un.toLowerCase()})){x.textContent="Username ini sudah dipakai.";return}
  if(DB.users.some(function(u){return String(u.email).toLowerCase()===id.toLowerCase()})){x.textContent="Email ini sudah terdaftar. Silakan masuk.";return}
  DB.users.push({id:uid(),name:un,user:un,email:id,phone:ph,city:ct,hash:hp(pw),role:"user"});saveDB();login(un,pw)}
 acct();gateReg();ad.close()});
acct();gateReg();
$("#ctawa").href=waLink(WA,"Halo, saya ingin bertanya tentang terapi totok punggung.");
document.addEventListener("click",function(e){if(!e.target.closest("nav")&&!e.target.closest("#burger")){$("#nav").classList.remove("open");$("#burger").setAttribute("aria-expanded","false")}});
document.addEventListener("keydown",function(e){if(e.key==="Escape"){$("#nav").classList.remove("open");$("#burger").setAttribute("aria-expanded","false")}});
route();
document.addEventListener("error",function(e){var t=e.target;if(!t||t.tagName!=="IMG")return;
 if(t.classList.contains("pimg")){var d=document.createElement("div");d.className="pimg ph";d.textContent="Foto rusak, upload ulang di admin";t.replaceWith(d)}
 else if(t.classList.contains("tav")){var v=document.createElement("div");v.className="av big";v.textContent=t.dataset.ini||"";t.replaceWith(v)}},true);
