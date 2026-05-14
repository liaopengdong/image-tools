const TOOLS = {"resize-image": {"slug": "resize-image", "title": "Resize Image", "desc": "Resize images by width and height directly in the browser.", "category": "Editing", "kind": "imageResize", "fields": [{"id": "image", "label": "Image file", "type": "file", "accept": "image/*"}, {"id": "width", "label": "Output width", "type": "number", "value": 1200}, {"id": "height", "label": "Output height", "type": "number", "value": 630}]}, "compress-image": {"slug": "compress-image", "title": "Compress Image", "desc": "Compress JPEG or WebP images with quality control.", "category": "Optimization", "kind": "imageCompress", "fields": [{"id": "image", "label": "Image file", "type": "file", "accept": "image/*"}, {"id": "quality", "label": "Quality %", "type": "number", "value": 80}]}, "convert-to-webp": {"slug": "convert-to-webp", "title": "Convert Image to WebP", "desc": "Convert PNG or JPEG images to WebP for smaller web assets.", "category": "Conversion", "kind": "imageWebp", "fields": [{"id": "image", "label": "Image file", "type": "file", "accept": "image/*"}, {"id": "quality", "label": "Quality %", "type": "number", "value": 85}]}, "png-to-jpg": {"slug": "png-to-jpg", "title": "PNG to JPG Converter", "desc": "Convert transparent PNG images to JPG with a background color.", "category": "Conversion", "kind": "imageJpg", "fields": [{"id": "image", "label": "Image file", "type": "file", "accept": "image/*"}, {"id": "bg", "label": "Background color", "type": "text", "value": "#ffffff"}]}, "jpg-to-png": {"slug": "jpg-to-png", "title": "JPG to PNG Converter", "desc": "Convert JPG images to PNG in the browser.", "category": "Conversion", "kind": "imagePng", "fields": [{"id": "image", "label": "Image file", "type": "file", "accept": "image/*"}]}, "image-metadata": {"slug": "image-metadata", "title": "Image Metadata Checker", "desc": "Check image dimensions, file type, size, and aspect ratio.", "category": "Optimization", "kind": "imageMeta", "fields": [{"id": "image", "label": "Image file", "type": "file", "accept": "image/*"}]}, "aspect-ratio": {"slug": "aspect-ratio", "title": "Aspect Ratio Calculator", "desc": "Calculate proportional image dimensions for resizing.", "category": "Editing", "kind": "aspectRatio", "fields": [{"id": "width", "label": "Original width", "type": "number", "value": 1920}, {"id": "height", "label": "Original height", "type": "number", "value": 1080}, {"id": "newWidth", "label": "New width", "type": "number", "value": 1200}, {"id": "newHeight", "label": "New height", "type": "number", "value": 630}]}, "favicon-generator": {"slug": "favicon-generator", "title": "Favicon Generator", "desc": "Create a simple 512x512 PNG favicon from text initials.", "category": "Web Assets", "kind": "favicon", "fields": [{"id": "text", "label": "Initials", "type": "text", "value": "BH"}, {"id": "bg", "label": "Background color", "type": "text", "value": "#1f7a4d"}, {"id": "color", "label": "Text color", "type": "text", "value": "#ffffff"}]}, "rotate-image": {"slug": "rotate-image", "title": "Rotate Image", "desc": "Rotate images by 90, 180, or 270 degrees.", "category": "Editing", "kind": "imageRotate", "fields": [{"id": "image", "label": "Image file", "type": "file", "accept": "image/*"}, {"id": "degrees", "label": "Rotation", "type": "select", "options": [["90", "90 degrees"], ["180", "180 degrees"], ["270", "270 degrees"]]}]}, "grayscale-image": {"slug": "grayscale-image", "title": "Grayscale Image", "desc": "Convert an uploaded image to grayscale.", "category": "Editing", "kind": "imageGray", "fields": [{"id": "image", "label": "Image file", "type": "file", "accept": "image/*"}]}, "image-color-picker": {"slug": "image-color-picker", "title": "Image Color Picker", "desc": "Sample the center color of an image and get HEX and RGB values.", "category": "Web Assets", "kind": "imageColor", "fields": [{"id": "image", "label": "Image file", "type": "file", "accept": "image/*"}]}, "social-image-size": {"slug": "social-image-size", "title": "Social Image Size Checker", "desc": "Check whether an image fits common social preview dimensions.", "category": "Web Assets", "kind": "socialSize", "fields": [{"id": "image", "label": "Image file", "type": "file", "accept": "image/*"}]}};

