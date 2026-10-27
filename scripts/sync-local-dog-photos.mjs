import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = "F:/아가몽 홈페이지";
const OUT = path.join(root, "public", "dogs");

const EN = {
  골든두들: "Golden Doodle",
  골든리트리버: "Golden Retriever",
  꼬똥드툴레아: "Coton de Tulear",
  꼬숑: "Cockapoo",
  닥스훈트: "Dachshund",
  도베르만: "Doberman",
  래브라도리트리버: "Labrador Retriever",
  말라뮤트: "Alaskan Malamute",
  말티즈: "Maltese",
  말티푸: "Maltipoo",
  몰키: "Morkie",
  미니핀: "Miniature Pinscher",
  버니두들: "Bernedoodle",
  버니즈마운틴독: "Bernese Mountain Dog",
  베들링턴테리어: "Bedlington Terrier",
  보더콜리: "Border Collie",
  보스턴테리어: "Boston Terrier",
  비글: "Beagle",
  비숑프리제: "Bichon Frise",
  빠삐용: "Papillon",
  사모예드: "Samoyed",
  세퍼드: "German Shepherd",
  셔틀랜드쉽독: "Shetland Sheepdog",
  슈나우저: "Schnauzer",
  스코티쉬테리어: "Scottish Terrier",
  스탠다드푸들: "Standard Poodle",
  스피츠: "Spitz",
  시바견: "Shiba Inu",
  시츄: "Shih Tzu",
  올드잉글리시쉽독: "Old English Sheepdog",
  요크셔테리어: "Yorkshire Terrier",
  웰시코기: "Welsh Corgi",
  이탈리안그레이하운드: "Italian Greyhound",
  잭러셀테리어: "Jack Russell Terrier",
  차우차우: "Chow Chow",
  치와와: "Chihuahua",
  코카스파니엘: "Cocker Spaniel",
  토이푸들: "Toy Poodle",
  퍼그: "Pug",
  페키니즈: "Pekingese",
  포메라니안: "Pomeranian",
  폼스키: "Pomsky",
  폼피츠: "Pomchi",
  프렌치불독: "French Bulldog",
  허스키: "Siberian Husky",
  화이트테리어: "West Highland White Terrier",
  휘핏: "Whippet",
};

const SLUG = {
  골든두들: "golden-doodle",
  골든리트리버: "golden-retriever",
  꼬똥드툴레아: "coton",
  꼬숑: "cockapoo",
  닥스훈트: "dachshund",
  도베르만: "doberman",
  래브라도리트리버: "labrador",
  말라뮤트: "malamute",
  말티즈: "maltese",
  말티푸: "maltipoo",
  몰키: "morkie",
  미니핀: "minpin",
  버니두들: "bernedoodle",
  버니즈마운틴독: "bernese",
  베들링턴테리어: "bedlington",
  보더콜리: "border-collie",
  보스턴테리어: "boston",
  비글: "beagle",
  비숑프리제: "bichon",
  빠삐용: "papillon",
  사모예드: "samoyed",
  세퍼드: "shepherd",
  셔틀랜드쉽독: "sheltie",
  슈나우저: "schnauzer",
  스코티쉬테리어: "scottish-terrier",
  스탠다드푸들: "standard-poodle",
  스피츠: "spitz",
  시바견: "shiba",
  시츄: "shihtzu",
  올드잉글리시쉽독: "old-english-sheepdog",
  요크셔테리어: "yorkshire",
  웰시코기: "corgi",
  이탈리안그레이하운드: "italian-greyhound",
  잭러셀테리어: "jack-russell",
  차우차우: "chowchow",
  치와와: "chihuahua",
  코카스파니엘: "cocker",
  토이푸들: "toypoodle",
  퍼그: "pug",
  페키니즈: "pekingese",
  포메라니안: "pomeranian",
  폼스키: "pomsky",
  폼피츠: "pomchi",
  프렌치불독: "frenchie",
  허스키: "husky",
  화이트테리어: "westie",
  휘핏: "whippet",
};

function sortKey(name) {
  const m = name.match(/(?:^|[\s_-])(\d+)(?:\.(?:png|jpe?g|webp))?$/i) || name.match(/-(\d+)\./);
  if (m) return Number(m[1]);
  return name.localeCompare("ko");
}

function copyBreed(ko, dirPath) {
  const slug = SLUG[ko];
  if (!slug) throw new Error(`slug 없음: ${ko}`);
  const files = fs
    .readdirSync(dirPath)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .sort((a, b) => sortKey(a) - sortKey(b) || a.localeCompare(b));
  if (files.length < 3) throw new Error(`${ko} 이미지 부족 (${files.length})`);

  const destDir = path.join(OUT, slug);
  fs.rmSync(destDir, { recursive: true, force: true });
  fs.mkdirSync(destDir, { recursive: true });

  files.forEach((file, i) => {
    const ext = path.extname(file).toLowerCase();
    const outName = `${String(i + 1).padStart(2, "0")}${ext === ".jpeg" ? ".jpg" : ext}`;
    fs.copyFileSync(path.join(dirPath, file), path.join(destDir, outName));
  });

  const take = Math.min(8, Math.max(1, Math.floor(files.length / 3)));
  return {
    slug,
    folder: slug,
    type: "puppy",
    ko,
    en: EN[ko] || ko,
    count: files.length,
    take,
    price: 170,
    colors: ["화이트", "크림", "브라운", "블랙"],
    local: true,
    premium: ["pomeranian", "toypoodle", "maltese", "bichon", "frenchie"].includes(slug),
    kindEligible: ["maltese", "chihuahua", "yorkshire", "dachshund"].includes(slug),
  };
}

if (!fs.existsSync(SOURCE)) {
  console.error("소스 폴더 없음:", SOURCE);
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const dirs = fs
  .readdirSync(SOURCE, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort((a, b) => a.localeCompare(b, "ko"));

const breeds = dirs.map((ko) => copyBreed(ko, path.join(SOURCE, ko)));

const outFile = path.join(root, "src", "data", "dog-breeds.js");
const body = `/** ${new Date().toISOString().slice(0, 10)} sync-local-dog-photos.mjs */\nexport const DOG_BREEDS = ${JSON.stringify(breeds, null, 2)};\n`;
fs.writeFileSync(outFile, body, "utf8");

console.log(`강아지 ${breeds.length}견종 → public/dogs/, ${outFile}`);
