
(function(){
'use strict';
var BASE='https://bracescare.vn';
var FB='https://www.facebook.com/profile.php?id=61594733152225';
var MS='https://m.me/61594733152225';
/* Dán địa chỉ Web App của Google Apps Script vào đây để gửi đơn về Google Sheets (xem README.md). Để trống = không gửi. */
var SHEETS_URL='';
var MAPS='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('79 Hồ Tùng Mậu, Hà Nội');
var DISC='BracesCare là đề tài phục vụ học phần Marketing số của sinh viên, hoạt động phi lợi nhuận và không có xung đột về nội dung cũng như tranh chấp với các thương hiệu khác.';
var IMG={"hero": "assets/images/hero.jpg", "hero_banner": "assets/images/hero-banner.jpg", "heads4": "assets/images/heads4.jpg", "tall8": "assets/images/tall8.jpg", "eco": "assets/images/eco.jpg", "go": "assets/images/go.jpg", "tt": "assets/images/tt.jpg", "food": "assets/images/food.jpg", "pk_kit": "assets/images/pk-kit.jpg", "pk_single": "assets/images/pk-single.jpg", "pk_refill": "assets/images/pk-refill.jpg", "group": "assets/images/group.jpg", "compare": "assets/images/compare.jpg", "xanh": "assets/images/xanh.jpg", "tim": "assets/images/tim.jpg", "hong": "assets/images/hong.jpg", "banner": "assets/images/banner.jpg", "mascot": "assets/images/mascot.jpg"};
var main=document.getElementById('main');
var LD=[];

/* ---------- Helpers ---------- */
function fdate(d){return new Date(d).toLocaleDateString('vi-VN',{day:'numeric',month:'long',year:'numeric'});}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function setMeta(sel,val){var el=document.querySelector(sel);if(el)el.setAttribute('content',val);}
function seo(o){
  var url=BASE+(o.path==='/'?'/':o.path);
  document.title=o.title;
  setMeta('meta[name="description"]',o.desc);
  document.getElementById('canonical').setAttribute('href',url);
  setMeta('meta[property="og:title"]',o.title);
  setMeta('meta[property="og:description"]',o.desc);
  setMeta('meta[property="og:url"]',url);
  setMeta('meta[property="og:type"]',o.type||'website');
  document.getElementById('ld-page').textContent=JSON.stringify(LD.map(function(x){x['@context']='https://schema.org';return x;}));
}
function crumbs(items){
  var all=[['Trang chủ','/']].concat(items);
  LD.push({'@type':'BreadcrumbList',itemListElement:all.map(function(c,i){return {'@type':'ListItem',position:i+1,name:c[0],item:BASE+(c[1]==='/'?'/':c[1])};})});
  return '<nav class="crumbs" aria-label="Đường dẫn"><div class="wrap"><ol>'+all.map(function(c,i){
    return i===all.length-1?'<li aria-current="page">'+c[0]+'</li>':'<li><a href="#'+c[1]+'">'+c[0]+'</a></li>';
  }).join('')+'</ol></div></nav>';
}
function img(key,alt,w,h,extra){
  return '<img src="'+IMG[key]+'" alt="'+esc(alt)+'" width="'+w+'" height="'+h+'" loading="lazy"'+(extra||'')+'>';
}

var ALT={
  hero:'Ba đầu chải BracesCare: đầu V, đầu nhọn và đầu cụm, phía sau là hàm răng đeo mắc cài',
  heads4:'Minh họa cách dùng ba đầu chải BracesCare: đầu V ôm mắc cài, đầu nhọn vào kẽ răng, đầu cụm chải kỹ từng vùng',
  tall8:'Thân bàn chải BracesCare và ba đầu chải thay thế, kèm thông tin về khớp nối và TimeTrack Bristles',
  eco:'Banner Thay đầu, khỏi thay thân: một thân bàn chải BracesCare dùng với nhiều đầu chải, giảm rác thải nhựa',
  go:'Thân tháo lắp BracesCare on-the-go: hộp đựng gọn nhẹ mang đi học, đi làm, đi chơi',
  tt:'TimeTrack Bristles: lông bàn chải phai dần sang màu trắng sau 3 tháng để nhắc thay đầu chải',
  food:'Infographic: đồ dính, đồ cứng, đồ xơ dễ làm bung mắc cài và 3 bước vệ sinh răng niềng tại bàn ăn',
  group:'Ba thân bàn chải BracesCare màu xanh, tím và hồng trên bục trưng bày',
  compare:'So sánh bàn chải BracesCare đầu lông hình trái tim với bàn chải thường đầu lông phẳng',
  banner:'Banner BracesCare: bàn chải chuyên biệt cho niềng răng, linh vật chiếc răng đeo mắc cài',
  mascot:'Linh vật BracesCare: chiếc răng đeo mắc cài nháy mắt, cầm bàn chải',
  xanh:'Thân bàn chải BracesCare màu xanh pastel',tim:'Thân bàn chải BracesCare màu tím pastel',hong:'Thân bàn chải BracesCare màu hồng pastel',
  pk_kit:'Hộp BracesCare Starter Kit gồm một thân bàn chải và ba đầu chải',
  pk_single:'Bàn chải BracesCare đóng vỉ, thông điệp Clean Braces Happy You',
  pk_refill:'Hộp BracesCare Interchangeable Heads Refill gồm ba đầu chải thay thế'
};

var ICONS={
  heart:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M24 41C10 31 6 24 6 17a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 7-4 14-18 24z"/></svg>',
  school:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 18L24 8l20 10-20 10z"/><path d="M12 23v10c0 3 6 6 12 6s12-3 12-6V23"/></svg>',
  leaf:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M40 8C16 8 8 20 8 30c0 4 3 8 8 8 12 0 24-8 24-30z"/><path d="M8 40c6-12 14-18 22-22"/></svg>',
  swap:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};

var ORBIT='<svg class="orbit" viewBox="0 0 600 600" aria-hidden="true"><defs><linearGradient id="og" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#27B3E6"/><stop offset="1" stop-color="#7A4FD8"/></linearGradient></defs>'+
 '<ellipse cx="300" cy="300" rx="285" ry="105" transform="rotate(-28 300 300)" fill="none" stroke="url(#og)" stroke-width="16" stroke-linecap="round"/>'+
 '<ellipse cx="300" cy="300" rx="262" ry="86" transform="rotate(-28 300 300)" fill="none" stroke="url(#og)" stroke-width="5" stroke-linecap="round" opacity=".55"/></svg>';
var SPARK='<svg class="spark" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 2c1.6 11 9.4 19.6 22 22-12.6 2.4-20.4 11-22 22-1.6-11-9.4-19.6-22-22C14.6 21.6 22.4 13 24 2z" fill="url(#og)"/></svg>';

/* ---------- Data ---------- */
var HEADS=[
 {k:'',name:'Đầu V',desc:'Thiết kế ôm theo vùng mắc cài, hỗ trợ làm sạch quanh dây cung và mắc cài. Lông trong 2mm mềm tròn làm sạch mắc cài và mảng bám, lông ngoài siêu mảnh chạm sâu vào vùng khó sau dây cung.',shape:'Hình trái tim, rãnh V ở giữa',bristle:'3X lông mềm: lông trong 2mm mềm tròn, lông ngoài siêu mảnh',use:'Làm sạch quanh mắc cài và dây cung'},
 {k:'n',name:'Đầu nhọn',desc:'Thuôn dài, nhọn dần về đỉnh như hình nón, lông siêu mảnh và siêu mềm. Hỗ trợ tiếp cận những vị trí nhỏ hẹp, kẽ răng và các góc khó vệ sinh trong răng niềng.',shape:'Thuôn dài, nhọn dần như hình nón',bristle:'Lông siêu mảnh, siêu mềm',use:'Tiếp cận vị trí nhỏ hẹp, kẽ răng, góc khó'},
 {k:'c',name:'Đầu cụm',desc:'Đầu tròn nhỏ như một cụm lông bàn chải đơn, lông siêu mảnh và siêu mềm. Lông chải tập trung, hỗ trợ làm sạch từng vùng răng một cách kỹ lưỡng.',shape:'Tròn nhỏ như một cụm lông đơn',bristle:'Lông siêu mảnh, siêu mềm',use:'Làm sạch kỹ từng vùng răng'}
];
var COMMON_USE='Nghiêng bàn chải khoảng 45 độ về phía viền nướu, đặt phần lõm ở giữa đầu V ôm mắc cài rồi chải nhẹ theo vòng tròn nhỏ. Chải nửa trên và nửa dưới của mỗi mắc cài. Dùng đầu nhọn cho kẽ răng và góc khó, đầu cụm để chải kỹ từng vùng. Chải ít nhất 2 phút, 2 lần mỗi ngày.';
var PRODUCTS=[
 {slug:'bracescare-starter-kit',name:'BracesCare Starter Kit',type:'Bộ một thân bàn chải và ba đầu chải',img:'pk_kit',w:508,h:840,badge:'Bộ khởi đầu',colors:true,
  short:'Một thân bàn chải cùng ba đầu chải chuyên dụng: đầu V, đầu nhọn và đầu cụm. Đủ để chăm sóc răng niềng từ mắc cài đến kẽ răng.',
  desc:'BracesCare Starter Kit: một thân bàn chải và ba đầu chải V, nhọn, cụm cho người niềng răng. Dễ thay đầu, làm sạch hiệu quả, gọn nhẹ khi di chuyển.',
  who:'Người mới bắt đầu niềng răng',incl:['1 thân bàn chải BracesCare','1 đầu chải V','1 đầu chải nhọn','1 đầu chải cụm'],
  feats:['Làm sạch hiệu quả quanh mắc cài và dây cung','Êm dịu với nướu nhờ lông siêu mảnh, siêu mềm','Dễ thay đầu chỉ với một thao tác','Gọn nhẹ, mang theo khi đi học, đi làm']},
 {slug:'bracescare-ban-chai-don',name:'Bàn chải BracesCare',type:'Bàn chải niềng răng đầu V',img:'pk_single',w:198,h:869,colors:true,
  short:'Bàn chải một thân với đầu V ôm mắc cài, thông điệp Clean Braces, Happy You dành cho người niềng răng.',
  desc:'Bàn chải BracesCare đầu V dành cho người niềng răng: ôm vùng mắc cài, làm sạch quanh dây cung, thân tháo lắp để thay đầu về sau.',
  who:'Người niềng răng muốn bắt đầu gọn nhẹ',incl:['1 bàn chải BracesCare kèm đầu V'],
  feats:['Đầu V ôm vùng mắc cài','Lông ngoài siêu mảnh chạm vào vùng sau dây cung','Thân tháo lắp, có thể thay đầu về sau','Thiết kế dành riêng cho người niềng răng']},
 {slug:'bracescare-dau-chai-thay-the',name:'Bộ 3 đầu chải thay thế',type:'Interchangeable Heads Refill',img:'pk_refill',w:286,h:632,
  short:'Ba đầu chải V, nhọn, cụm để thay mới mỗi khoảng 3 tháng. Giữ nguyên thân, chỉ thay đầu.',
  desc:'Bộ 3 đầu chải thay thế BracesCare gồm đầu V, đầu nhọn, đầu cụm. Thay đầu, giữ thân để vệ sinh tốt và giảm rác thải nhựa.',
  who:'Người đã có thân bàn chải BracesCare',incl:['1 đầu chải V','1 đầu chải nhọn','1 đầu chải cụm'],
  feats:['Thay đầu mới khoảng 3 tháng một lần','Giữ nguyên thân, tiết kiệm hơn','Giảm rác thải nhựa so với thay cả bàn chải','Lắp vào thân chỉ với một thao tác']}
];
PRODUCTS.forEach(function(p){p.alt=ALT[p.img];});
/* Giá: điền số vào thuộc tính price của từng sản phẩm (ví dụ price:129000). Chưa có giá thì hiển thị "xxx đ". */
function priceOf(p){return (typeof p.price==='number')?p.price.toLocaleString('vi-VN')+'đ':'xxx đ';}
var COLORS=[{name:'Xanh pastel',img:'xanh'},{name:'Tím pastel',img:'tim'},{name:'Hồng pastel',img:'hong'}];

var POSTS=[
 {slug:'dau-v-dau-nhon-dau-cum',title:'Đầu V, đầu nhọn, đầu cụm: dùng đầu chải nào cho răng niềng?',desc:'Phân biệt ba loại đầu chải BracesCare và cách dùng từng loại: đầu V quanh mắc cài, đầu nhọn cho kẽ răng, đầu cụm cho từng vùng răng.',date:'2026-10-12',read:'5 phút đọc',cat:'Sản phẩm',img:'heads4',
  body:()=>`<figure class="fig">${img('heads4',ALT.heads4,1100,780)}<figcaption>Ba đầu chải BracesCare và cách mỗi đầu tiếp cận răng niềng.</figcaption></figure>
<p>Răng niềng có nhiều vị trí khác nhau: quanh mắc cài, dưới dây cung, kẽ răng và những góc răng mọc chen. Vì vậy BracesCare không dùng một đầu chải cho tất cả, mà chia thành ba đầu, mỗi đầu đảm nhận một việc.</p>
<h2>Đầu V: ôm mắc cài</h2><p>Đầu V có rãnh ở giữa, thiết kế ôm theo vùng mắc cài và hỗ trợ làm sạch quanh dây cung. Lông trong dài 2mm, mềm và tròn đầu để làm sạch mắc cài và mảng bám. Lông ngoài siêu mảnh chạm sâu vào những vùng khó, nhất là phía sau dây cung.</p>
<h2>Đầu nhọn: vào kẽ răng và góc khó</h2><p>Đầu nhọn thuôn dài, nhọn dần về đỉnh như hình nón, với lông siêu mảnh và siêu mềm. Đầu này hỗ trợ tiếp cận những vị trí nhỏ hẹp, kẽ răng và các góc khó vệ sinh trong răng niềng.</p>
<h2>Đầu cụm: chải kỹ từng vùng</h2><p>Đầu cụm có dạng tròn nhỏ như một cụm lông bàn chải đơn. Lông tập trung giúp bạn dừng lại và làm sạch kỹ từng vùng răng, ví dụ quanh một mắc cài hay một chiếc răng mọc lệch.</p>
<h2>Gợi ý cách phối hợp</h2><ol><li>Dùng đầu V để chải toàn bộ hàm răng, đặc biệt quanh mắc cài.</li><li>Đổi sang đầu nhọn cho kẽ răng và những góc khó.</li><li>Dùng đầu cụm để chải kỹ những vùng bạn thấy còn bám thức ăn.</li></ol>
<p>Cả ba đầu đều gắn vào cùng một thân bàn chải bằng khớp nối gài chắc chắn, nên bạn đổi đầu chỉ với một thao tác. Xem thêm <a class="link" href="#/san-pham/bracescare-starter-kit">BracesCare Starter Kit</a>.</p>`},
 {slug:'thay-dau-khoi-thay-than',title:'Thay đầu, khỏi thay thân: cách giảm rác thải nhựa mỗi lần đánh răng',desc:'Một thân bàn chải dùng với nhiều đầu chải thay thế giúp tiết kiệm chi phí và giảm rác thải nhựa. Tìm hiểu ý tưởng Thay đầu, khỏi thay thân của BracesCare.',date:'2026-10-10',read:'4 phút đọc',cat:'Bền vững',img:'eco',
  body:()=>`<figure class="fig">${img('eco',ALT.eco,1300,680)}<figcaption>Một thân bàn chải, ba đầu chải: dùng được nhiều lần hơn.</figcaption></figure>
<p>Bàn chải thường phải bỏ cả cây sau vài tháng, dù phần cán vẫn còn dùng tốt. Với người niềng răng, bàn chải còn mòn nhanh hơn vì phải chải nhiều góc, nên lượng bàn chải bỏ đi càng nhiều.</p>
<h2>Ý tưởng một thân, ba đầu</h2><p>BracesCare tách bàn chải thành hai phần: thân và đầu chải. Khi lông chải đến lúc cần thay, bạn chỉ thay đầu, giữ nguyên thân. Một thân bàn chải đi cùng ba đầu chải nghĩa là dùng được nhiều lần hơn.</p>
<h2>Ba lợi ích</h2><ul><li><strong>Giảm rác thải nhựa:</strong> phần thân được giữ lại, chỉ phần đầu chải được thay.</li><li><strong>Tiết kiệm chi phí:</strong> mua bộ đầu chải thay thế thường gọn hơn mua cả bàn chải mới.</li><li><strong>Vì môi trường bền vững:</strong> mỗi thay đổi nhỏ trong thói quen hằng ngày đều góp phần bảo vệ hành tinh xanh.</li></ul>
<h2>Khi nào cần thay đầu?</h2><p>Khoảng 3 tháng một lần, hoặc sớm hơn nếu lông bị xòe. BracesCare có TimeTrack Bristles giúp bạn nhận biết thời điểm này: lông chải phai dần sang màu trắng khi đến hạn thay. Đọc thêm trong bài <a class="link" href="#/blog/timetrack-bristles-khi-nao-thay-dau-chai">TimeTrack Bristles</a>.</p>
<p>Thay đổi nhỏ, tác động lớn. Xem <a class="link" href="#/san-pham/bracescare-dau-chai-thay-the">bộ 3 đầu chải thay thế</a>.</p>`},
 {slug:'timetrack-bristles-khi-nao-thay-dau-chai',title:'TimeTrack Bristles: lông chải đổi màu báo khi nào cần thay đầu',desc:'TimeTrack Bristles giúp bạn biết lúc nào nên thay đầu chải: lông phai dần sang màu trắng sau khoảng 3 tháng. Giữ thân, thay đầu để vệ sinh tốt hơn.',date:'2026-10-08',read:'3 phút đọc',cat:'Sản phẩm',img:'tt',
  body:()=>`<figure class="fig">${img('tt',ALT.tt,1000,908)}<figcaption>Lông chải phai màu dần theo thời gian sử dụng.</figcaption></figure>
<p>Nhiều người chỉ thay bàn chải khi lông đã xòe rõ rệt, trong khi lông cũ làm sạch kém từ trước đó. TimeTrack Bristles giúp bạn không phải nhớ ngày thay.</p>
<h2>TimeTrack Bristles hoạt động thế nào?</h2><p>Lông chải của BracesCare có màu đậm khi mới dùng, phai dần sau khoảng 1,5 tháng và chuyển gần như trắng sau 3 tháng. Khi thấy lông đã nhạt màu, đó là tín hiệu bạn nên thay đầu chải mới.</p>
<h2>Giữ thân, thay đầu</h2><ul><li><strong>Đảm bảo vệ sinh:</strong> luôn dùng lông chải còn tốt.</li><li><strong>Hiệu quả lâu dài:</strong> thân bàn chải dùng được qua nhiều lần thay đầu.</li></ul>
<h2>Khi nào thay sớm hơn?</h2><p>Hãy thay đầu sớm nếu lông bị xòe, bẹp hoặc bám cặn khó rửa, hoặc sau khi bạn bị ốm. Người niềng răng chải nhiều góc nên nên kiểm tra lông thường xuyên.</p>
<p>Tìm hiểu thêm: <a class="link" href="#/blog/khi-nao-nen-thay-ban-chai">Bao lâu nên thay bàn chải đánh răng?</a></p>`},
 {slug:'ke-thu-so-1-lam-bung-mac-cai',title:'Món nào là “kẻ thù” số 1 làm bung mắc cài? Cách vệ sinh răng niềng tại bàn ăn',desc:'Đồ dính, đồ cứng, đồ xơ là ba nhóm thực phẩm dễ làm bung mắc cài. Xem cách tránh và 3 bước vệ sinh răng niềng cấp tốc ngay tại bàn ăn.',date:'2026-10-06',read:'4 phút đọc',cat:'Chăm sóc răng',img:'food',
  body:()=>`<figure class="fig">${img('food',ALT.food,900,900)}<figcaption>Ba nhóm thực phẩm cần cẩn thận khi niềng răng.</figcaption></figure>
<p>Ăn ngon nhưng đừng để mắc cài “kêu cứu”. Một số nhóm thực phẩm dễ làm bung mắc cài hoặc kẹt vào dây cung hơn những món khác.</p>
<h2>Đồ dính</h2><p>Kẹo dẻo, kẹo caramel hay nougat dễ bám vào mắc cài và khó làm sạch. Nếu muốn ăn, hãy ăn ít và vệ sinh răng ngay sau đó.</p>
<h2>Đồ cứng</h2><p>Đá viên, hạt, bắp rang hay trái cây cứng cắn nguyên miếng tạo lực mạnh lên mắc cài. Bạn nên cắt nhỏ trái cây và rau củ cứng trước khi ăn.</p>
<h2>Đồ xơ</h2><p>Thịt xé sợi và rau xơ dễ mắc vào dây cung và kẽ răng. Hãy ăn chậm, cắt nhỏ và kiểm tra răng sau bữa ăn.</p>
<h2>3 bước vệ sinh răng niềng cấp tốc tại bàn ăn</h2><ol><li><strong>Súc miệng với nước sạch</strong> để loại bớt thức ăn còn sót.</li><li><strong>Kiểm tra và làm sạch nhẹ</strong> những chỗ bị kẹt thức ăn.</li><li><strong>Đánh răng khi có điều kiện.</strong> Chuẩn bị sẵn bộ dụng cụ vệ sinh nhỏ gọn trong túi để chủ động hơn sau mỗi bữa ăn.</li></ol>
<div class="note">Nếu mắc cài bị bung, dây cung lệch hoặc gây khó chịu, đừng tự ý tháo hay cố gắn lại. Hãy liên hệ bác sĩ chỉnh nha của bạn.</div>
<p>Muốn mang bàn chải đi ăn trưa? Xem <a class="link" href="#/blog/mang-ban-chai-nieng-rang-di-hoc-di-lam">cách mang bàn chải niềng răng đi học, đi làm</a>.</p>`},
 {slug:'ban-chai-nieng-chuyen-dung-va-ban-chai-thuong',title:'Bàn chải niềng chuyên dụng và bàn chải thường: đâu mới là chân lý?',desc:'So sánh bàn chải niềng chuyên dụng với bàn chải thường: khác nhau ở đầu lông, khả năng làm sạch quanh mắc cài và cách chọn phù hợp.',date:'2026-10-05',read:'4 phút đọc',cat:'So sánh',img:'compare',
  body:()=>`<figure class="fig">${img('compare',ALT.compare,760,744)}<figcaption>Bàn chải BracesCare đầu lông hình trái tim và bàn chải thường đầu lông phẳng.</figcaption></figure>
<p>Đứng trước quầy bàn chải, nhiều người niềng răng băn khoăn: có thật sự cần bàn chải riêng, hay bàn chải thường vẫn dùng được? Câu trả lời nằm ở chỗ răng niềng khác răng bình thường ở điểm nào.</p>
<h2>Bàn chải thường được thiết kế cho ai?</h2><p>Bàn chải thường có đầu lông phẳng, phù hợp với hàm răng không gắn mắc cài. Khi gặp mắc cài và dây cung, phần lông phẳng dễ bị đẩy ra, khiến vùng sát chân mắc cài và dưới dây cung khó được chải tới.</p>
<h2>Răng niềng cần gì khác?</h2><p>Răng niềng có nhiều góc khuất hơn, nên bàn chải cần len được quanh mắc cài, sát viền nướu và vào những vị trí răng mọc chen.</p>
<h2>BracesCare khác ở đâu?</h2><ul><li><strong>Ba đầu chải chuyên dụng:</strong> đầu V ôm mắc cài, đầu nhọn vào kẽ răng, đầu cụm chải kỹ từng vùng.</li><li><strong>Lông siêu mảnh, siêu mềm</strong> để êm dịu với nướu.</li><li><strong>Thay đầu, giữ thân:</strong> tiết kiệm hơn và giảm rác thải nhựa.</li></ul>
<h2>Vậy đâu mới là chân lý?</h2><p>Không bàn chải nào thay thế được kỹ thuật chải đúng và thói quen đều đặn. Bàn chải chuyên dụng giúp việc chải quanh mắc cài dễ hơn, còn hiệu quả cuối cùng phụ thuộc vào cách bạn chải và việc tái khám đúng hẹn.</p>
<p>Xem thêm: <a class="link" href="#/blog/cach-danh-rang-khi-nieng-rang">Cách đánh răng khi niềng răng trong 6 bước</a>.</p>`},
 {slug:'mang-ban-chai-nieng-rang-di-hoc-di-lam',title:'Mang bàn chải niềng răng đi học, đi làm, đi chơi: gọn nhẹ và vệ sinh',desc:'Thân bàn chải tháo lắp và hộp đựng gọn giúp bạn chăm sóc răng niềng ngay sau bữa trưa. Mẹo mang bàn chải đi học, đi làm, đi du lịch.',date:'2026-10-04',read:'4 phút đọc',cat:'Mẹo hay',img:'go',
  body:()=>`<figure class="fig">${img('go',ALT.go,900,900)}<figcaption>Thân tháo lắp on-the-go: gọn nhẹ cùng bạn đi học, đi làm, đi chill.</figcaption></figure>
<p>Răng niềng cần được làm sạch sau mỗi bữa ăn, kể cả bữa trưa ở trường hay công sở. Một bộ bàn chải gọn nhẹ là điều kiện để bạn duy trì thói quen này.</p>
<h2>Thân tháo lắp, mang đi dễ dàng</h2><p>Thân bàn chải BracesCare có thể tháo rời để cất gọn vào hộp đựng. Khớp nối dùng chân gấp định vị cùng trục truyền động hình sao, kết hợp chi tiết kết nối dual-lock để gài chắc chắn. Việc tháo lắp chỉ cần một thao tác.</p>
<h2>Mẹo mang bàn chải đi cả ngày</h2><ul><li>Cất bàn chải vào hộp đựng riêng, bỏ ngăn nhỏ của balo hoặc túi xách.</li><li>Đánh răng sau bữa trưa nếu có điều kiện, hoặc súc miệng kỹ bằng nước sạch.</li><li>Để bàn chải khô trước khi đóng hộp.</li><li>Rửa sạch hộp đựng thường xuyên.</li></ul>
<h2>Khi đi du lịch</h2><p>Đem theo bộ khởi đầu gồm thân và ba đầu chải để bạn có đủ công cụ làm sạch quanh mắc cài, kẽ răng và những góc khó ở bất kỳ đâu. Xem <a class="link" href="#/san-pham/bracescare-starter-kit">BracesCare Starter Kit</a>.</p>`},
 {slug:'cach-danh-rang-khi-nieng-rang',title:'Cách đánh răng khi niềng răng đúng kỹ thuật trong 6 bước',desc:'Hướng dẫn từng bước đánh răng khi niềng: chải viền nướu, quanh mắc cài, dưới dây cung và mẹo giữ răng sạch cả ngày.',date:'2026-09-28',read:'5 phút đọc',cat:'Hướng dẫn',img:'hero',
  body:()=>`<p>Khi niềng răng, thức ăn và mảng bám dễ đọng quanh mắc cài và dây cung hơn bình thường. Đánh răng đúng kỹ thuật là cách đơn giản nhất để bảo vệ nướu và men răng trong suốt quá trình chỉnh nha.</p>
<h2>Chuẩn bị trước khi chải</h2><p>Súc miệng bằng nước sạch để loại bớt thức ăn còn sót. Chọn bàn chải đầu nhỏ, lông mềm, tốt nhất có thiết kế ôm mắc cài như đầu V của BracesCare.</p>
<h2>6 bước đánh răng khi niềng</h2><ol><li><strong>Chải viền nướu.</strong> Nghiêng bàn chải khoảng 45 độ về phía nướu, chải theo vòng tròn nhỏ với lực nhẹ.</li><li><strong>Chải phía trên mắc cài.</strong> Hướng lông bàn chải xuống, chải từng răng một.</li><li><strong>Chải phía dưới mắc cài.</strong> Hướng lông bàn chải lên, chải tương tự cho từng răng.</li><li><strong>Chải mặt trong của răng.</strong> Dựng đầu bàn chải theo chiều dọc để chải các răng cửa mặt trong.</li><li><strong>Chải mặt nhai.</strong> Chải qua lại nhẹ nhàng trên các răng hàm.</li><li><strong>Làm sạch vùng khó.</strong> Dùng đầu nhọn cho kẽ răng và góc khó, đầu cụm cho vùng còn bám thức ăn, rồi súc miệng sạch.</li></ol>
<h2>Nên chải bao lâu?</h2><p>Hãy chải ít nhất 2 phút, hai lần mỗi ngày. Nếu có điều kiện, bạn nên đánh răng sau mỗi bữa ăn chính vì thức ăn rất dễ kẹt quanh mắc cài.</p>
<h2>Lưu ý nhỏ nhưng quan trọng</h2><ul><li>Không chải quá mạnh, vì có thể làm tổn thương nướu và làm bong mắc cài.</li><li>Thay đầu chải khoảng 3 tháng một lần, hoặc sớm hơn khi lông bị xòe.</li><li>Tái khám đúng hẹn để bác sĩ kiểm tra tình trạng răng và nướu.</li></ul>`},
 {slug:'chon-ban-chai-cho-nguoi-nieng-rang',title:'Cách chọn bàn chải cho người niềng răng: 5 tiêu chí cần biết',desc:'Kiểu đầu lông, độ mềm, kích thước đầu, thân bàn chải và thời điểm thay: 5 tiêu chí giúp bạn chọn bàn chải phù hợp khi niềng răng.',date:'2026-09-15',read:'4 phút đọc',cat:'Chọn mua',img:'heads4',
  body:()=>`<p>Bàn chải thường được thiết kế cho hàm răng đều và không có mắc cài. Với răng niềng, bạn cần thêm vài tiêu chí để chọn đúng sản phẩm.</p>
<h2>1. Kiểu đầu lông: ưu tiên đầu ôm mắc cài</h2><p>Đầu có rãnh V ở giữa giúp ôm vùng mắc cài, trong khi lông hai bên chạm tới mặt răng phía trên và phía dưới mắc cài.</p>
<h2>2. Độ mềm của lông</h2><p>Chọn lông mềm, lông siêu mảnh, đầu lông tròn. Nướu của người niềng răng thường nhạy cảm hơn, đặc biệt trong vài tuần đầu và sau mỗi lần siết dây.</p>
<h2>3. Kích thước đầu bàn chải</h2><p>Đầu nhỏ giúp bạn xoay xở sau răng hàm và những vị trí răng mọc chen. Đầu quá lớn dễ bị mắc cài cản trở.</p>
<h2>4. Có đầu chuyên cho kẽ răng và góc khó</h2><p>Một chiếc bàn chải có thêm đầu nhọn và đầu cụm sẽ giúp bạn làm sạch triệt để hơn những vị trí bàn chải thường khó với tới.</p>
<h2>5. Khả năng thay đầu</h2><p>Bàn chải thay được đầu giúp bạn luôn dùng lông mới mà không phải bỏ cả cây, tiết kiệm hơn và giảm rác thải nhựa.</p>
<div class="note">Mỗi người có tình trạng răng khác nhau. Nếu bác sĩ chỉnh nha có hướng dẫn riêng, hãy ưu tiên làm theo hướng dẫn đó.</div>`},
 {slug:'sai-lam-khi-cham-soc-rang-nieng',title:'5 sai lầm thường gặp khi chăm sóc răng niềng',desc:'Chải quá mạnh, chỉ chải mặt ngoài, dùng bàn chải đã xòe lông: 5 sai lầm phổ biến khiến răng niềng khó sạch.',date:'2026-08-30',read:'4 phút đọc',cat:'Chăm sóc răng',img:'xanh',
  body:()=>`<p>Nhiều người niềng răng rất chăm đánh răng nhưng vẫn gặp tình trạng hôi miệng, nướu sưng hoặc xuất hiện vệt trắng trên men răng. Nguyên nhân thường nằm ở những thói quen nhỏ dưới đây.</p>
<h2>1. Chải quá mạnh</h2><p>Chải mạnh không làm răng sạch hơn mà có thể làm tổn thương nướu và khiến lông bàn chải nhanh bị xòe.</p>
<h2>2. Chỉ chải mặt ngoài</h2><p>Mặt trong và mặt nhai của răng cũng tích tụ mảng bám. Hãy chải đủ các mặt của từng răng.</p>
<h2>3. Bỏ qua kẽ răng và dưới dây cung</h2><p>Những vị trí này dễ bám thức ăn nhất. Hãy dùng đầu chải nhỏ, nhọn để làm sạch.</p>
<h2>4. Dùng bàn chải đã xòe lông</h2><p>Lông xòe không còn ôm được mắc cài và làm sạch kém hơn. Nên thay đầu chải khoảng 3 tháng một lần.</p>
<h2>5. Chải vội vàng</h2><p>Răng niềng cần nhiều thời gian hơn để chải sạch. Hãy dành ít nhất 2 phút cho mỗi lần chải, chia đều giữa hàm trên và hàm dưới.</p>`},
 {slug:'khi-nao-nen-thay-ban-chai',title:'Bao lâu nên thay bàn chải đánh răng? Những dấu hiệu cần thay ngay',desc:'Nên thay bàn chải hoặc đầu chải khoảng 3 tháng một lần. Xem các dấu hiệu cần thay sớm, đặc biệt với người niềng răng.',date:'2026-08-12',read:'3 phút đọc',cat:'Kiến thức',img:'hong',
  body:()=>`<p>Bàn chải cũ làm sạch kém hơn và có thể tích tụ vi khuẩn. Với người niềng răng, bàn chải còn phải len vào nhiều góc nên lông thường xuống cấp nhanh hơn.</p>
<h2>Thay bao lâu một lần?</h2><p>Khuyến nghị phổ biến là khoảng 3 tháng một lần. Nếu bạn niềng răng và chải kỹ quanh mắc cài, hãy kiểm tra lông thường xuyên để thay sớm hơn khi cần.</p>
<h2>Dấu hiệu cần thay ngay</h2><ul><li>Lông bị xòe, bẹp hoặc cong.</li><li>Lông đổi màu hoặc bám cặn khó rửa sạch.</li><li>Bạn vừa bị ốm, đặc biệt là bệnh nhiễm khuẩn đường hô hấp hoặc miệng.</li><li>Bàn chải bị rơi xuống nơi mất vệ sinh.</li></ul>
<h2>Mẹo giữ bàn chải sạch</h2><p>Rửa kỹ bàn chải sau khi dùng, để khô thoáng và không dùng chung với người khác. Với bàn chải thay được đầu như BracesCare, bạn chỉ cần thay phần đầu chải.</p>`}
];

var FAQ=[
 ['Người niềng răng nên dùng bàn chải loại nào?','Nên chọn bàn chải đầu nhỏ, lông mảnh và mềm, thiết kế riêng cho răng niềng như đầu V ôm mắc cài. BracesCare có ba đầu chải: đầu V, đầu nhọn và đầu cụm. Nếu bác sĩ chỉnh nha có chỉ định riêng, hãy ưu tiên làm theo.'],
 ['Bao lâu nên thay đầu chải?','Khoảng 3 tháng một lần. Với BracesCare, lông chải phai dần sang màu trắng sau khoảng 3 tháng để nhắc bạn thay đầu (TimeTrack Bristles). Bạn chỉ cần thay đầu, giữ nguyên thân.'],
 ['BracesCare có dùng pin hay động cơ không?','Không. Khớp nối được thiết kế như bàn chải điện nhưng BracesCare là bàn chải thủ công, không dùng pin và không có động cơ.'],
 ['Đầu V, đầu nhọn, đầu cụm khác nhau thế nào?','Đầu V ôm vùng mắc cài và dây cung. Đầu nhọn tiếp cận kẽ răng và những góc khó. Đầu cụm có lông tập trung để làm sạch kỹ từng vùng răng.'],
 ['BracesCare có dùng được cho mắc cài sứ không?','Bàn chải được thiết kế cho răng đeo mắc cài. Nếu bạn dùng mắc cài sứ hoặc loại khí cụ khác, hãy nhắn tin cho fanpage để được tư vấn cụ thể.'],
 ['Mua bàn chải BracesCare ở đâu?','Bạn đặt hàng ngay trên trang Đặt hàng (đơn được gửi qua Messenger), hoặc nhắn tin cho fanpage BracesCare Vietnam trên Facebook để được tư vấn và cập nhật thông tin sản phẩm mới nhất.']
];

/* ---------- Components ---------- */
function pcard(p){
  return `<article class="pcard">${p.badge?'<span class="chip">'+p.badge+'</span>':''}
  <a class="pcard-art" href="#/san-pham/${p.slug}" tabindex="-1" aria-hidden="true">${img(p.img,p.alt,p.w,p.h)}</a>
  <h3><a href="#/san-pham/${p.slug}">${p.name}</a></h3><p class="pcard-sub">${p.type}</p><p class="price">${priceOf(p)}</p></article>`;
}
function bcard(b){
  return `<article class="post-card"><div class="post-art" aria-hidden="true"><img src="${IMG[b.img]}" alt="" loading="lazy"></div>
  <p class="post-meta">${b.cat} · ${fdate(b.date)}</p><h3><a href="#/blog/${b.slug}">${b.title}</a></h3><p>${b.desc}</p></article>`;
}
function ctaBand(title,text){
  return `<section class="sec sec-deep"><div class="wrap cta-band"><h2>${title}</h2><p class="lead">${text}</p><div class="btn-row"><a class="btn btn-primary" href="#/dat-hang">Đặt hàng</a><a class="btn btn-ghost" href="#/lien-he">Liên hệ BracesCare</a></div></div></section>`;
}
function headsGrid(){
  return '<div class="heads">'+HEADS.map(function(h){return `<div class="head-item ${h.k}"><h3>${h.name}</h3><p>${h.desc}</p></div>`;}).join('')+'</div>';
}

/* ---------- Pages ---------- */
function home(){
  LD.push({'@type':'FAQPage',mainEntity:FAQ.map(function(f){return {'@type':'Question',name:f[0],acceptedAnswer:{'@type':'Answer',text:f[1]}};})});
  seo({path:'/',title:'BracesCare | Bàn chải đánh răng chuyên biệt cho người niềng răng',desc:'BracesCare là bàn chải đánh răng chuyên biệt cho người niềng răng: một thân, ba đầu chải V, nhọn, cụm. Thay đầu, giữ thân. Xem sản phẩm và hướng dẫn chăm sóc răng niềng.'});
  return `
  <section class="hero hero-banner" aria-labelledby="h-hero">
    ${ORBIT}
    <div class="wrap hb-inner"><div class="hb-text">
    <span class="pill">Một thân, ba đầu chải</span>
    <h1 id="h-hero">Bàn chải đánh răng chuyên biệt cho người niềng răng</h1>
    <p class="lead">BracesCare là bàn chải một thân, ba đầu chải: đầu V ôm mắc cài, đầu nhọn vào kẽ răng, đầu cụm chải kỹ từng vùng. Chỉ cần thay đầu, giữ nguyên thân.</p>
    <div class="btn-row"><a class="btn btn-primary" href="#/dat-hang">Đặt hàng</a><a class="btn btn-ghost" href="#/san-pham">Xem sản phẩm</a></div>
    <p class="hero-note">Clean Braces, Happy You</p></div></div>
    ${img('hero_banner',ALT.hero,1024,1024,' class="hb-img" fetchpriority="high"').replace(' loading="lazy"','')}
    ${SPARK.replace('class="spark"','class="spark hb-spark"')}
  </section>

  <section class="facts-wrap" aria-label="Điểm nổi bật"><div class="wrap"><div class="facts">
  <div class="fact">${ICONS.swap}<div><h3>Một thân, ba đầu chải</h3><p>Đầu V, đầu nhọn, đầu cụm gắn vào cùng một thân.</p></div></div>
  <div class="fact">${ICONS.clock}<div><h3>TimeTrack Bristles</h3><p>Lông phai trắng sau khoảng 3 tháng để nhắc thay đầu.</p></div></div>
  <div class="fact">${ICONS.leaf}<div><h3>Thay đầu, khỏi thay thân</h3><p>Giảm rác thải nhựa và tiết kiệm chi phí.</p></div></div>
  </div></div></section>

  <section class="sec" aria-labelledby="h-vi-sao"><div class="wrap split top"><div><h2 id="h-vi-sao">Vì sao răng niềng khó sạch hơn?</h2><p class="lead">Mắc cài và dây cung tạo thêm nhiều góc khuất. Thức ăn và mảng bám dễ đọng lại ở những chỗ bàn chải phẳng không chạm tới.</p></div>
  <dl class="dl-rows"><div><dt>Quanh mắc cài</dt><dd>Lông phẳng bị mắc cài đẩy ra, để lại vùng sát chân mắc cài không được chải tới.</dd></div>
  <div><dt>Dọc viền nướu</dt><dd>Mảng bám tích tụ lâu ngày ở đây có thể gây viêm nướu, sưng và dễ chảy máu.</dd></div>
  <div><dt>Dưới dây cung và kẽ răng</dt><dd>Dây cung chắn lối của lông bàn chải. Bạn cần đầu nhỏ, lông mảnh để len vào.</dd></div>
  <div><dt>Sau khi tháo niềng</dt><dd>Nếu mảng bám tồn tại lâu, men răng quanh mắc cài có thể để lại vết trắng khi tháo niềng.</dd></div></dl></div></section>

  <section class="sec sec-lav" aria-labelledby="h-ba-dau"><div class="wrap"><h2 id="h-ba-dau">Ba đầu chải, mỗi đầu một việc</h2><p class="lead">Răng niềng có nhiều vị trí khác nhau, nên BracesCare chia thành ba đầu chải chuyên dụng.</p>
  <figure class="fig" style="margin-top:2rem">${img('heads4',ALT.heads4,1100,780)}</figure>${headsGrid()}
  <p style="margin-top:2rem"><a class="link" href="#/blog/dau-v-dau-nhon-dau-cum">Tìm hiểu cách dùng từng đầu chải</a></p></div></section>

  <section class="sec" aria-labelledby="h-mot-than"><div class="wrap split flip"><figure class="fig" style="max-width:440px;justify-self:center">${img('tall8',ALT.tall8,700,1050)}</figure>
  <div><h2 id="h-mot-than">Một thân bàn chải, thay đầu dễ dàng</h2><p class="lead">Khớp nối gài chắc chắn giúp bạn đổi đầu chải chỉ với một thao tác.</p>
  <ul class="ticks"><li><strong>Khớp nối thay đầu:</strong> thiết kế như bàn chải điện nhưng là bàn chải thủ công, không dùng pin, không động cơ.</li>
  <li><strong>TimeTrack Bristles:</strong> lông chải phai dần sang màu trắng sau khoảng 3 tháng để nhắc bạn thay đầu.</li>
  <li><strong>Giữ thân, thay đầu:</strong> đảm bảo vệ sinh và hiệu quả lâu dài.</li></ul>
  <div class="btn-row"><a class="btn btn-ghost" href="#/blog/timetrack-bristles-khi-nao-thay-dau-chai">Tìm hiểu TimeTrack Bristles</a></div></div></div></section>

  <section class="sec sec-sky" aria-labelledby="h-sp"><div class="wrap"><div class="sec-head"><h2 id="h-sp">Sản phẩm của BracesCare</h2><a class="link" href="#/san-pham">Xem tất cả sản phẩm</a></div>
  <div class="pgrid">${PRODUCTS.map(pcard).join('')}</div></div></section>

  <section class="sec" aria-labelledby="h-eco"><div class="wrap"><h2 id="h-eco">Thay đầu, khỏi thay thân</h2><p class="lead">Một thân bàn chải dùng với nhiều đầu chải thay thế. Thay đổi nhỏ, tác động lớn cho hành tinh xanh.</p>
  <figure class="fig" style="margin-top:2rem">${img('eco',ALT.eco,1300,680)}</figure>
  <div class="eco-points"><div><h3>Giảm rác thải nhựa</h3><p>Chỉ thay phần đầu chải, giữ lại phần thân.</p></div><div><h3>Tiết kiệm chi phí</h3><p>Một thân, ba đầu chải: dùng được nhiều lần hơn.</p></div><div><h3>Vì môi trường bền vững</h3><p>Mỗi thói quen nhỏ mỗi ngày đều góp phần bảo vệ hành tinh.</p></div></div>
  <p style="margin-top:2rem"><a class="link" href="#/blog/thay-dau-khoi-thay-than">Đọc ý tưởng Thay đầu, khỏi thay thân</a></p></div></section>

  <section class="sec sec-lav" aria-labelledby="h-go"><div class="wrap split"><figure class="fig" style="max-width:520px;justify-self:center">${img('go',ALT.go,900,900)}</figure>
  <div><h2 id="h-go">Gọn nhẹ cùng bạn đi học, đi làm, đi chill</h2><p class="lead">Thân bàn chải tháo lắp được, cất gọn trong hộp đựng để bạn chăm sóc răng niềng ngay sau bữa trưa.</p>
  <ul class="ticks"><li>Chân gấp định vị và trục truyền động hình sao</li><li>Chi tiết kết nối dual-lock chắc chắn</li><li>Tháo lắp dễ dàng chỉ với một thao tác</li></ul>
  <div class="btn-row"><a class="btn btn-ghost" href="#/blog/mang-ban-chai-nieng-rang-di-hoc-di-lam">Mẹo mang bàn chải đi cả ngày</a></div></div></div></section>

  <section class="sec" aria-labelledby="h-buoc"><div class="wrap"><h2 id="h-buoc">Ba bước chải sạch quanh mắc cài</h2>
  <ol class="steps"><li><h3>Chải viền nướu</h3><p>Nghiêng bàn chải khoảng 45 độ về phía nướu, chải nhẹ theo vòng tròn nhỏ.</p></li>
  <li><h3>Chải trên và dưới mắc cài</h3><p>Dùng đầu V ôm mắc cài, chải riêng nửa trên rồi nửa dưới của từng răng.</p></li>
  <li><h3>Làm sạch kẽ và vùng khó</h3><p>Đổi sang đầu nhọn cho kẽ răng, đầu cụm để chải kỹ từng vùng còn bám thức ăn.</p></li></ol>
  <p style="margin-top:2rem"><a class="link" href="#/blog/cach-danh-rang-khi-nieng-rang">Đọc hướng dẫn đầy đủ</a></p></div></section>

  <section class="sec sec-lav" aria-labelledby="h-blog"><div class="wrap"><div class="sec-head"><h2 id="h-blog">Kiến thức chăm sóc răng niềng</h2><a class="link" href="#/blog">Xem tất cả bài viết</a></div>
  <div class="bgrid">${POSTS.slice(0,3).map(bcard).join('')}</div></div></section>

  <section class="sec" aria-labelledby="h-faq"><div class="wrap"><h2 id="h-faq">Câu hỏi thường gặp</h2><div class="faq">
  ${FAQ.map(function(f){return `<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`;}).join('')}</div></div></section>
  ${ctaBand('Cần tư vấn chọn bàn chải cho răng niềng?','Nhắn tin cho fanpage, đội ngũ BracesCare sẽ giúp bạn chọn đúng sản phẩm.')}`;
}

function products(){
  seo({path:'/san-pham',title:'Sản phẩm bàn chải đánh răng niềng răng | BracesCare',desc:'Starter Kit, bàn chải BracesCare và bộ 3 đầu chải thay thế: đầu V, đầu nhọn, đầu cụm cho người niềng răng. Thay đầu, giữ thân.'});
  LD.push({'@type':'ItemList',itemListElement:PRODUCTS.map(function(p,i){return {'@type':'ListItem',position:i+1,url:BASE+'/san-pham/'+p.slug,name:p.name};})});
  return crumbs([['Sản phẩm','/san-pham']])+`
  <section class="page-head"><div class="wrap"><h1>Sản phẩm bàn chải đánh răng BracesCare</h1><p class="lead">Một thân bàn chải, ba đầu chải chuyên dụng cho người niềng răng. Chọn bộ khởi đầu hoặc mua riêng từng sản phẩm.</p><div class="btn-row"><a class="btn btn-primary" href="#/dat-hang">Đặt hàng</a></div></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap"><div class="pgrid">${PRODUCTS.map(pcard).join('')}</div></div></section>
  <section class="sec sec-lav" aria-labelledby="h-gia"><div class="wrap"><h2 id="h-gia">Bảng giá</h2><p class="lead">Giá đang được cập nhật. Phí vận chuyển và ưu đãi được fanpage xác nhận khi bạn đặt hàng.</p>
  <div class="table-wrap"><table><thead><tr><th scope="col">Sản phẩm</th><th scope="col">Trong bộ có</th><th scope="col">Giá</th></tr></thead><tbody>
  ${PRODUCTS.map(function(p){return `<tr><th scope="row"><a class="link" href="#/san-pham/${p.slug}">${p.name}</a></th><td>${p.incl.join(', ')}</td><td><strong>${priceOf(p)}</strong></td></tr>`;}).join('')}
  </tbody></table></div><div class="btn-row"><a class="btn btn-primary" href="#/dat-hang">Đặt hàng</a></div></div></section>
  <section class="sec" aria-labelledby="h-ss"><div class="wrap"><h2 id="h-ss">So sánh ba đầu chải</h2><div class="table-wrap"><table><thead><tr><th scope="col">Đầu chải</th><th scope="col">Hình dạng</th><th scope="col">Lông chải</th><th scope="col">Dùng để</th></tr></thead><tbody>
  ${HEADS.map(function(h){return `<tr><th scope="row">${h.name}</th><td>${h.shape}</td><td>${h.bristle}</td><td>${h.use}</td></tr>`;}).join('')}
  </tbody></table></div></div></section>
  <section class="sec sec-lav"><div class="wrap split"><figure class="fig">${img('tt',ALT.tt,1000,908)}</figure><div><h2>TimeTrack Bristles: biết khi nào cần thay đầu</h2><p class="lead">Lông chải phai dần sang màu trắng sau khoảng 3 tháng. Khi thấy lông nhạt màu, hãy thay đầu chải mới.</p><ul class="ticks"><li>Mới dùng: lông có màu đậm</li><li>Sau 1,5 tháng: lông bắt đầu phai màu</li><li>Sau 3 tháng: lông gần như trắng, đã đến lúc thay đầu</li></ul><p>Giữ thân, thay đầu để đảm bảo vệ sinh và hiệu quả lâu dài.</p></div></div></section>
  <section class="sec"><div class="wrap split"><div><h2>Thân bàn chải nhiều màu</h2><p class="lead">Thân bàn chải có các màu pastel xanh, tím, hồng để bạn chọn theo sở thích.</p><p>Muốn hiểu rõ hơn? Đọc bài <a class="link" href="#/blog/ban-chai-nieng-chuyen-dung-va-ban-chai-thuong">so sánh bàn chải niềng chuyên dụng và bàn chải thường</a> hoặc <a class="link" href="#/blog/chon-ban-chai-cho-nguoi-nieng-rang">5 tiêu chí chọn bàn chải cho người niềng răng</a>.</p></div><figure class="fig" style="max-width:420px;justify-self:center">${img('group',ALT.group,390,585)}</figure></div></section>`;
}

function product(slug){
  var p=PRODUCTS.filter(function(x){return x.slug===slug;})[0];
  if(!p)return notFound();
  seo({path:'/san-pham/'+p.slug,title:p.name+' - '+p.type,desc:p.desc,type:'product'});
  LD.push({'@type':'Product',name:p.name,description:p.desc,brand:{'@type':'Brand',name:'BracesCare'},category:'Bàn chải đánh răng',url:BASE+'/san-pham/'+p.slug});
  var rel=PRODUCTS.filter(function(x){return x.slug!==slug;});
  return crumbs([['Sản phẩm','/san-pham'],[p.name,'/san-pham/'+p.slug]])+`
  <section class="sec" style="padding-top:clamp(24px,4vw,48px)"><div class="wrap pd"><div class="pd-art">${img(p.img,p.alt,p.w,p.h,' fetchpriority="high"').replace('loading="lazy"','')}</div><div>
  <h1>${p.name}</h1><p class="muted" style="margin:0">${p.type}</p><p class="price detail-price">${priceOf(p)}</p><p class="disc" style="margin:0 0 1rem">Giá và phí vận chuyển được fanpage xác nhận khi bạn đặt hàng.</p><p>${p.short}</p>
  <ul class="ticks">${p.feats.map(function(f){return '<li>'+f+'</li>';}).join('')}</ul>
  <div class="btn-row"><a class="btn btn-primary" href="#/dat-hang/${p.slug}">Đặt hàng</a><a class="btn btn-ghost" href="${FB}" target="_blank" rel="noopener">Nhắn tin tư vấn</a></div>
  <h2 style="margin-top:2.4rem;font-size:1.6rem">Trong hộp có</h2><ul class="ticks" style="margin-top:.6rem">${p.incl.map(function(f){return '<li>'+f+'</li>';}).join('')}</ul>
  <h2 style="margin-top:2rem;font-size:1.6rem">Thông số</h2><dl class="specs"><div><dt>Phù hợp với</dt><dd>${p.who}</dd></div>${p.colors?'<div><dt>Màu thân</dt><dd>Xanh, tím, hồng pastel (chọn khi đặt hàng)</dd></div>':''}<div><dt>Khớp nối</dt><dd>Khớp gài chắc chắn, tháo lắp một thao tác</dd></div><div><dt>Nguồn</dt><dd>Bàn chải thủ công, không dùng pin, không động cơ</dd></div><div><dt>Lông chải</dt><dd>TimeTrack Bristles: phai sang màu trắng sau khoảng 3 tháng</dd></div></dl>
  <h2 style="margin-top:2rem;font-size:1.6rem">Cách dùng</h2><p>${COMMON_USE}</p></div></div></section>
  <section class="sec sec-lav"><div class="wrap"><h2>Ba đầu chải BracesCare</h2>${headsGrid()}</div></section>
  <section class="sec"><div class="wrap"><div class="sec-head"><h2>Sản phẩm khác</h2></div><div class="pgrid" style="grid-template-columns:repeat(auto-fit,minmax(220px,320px))">${rel.map(pcard).join('')}</div></div></section>`;
}

function brandHub(){
  seo({path:'/bracescare',title:'Về BracesCare | Thương hiệu bàn chải cho người niềng răng',desc:'Tìm hiểu câu chuyện thương hiệu, giá trị cốt lõi và trách nhiệm cộng đồng của BracesCare, thương hiệu bàn chải dành riêng cho người niềng răng.'});
  return crumbs([['BracesCare','/bracescare']])+`
  <section class="page-head"><div class="wrap"><h1>Về BracesCare</h1><p class="lead">BracesCare là thương hiệu bàn chải đánh răng dành riêng cho người niềng răng. Chúng tôi tin chăm sóc răng niềng đúng cách phải đơn giản, vui và thân thiện với môi trường.</p></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap hub">
  <a href="#/bracescare/cau-chuyen-thuong-hieu"><div><h2>Câu chuyện thương hiệu</h2><p>Vì sao BracesCare ra đời và chúng tôi muốn đi tới đâu.</p></div>${ICONS.arrow}</a>
  <a href="#/bracescare/gia-tri-cot-loi"><div><h2>Giá trị cốt lõi</h2><p>Bốn điều chúng tôi giữ vững khi thiết kế và vận hành.</p></div>${ICONS.arrow}</a>
  <a href="#/bracescare/trach-nhiem-cong-dong"><div><h2>Trách nhiệm cộng đồng</h2><p>Định hướng hoạt động của BracesCare cùng cộng đồng.</p></div>${ICONS.arrow}</a>
  </div></section>`;
}

function story(){
  seo({path:'/bracescare/cau-chuyen-thuong-hieu',title:'Câu chuyện thương hiệu BracesCare',desc:'BracesCare là góc chăm sóc răng miệng chuyên biệt, đồng hành cùng hội niềng trên hành trình tìm lại nụ cười. Đọc câu chuyện thương hiệu và ý nghĩa logo.'});
  return crumbs([['BracesCare','/bracescare'],['Câu chuyện thương hiệu','/bracescare/cau-chuyen-thuong-hieu']])+`
  <section class="page-head"><div class="wrap"><h1>Câu chuyện thương hiệu BracesCare</h1><p class="lead">Góc chăm sóc răng miệng chuyên biệt, đồng hành cùng hội niềng trên hành trình tìm lại nụ cười.</p></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap"><figure class="fig" style="margin-bottom:2.4rem">${img('banner',ALT.banner,1232,455)}</figure><div class="prose">
  <h2 style="margin-top:0">Từ nhu cầu của hội niềng</h2><p>Ai niềng răng cũng nhận ra điều này sau vài tuần đầu: chiếc bàn chải quen dùng không còn làm sạch như trước. Thức ăn kẹt quanh mắc cài, nướu dễ sưng và việc đánh răng mất nhiều thời gian hơn hẳn. BracesCare ra đời để việc chăm sóc răng niềng bớt vất vả hơn.</p>
  <h2>Một thân, ba đầu chải</h2><p>Thay vì một đầu chải cho mọi vị trí, BracesCare chia thành đầu V ôm mắc cài, đầu nhọn vào kẽ răng và đầu cụm chải kỹ từng vùng. Cả ba cùng gắn vào một thân bàn chải, nên bạn chỉ cần thay đầu, giữ thân.</p>
  <h2>Cái tên và chiếc logo</h2><p>Tên thương hiệu ghép từ <em>braces</em> (mắc cài) và <em>care</em> (chăm sóc). Logo là chữ B ôm lấy chiếc bàn chải và hàng mắc cài, với vòng cung xanh tím bao quanh gợi hành trình niềng răng đi đến nụ cười.</p>
  <h2>Clean Braces, Happy You</h2><p>Thông điệp của BracesCare: răng niềng sạch thì bạn vui. Linh vật là chiếc răng nháy mắt, đeo mắc cài và cầm bàn chải, luôn đồng hành cùng bạn mỗi lần đánh răng.</p>
  <figure class="fig" style="max-width:420px">${img('mascot',ALT.mascot,598,405)}</figure>
  <h2>Một dự án học tập, phi lợi nhuận</h2><p>${DISC}</p>
  <p style="margin-top:2rem"><a class="link" href="#/bracescare/gia-tri-cot-loi">Xem giá trị cốt lõi của BracesCare</a></p></div></div></section>
  ${ctaBand('Đồng hành cùng hành trình niềng răng của bạn','Khám phá bộ sản phẩm BracesCare hoặc nhắn tin cho fanpage để được tư vấn.')}`;
}

function values(){
  seo({path:'/bracescare/gia-tri-cot-loi',title:'Giá trị cốt lõi của BracesCare',desc:'Chuyên biệt, nhẹ nhàng, trung thực và bền vững: bốn giá trị cốt lõi định hình cách BracesCare thiết kế sản phẩm và làm việc.'});
  var V=[
   ['Chuyên biệt','Chúng tôi chỉ làm bàn chải cho người niềng răng và dành toàn bộ sự chú ý cho nhóm người dùng này.','Mỗi đầu chải ra đời để giải quyết một vị trí khó: quanh mắc cài, kẽ răng, từng vùng răng.'],
   ['Nhẹ nhàng','Răng và nướu đang chịu nhiều áp lực khi niềng. Việc chăm sóc không nên làm chúng đau thêm.','Chúng tôi chọn lông siêu mảnh, siêu mềm và hướng dẫn lực chải nhẹ trong mọi tài liệu.'],
   ['Trung thực','BracesCare nói đúng những gì sản phẩm làm được. Chúng tôi không hứa hẹn thay thế bác sĩ hay việc tái khám.','Thông tin sản phẩm và bài viết đều ghi rõ mang tính tham khảo.'],
   ['Bền vững','Một chiếc bàn chải dùng vài tháng rồi bỏ cả cây gây nhiều rác thải nhựa. Chúng tôi muốn việc đó nhẹ nhàng hơn với môi trường.','Thay đầu, khỏi thay thân: giữ lại thân bàn chải, chỉ thay đầu chải.']
  ];
  return crumbs([['BracesCare','/bracescare'],['Giá trị cốt lõi','/bracescare/gia-tri-cot-loi']])+`
  <section class="page-head"><div class="wrap"><h1>Giá trị cốt lõi của BracesCare</h1><p class="lead">Bốn điều chúng tôi giữ vững, từ thiết kế sản phẩm đến cách trò chuyện với khách hàng.</p></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap">${V.map(function(v){return `<div class="value"><h2>${v[0]}</h2><div><p>${v[1]}</p><p class="how">${v[2]}</p></div></div>`;}).join('')}</div></section>
  ${ctaBand('Giá trị nào cũng bắt đầu từ người dùng','Hãy cho chúng tôi biết bạn cần gì ở một chiếc bàn chải niềng răng.')}`;
}

function community(){
  seo({path:'/bracescare/trach-nhiem-cong-dong',title:'Trách nhiệm cộng đồng | BracesCare',desc:'Định hướng cộng đồng của BracesCare: Thay đầu, khỏi thay thân để giảm rác thải nhựa, hỗ trợ bộ chăm sóc răng niềng và giáo dục nha khoa học đường.'});
  var P=[
   ['t-c eco',ICONS.leaf,'Thay đầu, khỏi thay thân','Một thân bàn chải dùng với nhiều đầu chải thay thế. Chỉ thay phần đầu mỗi khoảng 3 tháng giúp giảm rác thải nhựa và tiết kiệm chi phí. Thay đổi nhỏ, tác động lớn.'],
   ['t-r',ICONS.heart,'Nụ cười tự tin','Định hướng tặng bộ chăm sóc răng niềng cho học sinh, sinh viên có hoàn cảnh khó khăn đang chỉnh nha, để việc vệ sinh răng miệng không bị bỏ dở vì chi phí.'],
   ['t-b',ICONS.school,'Học đường khỏe răng','Định hướng phối hợp cùng nha sĩ tổ chức các buổi chia sẻ về vệ sinh răng miệng cho học sinh, giúp các em hình thành thói quen chăm sóc răng đúng từ sớm.']
  ];
  return crumbs([['BracesCare','/bracescare'],['Trách nhiệm cộng đồng','/bracescare/trach-nhiem-cong-dong']])+`
  <section class="page-head"><div class="wrap"><h1>Trách nhiệm cộng đồng</h1><p class="lead">Một nụ cười khỏe không nên là đặc quyền, và hành tinh xanh là của tất cả chúng ta. Đây là những định hướng BracesCare theo đuổi.</p></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap">${P.map(function(x){return `<div class="program"><div class="program-art ${x[0]}">${x[1]}</div><div><h2>${x[2]}</h2><p class="muted">${x[3]}</p></div></div>`;}).join('')}</div></section>
  ${ctaBand('Cùng BracesCare lan tỏa nụ cười khỏe','Bạn là nha sĩ, trường học hoặc tổ chức muốn hợp tác? Hãy liên hệ với chúng tôi.')}`;
}

function blog(){
  seo({path:'/blog',title:'Blog chăm sóc răng niềng | BracesCare',desc:'Hướng dẫn đánh răng khi niềng, cách chọn đầu chải, mẹo mang bàn chải đi học, đi làm và kiến thức chăm sóc răng niềng từ BracesCare.'});
  var f=POSTS[0];
  return crumbs([['Blog','/blog']])+`
  <section class="page-head"><div class="wrap"><h1>Blog chăm sóc răng niềng</h1><p class="lead">Hướng dẫn thực tế để răng và nướu luôn sạch khỏe trong suốt hành trình niềng răng.</p></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap"><article class="blog-feature"><div class="post-art" aria-hidden="true"><img src="${IMG[f.img]}" alt="" loading="lazy"></div><div><p class="post-meta">${f.cat} · ${fdate(f.date)} · ${f.read}</p><h2><a href="#/blog/${f.slug}">${f.title}</a></h2><p class="muted">${f.desc}</p></div></article>
  <div class="bgrid">${POSTS.slice(1).map(bcard).join('')}</div></div></section>`;
}

function post(slug){
  var b=POSTS.filter(function(x){return x.slug===slug;})[0];
  if(!b)return notFound();
  seo({path:'/blog/'+b.slug,title:b.title,desc:b.desc,type:'article'});
  LD.push({'@type':'Article',headline:b.title,description:b.desc,datePublished:b.date,dateModified:b.date,inLanguage:'vi-VN',mainEntityOfPage:BASE+'/blog/'+b.slug,author:{'@type':'Organization',name:'BracesCare'},publisher:{'@type':'Organization',name:'BracesCare'}});
  var rel=POSTS.filter(function(x){return x.slug!==slug;}).slice(0,3);
  return crumbs([['Blog','/blog'],[b.title,'/blog/'+b.slug]])+`
  <article><header class="page-head"><div class="wrap"><div style="max-width:860px"><h1 style="font-size:clamp(2rem,4.2vw,3rem);max-width:none">${b.title}</h1><p class="article-meta">${b.cat} · Đăng ngày <time datetime="${b.date}">${fdate(b.date)}</time> · ${b.read}</p></div></div></header>
  <div class="wrap" style="padding-bottom:clamp(40px,6vw,80px)"><div class="prose">${b.body()}
  <div class="note">Nội dung mang tính tham khảo, không thay thế tư vấn của bác sĩ. Hãy hỏi bác sĩ chỉnh nha của bạn nếu có chỉ định riêng.</div>
  <p>Cần bàn chải phù hợp? Xem <a class="link" href="#/san-pham">sản phẩm BracesCare</a>.</p></div></div></article>
  <section class="sec sec-lav"><div class="wrap"><div class="sec-head"><h2>Bài viết liên quan</h2></div><div class="bgrid">${rel.map(bcard).join('')}</div></div></section>`;
}

function contact(){
  seo({path:'/lien-he',title:'Liên hệ BracesCare | Tư vấn bàn chải cho răng niềng',desc:'Nhắn tin cho fanpage BracesCare Vietnam trên Facebook để được tư vấn chọn bàn chải và chăm sóc răng niềng.'});
  LD.push({'@type':'ContactPage',name:'Liên hệ BracesCare',url:BASE+'/lien-he'});
  return crumbs([['Liên hệ','/lien-he']])+`
  <section class="page-head"><div class="wrap"><h1>Liên hệ BracesCare</h1><p class="lead">Nhắn tin cho fanpage để được tư vấn chọn bàn chải và chăm sóc răng niềng. Theo dõi fanpage để xem thông tin mới.</p><div class="btn-row"><a class="btn btn-primary" href="${MS}" target="_blank" rel="noopener">Nhắn tin Messenger</a><a class="btn btn-ghost" href="#/san-pham">Xem sản phẩm</a></div></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap contact-grid"><div><h2 style="font-size:1.8rem">Thông tin fanpage</h2><dl class="specs">
  <div><dt>Tên fanpage</dt><dd>BracesCare Vietnam - Bàn Chải Cho Người Niềng Răng</dd></div>
  <div><dt>Lĩnh vực</dt><dd>Sức khỏe, làm đẹp</dd></div>
  <div><dt>Giới thiệu</dt><dd>Góc chăm sóc răng miệng chuyên biệt và đồng hành cùng hội niềng trên hành trình tìm lại nụ cười.</dd></div>
  <div><dt>Địa chỉ</dt><dd>79 Hồ Tùng Mậu, Hà Nội, Việt Nam. <a class="link" href="${MAPS}" target="_blank" rel="noopener">Xem bản đồ</a></dd></div>
  <div><dt>Messenger</dt><dd><a class="link" href="${MS}" target="_blank" rel="noopener">Nhắn tin BracesCare Vietnam</a></dd></div>
  <div><dt>Facebook</dt><dd><a class="link" href="${FB}" target="_blank" rel="noopener">Fanpage BracesCare Vietnam</a></dd></div></dl></div>
  <div><h2 style="font-size:1.8rem">Về dự án</h2><p class="muted">${DISC}</p><div class="note">Thông tin trên website mang tính tham khảo và không thay thế tư vấn của bác sĩ nha khoa hoặc bác sĩ chỉnh nha.</div></div></div></section>`;
}

function orderPage(pre){
  seo({path:'/dat-hang',title:'Đặt hàng BracesCare | Gửi đơn qua Messenger',desc:'Chọn sản phẩm và màu thân bàn chải BracesCare, điền thông tin nhận hàng và gửi đơn qua Messenger. Fanpage sẽ xác nhận giá, phí vận chuyển và cách thanh toán.'});
  return crumbs([['Đặt hàng','/dat-hang']])+`
  <section class="page-head"><div class="wrap"><h1>Đặt hàng BracesCare</h1><p class="lead">Chọn sản phẩm, màu thân bàn chải và điền thông tin nhận hàng. Đơn được gửi qua Messenger, fanpage BracesCare sẽ xác nhận giá, phí vận chuyển và cách thanh toán với bạn.</p></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap order-grid">
  <form class="order-card" id="orderForm" novalidate>
    <fieldset><legend>1. Chọn sản phẩm</legend>
    ${PRODUCTS.map(function(p){return `<div class="oitem"><div class="oitem-img">${img(p.img,p.alt,p.w,p.h)}</div><div><h3>${p.name}</h3><p>${p.type}</p><p><strong>${priceOf(p)}</strong></p></div>
      <div class="qty" role="group" aria-label="Số lượng ${p.name}"><button type="button" data-act="dec" data-slug="${p.slug}" aria-label="Giảm số lượng ${p.name}">−</button><span id="q-${p.slug}" aria-live="polite">0</span><button type="button" data-act="inc" data-slug="${p.slug}" aria-label="Tăng số lượng ${p.name}">+</button></div>
      ${p.colors?`<div class="oitem-colors" id="c-${p.slug}" role="radiogroup" aria-label="Màu thân ${p.name}" hidden><span class="oc-label">Màu thân:</span>${COLORS.map(function(c){return `<label class="sw"><input type="radio" name="color-${p.slug}" value="${c.name}"><span class="sw-img">${img(c.img,ALT[c.img],360,480)}</span><span class="sw-name">${c.name.replace(' pastel','')}</span></label>`;}).join('')}</div>`:''}
      </div>`;}).join('')}
    <p class="err" id="err-items" role="alert"></p></fieldset>
    <fieldset><legend>2. Thông tin nhận hàng</legend>
      <div class="field"><label for="o-name">Họ và tên</label><input id="o-name" autocomplete="name" aria-describedby="err-name" required><p class="err" id="err-name" role="alert"></p></div>
      <div class="field"><label for="o-phone">Số điện thoại</label><input id="o-phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Ví dụ: 0901234567" aria-describedby="err-phone" required><p class="err" id="err-phone" role="alert"></p></div>
      <div class="field"><label for="o-addr">Địa chỉ nhận hàng</label><textarea id="o-addr" autocomplete="street-address" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" aria-describedby="err-addr" required></textarea><p class="err" id="err-addr" role="alert"></p></div>
      <div class="field"><label for="o-note">Ghi chú (không bắt buộc)</label><textarea id="o-note" placeholder="Ví dụ: thời gian nhận hàng thuận tiện"></textarea></div>
    </fieldset>
    <button class="btn btn-primary" type="submit">Gửi đơn qua Messenger</button>
    <p class="order-status" id="orderMsg" role="status"></p>
    <div class="order-out" id="orderOut" hidden>
      <label for="orderText">Nội dung đơn hàng</label><textarea id="orderText" readonly></textarea>
      <div class="btn-row"><button class="btn btn-ghost" type="button" id="copyBtn">Sao chép nội dung</button><a class="btn btn-primary" href="${MS}" target="_blank" rel="noopener">Mở Messenger</a></div>
    </div>
  </form>
  <aside class="order-side">
    <div class="sum-card"><h2>Đơn của bạn</h2><div id="orderSummary"></div><p class="sum-note">Giá và phí vận chuyển sẽ được fanpage xác nhận qua Messenger. Website chưa thu tiền hoặc thanh toán trực tuyến.</p></div>
    <div class="how-card"><h2>Cách đặt hàng</h2><ol><li>Chọn sản phẩm, số lượng và màu thân.</li><li>Điền thông tin nhận hàng.</li><li>Bấm gửi: nội dung đơn được sao chép, bạn dán vào khung chat Messenger.</li><li>Fanpage xác nhận giá, vận chuyển và thanh toán.</li></ol>
    <p class="disc" style="margin:1rem 0 0">${DISC}</p></div>
  </aside></div></section>`;
}

function initOrder(pre){
  var qty={};PRODUCTS.forEach(function(p){qty[p.slug]=0;});
  if(pre&&qty.hasOwnProperty(pre))qty[pre]=1;
  var form=document.getElementById('orderForm');
  function v(id){var el=document.getElementById(id);return el&&el.value?String(el.value).trim():'';}
  function colorOf(p){
    if(!p.colors)return '';
    var r=document.querySelector('input[name="color-'+p.slug+'"]:checked');
    return r&&r.value?r.value:'';
  }
  function items(){return PRODUCTS.filter(function(p){return qty[p.slug]>0;});}
  function label(p){var c=colorOf(p);return p.name+(c?' (màu thân: '+c+')':'');}
  function total(list){
    var n=0,sum=0,known=true;
    list.forEach(function(p){n+=qty[p.slug];if(typeof p.price==='number')sum+=p.price*qty[p.slug];else known=false;});
    return {n:n,sum:sum,known:known&&list.length>0};
  }
  function render(){
    var list=items(),lines=list.map(function(p){return '<li><span>'+label(p)+'</span><strong>× '+qty[p.slug]+'</strong></li>';});
    PRODUCTS.forEach(function(p){
      var o=document.getElementById('q-'+p.slug);if(o)o.textContent=qty[p.slug];
      var c=document.getElementById('c-'+p.slug);if(c)c.hidden=!(qty[p.slug]>0);
    });
    var tt=total(list);
    document.getElementById('orderSummary').innerHTML=list.length?'<ul class="sum-list">'+lines.join('')+'</ul><p class="sum-total">Tổng cộng: <strong>'+tt.n+' sản phẩm</strong></p><p class="sum-total">Tạm tính: <strong>'+(tt.known?tt.sum.toLocaleString('vi-VN')+'đ':'xxx đ')+'</strong> (chưa gồm phí vận chuyển)</p>':'<p class="muted">Bạn chưa chọn sản phẩm nào.</p>';
    document.getElementById('err-items').textContent='';
  }
  function copyText(text,cb){
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){cb(true);},function(){cb(false);});}
    else cb(false);
  }
  function orderCode(){var d=new Date(),z=function(n){return ('0'+n).slice(-2);};return 'BC'+String(d.getFullYear()).slice(2)+z(d.getMonth()+1)+z(d.getDate())+'-'+Math.floor(100+Math.random()*900);}
  form.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('button[data-act]'):null;
    if(!b)return;
    var s=b.getAttribute('data-slug'),n=qty[s]+(b.getAttribute('data-act')==='inc'?1:-1);
    qty[s]=Math.max(0,Math.min(20,n));render();
  });
  form.addEventListener('change',function(e){
    if(e.target&&e.target.name&&e.target.name.indexOf('color-')===0){
      var chosenColor=COLORS.find(function(c){return c.name===e.target.value;});
      if(chosenColor){
        var itemContainer=e.target.closest('.oitem');
        if(itemContainer){
          var thumb=itemContainer.querySelector('.oitem-img img');
          if(thumb){thumb.src=chosenColor.img;thumb.alt='Bàn chải BracesCare màu '+chosenColor.name;}
        }
      }
    }
    render();
  });
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=true;
    ['name','phone','addr'].forEach(function(k){var el=document.getElementById('o-'+k);if(el)el.removeAttribute('aria-invalid');document.getElementById('err-'+k).textContent='';});
    function bad(k,msg){document.getElementById('err-'+k).textContent=msg;var el=document.getElementById('o-'+k);if(el)el.setAttribute('aria-invalid','true');ok=false;}
    var list=items();
    if(!list.length){document.getElementById('err-items').textContent='Vui lòng chọn ít nhất một sản phẩm.';ok=false;}
    if(!v('o-name'))bad('name','Vui lòng nhập họ và tên.');
    if(!/^(0\d{9}|\+?84\d{9})$/.test(v('o-phone').replace(/[\s.\-]/g,'')))bad('phone','Vui lòng nhập số điện thoại hợp lệ (ví dụ 0901234567).');
    if(v('o-addr').length<8)bad('addr','Vui lòng nhập địa chỉ nhận hàng đầy đủ.');
    var msg=document.getElementById('orderMsg');
    if(!ok){
      msg.textContent='Vui lòng kiểm tra lại các mục được báo lỗi.';
      var firstBad=form.querySelector('[aria-invalid="true"]');
      if(firstBad)firstBad.focus();
      return;
    }
    var code=orderCode(),tt=total(list);
    var lines=list.map(function(p){return '- '+label(p)+' x '+qty[p.slug]+(typeof p.price==='number'?' ('+priceOf(p)+')':'');}).join('\n');
    var text='ĐƠN ĐẶT HÀNG BRACESCARE\nMã đơn: '+code+'\n\nSản phẩm:\n'+lines+(tt.known?'\nTạm tính: '+tt.sum.toLocaleString('vi-VN')+'đ (chưa gồm phí vận chuyển)':'')+
      '\n\nHọ tên: '+v('o-name')+'\nSố điện thoại: '+v('o-phone')+'\nĐịa chỉ: '+v('o-addr')+(v('o-note')?'\nGhi chú: '+v('o-note'):'')+'\n\n(Đơn gửi từ website BracesCare)';
    document.getElementById('orderText').value=text;
    document.getElementById('orderOut').hidden=false;
    var sheetNote='';
    if(SHEETS_URL&&window.fetch){
      var payload={code:code,time:new Date().toISOString(),name:v('o-name'),phone:v('o-phone'),address:v('o-addr'),
        items:list.map(function(p){return label(p)+' x '+qty[p.slug];}).join('; '),total_items:tt.n,note:v('o-note'),source:'website'};
      try{window.fetch(SHEETS_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)}).catch(function(){});sheetNote=' Đơn cũng đã được gửi đến bảng theo dõi.';}catch(err){}
    }
    copyText(text,function(done){
      msg.textContent='Mã đơn '+code+'. '+(done?'Đã sao chép nội dung đơn, hãy dán (Ctrl+V) vào khung chat Messenger rồi gửi cho BracesCare.':'Chưa tự sao chép được, hãy bấm "Sao chép nội dung" bên dưới rồi dán vào Messenger.')+sheetNote;
    });
    if(window.open)window.open(MS,'_blank','noopener');
  });
  document.getElementById('copyBtn').addEventListener('click',function(){
    var text=document.getElementById('orderText').value;
    var cpBtn=this;
    copyText(text,function(done){
      document.getElementById('orderMsg').textContent=done?'Đã sao chép nội dung đơn. Hãy dán vào Messenger.':'Hãy bôi đen nội dung trong khung rồi nhấn Ctrl+C để sao chép.';
      if(done){
        var origHtml=cpBtn.innerHTML;
        cpBtn.classList.add('btn-copied');
        cpBtn.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px"><path d="M20 6L9 17l-5-5"/></svg>Đã sao chép!';
        setTimeout(function(){
          cpBtn.classList.remove('btn-copied');
          cpBtn.innerHTML=origHtml;
        },2500);
      }else{
        var ta=document.getElementById('orderText');if(ta&&ta.select)ta.select();
      }
    });
  });
  render();
}