const byId = (id) => document.getElementById(id);
const money = (v) => Number.isFinite(v) ? new Intl.NumberFormat("en-US", {style:"currency", currency:"USD", maximumFractionDigits:2}).format(v) : "$0.00";
const num = (v) => Number.isFinite(v) ? new Intl.NumberFormat("en-US", {maximumFractionDigits:2}).format(v) : "0";
const pct = (v) => Number.isFinite(v) ? `${v.toFixed(2)}%` : "0.00%";
const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const readFields = (fields) => {
  const out = {};
  fields.forEach(f => {
    const el = byId(f.id);
    if (!el) return;
    if (f.type === "file") out[f.id] = el.files?.[0] || null;
    else if (f.type === "textarea" || f.type === "text" || f.type === "select") out[f.id] = el.value;
    else out[f.id] = Number(el.value || 0);
  });
  return out;
};
const fieldHtml = (f) => {
  if (f.type === "textarea") return `<div class="field wide"><label for="${f.id}">${f.label}</label><textarea id="${f.id}" placeholder="${f.placeholder || ""}">${f.value || ""}</textarea></div>`;
  if (f.type === "select") return `<div class="field"><label for="${f.id}">${f.label}</label><select id="${f.id}">${f.options.map(o => `<option value="${o[0]}">${o[1]}</option>`).join("")}</select></div>`;
  if (f.type === "file") return `<div class="field wide"><label for="${f.id}">${f.label}</label><input id="${f.id}" type="file" accept="${f.accept || ""}"></div>`;
  return `<div class="field"><label for="${f.id}">${f.label}</label><input id="${f.id}" type="${f.type || "number"}" step="any" value="${f.value ?? ""}" placeholder="${f.placeholder || ""}"></div>`;
};
const show = (rows, extra="") => {
  byId("results").innerHTML = rows.map(([k,v]) => `<div class="result-card"><span>${escapeHtml(k)}</span><strong>${escapeHtml(v)}</strong></div>`).join("") + extra;
};
const copyText = () => navigator.clipboard?.writeText(byId("results").innerText);

async function loadImage(file) {
  if (!file) throw new Error("Upload an image first.");
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();
  return img;
}
function canvasFromImage(img, w=img.width, h=img.height, rotate=0, gray=false, bg="#ffffff") {
  const c = document.createElement("canvas");
  const swap = rotate === 90 || rotate === 270;
  c.width = swap ? h : w;
  c.height = swap ? w : h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = bg;
  ctx.fillRect(0,0,c.width,c.height);
  if (rotate) {
    ctx.translate(c.width/2, c.height/2);
    ctx.rotate(rotate * Math.PI / 180);
    ctx.drawImage(img, -w/2, -h/2, w, h);
  } else ctx.drawImage(img, 0, 0, w, h);
  if (gray) {
    const data = ctx.getImageData(0,0,c.width,c.height);
    for (let i=0;i<data.data.length;i+=4) {
      const g = Math.round(data.data[i]*0.299 + data.data[i+1]*0.587 + data.data[i+2]*0.114);
      data.data[i]=data.data[i+1]=data.data[i+2]=g;
    }
    ctx.putImageData(data,0,0);
  }
  return c;
}
function downloadCanvas(c, type="image/png", name="image.png", quality=.85) {
  c.toBlob(blob => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
  }, type, quality);
}

