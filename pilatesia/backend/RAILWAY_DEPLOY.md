## Vercel Deploy (Backend: FastAPI + Neon PostgreSQL)

Bu proje Vercel üzerinde Python Serverless Functions olarak çalışmaktadır.

### Canlı Link
- **API:** https://pilatesia-api.vercel.app
- **Swagger Docs:** https://pilatesia-api.vercel.app/docs

### 1) Neon PostgreSQL
- Vercel Marketplace üzerinden `vercel integration add neon` ile eklenir.
- `DATABASE_URL` otomatik olarak proje env'lerine enjekte edilir.
- Şema yoksa backend bunu otomatik oluşturur (startup sırasında `studios` tablosunu kontrol eder; yoksa `init_db` çalıştırır).

### 2) Vercel proje yapılandırması
- Kaynak: GitHub repository `talhapakdil7/Pilatesia`
- Root Directory: `pilatesia/backend`
- `vercel.json` ve `api/index.py` Vercel Python runtime'ı yapılandırır.

### 3) Zorunlu environment variables
- `DATABASE_URL`
  - Neon'dan otomatik gelir.
  - Format: `postgresql://USER:PASSWORD@HOST/neondb?sslmode=require`
- `SECRET_KEY`
  - JWT imzalama için güçlü bir secret.

### 4) CORS environment variable
- `CORS_ALLOW_ORIGINS`
  - Virgülle ayır (comma-separated).
  - Örnek: `https://pilatesia.vercel.app,http://localhost:5173`

### 5) Doğrulama
- Deploy sonrası:
  - `https://pilatesia-api.vercel.app/docs` açılınca FastAPI Swagger görünmelidir.
