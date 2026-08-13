/* =====================================================================
   app.js — ตรรกะหลักของเว็บไซต์ทั้งหมด
   จุดที่ "แก้ค่าได้" จะมีคอมเมนต์ภาษาไทยกำกับไว้ทุกจุด
   ===================================================================== */

/* ---------------------------------------------------------------------
   1) วันเริ่มคบกัน (แก้วันที่ตรงนี้เพียงจุดเดียว ถ้าจำเป็น)
   รูปแบบ: new Date(ปี, เดือน-1, วัน, ชั่วโมง, นาที, วินาที)
   ตั้งเป็น 20 กรกฏาคม 2026 เวลา 00:00:00 ตามที่แจ้งไว้
   --------------------------------------------------------------------- */
const START_DATE = new Date(2026, 6, 20, 0, 0, 0);

/* ---------------------------------------------------------------------
   2) ระบบเปลี่ยนหน้า (routing)
   --------------------------------------------------------------------- */
function goToPage(pageId){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  closeMenu();

  if(pageId === 'page-letter') renderLetter();
  if(pageId === 'page-album') renderAlbum();
  if(pageId === 'page-end') renderEnd();
}

/* ---------------------------------------------------------------------
   3) ตัวนับเวลาคบกัน (real-time, ทำงานทุกหน้า)
   --------------------------------------------------------------------- */
function updateCounter(){
  const now = new Date();
  let diff = Math.max(0, now - START_DATE) / 1000; // วินาทีทั้งหมด

  const days = Math.floor(diff / 86400); diff -= days*86400;
  const hours = Math.floor(diff / 3600); diff -= hours*3600;
  const minutes = Math.floor(diff / 60); diff -= minutes*60;
  const seconds = Math.floor(diff);

  document.getElementById('counter-value').textContent =
    `${days} ${t('counterDays')} ${hours} ${t('counterHours')} ${minutes} ${t('counterMinutes')} ${seconds} ${t('counterSeconds')}`;
}
setInterval(updateCounter, 1000);

/* ---------------------------------------------------------------------
   4) ภาษา — เติมข้อความทุกจุดที่มี data-i18n และไฮไลต์ปุ่มภาษาที่ใช้อยู่
   --------------------------------------------------------------------- */
function applyLanguage(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('.lang-btn').forEach(btn=>{
    btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
  });
  updateCounter();
}
document.addEventListener('languageChanged', applyLanguage);

/* ---------------------------------------------------------------------
   5) Hamburger menu
   --------------------------------------------------------------------- */
function openMenu(){ document.getElementById('menu-panel').classList.add('open'); }
function closeMenu(){ document.getElementById('menu-panel').classList.remove('open'); }

document.getElementById('hamburger-btn').addEventListener('click', openMenu);
document.getElementById('menu-close').addEventListener('click', closeMenu);
document.querySelectorAll('.menu-link').forEach(link=>{
  link.addEventListener('click', ()=> goToPage(link.getAttribute('data-goto')));
});
document.querySelectorAll('.lang-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> setLanguage(btn.getAttribute('data-lang')));
});

/* ---------------------------------------------------------------------
   6) หน้า Welcome: popup 5 วิ + แตะ popup ให้หัวใจลอย + แตะพื้นหลัง 3 ครั้งไปต่อ
   --------------------------------------------------------------------- */
let welcomeTapCount = 0;
let popupVisible = false;

function initWelcomePage(){
  const popup = document.getElementById('welcome-popup');

  // background โชว์ก่อน ~1 วิ แล้วค่อยเด้ง popup ขึ้นมา
  setTimeout(()=>{
    popup.classList.add('show');
    popupVisible = true;

    // popup อยู่ 5 วิ แล้วเด้งหาย
    setTimeout(()=>{
      popup.classList.remove('show');
      popupVisible = false;
    }, 5000);
  }, 1000);

  // แตะที่ popup -> หัวใจลอย 10 ดวง (ไม่นับเป็นการแตะพื้นหลัง)
  popup.addEventListener('click', (e)=>{
    e.stopPropagation();
    if(!popupVisible) return;
    const rect = popup.getBoundingClientRect();
    const appRect = document.getElementById('app').getBoundingClientRect();
    spawnHearts(
      document.getElementById('page-welcome'),
      10,
      rect.left - appRect.left + rect.width/2,
      rect.top - appRect.top + rect.height/2
    );
  });

  // แตะพื้นหลังหน้า Welcome 3 ครั้ง -> ไปหน้าเค้ก
  document.getElementById('page-welcome').addEventListener('click', ()=>{
    welcomeTapCount++;
    if(welcomeTapCount >= 3){
      welcomeTapCount = 0;
      goToPage('page-cake');
    }
  });
}

