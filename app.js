/***********************************************
 * GLOBAL ELEMENTS
 ***********************************************/
const fileInput = document.getElementById("fileInput");
const cameraToggleBtn = document.getElementById("cameraToggleBtn");
const cameraContainer = document.getElementById("cameraContainer");
const cameraVideo = document.getElementById("cameraVideo");
const captureBtn = document.getElementById("captureBtn");
const previewImage = document.getElementById("previewImage");
const previewPlaceholder = document.getElementById("previewPlaceholder");
const faceCanvas = document.getElementById("faceCanvas");

const sampleThumbs = document.querySelectorAll(".sample-thumb");

const statusText = document.getElementById("statusText");
const loadingSpinner = document.getElementById("loadingSpinner");

const resultCard = document.getElementById("resultCard");
const emptyState = document.getElementById("emptyState");

const seasonBadge = document.getElementById("seasonBadge");
const seasonTitle = document.getElementById("seasonTitle");
const toneSummary = document.getElementById("toneSummary");
const paletteSwatches = document.getElementById("paletteSwatches");
const makeupList = document.getElementById("makeupList");
const hairList = document.getElementById("hairList");
const avoidList = document.getElementById("avoidList");

const premiumBtn = document.getElementById("premiumBtn");
const downloadBtn = document.getElementById("downloadBtn");

const shareKakao = document.getElementById("shareKakao");
const shareInsta = document.getElementById("shareInsta");
const shareLink = document.getElementById("shareLink");

const languageSelect = document.getElementById("languageSelect");

let cameraStream = null;
let lastImageDataUrl = null;

/***********************************************
 * TRANSLATIONS
 ***********************************************/
const translations = {
  adSpace: {
    ko: "광고 공간",
    en: "Ad space",
    ja: "広告スペース",
    zh: "广告位",
    es: "Espacio publicitario",
    fr: "Espace publicitaire",
    vi: "Vị trí quảng cáo"
  },
  brandTag: {
    ko: "AI 퍼스널 컬러 분석. 무료로 체험해보세요.",
    en: "AI Personal Color Analysis. Try it for free.",
    ja: "AIパーソナルカラー診断。無料でお試しください。",
    zh: "AI个人色彩分析。免费体验。",
    es: "Análisis de color personal con IA. Pruébalo gratis.",
    fr: "Analyse de couleur personnelle par IA. Essayez gratuitement.",
    vi: "Phân tích màu cá nhân bằng AI. Dùng thử miễn phí."
  },
  previewPlaceholder: {
    ko: "사진을 업로드하거나 카메라를 사용하세요",
    en: "Upload or use camera",
    ja: "画像をアップロードするかカメラを使用してください",
    zh: "上传图片或使用摄像头",
    es: "Sube una foto o usa la cámara",
    fr: "Importez une photo ou utilisez la caméra",
    vi: "Tải ảnh lên hoặc dùng camera"
  },
  upload: {
    ko: "사진 업로드",
    en: "Upload Image",
    ja: "画像をアップロード",
    zh: "上传图片",
    es: "Subir imagen",
    fr: "Télécharger l’image",
    vi: "Tải ảnh lên"
  },
  useCamera: {
    ko: "카메라 사용",
    en: "Use Camera",
    ja: "カメラを使用",
    zh: "使用摄像头",
    es: "Usar cámara",
    fr: "Utiliser la caméra",
    vi: "Dùng camera"
  },
  stopCamera: {
    ko: "카메라 끄기",
    en: "Stop Camera",
    ja: "カメラを停止",
    zh: "关闭摄像头",
    es: "Detener cámara",
    fr: "Arrêter la caméra",
    vi: "Tắt camera"
  },
  capture: {
    ko: "촬영",
    en: "Capture",
    ja: "撮影",
    zh: "拍摄",
    es: "Capturar",
    fr: "Capturer",
    vi: "Chụp"
  },
  tryExample: {
    ko: "예시 사진:",
    en: "Try example:",
    ja: "サンプルを試す:",
    zh: "试试示例：",
    es: "Probar ejemplo:",
    fr: "Essayer un exemple :",
    vi: "Thử ví dụ:"
  },
  sample1: { ko: "샘플 1", en: "Sample 1" },
  sample2: { ko: "샘플 2", en: "Sample 2" },
  sample3: { ko: "샘플 3", en: "Sample 3" },

  ready: {
    ko: "준비됨",
    en: "Ready"
  },
  statusInvalidImage: {
    ko: "PNG 또는 JPG 이미지를 업로드해주세요.",
    en: "Please upload a PNG or JPG image."
  },
  statusAiUnavailable: {
    ko: "AI 사용 불가. 잠시 후 다시 시도해주세요.",
    en: "AI unavailable. Try later."
  },
  statusAnalyzing: {
    ko: "AI가 이미지 분석 중...",
    en: "Analyzing image with AI..."
  },
  statusComplete: {
    ko: "분석 완료!",
    en: "Analysis complete!"
  },
  statusFailed: {
    ko: "분석 실패. 다른 사진으로 시도해주세요.",
    en: "Analysis failed. Try another photo."
  }
};

