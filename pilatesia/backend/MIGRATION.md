# MySQL ve Çoklu Stüdyo Geçiş Rehberi

## Yapılan Değişiklikler

- **Veritabanı:** SQLite → MySQL
- **Yeni kavram:** Stüdyo (studio) – Her stüdyonun kendi admini ve kullanıcıları var
- **Email:** Artık `(email, studio_id)` benzersiz – aynı email farklı stüdyolarda kullanılabilir

## Kurulum

### 1. MySQL

MySQL kurulu değilse:

- macOS: `brew install mysql` ve `brew services start mysql`
- Ubuntu: `sudo apt install mysql-server`

Veritabanı oluştur:

```bash
mysql -u root -p -e "CREATE DATABASE pilatesia;"
```

### 2. Ortam Değişkenleri

`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri güncelleyin:

```bash
cp .env.example .env
```

`.env` içeriği örneği:

```
DATABASE_URL=mysql+pymysql://root:SIFRENIZ@localhost:3306/pilatesia
SECRET_KEY=guclu-bir-gizli-anahtar
```

### 3. Bağımlılıklar

```bash
pip install -r requirements.txt
```

### 4. Tabloları Oluştur

```bash
python -m app.scripts.init_db
```

### 5. İlk Stüdyoyu Oluştur

Tarayıcıdan `/register-studio` sayfasına gidip yeni stüdyo oluşturun veya API ile:

```bash
curl -X POST http://127.0.0.1:8000/register-studio \
  -H "Content-Type: application/json" \
  -d '{"studio_name":"Demo Stüdyo","studio_code":"demo","admin_name":"Admin","admin_email":"admin@demo.com","admin_password":"sifre123"}'
```

### 6. Uygulamayı Çalıştır

```bash
./run.sh          # Backend
cd ../frontend && npm run dev   # Frontend
```

## Akışlar

- **Stüdyo açma:** `/register-studio` – Stüdyo adı, kodu ve admin bilgileri
- **Üye kaydı:** `/register` – Stüdyo kodu + ad, email, şifre
- **Giriş:** `/login` – Email + şifre (kullanıcı kendi stüdyosuna ait verilere erişir)
