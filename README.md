# Makro II — teorie

Studijní trenažér makroekonomie (Makroekonomie II, BALN) — výroky **ANO/NE** s vysvětlením a přehledem pastí. Jeden self-contained HTML soubor, žádný build, žádné závislosti kromě Google Fonts z CDN.

## PWA

Aplikace je instalovatelná jako Progressive Web App:

- `manifest.webmanifest` — metadata + ikony (192 / 512 / maskable)
- `sw.js` — service worker, offline provoz (cache-first pro vlastní soubory, síť pro CDN fonty)
- `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` — ikony v Constructiva stylu (zdroj: `icon.svg`, `icon-maskable.svg`)

Po prvním načtení běží appka i offline a jde „přidat na plochu".

## Soubory

- `index.html` — produkční verze (nasazovaný soubor)
- `makro-teorie.html` — originál (zdroj, needituje se)

## Nasazení

Statický web na **Vercel** — žádný build, root jako output. Stačí propojit repozitář, framework „Other" / statický export. Lokální náhled např.:

```bash
npx serve .
```

> Ikony se generují z SVG přes `sharp` (`npm install sharp`); `node_modules` je v `.gitignore`.