/***********************************************
 * LANGUAGE FUNCTIONS
 ***********************************************/
let currentLanguage = localStorage.getItem("personalColorLang") || "en";

function t(key) {
  const entry = translations[key];
  if (!entry) return "";
  return entry[currentLanguage] || entry.en || "";
}

function applyTranslations() {
  const nodes = document.querySelectorAll("[data-i18n]");
  nodes.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const text = t(key);
    if (text) el.textContent = text;
  });

  cameraToggleBtn.textContent = cameraStream
    ? t("stopCamera")
    : t("useCamera");
}

languageSelect.value = currentLanguage;
languageSelect.addEventListener("change", () => {
  currentLanguage = languageSelect.value;
  localStorage.setItem("personalColorLang", currentLanguage);
  applyTranslations();
});

/***********************************************
 * STATUS BAR
 ***********************************************/
function setStatus(key, loading = false) {
  statusText.textContent = t(key);
  loadingSpinner.classList.toggle("hidden", !loading);
}

/***********************************************
 * IMAGE PREVIEW + CAMERA
 ***********************************************/
function showImagePreview(dataUrl) {
  lastImageDataUrl = dataUrl;
  previewImage.src = dataUrl;
  previewImage.style.display = "block";
  previewPlaceholder.style.display = "none";
  clearFaceOverlay();
}

function clearFaceOverlay() {
  const ctx = faceCanvas.getContext("2d");
  ctx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
}

function resizeCanvasToImage() {
  if (!previewImage.naturalWidth) return;
  faceCanvas.width = previewImage.clientWidth;
  faceCanvas.height = previewImage.clientHeight;
}

previewImage.addEventListener("load", resizeCanvasToImage);
window.addEventListener("resize", resizeCanvasToImage);
fileInput.addEventListener("change", handleImageUpload);

/***********************************************
 * IMAGE UPLOAD HANDLER
 ***********************************************/
async function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setStatus("statusInvalidImage");
    return;
  }

  const reader = new FileReader();
  reader.onload = async (ev) => {
    const dataUrl = ev.target.result;
    showImagePreview(dataUrl);
    await runAnalysis(dataUrl);
  };
  reader.readAsDataURL(file);
}
/***********************************************
 * CAMERA CONTROL
 ***********************************************/
cameraToggleBtn.addEventListener("click", async () => {
  if (cameraContainer.style.display === "block") {
    stopCamera();
  } else {
    await startCamera();
  }
  applyTranslations();
});

captureBtn.addEventListener("click", captureFromCamera);

async function startCamera() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false
    });

    cameraVideo.srcObject = cameraStream;
    cameraContainer.style.display = "block";
    cameraToggleBtn.textContent = t("stopCamera");
  } catch (err) {
    console.error(err);
    setStatus("statusCameraError");
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((t) => t.stop());
    cameraStream = null;
  }
  cameraContainer.style.display = "none";
  cameraToggleBtn.textContent = t("useCamera");
}

function captureFromCamera() {
  if (!cameraStream) return;

  const video = cameraVideo;
  const canvas = document.createElement("canvas");
  const size = Math.min(video.videoWidth || 640, video.videoHeight || 480);

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  // 🚨 좌우반전 유지 (셀카 자연스럽게)
  ctx.save();
  ctx.translate(size, 0);
  ctx.scale(-1, 1);

  ctx.drawImage(
    video,
    (video.videoWidth - size) / 2,
    (video.videoHeight - size) / 2,
    size,
    size,
    0,
    0,
    size,
    size
  );

  ctx.restore();

  const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
  showImagePreview(dataUrl);
  runAnalysis(dataUrl);
}

