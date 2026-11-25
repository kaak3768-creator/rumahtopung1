
var WA="6282267785229";
var AREAS=["Medan Kota","Medan Johor","Medan Sunggal","Medan Marelan"];
var PAGES=[["beranda","Beranda"],["tentang","Tentang"],["mitra","Mitra"],["produk","Produk"],["akademi","Akademi"],["artikel","Artikel"],["hubungi","Hubungi kami"]];
var T=[
{n:"Ibu Sartika Lubis",a:0,y:8,s:["Pegal punggung","Ibu pasca melahirkan"],st:"v",w:"6281200000101"},
{n:"Bapak Rahmat Siregar",a:0,y:5,s:["Totok punggung","Pegal pekerja kantor"],st:"v",w:"6281200000102"},
{n:"Ibu Dewi Harahap",a:1,y:6,s:["Totok punggung","Kompres rempah"],st:"v",w:"6281200000103"},
{n:"Ibu Nurhayati",a:1,y:3,s:["Relaksasi bahu"],st:"r",w:"6281200000104"},
{n:"Bapak Andi Tanjung",a:2,y:10,s:["Totok punggung","Pegal pengemudi"],st:"v",w:"6281200000105"},
{n:"Ibu Rosmawati",a:2,y:4,s:["Totok punggung"],st:"v",w:"6281200000106"},
{n:"Ibu Fitri Ginting",a:3,y:7,s:["Totok punggung","Terapi rempah"],st:"v",w:"6281200000107"},
{n:"Bapak Hendra Nasution",a:3,y:2,s:["Relaksasi punggung"],st:"r",w:"6281200000108"}];
var ST={x:["Ditolak","b-new"],v:["Terverifikasi","b-ok"],r:["Dalam peninjauan","b-wait"],p:["Pengajuan diterima","b-new"]};
var PROD=[
["Minyak Totok Hangat","60 ml","Rp45.000","Campuran jahe, serai, dan cengkeh untuk memijat punggung."],
["Balsem Jahe Merah","30 g","Rp35.000","Balsem hangat untuk pegal setelah beraktivitas."],
["Wedang Rempah Instan","250 g","Rp40.000","Jahe, kayu manis, dan serai. Seduh hangat setelah terapi."],
["Param Kocok Serai","100 g","Rp30.000","Param tradisional untuk dioles tipis pada punggung dan pinggang."],
["Kantong Kompres Rempah","1 buah","Rp55.000","Kantong kain berisi rempah kering, dipanaskan lalu ditempelkan."],
["Paket Perawatan Mandiri","3 produk","Rp120.000","Minyak totok, wedang rempah, dan kompres dalam satu paket."]];
var COURSE=[
["Dasar totok punggung","Pemula","2 hari","Rp750.000",["Anatomi punggung dasar","Titik totok dan tekanan aman","Praktik langsung dengan pendamping"]],
["Teknik lanjutan dan rempah","Menengah","3 hari","Rp1.250.000",["Kombinasi minyak dan kompres rempah","Menangani keluhan umum","Komunikasi dengan klien"]],
["Sertifikasi mitra terapis","Persiapan mitra","1 hari","Rp500.000",["Ujian praktik","Etika dan keselamatan","Pendaftaran jaringan mitra"]]];
var ART=[
["Edukasi","Mengapa punggung mudah pegal saat bekerja","Duduk lama membuat otot punggung bawah dan bahu terus menegang. Tubuh tidak mendapat cukup variasi gerak, sehingga otot terasa kaku di sore hari.","Bangun dan bergerak ringan setiap 45 menit, atur tinggi layar sejajar mata, dan sandarkan punggung bawah pada kursi. Bila nyeri menetap lebih dari beberapa hari, periksakan ke dokter."],
["Perawatan mandiri","Peregangan 5 menit sebelum tidur","Peregangan lembut membantu otot rileks sebelum tidur. Lakukan perlahan, tanpa memaksa gerakan hingga nyeri.","Coba gerakan kucing-sapi, memeluk lutut saat berbaring, dan memutar badan perlahan ke kiri dan kanan. Tahan tiap gerakan sekitar 20 detik sambil bernapas teratur."],
["Rempah","Jahe, serai, dan cengkeh: rempah untuk rasa hangat","Jahe, serai, dan cengkeh sudah lama dipakai dalam ramuan hangat tradisional Nusantara, termasuk untuk pijat dan kompres.","Selalu uji oles di area kecil kulit terlebih dahulu. Hentikan pemakaian bila muncul gatal, merah, atau perih, dan hindari mengoleskan pada kulit yang terluka."],
["Keamanan","Kapan sebaiknya menunda terapi","Terapi totok sebaiknya ditunda saat demam, ada luka atau infeksi kulit di punggung, atau setelah cedera tulang yang belum diperiksa.","Ibu hamil, penderita osteoporosis, dan pengguna obat pengencer darah sebaiknya berkonsultasi dengan dokter lebih dulu. Beri tahu terapis tentang kondisi Anda sebelum sesi dimulai."]];
var FAQ=[
["Apakah totok punggung terasa sakit?","Tekanan disesuaikan dengan kenyamanan Anda. Rasa tekan yang dalam bisa muncul di titik yang tegang, tetapi Anda boleh meminta terapis melembutkan tekanan kapan saja."],
["Berapa lama satu sesi?","Umumnya 45–60 menit, termasuk pengolesan minyak rempah dan waktu istirahat singkat di akhir."],
["Seberapa sering boleh dilakukan?","Untuk pegal ringan, banyak orang melakukannya seminggu sekali atau sesuai kebutuhan. Bicarakan dengan terapis dan dokter bila Anda punya kondisi tertentu."],
["Apa yang perlu disiapkan?","Pakai pakaian longgar, hindari makan terlalu kenyang sebelum sesi, dan beri tahu terapis tentang alergi atau kondisi kesehatan Anda."],
["Apakah rempahnya aman untuk kulit sensitif?","Minta uji oles di area kecil lebih dulu. Bila kulit memerah atau gatal, hentikan dan bersihkan dengan air."],
["Bagaimana cara menjadi mitra terapis?","Isi formulir di halaman Mitra Terapis, lalu tim kami meninjau biodata dan pengalaman Anda. Setelah lolos wawancara, status Anda menjadi terverifikasi."]];