function notFound(){
  seo({path:'/404',title:'Không tìm thấy trang | BracesCare',desc:'Trang bạn tìm không tồn tại. Quay về trang chủ hoặc xem sản phẩm BracesCare.'});
  document.querySelector('meta[name="robots"]').setAttribute('content','noindex');
  return '<section class="sec"><div class="wrap"><h1>Không tìm thấy trang này</h1><p class="lead">Đường dẫn có thể đã thay đổi hoặc bị nhập sai.</p><div class="btn-row"><a class="btn btn-primary" href="#/">Về trang chủ</a><a class="btn btn-ghost" href="#/san-pham">Xem sản phẩm</a></div></div></section>';
}

/* ---------- Front-end Page Effects (Scroll Reveal, Skeleton, Header, Anchors) ---------- */
var header=document.querySelector('.site-header');
var progressBar=document.getElementById('scrollProgress');
var scrollTicking=false;

function onScroll(){
  if(!scrollTicking){
    window.requestAnimationFrame(function(){
      var y=window.scrollY||window.pageYOffset||0;
      if(header){
        if(y>20)header.classList.add('is-scrolled');
        else header.classList.remove('is-scrolled');
      }
      if(progressBar){
        var docH=document.documentElement.scrollHeight-window.innerHeight;
        var pct=docH>0?(y/docH)*100:0;
        progressBar.style.width=Math.min(100,Math.max(0,pct))+'%';
      }
      scrollTicking=false;
    });
    scrollTicking=true;
  }
}
window.addEventListener('scroll',onScroll,{passive:true});
onScroll();

