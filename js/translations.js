/* =====================================================================
   translations.js
   ไฟล์นี้เก็บ "ข้อความทุกจุด" ที่แสดงบนเว็บไซต์ เป็น 3 ภาษา
   ภาษาเริ่มต้นของเว็บ = "la" (ລາວ)

   วิธีแก้ไข:
   - หาบรรทัดที่มี key ที่ต้องการ (เช่น tapToContinue)
   - แก้ข้อความในเครื่องหมายคำพูด "..." ของแต่ละภาษาได้เลย
   - ห้ามลบ key (ชื่อด้านซ้าย เช่น tapToContinue:) ให้แก้แค่ค่าด้านขวา
   - ถ้าจะเพิ่มข้อความใหม่ ให้เพิ่ม key ใหม่ใน "ทั้ง 3 ภาษา" พร้อมกัน
   ===================================================================== */

const translations = {

  /* ==================== ພາສາລາວ (LAO) — ภาษาเริ่มต้น ==================== */
  la: {
    // หน้า 1 - Welcome
    tapToContinue: "ແຕະ 3 ຄັ້ງ",          // ข้อความบอกให้แตะจอ 3 ครั้ง

    // หน้า 3 - จดหมาย / หน้า 4 - อัลบั้ม
    nextPage: "ໜ້າຖັດໄປ",                 // ปุ่ม/ลูกศรไปหน้าถัดไป

    // Hamburger Menu
    menuTitle: "ເມນູ",                    // หัวข้อเมนู
    menuLetterPage: "ໜ້າຈົດໝາຍ",          // เมนู -> หน้าจดหมาย
    menuAlbumPage: "ໜ້າຮູບພາບ",           // เมนู -> หน้าอัลบั้ม
    menuLanguage: "ພາສາ",                 // หัวข้อเลือกภาษา

    // ตัวนับเวลาคบกัน (Real-time counter)
    counterTitle: "ຄົບກັນມາແລ້ວ",         // หัวข้อ "คบกันมาแล้ว..."
    counterDays: "ມື້",                    // วัน
    counterHours: "ຊົ່ວໂມງ",               // ชั่วโมง
    counterMinutes: "ນາທີ",                // นาที
    counterSeconds: "ວິນາທີ",              // วินาที

    // ปุ่มทั่วไป
    homeButton: "ໜ້າຫຼັກ",                 // ปุ่มโฮม
    nextButton: "ຕໍ່ໄປ",                   // ปุ่มถัดไป (หน้าอัลบั้ม -> หน้าปิดท้าย)
    saveImage: "ບັນທຶກຮູບ",                // ปุ่มบันทึกรูปภาพ
    closeButton: "ປິດ",                    // ปุ่มปิด (popup รูปภาพ)
  },

  /* ==================== ภาษาไทย (THAI) ==================== */
  th: {
    tapToContinue: "แตะหน้าจอ 3 ครั้ง",

    nextPage: "หน้าถัดไป",

    menuTitle: "เมนู",
    menuLetterPage: "หน้าจดหมาย",
    menuAlbumPage: "หน้ารูปภาพ",
    menuLanguage: "ภาษา",

    counterTitle: "คบกันมาแล้ว",
    counterDays: "วัน",
    counterHours: "ชั่วโมง",
    counterMinutes: "นาที",
    counterSeconds: "วินาที",

    homeButton: "หน้าแรก",
    nextButton: "ถัดไป",
    saveImage: "บันทึกรูปภาพ",
    closeButton: "ปิด",
  },

  /* ==================== English (EN) ==================== */
  en: {
    tapToContinue: "Tap the screen 3 times",

    nextPage: "Next page",

    menuTitle: "Menu",
    menuLetterPage: "Letter",
    menuAlbumPage: "Photo Album",
    menuLanguage: "Language",

    counterTitle: "Together for",
    counterDays: "days",
    counterHours: "hours",
    counterMinutes: "minutes",
    counterSeconds: "seconds",

    homeButton: "Home",
    nextButton: "Next",
    saveImage: "Save photo",
    closeButton: "Close",
  },
};

/* ---------------------------------------------------------------------
   ตัวช่วยดึงข้อความ: t("tapToContinue") จะคืนข้อความตามภาษาที่ตั้งไว้
   (ใช้ในไฟล์ app.js — ไม่ต้องแก้ตรงนี้)
   --------------------------------------------------------------------- */
let currentLang = localStorage.getItem("site_lang") || "la"; // เริ่มต้นเป็นลาว

function t(key) {
  return (translations[currentLang] && translations[currentLang][key])
      || translations.la[key]
      || key;
}

function setLanguage(langCode) {
  if (!translations[langCode]) return;
  currentLang = langCode;
  localStorage.setItem("site_lang", langCode);
  document.dispatchEvent(new CustomEvent("languageChanged"));
}