function money(n){return"Rp"+String(n).replace(/\B(?=(\d{3})+(?!\d))/g,".")}
function num(s){return parseInt(String(s).replace(/\D/g,""),10)||0}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function hp(p){var s="tp-salt:"+p,a=3735928559,b=1103547991;for(var i=0;i<s.length;i++){var c=s.charCodeAt(i);a=Math.imul(a^c,2654435761);b=Math.imul(b^c,1597334677)}a=Math.imul(a^(a>>>16),2246822507)^Math.imul(b^(b>>>13),3266489909);b=Math.imul(b^(b>>>16),2246822507)^Math.imul(a^(a>>>13),3266489909);return(4294967296*(2097151&b)+(a>>>0)).toString(36)}
function defDesc(t){return"Terapis totok punggung di "+AREAS[t.a]+(t.y?" dengan pengalaman "+t.y+" tahun":"")+". Fokus: "+(t.s||[]).join(", ").toLowerCase()+"."}
function zuiker(){return{id:"p-zuiker",name:"Zuiker 17 Rempah + Gula Semut",size:"350 gr",price:300000,old:0,desc:"Minuman rempah 17 jenis dengan gula semut. Seduh 2 sendok makan dengan segelas air panas.",img:"assets/produk/zuiker-cover.jpg",imgs:["assets/produk/zuiker-1.jpg","assets/produk/zuiker-2.jpg","assets/produk/zuiker-3.jpg"],stock:"ada"}}
function seed(){return{migr:["zuiker"],
products:[zuiker()].concat(PROD.map(function(p,i){return{id:"p"+i,name:p[0],size:p[1],price:num(p[2]),old:i===5?150000:0,desc:p[3],img:"",stock:"ada"}})),
courses:COURSE.map(function(c,i){return{id:"c"+i,title:c[0],level:c[1],dur:c[2],price:num(c[3]),mods:c[4]}}),
articles:ART.map(function(a,i){return{id:"a"+i,cat:a[0],title:a[1],intro:a[2],body:a[3]}}),
therapists:T.map(function(t,i){t.id="t"+i;t.p="";t.d=defDesc(t);return t}),orders:[],msgs:[],
users:[{id:"u0",name:"Fazil",user:"faziladmin",email:"",hash:hp("123"),role:"admin"}],
settings:{wa:WA,hours:"Setiap hari, 08.00\u201320.00 WIB",brand:"Totok Punggung Medan"}}}
function loadDB(){try{var d=JSON.parse(localStorage.getItem("tp_db"));if(d&&d.products&&d.users){d.therapists.forEach(function(t){if(t.d===undefined)t.d=defDesc(t);if(t.p===undefined)t.p=""});d.migr=d.migr||[];if(d.migr.indexOf("zuiker")<0){d.migr.push("zuiker");if(!d.products.some(function(p){return p.id==="p-zuiker"}))d.products.unshift(zuiker());try{localStorage.setItem("tp_db",JSON.stringify(d));localStorage.removeItem("tp_cart")}catch(e){}}return d}}catch(e){}return seed()}
var DB=loadDB();
function saveDB(){try{localStorage.setItem("tp_db",JSON.stringify(DB));return true}catch(e){return false}}
function me(){try{var s=localStorage.getItem("tp_sess");return DB.users.filter(function(u){return u.id===s})[0]||null}catch(e){return null}}
function login(id,pw){id=id.toLowerCase();var u=DB.users.filter(function(x){return(String(x.user).toLowerCase()===id||String(x.email).toLowerCase()===id)&&x.hash===hp(pw)})[0];if(u){try{localStorage.setItem("tp_sess",u.id)}catch(e){}}return u||null}
function logout(){try{localStorage.removeItem("tp_sess")}catch(e){}}
(function(){T=DB.therapists;WA=DB.settings.wa;
PROD=DB.products.map(function(p){return[p.name,p.size,money(p.price),p.desc,p.img,p.old,p.stock,p.imgs||[]]});
COURSE=DB.courses.map(function(c){return[c.title,c.level,c.dur,money(c.price),c.mods,c.desc||""]});
ART=DB.articles.map(function(a){return[a.cat,a.title,a.intro,a.body]})})();
