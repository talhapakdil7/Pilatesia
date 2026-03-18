## Railway Deploy (Backend: FastAPI + MySQL)

Bu proje Railway üzerinde backend (FastAPI) ve MySQL’i ayrı servisler olarak çalıştırmak üzere hazırlanmıştır.

### 1) MySQL servisi
- Railway’de yeni proje içinde “MySQL” template’i ekle.
- Şema yoksa backend bunu otomatik oluşturur (backend, container/entrypoint açılışında `studios` tablosunu kontrol eder; yoksa `python -m app.scripts.init_db` çalıştırır).

### 2) Backend servisi
- Kaynak: GitHub repository (veya Docker ile; bu dokümanda source akışı esas alınmıştır).
- Çalıştırma (Start command):
  - `python entrypoint.py`
- Build/Run ortamı:
  - `requirements.txt` kullanılır.

### 3) Zorunlu environment variables
- `DATABASE_URL`
  - Format örneği: `mysql+pymysql://USER:PASSWORD@HOST:PORT/pilatesia`
- `SECRET_KEY`
  - JWT imzalama için güçlü bir secret.

### 4) CORS environment variable
- `CORS_ALLOW_ORIGINS`
  - Virgülle ayır (comma-separated).
  - Örnek (Vercel frontend domainin eklenmiş hali):
    - `https://your-frontend.vercel.app,http://localhost:5173,http://127.0.0.1:5173`

### 5) Port
- Railway start sürecinde genelde `PORT` env’i set edilir.
- `entrypoint.py` `PORT` env’ini okuyup uvicorn’u ona göre ayağa kaldırır.

### 6) Doğrulama
- Deploy sonrası:
  - `/{docs}` veya `http://<backend-domain>/docs` açılınca FastAPI Swagger görünmelidir.

