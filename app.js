const fileInput = document.getElementById("fileInput");
const cameraToggleBtn = document.getElementById("cameraToggleBtn");
const cameraContainer = document.getElementById("cameraContainer");
const cameraVideo = document.getElementById("cameraVideo");
const captureBtn = document.getElementById("captureBtn");
const previewImage = document.getElementById("previewImage");
const previewPlaceholder = document.getElementById("previewPlaceholder");
const faceCanvas = document.getElementById("faceCanvas");

const sampleThumbs = document.querySelectorAll(".sample-thumb");

const statusBar = document.getElementById("statusBar");
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

/* Translations */

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
    sample1: {
        ko: "샘플 1",
        en: "Sample 1",
        ja: "サンプル 1",
        zh: "示例 1",
        es: "Ejemplo 1",
        fr: "Exemple 1",
        vi: "Mẫu 1"
    },
    sample2: {
        ko: "샘플 2",
        en: "Sample 2",
        ja: "サンプル 2",
        zh: "示例 2",
        es: "Ejemplo 2",
        fr: "Exemple 2",
        vi: "Mẫu 2"
    },
    sample3: {
        ko: "샘플 3",
        en: "Sample 3",
        ja: "サンプル 3",
        zh: "示例 3",
        es: "Ejemplo 3",
        fr: "Exemple 3",
        vi: "Mẫu 3"
    },
    ready: {
        ko: "준비됨",
        en: "Ready",
        ja: "準備完了",
        zh: "就绪",
        es: "Listo",
        fr: "Prêt",
        vi: "Sẵn sàng"
    },
    premiumComingSoon: {
        ko: "프리미엄 분석 (곧 출시)",
        en: "Premium Analysis (Coming Soon)",
        ja: "プレミアム分析（近日公開）",
        zh: "高级分析（即将推出）",
        es: "Análisis premium (Próximamente)",
        fr: "Analyse premium (Bientôt disponible)",
        vi: "Phân tích cao cấp (Sắp ra mắt)"
    },
    downloadHdReport: {
        ko: "고화질 리포트 다운로드 (PDF)",
        en: "Download HD Report (PDF)",
        ja: "高画質レポートをダウンロード (PDF)",
        zh: "下载高清报告 (PDF)",
        es: "Descargar informe HD (PDF)",
        fr: "Télécharger le rapport HD (PDF)",
        vi: "Tải báo cáo HD (PDF)"
    },
    paletteTitle: {
        ko: "팔레트",
        en: "Palette",
        ja: "パレット",
        zh: "配色",
        es: "Paleta",
        fr: "Palette",
        vi: "Bảng màu"
    },
    makeupTitle: {
        ko: "메이크업 컬러",
        en: "Makeup Colors",
        ja: "メイクカラー",
        zh: "彩妆颜色",
        es: "Colores de maquillaje",
        fr: "Couleurs de maquillage",
        vi: "Màu trang điểm"
    },
    hairTitle: {
        ko: "헤어 컬러",
        en: "Hair Colors",
        ja: "ヘアカラー",
        zh: "发色",
        es: "Colores de cabello",
        fr: "Couleurs de cheveux",
        vi: "Màu tóc"
    },
    avoidTitle: {
        ko: "피해야 할 컬러",
        en: "Colors to Avoid",
        ja: "避けるべきカラー",
        zh: "应避免的颜色",
        es: "Colores a evitar",
        fr: "Couleurs à éviter",
        vi: "Màu nên tránh"
    },
    shareLabel: {
        ko: "공유",
        en: "Share",
        ja: "共有",
        zh: "分享",
        es: "Compartir",
        fr: "Partager",
        vi: "Chia sẻ"
    },
    shareKakao: {
        ko: "카카오톡",
        en: "KakaoTalk",
        ja: "カカオトーク",
        zh: "KakaoTalk",
        es: "KakaoTalk",
        fr: "KakaoTalk",
        vi: "KakaoTalk"
    },
    shareInsta: {
        ko: "인스타 스토리",
        en: "Instagram Story",
        ja: "インスタグラムストーリー",
        zh: "Instagram 限时动态",
        es: "Historia de Instagram",
        fr: "Story Instagram",
        vi: "Story Instagram"
    },
    shareLink: {
        ko: "링크 복사",
        en: "Copy Link",
        ja: "リンクをコピー",
        zh: "复制链接",
        es: "Copiar enlace",
        fr: "Copier le lien",
        vi: "Sao chép liên kết"
    },
    emptyStateText: {
        ko: "사진을 업로드하거나 카메라를 사용해 나만의 퍼스널 컬러 시즌을 확인하세요.",
        en: "Upload a photo or use your camera to see your personal color season.",
        ja: "写真をアップロードするかカメラを使って、あなたのパーソナルカラーシーズンを確認しましょう。",
        zh: "上传照片或使用摄像头来查看你的个人色彩季型。",
        es: "Sube una foto o usa tu cámara para ver tu estación de color personal.",
        fr: "Importez une photo ou utilisez votre caméra pour découvrir votre saison de couleur personnelle.",
        vi: "Tải ảnh lên hoặc dùng camera để xem mùa màu cá nhân của bạn."
    },
    statusInvalidImage: {
        ko: "PNG 또는 JPG 이미지를 업로드해주세요.",
        en: "Please upload a PNG or JPG image.",
        ja: "PNG または JPG 画像をアップロードしてください。",
        zh: "请上传 PNG 或 JPG 图片。",
        es: "Sube una imagen PNG o JPG.",
        fr: "Veuillez télécharger une image PNG ou JPG.",
        vi: "Vui lòng tải lên ảnh PNG hoặc JPG."
    },
    statusCameraError: {
        ko: "카메라에 접근할 수 없거나 권한이 거부되었습니다.",
        en: "Camera access denied or unavailable.",
        ja: "カメラにアクセスできないか、権限が拒否されました。",
        zh: "无法访问摄像头或权限被拒绝。",
        es: "Acceso a la cámara denegado o no disponible.",
        fr: "Accès à la caméra refusé ou indisponible.",
        vi: "Không thể truy cập camera hoặc bị từ chối quyền."
    },
    statusLoadingSample: {
        ko: "샘플 이미지를 불러오는 중...",
        en: "Loading sample...",
        ja: "サンプルを読み込み中...",
        zh: "正在加载示例...",
        es: "Cargando ejemplo...",
        fr: "Chargement de l’exemple...",
        vi: "Đang tải mẫu..."
    },
    statusSampleFailed: {
        ko: "샘플을 불러오지 못했습니다.",
        en: "Failed to load sample.",
        ja: "サンプルを読み込めませんでした。",
        zh: "示例加载失败。",
        es: "No se pudo cargar el ejemplo.",
        fr: "Impossible de charger l’exemple.",
        vi: "Tải mẫu thất bại."
    },
    statusAiUnavailable: {
        ko: "AI를 사용할 수 없습니다. 잠시 후 다시 시도해주세요.",
        en: "AI not available. Please try again later.",
        ja: "AI を利用できません。しばらくしてから再度お試しください。",
        zh: "AI 暂不可用，请稍后再试。",
        es: "La IA no está disponible. Inténtalo de nuevo más tarde.",
        fr: "L’IA n’est pas disponible. Veuillez réessayer plus tard.",
        vi: "AI hiện không khả dụng. Vui lòng thử lại sau."
    },
    statusAnalyzing: {
        ko: "AI로 얼굴과 컬러를 분석하는 중...",
        en: "Analyzing face & colors with AI...",
        ja: "AIで顔とカラーを分析中...",
        zh: "正在使用 AI 分析面部和色彩...",
        es: "Analizando rostro y colores con IA...",
        fr: "Analyse du visage et des couleurs avec l’IA...",
        vi: "Đang phân tích khuôn mặt và màu sắc bằng AI..."
    },
    statusComplete: {
        ko: "분석이 완료되었습니다.",
        en: "Analysis complete.",
        ja: "分析が完了しました。",
        zh: "分析完成。",
        es: "Análisis completado.",
        fr: "Analyse terminée.",
        vi: "Phân tích hoàn tất."
    },
    statusFailed: {
        ko: "분석에 실패했습니다. 다른 사진으로 다시 시도해주세요.",
        en: "Analysis failed. Please try another photo.",
        ja: "分析に失敗しました。別の写真でお試しください。",
        zh: "分析失败。请尝试另一张照片。",
        es: "El análisis falló. Intenta con otra foto.",
        fr: "Analyse échouée. Veuillez essayer avec une autre photo.",
        vi: "Phân tích thất bại. Hãy thử một ảnh khác."
    },
    premiumAlert: {
        ko: "프리미엄 분석은 곧 제공될 예정입니다. 기대해주세요!",
        en: "Premium Analysis is coming soon. Stay tuned!",
        ja: "プレミアム分析は近日公開予定です。お楽しみに！",
        zh: "高级分析功能即将推出，敬请期待！",
        es: "El análisis premium estará disponible pronto. ¡Permanece atento!",
        fr: "L’analyse premium arrive bientôt. Restez à l’écoute !",
        vi: "Tính năng phân tích cao cấp sắp ra mắt. Hãy đón chờ nhé!"
    },
    downloadAlert: {
        ko: "고화질 PDF 리포트 다운로드 기능은 추후 업데이트될 예정입니다.",
        en: "HD PDF report download will be available in a future update.",
        ja: "高画質PDFレポートのダウンロード機能は今後のアップデートで追加予定です。",
        zh: "高清 PDF 报告下载功能将在未来更新中提供。",
        es: "La descarga del informe PDF en HD estará disponible en una futura actualización.",
        fr: "Le téléchargement du rapport PDF HD sera disponible dans une prochaine mise à jour.",
        vi: "Tải báo cáo PDF chất lượng cao sẽ có trong bản cập nhật sau."
    },
    shareKakaoAlert: {
        ko: "카카오톡을 열어 이 페이지를 공유하거나 결과 화면을 캡처해 공유하세요.",
        en: "Open KakaoTalk and share this page or screenshot your result.",
        ja: "KakaoTalkを開き、このページを共有するか結果画面をスクリーンショットして共有してください。",
        zh: "打开 KakaoTalk，分享此页面或截屏你的结果。",
        es: "Abre KakaoTalk y comparte esta página o una captura de tu resultado.",
        fr: "Ouvrez KakaoTalk et partagez cette page ou une capture de votre résultat.",
        vi: "Mở KakaoTalk và chia sẻ trang này hoặc ảnh chụp kết quả."
    },
    shareInstaAlert: {
        ko: "인스타그램 스토리를 열고 결과 화면을 캡처해 업로드하세요.",
        en: "Open Instagram Story and upload a screenshot of your result.",
        ja: "Instagramストーリーズを開き、結果のスクリーンショットをアップロードしてください。",
        zh: "打开 Instagram 限时动态并上传你的结果截图。",
        es: "Abre Historias de Instagram y sube una captura de tu resultado.",
        fr: "Ouvrez les Stories Instagram et téléchargez une capture de votre résultat.",
        vi: "Mở Instagram Story và tải ảnh chụp màn hình kết quả của bạn."
    },
    shareLinkCopied: {
        ko: "링크가 클립보드에 복사되었습니다!",
        en: "Link copied to clipboard!",
        ja: "リンクをクリップボードにコピーしました！",
        zh: "链接已复制到剪贴板！",
        es: "¡Enlace copiado al portapapeles!",
        fr: "Lien copié dans le presse-papiers !",
        vi: "Đã sao chép liên kết vào clipboard!"
    },
    shareLinkFailed: {
        ko: "복사에 실패했습니다. URL을 직접 복사해주세요.",
        en: "Copy failed. Please copy the URL manually.",
        ja: "コピーに失敗しました。URLを手動でコピーしてください。",
        zh: "复制失败，请手动复制 URL。",
        es: "Error al copiar. Copia la URL manualmente.",
        fr: "Échec de la copie. Veuillez copier l’URL manuellement.",
        vi: "Sao chép thất bại. Vui lòng tự sao chép URL."
    }
};

