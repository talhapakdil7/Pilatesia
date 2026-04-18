## Vercel Deploy (Frontend: React + Vite)

Bu doküman `pilatesia/frontend` klasörünü Vercel'de yayınlamak için hazırlanmıştır.

### Canlı Link
- **Frontend:** https://pilatesia.vercel.app

### 1) Vercel'de proje ayarı
- Vercel -> "Add New Project" ile GitHub repodan içe aktar.
- "Root Directory" değerini şuna ayarla:
  - `pilatesia/frontend`

### 2) Build ayarları
- Framework/Builder: Vite (otomatik seçilebilir)
- Build command: `npm run build`
- Output directory: `dist`

### 3) Zorunlu env değişkeni
- `VITE_API_BASE_URL`
  - Değer: Vercel backend domaini
  - Mevcut: `https://pilatesia-api.vercel.app`

`src/api/http.js` içinde her istek Bearer token ekleniyor ve `VITE_API_BASE_URL` ile backend'e yönleniyor.

### 4) Doğrulama
- Vercel deploy sonrası tarayıcıdan frontend'i aç.
- İlk sayfa route'ları ve login akışı çalışmalı.
