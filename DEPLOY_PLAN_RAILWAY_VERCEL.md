# Pilatesia Deploy Yol Haritası (Railway + Vercel)

## Durum
- `main` dalına push yapıldı.
- Kaynak kod yapısı:
  - Backend: `pilatesia/backend` (FastAPI)
  - Frontend: `pilatesia/frontend` (React/Vite)

## Hedef
- Önce MySQL (Railway) -> sonra Backend (Railway) -> en son Frontend (Vercel)

---

## Adım 2: Railway MySQL oluştur
1. Railway’de **New Project** -> **MySQL** ekle.
2. Varsayılanlar ile devam et, ancak backend bağlantısı için gerekli bilgileri not et:
   - `host`
   - `port` (genelde 3306)
   - `database` (backend `pilatesia` bekliyor)
   - `username`
   - `password`
3. Sonuç: backend için aşağıdaki formatta connection string üretilecek.
   - Örnek:
     - `mysql+pymysql://USER:PASSWORD@HOST:PORT/pilatesia`

---

## Adım 3: Railway Backend (FastAPI) deploy
1. Railway’de **Add Service** -> **FastAPI** (veya “Web Service”) oluştur.
2. Kaynak:
   - GitHub repo: `talhapakdil7/Pilatesia`
   - Dal: `main`
3. **Root Directory**:
   - `pilatesia/backend`
4. Build/Start:
   - Start command: `python entrypoint.py`
   - Build ortamı: `requirements.txt` otomatik kullanılmalı (backend klasöründe mevcut).

### Backend environment variables (Railway)
Zorunlu:
1. `DATABASE_URL`
   - Format:
     - `mysql+pymysql://USER:PASSWORD@HOST:PORT/pilatesia`
2. `SECRET_KEY`
   - Güçlü bir secret string (Railway env olarak saklayın).
3. `CORS_ALLOW_ORIGINS`
   - Başlangıç için (geçici):
     - `http://localhost:5173,http://127.0.0.1:5173`
   - Vercel domain geldikten sonra güncellenecek (Adım 6).

Opsiyonel:
- `ALGORITHM` (defaults: `HS256`)
- `PORT` (Railway genelde otomatik ayarlar; `entrypoint.py` `PORT` okur)

### Backend doğrulama
Deploy sonrası:
1. Swagger docs:
   - `https://<backend-domain>/docs`
   - HTTP 200 ve sayfa açılıyorsa backend çalışıyor.
2. Basit endpoint:
   - `https://<backend-domain>/studios/check?studio_code=<kod>`

---

## Adım 4: Vercel Frontend deploy
1. Vercel’de **Add New Project**:
   - GitHub repo: `talhapakdil7/Pilatesia`
   - Dal: `main`
2. **Root Directory**:
   - `pilatesia/frontend`
3. Build ayarları:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Vercel environment variables (build-time)
   - `VITE_API_BASE_URL`
   - Değer:
     - `https://<backend-domain>` (path ekleme, sadece domain/base)

### Frontend doğrulama
- Frontend ana sayfa açılmalı.
- Login/Register route’ları çalışmalı.

---

## Adım 5: CORS güncellemesi (kritik)
Vercel domaini geldiğinde (örn. `https://pilatesia-web.vercel.app`):
1. Railway backend’te `CORS_ALLOW_ORIGINS` değerini güncelle.
2. Örnek:
   - `http://localhost:5173,https://pilatesia-web.vercel.app`
3. Backend’i yeniden deploy et / restart.

---

## Adım 6: Uçtan uca canlı test (önerilen sıra)
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
1. Frontend backend’e istek atamıyor
   - `VITE_API_BASE_URL` yanlış olabilir veya boş olabilir (Vercel env build-time).
2. Login çalışmıyor / CORS hatası
   - `CORS_ALLOW_ORIGINS` Vercel domain ile güncellenmemiştir.
3. `/docs` açılmıyor
   - Railway backend environment vars eksik (özellikle `DATABASE_URL` / `SECRET_KEY`).
4. MySQL tabloları yok/başlamıyor
   - `entrypoint.py` `studios` tablosunu kontrol eder; yoksa `init_db` çalışır.