/* ---------------------------------------------------------------------
   7) หน้าปุ่มเค้ก -> ไปหน้าจดหมาย
   --------------------------------------------------------------------- */
document.getElementById('cake-btn').addEventListener('click', ()=> goToPage('page-letter'));

/* ---------------------------------------------------------------------
   8) หน้าจดหมาย: เติมข้อความ + หัวใจลอยตอนเปิดหน้า + ปุ่มไปต่อ
   --------------------------------------------------------------------- */
let letterHeartsPlayed = false;
function renderLetter(){
  document.getElementById('letter-content').textContent = letterText;
  if(!letterHeartsPlayed){
    letterHeartsPlayed = true;
    const page = document.getElementById('page-letter');
    setTimeout(()=>{
      spawnHearts(page, 10, page.clientWidth/2, 60);
    }, 300);
  }
}
document.getElementById('letter-next').addEventListener('click', ()=> goToPage('page-album'));

/* ---------------------------------------------------------------------
   9) หน้าอัลบั้ม: โหลดรูปจาก localStorage (ถ้ามีจาก admin.html) หรือ default
   --------------------------------------------------------------------- */
function getAlbumData(){
  const saved = localStorage.getItem('album_data');
  if(saved){
    try{ return JSON.parse(saved); }catch(e){ /* fallback ด้านล่าง */ }
  }
  return defaultAlbumData;
}

let albumRendered = false;
function renderAlbum(){
  if(albumRendered) return; // render ครั้งเดียวพอ (โหลดใหม่เมื่อ refresh หน้าเว็บ)
  albumRendered = true;

  const data = getAlbumData();
  const masonry = document.getElementById('masonry');
  masonry.innerHTML = '';

  data.forEach((item, idx)=>{
    const card = document.createElement('div');
    card.className = 'album-card';
    card.innerHTML = `<img src="${item.img}" alt="${item.caption}" loading="lazy">
                       <div class="caption">${item.caption}</div>`;
    card.addEventListener('click', ()=> openImageModal(item));
    masonry.appendChild(card);
  });
}

/* ---------------------------------------------------------------------
   10) Modal รูปขยาย + บันทึกรูป
   --------------------------------------------------------------------- */
function openImageModal(item){
  document.getElementById('modal-img').src = item.img;
  document.getElementById('modal-caption').textContent = item.detail || item.caption;
  document.getElementById('image-modal').classList.add('open');
  document.getElementById('modal-save').onclick = ()=>{
    const a = document.createElement('a');
    a.href = item.img;
    a.download = (item.caption || 'photo') + '.jpg';
    a.click();
  };
}
document.getElementById('modal-close').addEventListener('click', ()=>{
  document.getElementById('image-modal').classList.remove('open');
});

document.getElementById('album-next').addEventListener('click', ()=> goToPage('page-end'));

/* ---------------------------------------------------------------------
   11) หน้าปิดท้าย: เติมข้อความ + ปุ่มโฮม
   --------------------------------------------------------------------- */
function renderEnd(){
  document.getElementById('end-content').textContent = endText;
}
document.getElementById('end-home').addEventListener('click', ()=> goToPage('page-welcome'));

/* ---------------------------------------------------------------------
   12) เพลงพื้นหลัง: เริ่มเล่นทันทีที่เห็น background หน้าแรก
   หมายเหตุ: เบราว์เซอร์ส่วนใหญ่ "บล็อกเสียงอัตโนมัติ" จนกว่าจะมีการแตะจอ
   โค้ดนี้จึงพยายามเล่นทันที และถ้าเล่นไม่ได้จะเล่นทันทีที่แตะจอครั้งแรกแทน
   --------------------------------------------------------------------- */
function initMusic(){
  const bgm = document.getElementById('bgm');
  bgm.volume = 0.6;
  const tryPlay = () => bgm.play().catch(()=>{});
  tryPlay();
  document.body.addEventListener('click', tryPlay, { once:true });
}

/* ---------------------------------------------------------------------
   เริ่มต้นทั้งหมด
   --------------------------------------------------------------------- */
window.addEventListener('DOMContentLoaded', ()=>{
  applyLanguage();
  updateCounter();
  initWelcomePage();
  initMusic();
});
