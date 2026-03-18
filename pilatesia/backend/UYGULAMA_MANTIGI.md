# Pilatesia – Uygulama Mantığı Özeti

## Genel Bakış

Pilatesia, çok stüdyolu bir pilates/fitness rezervasyon sistemidir. Her stüdyonun kendi admin'i ve üyeleri var. Kullanıcılar derslere rezervasyon yapabiliyor, üyelik bilgilerini görüyor; admin'ler ders, kullanıcı ve ısınma hareketlerini yönetiyor.

---

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Backend | FastAPI, Python 3.12 |
| Veritabanı | MySQL 8 |
| Frontend | React 19, Vite, Bootstrap |
| HTTP | Axios |
| Auth | JWT (python-jose), passlib (şifre) |

---

## Backend Mimarisi

### Ana Dosyalar
- **`main.py`**: FastAPI app, CORS, tüm router'ların bağlandığı yer
- **`app/config.py`**: `DATABASE_URL`, `SECRET_KEY` gibi ortam değişkenleri
- **`app/db.py`**: SQLAlchemy engine, `get_db()` session üreticisi
- **`entrypoint.py`**: Docker ortamında MySQL hazır olana kadar bekler, tablolar yoksa init_db çalıştırır, sonra uvicorn başlatır

### Router'lar
| Router | Dosya | İşlev |
|--------|-------|-------|
| Auth | `app/routers/auth.py` | Stüdyo kaydı, üye kaydı, login, profil güncelleme, stüdyo kodu kontrolü |
| Lessons | `app/routers/lessons.py` | Ders listesi, ders detayı |
| Reservations | `app/routers/reservations.py` | Rezervasyon listesi, oluşturma, iptal |
| Membership | `app/routers/membership.py` | Üyelik bilgisi, kalan hak |
| Admin Lessons | `app/routers/admin_lessons.py` | Admin: ders CRUD |
| Admin Users | `app/routers/admin_users.py` | Admin: kullanıcı listesi, üyelik atama |
| Warmups | `app/routers/warmups.py` | Isınma hareketleri (okuma + admin CRUD) |

### Core Modüller
- **`app/core/security.py`**: Şifre hash/verify, JWT token üretme, `get_current_user` (Bearer token doğrulama)
- **`app/core/admin_guard.py`**: Admin rolü kontrolü
- **`app/core/membership_logic.py`**: Üyelik kredisi hesaplama mantığı

### Veritabanı Şeması (özet)
- **studios**: Stüdyo adı, benzersiz `code`
- **users**: `studio_id`, `full_name`, `email`, `password_hash`, `role` (user/admin)
- **lessons**: `studio_id`, başlık, açıklama, eğitmen, `start_time`, `duration`, `capacity`
- **reservations**: `user_id`, `lesson_id`, `status` (active/cancelled vb.)
- **memberships**: `user_id`, `status`, `remaining_cred`
- **warmup_moves**: `studio_id`, başlık, açıklama, `video_url`

---

## Frontend Mimarisi

### Yapı
- **`src/App.jsx`**: React Router, `RequireAuth` / `RequireAdmin` ile korumalı route'lar
- **`src/auth/AuthContext.jsx`**: Token + user state, login/logout, `/me` ile kullanıcı çekme
- **`src/auth/RequireAuth.jsx`**: Giriş yoksa login'e yönlendirir
- **`src/auth/RequireAdmin.jsx`**: Admin değilse erişimi engeller
- **`src/api/http.js`**: Axios instance, `baseURL` + her istekte Bearer token ekler
- **`src/context/ToastContext.jsx`**: Toast bildirimleri

### Sayfalar
| Sayfa | Açıklama |
|-------|----------|
| Login / Register | Giriş ve kayıt |
| RegisterStudio | Yeni stüdyo + ilk admin oluşturma |
| Dashboard | Admin / kullanıcı için farklı özet ekranı |
| Lessons / LessonDetail | Ders listesi, detay, rezervasyon |
| MyReservations | Kullanıcının rezervasyonları |
| Membership | Üyelik bilgisi, kalan hak |
| Profile | Ad/şifre güncelleme |
| WarmupMoves | Isınma hareketleri listesi |
| HealthTools | Sağlık araçları (örn. BMI) |
| AdminUsers | Admin: kullanıcı yönetimi |
| AdminLessons | Admin: ders CRUD |
| AdminWarmupMoves | Admin: ısınma hareketi CRUD |

---

## Akış Özetleri

**Stüdyo kurma:** `/register-studio` → `studios` + ilk `users` (role=admin) kaydı

**Üye kaydı:** `/register` (stüdyo kodu + ad/email/şifre) → `users` (role=user)

**Giriş:** `/login` → JWT döner, frontend localStorage'a yazar, sonraki isteklerde Bearer header ile gönderir

**Ders listesi:** Kullanıcının `studio_id`'sine göre gelecek dersler filtrelenir, kalan kontenjan `capacity - aktif rezervasyon sayısı` ile hesaplanır

**Rezervasyon:** Üyelik kredisi ve kapasite kontrol edilir, `reservations` tablosuna eklenir

---

## Docker Yapısı

- **db**: MySQL 8, `pilatesia` veritabanı, `3307:3306` ile host'a açık (DBeaver vb. için)
- **backend**: `Dockerfile.backend` ile build, uvicorn 8000
- **frontend**: Node build + Nginx ile statik servis, 3000 portunda

Backend ve frontend `db` host adı ile `3306` portundan MySQL'e bağlanır. Host'tan erişim: backend `localhost:8000`, frontend `localhost:3000`.
