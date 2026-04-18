# Pilatesia Deploy Yol Haritası (Vercel)

## Durum
- `main` dalına push yapıldı.
- Kaynak kod yapısı:
  - Backend: `pilatesia/backend` (FastAPI)
  - Frontend: `pilatesia/frontend` (React/Vite)

## Hedef
- Tüm altyapı Vercel üzerinde: Neon PostgreSQL → Backend (Vercel Python Serverless) → Frontend (Vercel Static)

## Canlı Linkler
- **Frontend:** https://pilatesia.vercel.app
- **Backend API:** https://pilatesia-api.vercel.app
- **Swagger Docs:** https://pilatesia-api.vercel.app/docs

---

## Adım 1: Neon PostgreSQL oluştur
1. Vercel Dashboard → Storage → **Create Database** → **Neon Postgres** seç.
   - Veya CLI ile: `vercel integration add neon`
2. Oluşturulan `DATABASE_URL` otomatik olarak proje env'lerine eklenir.
3. Tabloları oluştur:
   - Neon SQL editöründe `scripts/init_db.sql` içeriğini çalıştır.
   - Veya lokal: `DATABASE_URL="..." python -m app.scripts.init_db`

---

## Adım 2: Backend (FastAPI) deploy
1. Vercel'de **Add New Project** → GitHub repo: `talhapakdil7/Pilatesia`
2. **Root Directory**: `pilatesia/backend`
3. Vercel, `vercel.json` + `api/index.py` + `@vercel/python` ile otomatik build eder.

### Backend environment variables (Vercel)
Zorunlu:
1. `DATABASE_URL`
   - Neon entegrasyonundan otomatik gelir.
   - Format: `postgresql://USER:PASSWORD@HOST/neondb?sslmode=require`
2. `SECRET_KEY`
   - Güçlü bir secret string.
3. `CORS_ALLOW_ORIGINS`
   - Örnek: `https://pilatesia.vercel.app`

Opsiyonel:
- `ALGORITHM` (varsayılan: `HS256`)

### Backend doğrulama
Deploy sonrası:
1. Swagger docs:
   - `https://pilatesia-api.vercel.app/docs`
   - HTTP 200 ve sayfa açılıyorsa backend çalışıyor.
2. Basit endpoint:
   - `https://pilatesia-api.vercel.app/studios/check?studio_code=<kod>`

---

## Adım 3: Vercel Frontend deploy
1. Vercel'de **Add New Project**:
   - GitHub repo: `talhapakdil7/Pilatesia`
   - Dal: `main`
2. **Root Directory**: `pilatesia/frontend`
3. Build ayarları:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Vercel environment variables (build-time)
   - `VITE_API_BASE_URL`
   - Değer: `https://pilatesia-api.vercel.app`

### Frontend doğrulama
- Frontend ana sayfa açılmalı.
- Login/Register route'ları çalışmalı.

---

## Adım 4: Uçtan uca canlı test (önerilen sıra)
1. `POST /register-studio`
   - Yeni stüdyo + admin oluştur
2. `POST /login`
   - Admin ile JWT al
3. `GET /me`
   - Kullanıcı bilgisi dönmeli
4. `GET /lessons`
   - Admin veya user için ders listesi dönmeli (role/güncel veriye göre)
5. `POST /reservations`
   - Bir lesson için rezervasyon oluştur
6. `GET /my-reservations`
   - Aktif rezervasyonlar görünmeli
7. `DELETE /reservations/{reservation_id}`
   - Ders başlamadıysa iptal çalışmalı ve kredi iade olmalı

---

## Sorun Giderme (en sık)
1. Frontend backend'e istek atamıyor
   - `VITE_API_BASE_URL` yanlış olabilir veya boş olabilir (Vercel env build-time).
2. Login çalışmıyor / CORS hatası
   - `CORS_ALLOW_ORIGINS` Vercel domain ile güncellenmemiştir.
3. `/docs` açılmıyor
   - Backend environment vars eksik (özellikle `DATABASE_URL` / `SECRET_KEY`).
4. PostgreSQL tabloları yok
   - `entrypoint.py` `studios` tablosunu kontrol eder; yoksa `init_db` çalışır.