var revealObserver=null;
function initPageEffects(){
  main.classList.remove('page-fade-in');
  void main.offsetWidth;
  main.classList.add('page-fade-in');

  var imgs=main.querySelectorAll('.pcard-art img, .post-art img, .pd-art img, .oitem-img img, .fig img');
  imgs.forEach(function(im){
    var parent=im.parentElement;
    if(parent)parent.classList.add('img-loading');
    im.classList.add('fade-img');
    function markDone(){
      im.classList.add('is-ready');
      if(parent)parent.classList.add('img-loaded');
    }
    if(im.complete)markDone();
    else{
      im.addEventListener('load',markDone,{once:true});
      im.addEventListener('error',markDone,{once:true});
    }
  });

  var sections=main.querySelectorAll('.sec, .facts-wrap, .split, .fig, .program, .value, .cta-band, .order-card, .faq details, .contact-grid');
  sections.forEach(function(s){
    if(!s.closest('.hero-banner'))s.classList.add('reveal');
  });

  var listContainers=main.querySelectorAll('.pgrid, .bgrid, .heads, .facts, .steps, .eco-points, .hub');
  listContainers.forEach(function(lc){
    lc.classList.add('reveal-stagger');
    var children=Array.prototype.slice.call(lc.children);
    children.forEach(function(child,idx){
      child.style.setProperty('--stagger-idx',idx);
    });
  });

  var isReduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets=main.querySelectorAll('.reveal, .reveal-stagger');

  if(isReduced||!('IntersectionObserver' in window)){
    revealTargets.forEach(function(el){el.classList.add('is-visible');});
    return;
  }

  if(revealObserver)revealObserver.disconnect();
  revealObserver=new IntersectionObserver(function(entries,obs){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  },{rootMargin:'0px 0px -40px 0px',threshold:0.08});

  revealTargets.forEach(function(el){
    var r=el.getBoundingClientRect();
    if(r.top<window.innerHeight&&r.bottom>0){
      el.classList.add('is-visible');
    }else{
      revealObserver.observe(el);
    }
  });
}