/* Season result dictionary */

const seasonDictionary = {
    springWarm: {
        title: {
            ko: "봄웜",
            en: "Spring Warm",
            ja: "スプリングウォーム",
            zh: "春暖色",
            es: "Primavera Cálida",
            fr: "Printemps Chaud",
            vi: "Xuân Ấm"
        },
        description: {
            ko: "따뜻하고 밝은 피부톤으로 생기 있고 화사한 분위기를 줍니다.",
            en: "She has a warm and light skin tone, giving off a radiant and fresh vibe.",
            ja: "暖かく明るい肌で、華やかで明るい印象を与えます。",
            zh: "她拥有温暖明亮的肤色，呈现清新而充满活力的气质。",
            es: "Tiene un tono de piel cálido y claro, que transmite frescura y vitalidad.",
            fr: "Elle a un teint chaud et clair qui donne une impression lumineuse et fraîche.",
            vi: "Cô ấy có làn da ấm và sáng, mang lại vẻ tươi tắn và rạng rỡ."
        },
        makeup: {
            ko: [
                "라이트 피치 또는 코랄 블러셔",
                "웜 베이지 또는 라이트 브라운 아이섀도우",
                "코랄 또는 라이트 레드 립",
                "골드 또는 브론즈 하이라이터"
            ],
            en: [
                "Light peach or coral blush",
                "Warm beige or light brown eyeshadow",
                "Coral or light red lipstick",
                "Golden or bronze highlighter"
            ],
            ja: [
                "ライトピーチまたはコーラルのチーク",
                "ウォームベージュまたはライトブラウンのアイシャドウ",
                "コーラルまたはライトレッドのリップ",
                "ゴールドまたはブロンズのハイライター"
            ],
            zh: [
                "浅蜜桃色或珊瑚色腮红",
                "暖米色或浅棕色眼影",
                "珊瑚色或浅红色口红",
                "金色或古铜色高光"
            ],
            es: [
                "Rubor melocotón claro o coral",
                "Sombra beige cálido o marrón claro",
                "Labial coral o rojo claro",
                "Iluminador dorado o bronce"
            ],
            fr: [
                "Blush pêche clair ou corail",
                "Fard à paupières beige chaud ou brun clair",
                "Rouge à lèvres corail ou rouge clair",
                "Enlumineur doré ou bronze"
            ],
            vi: [
                "Má hồng màu đào nhạt hoặc san hô",
                "Phấn mắt be ấm hoặc nâu nhạt",
                "Son màu san hô hoặc đỏ nhạt",
                "Phấn highlight vàng hoặc đồng"
            ]
        },
        hair: {
            ko: ["골드 하이라이트가 있는 웜 브라운", "카라멜 브라운", "스트로베리 블론드"],
            en: ["Warm brown with golden highlights", "Caramel brown", "Strawberry blonde"],
            ja: ["ゴールドハイライトのウォームブラウン", "キャラメルブラウン", "ストロベリーブロンド"],
            zh: ["带金色挑染的暖棕色", "焦糖棕", "草莓金发"],
            es: ["Castaño cálido con reflejos dorados", "Castaño caramelo", "Rubio fresa"],
            fr: ["Brun chaud avec reflets dorés", "Brun caramel", "Blond fraise"],
            vi: ["Nâu ấm với highlights vàng", "Nâu caramel", "Vàng dâu"]
        },
        avoid: {
            ko: ["쿨 블루/퍼플", "어두운 톤", "실버 액세서리"],
            en: ["Cool blues and purples", "Dark and muted colors", "Silver jewelry"],
            ja: ["クールブルーやパープル", "暗くくすんだ色", "シルバーアクセサリー"],
            zh: ["冷蓝色和紫色", "深沉或灰暗的颜色", "银色配饰"],
            es: ["Azules y morados fríos", "Colores oscuros o apagados", "Accesorios plateados"],
            fr: ["Bleus froids et violets", "Couleurs sombres ou ternes", "Bijoux argentés"],
            vi: ["Xanh lạnh và tím", "Màu tối hoặc xỉn", "Trang sức bạc"]
        }
    },
    summerCool: {
        title: {
            ko: "여름쿨",
            en: "Summer Cool",
            ja: "サマークール",
            zh: "夏凉色",
            es: "Verano Frío",
            fr: "Été Froid",
            vi: "Hè Lạnh"
        },
        description: {
            ko: "차갑고 맑은 피부톤으로 고급스럽고 세련된 분위기를 줍니다.",
            en: "She has a cool and clear skin tone, giving off an elegant and refined mood.",
            ja: "透明感のあるクールトーンで、上品で洗練された印象を与えます。",
            zh: "她拥有清透的冷肤色，呈现优雅精致的气质。",
            es: "Tiene un tono de piel frío y claro que transmite elegancia y sofisticación.",
            fr: "Elle a un teint clair et froid, offrant une allure élégante et raffinée.",
            vi: "Cô ấy có làn da lạnh và sáng, tạo cảm giác thanh lịch và tinh tế."
        },
        makeup: {
            ko: [
                "라이트 핑크 또는 로즈 블러셔",
                "쿨 브라운 또는 라벤더 아이섀도우",
                "로즈 핑크 또는 쿨 레드 립",
                "실버 또는 핑크 하이라이터"
            ],
            en: [
                "Light pink or rose blush",
                "Cool brown or lavender eyeshadow",
                "Rose pink or cool red lipstick",
                "Silver or pink highlighter"
            ],
            ja: [
                "ライトピンクまたはローズのチーク",
                "クールブラウンまたはラベンダーのアイシャドウ",
                "ローズピンクまたはクールレッドのリップ",
                "シルバーまたはピンクのハイライター"
            ],
            zh: [
                "浅粉色或玫瑰色腮红",
                "冷棕色或薰衣草色眼影",
                "玫瑰粉或冷红色口红",
                "银色或粉色高光"
            ],
            es: [
                "Rubor rosa claro o rosado",
                "Sombra marrón fría o lavanda",
                "Labial rosa o rojo frío",
                "Iluminador plateado o rosado"
            ],
            fr: [
                "Blush rose clair ou rosé",
                "Fard froid brun ou lavande",
                "Rouge à lèvres rose ou rouge froid",
                "Enlumineur argenté ou rosé"
            ],
            vi: [
                "Má hồng hồng nhạt hoặc hồng tro",
                "Phấn mắt nâu lạnh hoặc tím oải hương",
                "Son hồng hoặc đỏ lạnh",
                "Phấn highlight bạc hoặc hồng"
            ]
        },
        hair: {
            ko: ["애쉬 브라운", "시폰 베이지", "쿨 브라운"],
            en: ["Ash brown", "Chiffon beige", "Cool brown"],
            ja: ["アッシュブラウン", "シフォンベージュ", "クールブラウン"],
            zh: ["亚麻棕", "雪纺米色", "冷棕色"],
            es: ["Castaño ceniza", "Beige chiffon", "Marrón frío"],
            fr: ["Brun cendré", "Beige chiffon", "Brun froid"],
            vi: ["Nâu tro", "Be nâu chiffon", "Nâu lạnh"]
        },
        avoid: {
            ko: ["노란 빛이 도는 웜톤 컬러", "강한 오렌지", "골드 악세서리"],
            en: ["Yellowish warm colors", "Strong orange", "Gold accessories"],
            ja: ["黄みの強い色", "ビビッドオレンジ", "ゴールドアクセサリー"],
            zh: ["偏黄暖色", "亮橙色", "金色配饰"],
            es: ["Colores cálidos amarillentos", "Naranja fuerte", "Accesorios dorados"],
            fr: ["Couleurs chaudes jaunâtres", "Orange vif", "Bijoux dorés"],
            vi: ["Màu ấm ngả vàng", "Cam đậm", "Trang sức vàng"]
        }
    },
    autumnWarm: {
        title: {
            ko: "가을웜",
            en: "Autumn Warm",
            ja: "オータムウォーム",
            zh: "秋暖色",
            es: "Otoño Cálido",
            fr: "Automne Chaud",
            vi: "Thu Ấm"
        },
        description: {
            ko: "깊고 풍부한 톤으로 차분하고 분위기 있는 인상을 줍니다.",
            en: "She has a deep and rich tone, giving a calm and atmospheric impression.",
            ja: "深みのあるリッチなトーンで、落ち着いた雰囲気を与えます。",
            zh: "她拥有深沉而丰富的肤色，呈现沉稳而有格调的气质。",
            es: "Tiene un tono profundo y cálido que transmite serenidad y elegancia.",
            fr: "Elle a un teint profond et riche, offrant une allure calme et chaleureuse.",
            vi: "Cô ấy có tông da sâu và ấm, tạo cảm giác trầm ổn và cuốn hút."
        },
        makeup: {
            ko: [
                "브릭 오렌지 블러셔",
                "올리브 브라운 또는 카키 아이섀도우",
                "브릭 레드 또는 오렌지 레드 립",
                "골드 또는 코퍼 하이라이터"
            ],
            en: [
                "Brick orange blush",
                "Olive brown or khaki eyeshadow",
                "Brick red or orange red lipstick",
                "Gold or copper highlighter"
            ],
            ja: [
                "ブリックオレンジのチーク",
                "オリーブブラウンまたはカーキのアイシャドウ",
                "ブリックレッドまたはオレンジレッドのリップ",
                "ゴールドまたはコッパーのハイライター"
            ],
            zh: [
                "砖橘色腮红",
                "橄榄棕或卡其色眼影",
                "砖红或橘红口红",
                "金色或铜色高光"
            ],
            es: [
                "Rubor naranja ladrillo",
                "Sombra marrón oliva o caqui",
                "Labial rojo ladrillo u rojo anaranjado",
                "Iluminador dorado o cobre"
            ],
            fr: [
                "Blush orange brique",
                "Fard à paupières brun olive ou kaki",
                "Rouge à lèvres rouge brique ou rouge orangé",
                "Enlumineur or ou cuivre"
            ],
            vi: [
                "Má hồng cam gạch",
                "Phấn mắt nâu ô liu hoặc kaki",
                "Son đỏ gạch hoặc đỏ cam",
                "Phấn highlight vàng hoặc đồng đỏ"
            ]
        },
        hair: {
            ko: ["다크 브라운", "골드 브라운", "딥 카퍼"],
            en: ["Dark brown", "Golden brown", "Deep copper"],
            ja: ["ダークブラウン", "ゴールデンブラウン", "ディープコッパー"],
            zh: ["深棕色", "金棕色", "深铜色"],
            es: ["Castaño oscuro", "Castaño dorado", "Cobre profundo"],
            fr: ["Brun foncé", "Brun doré", "Cuivre profond"],
            vi: ["Nâu đậm", "Nâu vàng", "Đồng sâu"]
        },
        avoid: {
            ko: ["파스텔 톤", "쿨 핑크", "블루 계열"],
            en: ["Pastel colors", "Cool pink", "Blue tones"],
            ja: ["パステルカラー", "クールピンク", "ブルートーン"],
            zh: ["浅色系（粉彩色）", "冷粉色", "蓝色系"],
            es: ["Colores pastel", "Rosa frío", "Tonos azules"],
            fr: ["Couleurs pastel", "Rose froid", "Tons bleus"],
            vi: ["Màu pastel", "Hồng lạnh", "Sắc xanh"]
        }
    },
    winterCool: {
        title: {
            ko: "겨울쿨",
            en: "Winter Cool",
            ja: "ウィンタークール",
            zh: "冬冷色",
            es: "Invierno Frío",
            fr: "Hiver Froid",
            vi: "Đông Lạnh"
        },
        description: {
            ko: "대비감 있는 선명한 톤으로 시크하고 강렬한 인상을 줍니다.",
            en: "She has a high-contrast, vivid tone that gives a chic and striking impression.",
            ja: "鮮やかでコントラストの高いトーンで、クールで印象的な雰囲気を与えます。",
            zh: "她拥有高对比度的鲜明肤色，呈现冷静又强烈的气质。",
            es: "Tiene un tono vívido y de alto contraste que transmite una imagen elegante y poderosa.",
            fr: "Elle a un teint vif et contrasté qui offre une allure chic et marquante.",
            vi: "Cô ấy có tông da sáng, tương phản mạnh, tạo cảm giác lạnh lùng và nổi bật."
        },
        makeup: {
            ko: [
                "로즈핑크 또는 플럼 블러셔",
                "쿨 그레이 또는 블루 아이섀도우",
                "버건디 또는 퓨어 레드 립",
                "실버 또는 라일락 하이라이터"
            ],
            en: [
                "Rose pink or plum blush",
                "Cool gray or blue eyeshadow",
                "Burgundy or pure red lipstick",
                "Silver or lilac highlighter"
            ],
            ja: [
                "ローズピンクまたはプラムのチーク",
                "クールグレーまたはブルーのアイシャドウ",
                "バーガンディまたはピュアレッドのリップ",
                "シルバーまたはライラックのハイライター"
            ],
            zh: [
                "玫瑰粉或梅子色腮红",
                "冷灰色或蓝色眼影",
                "酒红色或正红色口红",
                "银色或丁香紫高光"
            ],
            es: [
                "Rubor rosa o ciruela",
                "Sombra gris fría o azul",
                "Labial burdeos o rojo puro",
                "Iluminador plateado o lavanda"
            ],
            fr: [
                "Blush rose ou prune",
                "Fard gris froid ou bleu",
                "Rouge à lèvres bordeaux ou rouge pur",
                "Enlumineur argenté ou lilas"
            ],
            vi: [
                "Má hồng hồng tro hoặc mận chín",
                "Phấn mắt xám lạnh hoặc xanh dương",
                "Son màu rượu vang hoặc đỏ thuần",
                "Phấn highlight bạc hoặc tím nhạt"
            ]
        },
        hair: {
            ko: ["블랙", "블루블랙", "애쉬 블루"],
            en: ["Black", "Blue-black", "Ash blue"],
            ja: ["ブラック", "ブルーブラック", "アッシュブルー"],
            zh: ["黑色", "蓝黑色", "灰蓝色"],
            es: ["Negro", "Azul negro", "Azul ceniza"],
            fr: ["Noir", "Bleu-noir", "Bleu cendré"],
            vi: ["Đen", "Đen ánh xanh", "Xanh tro"]
        },
        avoid: {
            ko: ["옐로우 베이스 컬러", "브라운톤 메이크업", "올리브 계열"],
            en: ["Yellow-based colors", "Brown-toned makeup", "Olive tones"],
            ja: ["イエローベースの色", "ブラウン系メイク", "オリーブトーン"],
            zh: ["偏黄色的色调", "棕色系妆容", "橄榄色系"],
            es: ["Colores con base amarilla", "Maquillaje en tonos marrones", "Tonos oliva"],
            fr: ["Couleurs à base de jaune", "Maquillage brun", "Tons olive"],
            vi: ["Màu nền vàng", "Trang điểm tông nâu", "Tông ô liu"]
        }
    }
};

