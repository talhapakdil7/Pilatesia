### Docker ile 3 Servis Yayına Hazırlık

Bu klasör, `pilatesia/backend/docker-compose.yml` dosyasının kullandığı Docker ek dosyalarını içerir.

Başlatma:
- Backend + PostgreSQL + Frontend: `docker compose -f docker-compose.yml up --build`

Notlar:
- PostgreSQL, tabloları `scripts/init_db.sql` ile container ilk açılışında oluşturur.
- Backend yalnızca tablolar oluştuğunda start alır (healthcheck bu duruma göre tetikler).