document.addEventListener('click',function(e){
  var a=e.target&&e.target.closest?e.target.closest('a[href^="#"]'):null;
  if(!a)return;
  var h=a.getAttribute('href');
  if(!h||h==='#'||h.indexOf('#/')===0)return;
  var target=document.querySelector(h);
  if(target){
    e.preventDefault();
    target.scrollIntoView({behavior:'smooth',block:'start'});
    if(history.pushState)history.pushState(null,'',h);
  }
});

/* ---------- Router ---------- */
function route(){
  var path=(location.hash||'#/').replace(/^#/,'')||'/';
  if(path.length>1)path=path.replace(/\/+$/,'');
  document.querySelector('meta[name="robots"]').setAttribute('content','index,follow,max-image-preview:large');
  LD=[];
  var seg=path.split('/').filter(Boolean),html;
  if(path==='/')html=home();
  else if(seg[0]==='san-pham'&&seg.length===1)html=products();
  else if(seg[0]==='san-pham'&&seg.length===2)html=product(seg[1]);
  else if(seg[0]==='bracescare'&&seg.length===1)html=brandHub();
  else if(path==='/bracescare/cau-chuyen-thuong-hieu')html=story();
  else if(path==='/bracescare/gia-tri-cot-loi')html=values();
  else if(path==='/bracescare/trach-nhiem-cong-dong')html=community();
  else if(seg[0]==='blog'&&seg.length===1)html=blog();
  else if(seg[0]==='blog'&&seg.length===2)html=post(seg[1]);
  else if(seg[0]==='dat-hang'&&seg.length<=2)html=orderPage(seg[1]);
  else if(path==='/lien-he')html=contact();
  else html=notFound();
  main.innerHTML=html;
  if(seg[0]==='dat-hang'&&document.getElementById('orderForm'))initOrder(seg[1]);
  document.querySelectorAll('.nav-link').forEach(function(a){
    var r=a.getAttribute('data-r');
    var on=r==='/'?path==='/':(path===r||path.indexOf(r+'/')===0);
    if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  });
  closeMenu();
  window.scrollTo(0,0);
  initPageEffects();
  main.focus({preventScroll:true});
}

/* ---------- Mobile menu ---------- */
var btn=document.getElementById('menuBtn'),nav=document.getElementById('nav'),backdrop=document.getElementById('navBackdrop');
function closeMenu(){
  nav.classList.remove('open');
  if(backdrop)backdrop.classList.remove('is-active');
  document.body.classList.remove('menu-open');
  btn.setAttribute('aria-expanded','false');
  btn.setAttribute('aria-label','Mở menu');
  nav.removeAttribute('aria-modal');
}
function openMenu(){
  nav.classList.add('open');
  if(backdrop)backdrop.classList.add('is-active');
  document.body.classList.add('menu-open');
  btn.setAttribute('aria-expanded','true');
  btn.setAttribute('aria-label','Đóng menu');
  nav.setAttribute('aria-modal','true');
}
btn.addEventListener('click',function(){
  if(nav.classList.contains('open'))closeMenu();
  else openMenu();
});
if(backdrop)backdrop.addEventListener('click',closeMenu);
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});
document.getElementById('skip').addEventListener('click',function(e){e.preventDefault();main.focus();main.scrollIntoView({behavior:'smooth'});});
document.getElementById('toTop').addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
window.addEventListener('hashchange',route);
route();
})();