/***********************************************
 * SAMPLE IMAGE BUTTONS
 ***********************************************/
sampleThumbs.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const url = btn.dataset.url;
    if (!url) return;

    setStatus("statusLoadingSample", true);

    try {
      const dataUrl = await urlToDataUrl(url);
      showImagePreview(dataUrl);
      await runAnalysis(dataUrl);
    } catch (err) {
      console.error(err);
      setStatus("statusSampleFailed");
    }
  });
});

/***********************************************
 * FETCH SAMPLE → DATA URL
 ***********************************************/
async function urlToDataUrl(url) {
  const res = await fetch(url);
  const blob = await res.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/***********************************************
 * OPENAI REQUEST (IMPORTANT)
 ***********************************************/
async function runAnalysis(imageDataUrl) {
  setStatus("statusAnalyzing", true);
  showLoadingState(true);

  try {
    const response = await fetch("/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageDataUrl })
    });

    const result = await response.json();

    if (!result || !result.success) {
      throw new Error("AI Response Invalid");
    }

    applyResultToUI(result.data);
    setStatus("statusComplete");
  } catch (err) {
    console.error(err);
    setStatus("statusFailed");
  } finally {
    showLoadingState(false);
  }
}

/***********************************************
 * LOADING STATE
 ***********************************************/
function showLoadingState(isLoading) {
  if (isLoading) {
    resultCard.classList.add("hidden");
    emptyState.classList.remove("hidden");
  }
}
/***********************************************
 * APPLY AI RESULT TO UI
 ***********************************************/
function applyResultToUI(data) {
  if (!data) return;

  emptyState.classList.add("hidden");
  resultCard.classList.remove("hidden");

  const season = data.season || "봄웜";
  seasonBadge.textContent = season;

  // 영어 이름 fallback
  const englishSeasonName = data.englishSeasonName || seasonToEnglish(season);

  // 시즌 키 찾기 (봄웜 → springWarm)
  const seasonKey = seasonKeyFromLabel(season);
  const dictEntry = seasonDictionary[seasonKey] || null;

  // 시즌 타이틀
  const localizedTitle =
    dictEntry?.title?.[currentLanguage] ||
    dictEntry?.title?.en ||
    englishSeasonName;

  seasonTitle.textContent = localizedTitle;

  // 설명(요약)
  toneSummary.textContent =
    dictEntry?.description?.[currentLanguage] ||
    dictEntry?.description?.en ||
    data.summary ||
    "";

  /***********************************************
   * COLOR PALETTE
   ***********************************************/
  paletteSwatches.innerHTML = "";

  const colors =
    data.paletteColors && data.paletteColors.length
      ? data.paletteColors.slice(0, 12)
      : defaultPaletteForSeason(season);

  colors.forEach((hex) => {
    const div = document.createElement("div");
    div.className = "swatch";
    div.style.background = hex;

    const label = document.createElement("div");
    label.className = "swatch-label";
    label.textContent = hex.toUpperCase();

    div.appendChild(label);
    paletteSwatches.appendChild(div);
  });

  /***********************************************
   * MAKEUP / HAIR / AVOID LISTS
   ***********************************************/
  const dictMakeup =
    dictEntry?.makeup?.[currentLanguage] ||
    dictEntry?.makeup?.en ||
    null;

  const dictHair =
    dictEntry?.hair?.[currentLanguage] ||
    dictEntry?.hair?.en ||
    null;

  const dictAvoid =
    dictEntry?.avoid?.[currentLanguage] ||
    dictEntry?.avoid?.en ||
    null;

  fillList(makeupList, dictMakeup || defaultMakeupForSeason(season));
  fillList(hairList, dictHair || defaultHairForSeason(season));
  fillList(avoidList, dictAvoid || defaultAvoidForSeason(season));

  /***********************************************
   * FACE BOX
   ***********************************************/
  resizeCanvasToImage();
  clearFaceOverlay();

  if (data.faceBox && typeof data.faceBox.x === "number") {
    drawFaceBox(data.faceBox);
  }
}

/***********************************************
 * FILL HTML LIST UL > LI
 ***********************************************/
function fillList(container, arr) {
  container.innerHTML = "";
  (arr || []).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    container.appendChild(li);
  });
}

/***********************************************
 * DRAW FACE BOX (AI bounding box)
 ***********************************************/
