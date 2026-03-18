### Docker ile 3 Servis Yayına Hazırlık

Bu klasör, `pilatesia/docker-compose.yml` dosyasının kullandığı Docker ek dosyalarını (özellikle MySQL init script) içerir.

Başlatma:
- Backend + MySQL + Frontend: `docker compose -f docker-compose.yml up --build`

Notlar:
- MySQL, tabloları `docker/mysql/init_db.sql` ile container ilk açılışında oluşturur.
- Backend yalnızca tablolar oluştuğunda start alır (healthcheck bu duruma göre tetikler).