let currentLanguage = localStorage.getItem("personalColorLang") || "en";

function t(key) {
    const entry = translations[key];
    if (!entry) return "";
    return entry[currentLanguage] || entry.en || Object.values(entry)[0] || "";
}

function applyTranslations() {
    // Update generic elements with data-i18n
    const nodes = document.querySelectorAll("[data-i18n]");
    nodes.forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const text = t(key);
        if (text) {
            el.textContent = text;
        }
    });

    // Update camera toggle button based on current state
    if (cameraStream) {
        cameraToggleBtn.textContent = t("stopCamera");
    } else {
        cameraToggleBtn.textContent = t("useCamera");
    }

    // Keep current status message key if we can infer it, otherwise leave as-is.
    // For simplicity, do not override statusText here; it is updated via setStatus.
}

/* Status */

function setStatus(messageKeyOrText, loading = false, isKey = true) {
    const message = isKey ? t(messageKeyOrText) : messageKeyOrText;
    statusText.textContent = message;
    loadingSpinner.classList.toggle("hidden", !loading);
}

/* Initial language setup */

languageSelect.value = currentLanguage;
languageSelect.addEventListener("change", () => {
    currentLanguage = languageSelect.value;
    localStorage.setItem("personalColorLang", currentLanguage);
    applyTranslations();
});

