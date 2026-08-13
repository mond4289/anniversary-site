/* =====================================================================
   audio.js
   - เสียงเอฟเฟกต์ "วิ้ง/น้ำพ่นอากาศ" ตอนแตะหัวใจ (สร้างด้วยโค้ด ไม่ใช้ไฟล์เสียง)
   - ฟังก์ชันทำหัวใจลอย (ใช้ร่วมกันทุกหน้า)
   ===================================================================== */

let audioCtx = null;
function getAudioCtx(){
  if(!audioCtx){ audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
  return audioCtx;
}

/* เสียง whoosh สั้นๆ คล้ายฟองอากาศ/น้ำพ่น */
function playHeartSound(){
  try{
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.18);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }catch(e){ /* เบราว์เซอร์บางตัวอาจบล็อกเสียงจนกว่าจะมีการแตะจอ ไม่ต้องทำอะไรเพิ่ม */ }
}

/* เสียง "ติ๊ก" น่ารักๆ สั้นๆ สำหรับตอนกดปุ่มต่างๆ ทั่วเว็บ */
function playClickSound(){
  try{
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    // โน้ตสูงขึ้นเล็กน้อยแบบ "ป๊ิง" ให้ฟังดูน่ารักสดใส
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1500, now + 0.08);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }catch(e){ /* ถ้าเบราว์เซอร์ยังไม่ปลดล็อกเสียง ให้ข้ามไปเงียบๆ */ }
}

/* ผูกเสียงคลิกนี้เข้ากับปุ่มทุกปุ่มในเว็บอัตโนมัติ
   (ใช้ event delegation ที่ document เดียว ไม่ต้องแก้ทีละปุ่ม
   ปุ่มไหนไม่อยากให้มีเสียงนี้ ให้ใส่ attribute  data-no-click-sound  ในปุ่มนั้น) */
document.addEventListener('click', (e)=>{
  const target = e.target.closest(
    '#hamburger-btn, #menu-close, .menu-link, .lang-btn, #cake-btn, #letter-next, #album-next, #end-home, .album-card, #modal-save, #modal-close'
  );
  if(target && !target.hasAttribute('data-no-click-sound')){
    playClickSound();
  }
});

/* หัวใจ 3 สี: แดง / ขาว / ฟ้าพาสเทล */
const HEART_COLORS = ['#E8607A', '#FFFDFB', '#8FCBEF'];

/**
 * สร้างหัวใจลอยขึ้นจากตำแหน่งที่กำหนด (หรือสุ่มรอบจุดกำหนด)
 * @param {HTMLElement} container - element ที่จะใส่หัวใจเข้าไป (ต้อง position:relative/absolute)
 * @param {number} count - จำนวนหัวใจ
 * @param {number} originX - ตำแหน่ง x (px) จุดเริ่ม
 * @param {number} originY - ตำแหน่ง y (px) จุดเริ่ม
 */
function spawnHearts(container, count, originX, originY){
  for(let i=0;i<count;i++){
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = '♥';
    heart.style.color = HEART_COLORS[Math.floor(Math.random()*HEART_COLORS.length)];
    const jitterX = (Math.random()-0.5) * 140;
    const jitterY = (Math.random()-0.5) * 40;
    heart.style.left = (originX + jitterX) + 'px';
    heart.style.top = (originY + jitterY) + 'px';
    heart.style.animationDelay = (Math.random()*0.3) + 's';
    heart.style.fontSize = (16 + Math.random()*16) + 'px';
    container.appendChild(heart);
    setTimeout(()=> heart.remove(), 2800);
  }
  playHeartSound();
}