const calculator = {
  jsonFormatter: v => { try { const o=JSON.parse(v.input); return [["Valid JSON","Yes"],["Characters",num(v.input.length)],["Formatted", JSON.stringify(o,null,2)],["Minified", JSON.stringify(o)]]; } catch(e){ return [["Valid JSON","No"],["Error",e.message]]; } },
  jsonToCsv: v => { try { const arr=JSON.parse(v.input); const rows=Array.isArray(arr)?arr:[arr]; const keys=[...new Set(rows.flatMap(o=>Object.keys(o||{})))]; const csv=[keys.join(","),...rows.map(o=>keys.map(k=>`"${String(o?.[k]??"").replaceAll('"','""')}"`).join(","))].join("\n"); return [["Rows",num(rows.length)],["Columns",num(keys.length)],["CSV",csv]]; } catch(e){ return [["Error",e.message]]; } },
  regexTester: v => { try { const re=new RegExp(v.pattern,v.flags); const m=[...v.text.matchAll(re)]; return [["Matches",num(m.length)],["Matched text",m.map(x=>x[0]).join("\n") || "No matches"]]; } catch(e){ return [["Error",e.message]]; } },
  timestampConverter: v => { const d = v.mode==="unix" ? new Date(Number(v.value)*1000) : new Date(v.value); return [["Local time",d.toString()],["ISO",d.toISOString?.() || "Invalid date"],["Unix seconds",Number.isFinite(d.getTime())?Math.floor(d.getTime()/1000).toString():"Invalid date"]]; },
  base64: v => { try { return [["Encoded",btoa(unescape(encodeURIComponent(v.text)))],["Decoded",decodeURIComponent(escape(atob(v.text)))] ]; } catch { return [["Encoded",btoa(unescape(encodeURIComponent(v.text)))],["Decoded","Input is not valid Base64"]]; } },
  urlCodec: v => [["Encoded",encodeURIComponent(v.text)],["Decoded",decodeURIComponent(v.text)]],
  jwtDecoder: v => { const p=v.token.split("."); const dec=s=>JSON.stringify(JSON.parse(atob(s.replace(/-/g,"+").replace(/_/g,"/"))),null,2); try { return [["Header",dec(p[0])],["Payload",dec(p[1])],["Signature present",p[2]?"Yes":"No"]]; } catch(e){ return [["Error","Invalid JWT format"]]; } },
  uuidGenerator: v => [["UUIDs",Array.from({length:Math.max(1,Math.min(50,v.count||5))},()=>crypto.randomUUID()).join("\n")]],
  hashGenerator: async v => { const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v.text)); return [["SHA-256",[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")]]; },
  queryParser: v => { const q=v.query.replace(/^\?/,""); const params=[...new URLSearchParams(q).entries()]; return [["Parameters",num(params.length)],["Parsed",params.map(([k,val])=>`${k}: ${val}`).join("\n") || "No parameters"]]; },
  htmlEntities: v => [["Escaped",escapeHtml(v.text)],["Unescaped",v.text.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'")]],
  apiFormatter: v => calculator.jsonFormatter({input:v.payload}),

  aspectRatio: v => { const ratio=v.width/v.height; return [["Aspect ratio",`${num(v.width)}:${num(v.height)} (${ratio.toFixed(4)})`],["New height from width",num(v.newWidth/ratio)],["New width from height",num(v.newHeight*ratio)]]; },
  favicon: v => { const c=document.createElement("canvas"); c.width=c.height=512; const ctx=c.getContext("2d"); ctx.fillStyle=v.bg||"#1f7a4d"; ctx.fillRect(0,0,512,512); ctx.fillStyle=v.color||"#ffffff"; ctx.font="bold 190px Georgia"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText((v.text||"BH").slice(0,3).toUpperCase(),256,270); downloadCanvas(c,"image/png","favicon.png"); return [["Generated","Downloaded favicon.png"],["Size","512 x 512"]]; },
  socialSize: async v => { const img=await loadImage(v.image); const r=img.width/img.height; return [["Dimensions",`${img.width} x ${img.height}`],["Aspect ratio",r.toFixed(3)],["Open Graph 1200x630 fit",Math.abs(r-1200/630)<.08?"Good fit":"May crop"],["Square social fit",Math.abs(r-1)<.08?"Good fit":"May crop"]]; },
  imageMeta: async v => { const img=await loadImage(v.image); return [["File name",v.image.name],["File size",`${(v.image.size/1024).toFixed(1)} KB`],["Type",v.image.type],["Dimensions",`${img.width} x ${img.height}`],["Aspect ratio",(img.width/img.height).toFixed(4)]]; },
  imageResize: async v => { const img=await loadImage(v.image); const c=canvasFromImage(img, v.width||img.width, v.height||img.height); downloadCanvas(c,"image/png","resized-image.png"); return [["Output","Downloaded resized-image.png"],["Dimensions",`${c.width} x ${c.height}`]]; },
  imageCompress: async v => { const img=await loadImage(v.image); const c=canvasFromImage(img); downloadCanvas(c,"image/jpeg","compressed-image.jpg",(v.quality||80)/100); return [["Output","Downloaded compressed-image.jpg"],["Quality",`${v.quality}%`]]; },
  imageWebp: async v => { const img=await loadImage(v.image); const c=canvasFromImage(img); downloadCanvas(c,"image/webp","converted-image.webp",(v.quality||85)/100); return [["Output","Downloaded converted-image.webp"],["Quality",`${v.quality}%`]]; },
  imageJpg: async v => { const img=await loadImage(v.image); const c=canvasFromImage(img,img.width,img.height,0,false,v.bg||"#ffffff"); downloadCanvas(c,"image/jpeg","converted-image.jpg",.9); return [["Output","Downloaded converted-image.jpg"],["Background",v.bg||"#ffffff"]]; },
  imagePng: async v => { const img=await loadImage(v.image); const c=canvasFromImage(img); downloadCanvas(c,"image/png","converted-image.png"); return [["Output","Downloaded converted-image.png"],["Dimensions",`${c.width} x ${c.height}`]]; },
  imageRotate: async v => { const img=await loadImage(v.image); const c=canvasFromImage(img,img.width,img.height,Number(v.degrees)); downloadCanvas(c,"image/png","rotated-image.png"); return [["Output","Downloaded rotated-image.png"],["Rotation",`${v.degrees} degrees`]]; },
  imageGray: async v => { const img=await loadImage(v.image); const c=canvasFromImage(img,img.width,img.height,0,true); downloadCanvas(c,"image/png","grayscale-image.png"); return [["Output","Downloaded grayscale-image.png"],["Dimensions",`${c.width} x ${c.height}`]]; },
  imageColor: async v => { const img=await loadImage(v.image); const c=canvasFromImage(img); const d=c.getContext("2d").getImageData(Math.floor(c.width/2),Math.floor(c.height/2),1,1).data; const hex="#"+[d[0],d[1],d[2]].map(x=>x.toString(16).padStart(2,"0")).join(""); return [["Center HEX",hex],["Center RGB",`rgb(${d[0]}, ${d[1]}, ${d[2]})`]]; },

  wordCounter: v => { const words=(v.text.trim().match(/\b[\w'-]+\b/g)||[]).length; return [["Words",num(words)],["Characters",num(v.text.length)],["Sentences",num((v.text.match(/[.!?]+/g)||[]).length)],["Paragraphs",num(v.text.split(/\n\s*\n/).filter(Boolean).length)],["Reading time",`${Math.max(1,Math.ceil(words/200))} min`]]; },
  caseConverter: v => { const title=v.text.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()); const slug=v.text.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); return [["Title Case",title],["Sentence case",v.text.charAt(0).toUpperCase()+v.text.slice(1).toLowerCase()],["Uppercase",v.text.toUpperCase()],["Lowercase",v.text.toLowerCase()],["Slug",slug]]; },
  slugGenerator: v => [["Slug",v.title.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")],["Length",num(v.title.length)]],
  metaHelper: v => [["Characters",num(v.text.length)],["Status",v.text.length<120?"Too short":v.text.length>160?"Too long":"Good"],["Preview",v.text]],
  titleChecker: v => [["Characters",num(v.title.length)],["Estimated pixels",num(v.title.length*8.5)],["Status",v.title.length>60?"May truncate":"Good"]],
  subtitleCleaner: v => [["Cleaned transcript",v.text.replace(/^\d+\s*$/gm,"").replace(/\d{2}:\d{2}:\d{2}[,\.]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[,\.]\d{3}/g,"").replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim()]],
  markdownCleaner: v => [["Cleaned markdown",v.text.replace(/[ \t]+$/gm,"").replace(/\n{3,}/g,"\n\n").trim()]],
  readingTime: v => { const words=(v.text.trim().match(/\b[\w'-]+\b/g)||[]).length; return [["Words",num(words)],["Reading time",`${Math.max(1,Math.ceil(words/(v.wpm||200)))} min`],["Speaking time",`${Math.max(1,Math.ceil(words/140))} min`]]; },
  headlineIdeas: v => [["Ideas",[`How to ${v.topic} Without Wasting Time`,`A Practical Guide to ${v.topic}`,`${v.topic}: Common Mistakes and Better Options`,`What I Check Before ${v.topic}`,`${v.topic} Checklist for Beginners`].join("\n")]],
  hashtags: v => [["Hashtags",v.keywords.split(/[,\n]+/).map(x=>"#"+x.trim().toLowerCase().replace(/[^a-z0-9]+/g,"")).filter(x=>x.length>1).join(" ")]],
  dedupe: v => { const seen=new Set(); const lines=v.text.split(/\r?\n/).filter(l=>{const k=l.trim(); if(!k||seen.has(k)) return false; seen.add(k); return true;}); return [["Unique lines",lines.join("\n")],["Line count",num(lines.length)]]; },
  utmBuilder: v => { const u=new URL(v.url); [["utm_source",v.source],["utm_medium",v.medium],["utm_campaign",v.campaign],["utm_content",v.content]].forEach(([k,val])=>val&&u.searchParams.set(k,val)); return [["Campaign URL",u.toString()]]; },

  compoundInterest: v => { let bal=v.principal; const r=v.rate/100/v.compounds; for(let y=0;y<v.years;y++) for(let c=0;c<v.compounds;c++) bal=bal*(1+r)+v.monthly*12/v.compounds; return [["Future value",money(bal)],["Total contributions",money(v.principal+v.monthly*12*v.years)],["Estimated interest",money(bal-v.principal-v.monthly*12*v.years)]]; },
  loanPayoff: v => loanCalc(v.balance,v.rate,v.payment,v.extra),
  mortgage: v => { const r=v.rate/100/12,n=v.years*12,p=v.amount*r/(1-Math.pow(1+r,-n)); return [["Principal and interest",money(p)],["Estimated monthly total",money(p+v.tax/12+v.insurance/12)],["Total interest",money(p*n-v.amount)]]; },
  creditCard: v => loanCalc(v.balance,v.apr,v.payment,0),
  savingsGoal: v => { const months=v.months, need=(v.goal-v.current)/months; return [["Monthly savings needed",money(need)],["Weekly savings needed",money(need*12/52)],["Remaining target",money(v.goal-v.current)]]; },
  emergencyFund: v => [["Recommended fund",money(v.expenses*v.months)],["Current gap",money(Math.max(0,v.expenses*v.months-v.current))],["Coverage now",`${(v.current/v.expenses).toFixed(1)} months`]],
  retirement: v => calculator.compoundInterest({principal:v.current,monthly:v.monthly,rate:v.rate,years:v.years,compounds:12}),
  inflation: v => { const future=v.amount*Math.pow(1+v.rate/100,v.years); return [["Future cost",money(future)],["Buying power loss",money(future-v.amount)]]; },
  salaryHourly: v => [["Hourly rate",money(v.salary/(v.weeks*v.hours))],["Monthly pay",money(v.salary/12)],["Weekly pay",money(v.salary/v.weeks)]],
  hourlySalary: v => [["Annual salary",money(v.rate*v.hours*v.weeks)],["Monthly pay",money(v.rate*v.hours*v.weeks/12)],["Weekly pay",money(v.rate*v.hours)]],
  dti: v => [["DTI ratio",pct(v.debt/v.income*100)],["Status",v.debt/v.income>.43?"High":"Manageable"]],
  investmentReturn: v => { const gain=v.end-v.start+v.withdrawals-v.deposits; return [["Net gain",money(gain)],["ROI",pct(gain/(v.start+v.deposits)*100)],["Ending value",money(v.end)]]; },

  seoTitle: v => calculator.titleChecker({title:v.title}),
  seoMeta: v => calculator.metaHelper({text:v.description}),
  serpPreview: v => [["Preview",`${v.title}\n${v.url}\n${v.description}`],["Title length",num(v.title.length)],["Description length",num(v.description.length)]],
  robotsTester: v => { const blocked=v.rules.split(/\r?\n/).some(l=>l.toLowerCase().startsWith("disallow:") && v.path.startsWith(l.split(":").slice(1).join(":").trim())); return [["Result",blocked?"Potentially blocked":"Not blocked by simple rules"],["Path",v.path]]; },
  sitemapExtractor: v => { const urls=[...v.xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]); return [["URLs found",num(urls.length)],["URLs",urls.join("\n")]]; },
  canonicalChecker: v => [["Match",v.page.replace(/\/$/,"")===v.canonical.replace(/\/$/,"")?"Yes":"No"],["Page URL",v.page],["Canonical URL",v.canonical]],
  schemaGenerator: v => [["JSON-LD",JSON.stringify({"@context":"https://schema.org","@type":v.type,name:v.name,description:v.description,url:v.url},null,2)]],
  ogPreview: v => [["Preview",`${v.title}\n${v.url}\n${v.description}\nImage: ${v.image}`]],
  keywordDensity: v => { const words=(v.text.toLowerCase().match(/\b[\w'-]+\b/g)||[]); const kw=v.keyword.toLowerCase(); const count=words.filter(w=>w===kw).length; return [["Keyword count",num(count)],["Total words",num(words.length)],["Density",pct(count/words.length*100)]]; },
  slugChecker: v => { const words=v.slug.split("-").filter(Boolean); return [["Words",num(words.length)],["Characters",num(v.slug.length)],["Status",v.slug.length>75?"Long":"Good"]]; },
  hreflang: v => [["Tags",v.lines.split(/\r?\n/).map(line=>{const [lang,url]=line.split(",").map(x=>x?.trim()); return lang&&url?`<link rel="alternate" hreflang="${lang}" href="${url}">`:"";}).filter(Boolean).join("\n")]],
  faqSchema: v => { const pairs=v.text.split(/\n\s*\n/).map(b=>b.split(/\r?\n/)); return [["JSON-LD",JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:pairs.map(p=>({"@type":"Question",name:p[0]||"",acceptedAnswer:{"@type":"Answer",text:p.slice(1).join(" ")}}))},null,2)]]; }
};
function loanCalc(balance, rate, payment, extra=0){let b=balance, i=0, m=0, p=payment+extra; while(b>0.01&&m<1200){const interest=b*rate/100/12; i+=interest; b+=interest; b-=Math.min(p,b); m++; if(p<=interest) break;} return [["Payoff months",m>=1200?"More than 100 years":num(m)],["Total interest",money(i)],["Monthly payment",money(p)]];}
async function runTool() {
  const slug = document.body.dataset.tool;
  if (!slug || !TOOLS[slug]) return;
  const t = TOOLS[slug];
  byId("calculatorForm").innerHTML = t.fields.map(fieldHtml).join("");
  const run = async () => {
    try { const rows = await calculator[t.kind](readFields(t.fields)); show(rows); }
    catch (e) { show([["Error", e.message]]); }
  };
  byId("calculatorForm").querySelectorAll("input,textarea,select").forEach(el => { el.addEventListener("input", run); el.addEventListener("change", run); });
  byId("copyResults")?.addEventListener("click", copyText);
  run();
}
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-year]").forEach(n => n.textContent = new Date().getFullYear());
  runTool();
});