function drawFaceBox(box) {
  const ctx = faceCanvas.getContext("2d");
  const w = faceCanvas.width;
  const h = faceCanvas.height;

  if (!w || !h) return;

  const x = box.x * w;
  const y = box.y * h;
  const bw = box.width * w;
  const bh = box.height * h;

  ctx.save();
  ctx.strokeStyle = "rgba(255,122,109,0.9)";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(x, y, bw, bh);

  ctx.fillStyle = "rgba(255,122,109,0.15)";
  ctx.fillRect(x, y, bw, bh);
  ctx.restore();
}

/***********************************************
 * SEASON FALLBACKS
 ***********************************************/
function seasonToEnglish(season) {
  switch (season) {
    case "봄웜": return "Spring Warm";
    case "여름쿨": return "Summer Cool";
    case "가을웜": return "Autumn Warm";
    case "겨울쿨": return "Winter Cool";
    default: return "Personal Color";
  }
}

function seasonKeyFromLabel(season) {
  switch (season) {
    case "봄웜": return "springWarm";
    case "여름쿨": return "summerCool";
    case "가을웜": return "autumnWarm";
    case "겨울쿨": return "winterCool";
    default: return null;
  }
}

/***********************************************
 * DEFAULT PALETTE
 ***********************************************/
function defaultPaletteForSeason(season) {
  switch (season) {
    case "봄웜":
      return ["#FFE3C4", "#FFD1B3", "#FFB3A7", "#FFC96F", "#F8D5C5", "#F7A0B8"];
    case "여름쿨":
      return ["#E8F0FF", "#D2E0FF", "#C2D2F2", "#F0C5DA", "#F7D4EB", "#C0E3E8"];
    case "가을웜":
      return ["#F3C9A7", "#D88F5A", "#B86A3C", "#CFAE71", "#A6604D", "#76513B"];
    case "겨울쿨":
      return ["#F5F5FF", "#D8D9FF", "#B1B4FF", "#7C7AD9", "#4D4A9F", "#C02152"];
    default:
      return ["#F8D5C5", "#F7B2A6", "#E9A8E2", "#CDE5FF", "#BFD8D2", "#F4C095"];
  }
}

/***********************************************
 * DEFAULT MAKEUP / HAIR / AVOID
 ***********************************************/
function defaultMakeupForSeason(season) {
  switch (season) {
    case "봄웜":
      return ["Warm coral & peach blush", "Apricot lips", "Soft brown shadows"];
    case "여름쿨":
      return ["Cool pink blush", "Rose & berry lips", "Lavender shadows"];
    case "가을웜":
      return ["Terracotta blush", "Brick red lips", "Copper shadows"];
    case "겨울쿨":
      return ["Wine blush", "Bold red lips", "Charcoal shadows"];
    default:
      return ["Soft rosy blush", "MLBB lips", "Neutral eyeshadow"];
  }
}

function defaultHairForSeason(season) {
  switch (season) {
    case "봄웜": return ["Warm brown", "Honey blonde", "Gold highlights"];
    case "여름쿨": return ["Ash brown", "Cool beige", "Rose-brown"];
    case "가을웜": return ["Deep brown", "Chestnut", "Copper"];
    case "겨울쿨": return ["Blue-black", "Deep cool brown", "Plum tint"];
    default: return ["Dark brown"];
  }
}

function defaultAvoidForSeason(season) {
  switch (season) {
    case "봄웜": return ["Icy cool tones", "Grayish colors"];
    case "여름쿨": return ["Strong orange", "Yellow warm tones"];
    case "가을웜": return ["Pastels", "Cool pinks"];
    case "겨울쿨": return ["Muted earth tones", "Mustard"];
    default: return ["Neon", "Muddy tones"];
  }
}

/***********************************************
 * MONETIZATION MOCKS
 ***********************************************/
premiumBtn.addEventListener("click", () => {
  alert(t("premiumAlert"));
});

downloadBtn.addEventListener("click", () => {
  alert(t("downloadAlert"));
});

/***********************************************
 * SHARING
 ***********************************************/
shareKakao.addEventListener("click", () => {
  alert(t("shareKakaoAlert"));
});

shareInsta.addEventListener("click", () => {
  alert(t("shareInstaAlert"));
});

shareLink.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    alert(t("shareLinkCopied"));
  } catch {
    alert(t("shareLinkFailed"));
  }
});

/***********************************************
 * FINISH INIT
 ***********************************************/
applyTranslations();
setStatus("ready");