/* Image preview & camera */

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
    if (!previewImage.naturalWidth || !previewImage.naturalHeight) return;
    faceCanvas.width = previewImage.clientWidth;
    faceCanvas.height = previewImage.clientHeight;
}

window.addEventListener("resize", resizeCanvasToImage);
previewImage.addEventListener("load", resizeCanvasToImage);

fileInput.addEventListener("change", async (e) => {
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
});

cameraToggleBtn.addEventListener("click", async () => {
    if (cameraContainer.style.display === "block") {
        stopCamera();
    } else {
        await startCamera();
    }
    applyTranslations();
});

captureBtn.addEventListener("click", () => {
    captureFromCamera();
});

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
    // 좌우 반전 시작
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
    // 좌우 반전 끝
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    showImagePreview(dataUrl);
    runAnalysis(dataUrl);
}

/* Example thumbnails */

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

/* AI Analysis */

async function runAnalysis(imageDataUrl) {
    setStatus("statusAnalyzing", true);
    showLoadingState(true);

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageDataUrl })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server Error: ${response.status}`);
        }

        const result = await response.json();
        applyResultToUI(result);
        setStatus("statusComplete");
    } catch (err) {
        console.error(err);
        setStatus("Error: " + err.message);
    } finally {
        showLoadingState(false);
    }
}

function showLoadingState(isLoading) {
    if (isLoading) {
        resultCard.classList.add("hidden");
        emptyState.classList.remove("hidden");
    } else {
        // actual visibility controlled after result
    }
}

/* UI update */

function applyResultToUI(data) {
    if (!data) return;
    emptyState.classList.add("hidden");
    resultCard.classList.remove("hidden");

    const season = data.season || "봄웜";
    seasonBadge.textContent = season;

    const englishSeasonName = data.englishSeasonName || seasonToEnglish(season);

    const seasonKey = seasonKeyFromLabel(season);
    const dictEntry = seasonKey ? seasonDictionary[seasonKey] : null;

    const localizedTitle =
        dictEntry?.title?.[currentLanguage] ||
        dictEntry?.title?.en ||
        englishSeasonName;

    seasonTitle.textContent = localizedTitle;

    toneSummary.textContent =
        dictEntry?.description?.[currentLanguage] ||
        dictEntry?.description?.en ||
        data.summary ||
        "";

    // Palette
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

    // Lists (prefer AI, then dictionary, then existing defaults)
    const dictMakeup =
        dictEntry?.makeup?.[currentLanguage] || dictEntry?.makeup?.en || null;
    const dictHair =
        dictEntry?.hair?.[currentLanguage] || dictEntry?.hair?.en || null;
    const dictAvoid =
        dictEntry?.avoid?.[currentLanguage] || dictEntry?.avoid?.en || null;

    fillList(
        makeupList,
        dictMakeup || data.makeupRecommendations || defaultMakeupForSeason(season)
    );

    fillList(
        hairList,
        dictHair || data.hairRecommendations || defaultHairForSeason(season)
    );

    fillList(
        avoidList,
        dictAvoid || data.avoidColors || defaultAvoidForSeason(season)
    );

    // Face box overlay
    resizeCanvasToImage();
    clearFaceOverlay();
    if (data.faceBox && typeof data.faceBox.x === "number") {
        drawFaceBox(data.faceBox);
    }
}

function fillList(el, arr) {
    el.innerHTML = "";
    (arr || []).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        el.appendChild(li);
    });
}

/* Face box drawing */

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
    ctx.strokeStyle = "rgba(255, 122, 109, 0.9)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(x, y, bw, bh);

    ctx.fillStyle = "rgba(255, 122, 109, 0.15)";
    ctx.fillRect(x, y, bw, bh);
    ctx.restore();
}

/* Default fallbacks */

function seasonToEnglish(season) {
    switch (season) {
        case "봄웜":
            return "Spring Warm";
        case "여름쿨":
            return "Summer Cool";
        case "가을웜":
            return "Autumn Warm";
        case "겨울쿨":
            return "Winter Cool";
        default:
            return "Personal Color Match";
    }
}

function seasonKeyFromLabel(season) {
    switch (season) {
        case "봄웜":
            return "springWarm";
        case "여름쿨":
            return "summerCool";
        case "가을웜":
            return "autumnWarm";
        case "겨울쿨":
            return "winterCool";
        default:
            return null;
    }
}

function defaultPaletteForSeason(season) {
    switch (season) {
        case "봄웜":
            return [
                "#FFE3C4",
                "#FFD1B3",
                "#FFB3A7",
                "#FFC96F",
                "#F8D5C5",
                "#F7A0B8"
            ];
        case "여름쿨":
            return [
                "#E8F0FF",
                "#D2E0FF",
                "#C2D2F2",
                "#F0C5DA",
                "#F7D4EB",
                "#C0E3E8"
            ];
        case "가을웜":
            return [
                "#F3C9A7",
                "#D88F5A",
                "#B86A3C",
                "#CFAE71",
                "#A6604D",
                "#76513B"
            ];
        case "겨울쿨":
            return [
                "#F5F5FF",
                "#D8D9FF",
                "#B1B4FF",
                "#7C7AD9",
                "#4D4A9F",
                "#C02152"
            ];
        default:
            return [
                "#F8D5C5",
                "#F7B2A6",
                "#E9A8E2",
                "#CDE5FF",
                "#BFD8D2",
                "#F4C095"
            ];
    }
}

function defaultMakeupForSeason(season) {
    switch (season) {
        case "봄웜":
            return [
                "Warm coral & peachy pink blush",
                "Light apricot or salmon lip tints",
                "Soft brown or rose-gold eyeshadow",
                "Warm ivory or light beige base"
            ];
        case "여름쿨":
            return [
                "Cool pink or mauve blush",
                "Rose or berry lip colors",
                "Taupe, dusty rose, or lavender eyeshadow",
                "Cool-toned ivory foundation"
            ];
        case "가을웜":
            return [
                "Terracotta & warm apricot blush",
                "Brick, cinnamon, or caramel lips",
                "Olive, bronze, and copper eyeshadow",
                "Warm beige or honey base"
            ];
        case "겨울쿨":
            return [
                "Raspberry or wine-toned blush",
                "Bold red or fuchsia lips",
                "Charcoal, plum, and jewel-tone eyeshadow",
                "Porcelain or neutral beige base"
            ];
        default:
            return ["Soft rosy blush", "MLBB lip colors", "Neutral brown eyeshadow"];
    }
}

function defaultHairForSeason(season) {
    switch (season) {
        case "봄웜":
            return [
                "Warm brown with golden highlights",
                "Soft caramel or honey blonde",
                "Rose-brown with a subtle warm tint"
            ];
        case "여름쿨":
            return [
                "Ash brown or cool dark brown",
                "Soft beige or ash blonde",
                "Rose-brown with a cool undertone"
            ];
        case "가을웜":
            return [
                "Deep chocolate brown",
                "Chestnut, copper, or auburn",
                "Warm dark brown with golden balayage"
            ];
        case "겨울쿨":
            return [
                "Blue-black or cool deep brown",
                "Burgundy or plum highlights",
                "Very dark espresso brown"
            ];
        default:
            return ["Neutral dark brown", "Soft brown balayage"];
    }
}

function defaultAvoidForSeason(season) {
    switch (season) {
        case "봄웜":
            return [
                "Very cool, icy neon shades",
                "Dusty, grayish muted colors",
                "Extremely dark, heavy colors close to black"
            ];
        case "여름쿨":
            return [
                "Overly warm, orange-heavy tones",
                "Very bright neon colors",
                "Harsh black near the face"
            ];
        case "가을웜":
            return [
                "Icy blue and silver-based pastels",
                "Neon pinks and purples",
                "Pure stark white"
            ];
        case "겨울쿨":
            return [
                "Muted, earthy browns",
                "Mustard and yellow-orange tones",
                "Soft, dusty pastels that look faded"
            ];
        default:
            return [
                "Extremely neon colors near the face",
                "Very muddy, grayish tones"
            ];
    }
}

/* Monetization mocks */

premiumBtn.addEventListener("click", () => {
    alert(t("premiumAlert"));
});

downloadBtn.addEventListener("click", () => {
    alert(t("downloadAlert"));
});

/* Sharing */

shareKakao.addEventListener("click", () => {
    alert(t("shareKakaoAlert"));
});

shareInsta.addEventListener("click", () => {
    alert(t("shareInstaAlert"));
});

shareLink.addEventListener("click", async () => {
    const url = window.location.href;
    try {
        await navigator.clipboard.writeText(url);
        alert(t("shareLinkCopied"));
    } catch {
        alert(t("shareLinkFailed"));
    }
});

/* Initial */

applyTranslations();
setStatus("ready");
