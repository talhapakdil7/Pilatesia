# Pilatesia Web Frontend Görevleri

**Web Frontend Adresi:** [pilatesia](https://pilatesia.vercel.app/login)

**Front-end Test Videosu:** [Frontend test videosu](https://www.youtube.com/watch?v=KwFOXFPuW0k)


---

## 1. Üye Olma (Kayıt) Sayfası

- **API Endpoint:** `POST /register` (yardımcı: `GET /studios/check?studio_code=...`)
- **Görev:** Kullanıcı kayıt işlemi için web sayfası tasarımı ve implementasyonu (geçerli stüdyo kodu ile).
- **UI Bileşenleri:**
  - Responsive kayıt formu (desktop ve mobile uyumlu)
  - Stüdyo kodu alanı; doğrulama için `studios/check` (geçerliyse stüdyo adı gösterimi)
  - Email input alanı (`type="email"`, `autocomplete="email"`)
  - Şifre input alanı (`type="password"`, şifre gücü göstergesi)
  - Şifre tekrar input alanı (doğrulama için)
  - Ad (`firstName`) input alanı (`autocomplete="given-name"`) ve soyad (`lastName`) (`autocomplete="family-name"`) — birleştirilerek API’ye `full_name` olarak gönderilir; veya tek `full_name` alanı
  - “Kayıt Ol” butonu (primary button style)
  - “Zaten hesabınız var mı? Giriş Yap” linki
  - Loading spinner (kayıt işlemi sırasında)
  - Form container (card veya centered layout)
- **Form Validasyonu:**
  - HTML5 form validation (`required`, `pattern` uygun yerlerde)
  - JavaScript real-time validation
  - Email format kontrolü (regex pattern)
  - Şifre güvenlik kuralları (min 8 karakter, büyük/küçük harf, rakam)
  - Şifre eşleşme kontrolü
  - Ad ve soyad (veya `full_name`) boş olamaz kontrolü
  - Tüm alanlar geçerli olmadan buton disabled
  - Client-side ve server-side validation (API `400`: geçersiz stüdyo kodu, e-posta zaten kayıtlı vb.)
- **Kullanıcı Deneyimi:**
  - Form hatalarını input altında gösterilmesi (inline validation)
  - Başarılı kayıt sonrası success notification ve otomatik giriş sayfasına yönlendirme
  - Hata durumlarında kullanıcı dostu mesajlar (ör. `400`: “Bu e-posta bu stüdyoda zaten kayıtlı”)
  - Form submission prevention (double-click koruması)
  - Accessible form labels ve ARIA attributes
  - Keyboard navigation desteği (Tab, Enter)
- **Teknik Detaylar:**
  - Framework: React/Vue/Angular veya Vanilla JS
  - Form library: React Hook Form, Formik veya native HTML5
  - State management (form state, loading state, error state)
  - Routing (kayıt sayfasından giriş sayfasına geçiş)
  - SEO optimization (meta tags, structured data)
  - Accessibility (WCAG 2.1 AA compliance)

---

## 2. Kullanıcı Profil Görüntüleme Sayfası

- **API Endpoint:** `GET /me`
- **Görev:** Oturum açmış kullanıcının profil bilgilerini görüntüleme sayfası tasarımı ve implementasyonu.
- **UI Bileşenleri:**
  - Responsive profil layout (desktop: sidebar + content, mobile: stacked)
  - Profil fotoğrafı alanı (circular avatar, placeholder veya gerçek fotoğraf) — *API’de foto URL yok; baş harf / placeholder*
  - Kullanıcı adı ve soyadı (`full_name`, H1 heading)
  - Email adresi (icon + text, copy to clipboard özelliği)
  - Telefon numarası (icon + text, varsa) — *şu an API’de yok; backend eklendiğinde gösterim*
  - Rol (`role`) gösterimi
  - Hesap oluşturulma tarihi (`created_at`, formatted date)
  - “Profili Düzenle” butonu (secondary button)
  - “Hesabı Sil” butonu (danger, alt kısımda) — *son kullanıcı self-delete API yok; gizle veya “yakında” / admin ile aynı stüdyo politikası*
  - Refresh butonu veya auto-refresh
  - Breadcrumb navigation (opsiyonel)
- **Form Validasyonu:**
  - Uygulanmaz (salt okuma).
- **Kullanıcı Deneyimi:**
  - Loading skeleton screen (veri yüklenirken)
  - Empty state (veri yoksa)
  - Error state (yükleme hatası durumunda retry butonu; `401` → giriş)
  - Smooth page transitions
  - Profil fotoğrafı için placeholder avatar (initials)
  - Responsive grid layout
  - Print-friendly styles
- **Teknik Detaylar:**
  - Lazy loading images (gelecekte profil fotoğrafı varsa)
  - Image optimization (WebP, responsive images)
  - Client-side caching (localStorage/sessionStorage) — dikkatli, hassas veri
  - State management (user data, loading, error states)
  - Routing (profil düzenleme sayfasına geçiş)
  - Deep linking (profil genelde private; paylaşım yoksa kısıtlı)
  - Meta tags (Open Graph, Twitter Cards — uygun gizlilik politikası)

---

## 3. Kullanıcı Profil Düzenleme Sayfası

- **API Endpoint:** `PUT /profile`
- **Görev:** Kullanıcı profil bilgilerini düzenleme sayfası tasarımı ve implementasyonu (API’nin desteklediği alanlarla).
- **UI Bileşenleri:**
  - Responsive düzenleme formu
  - Profil fotoğrafı düzenleme alanı (drag & drop upload, preview) — *API henüz desteklemiyor; frontend hazırlığı veya gizle*
  - Ad / soyad veya tek `full_name` alanı (mevcut değer `GET /me` ile dolu)
  - Email input — *API’de güncelleme yok; salt okunur göster veya gizle*
  - Telefon numarası input — *API’de yok; backend sonrası*
  - Yeni şifre + şifre tekrar (opsiyonel)
  - “Kaydet” butonu (primary button, sağ üst veya form altında)
  - “İptal” butonu (secondary button, sol üst veya form altında)
  - Değişiklik yapıldığında “Kaydet” butonu aktif olur
  - Unsaved changes indicator
- **Form Validasyonu:**
  - En az `full_name` veya `password` güncellemesi (ikisi de boş gönderilmez; API `400`)
  - Email format kontrolü — *yalnızca gelecekte email düzenleme eklenirse*
  - Telefon format kontrolü — *backend sonrası*
  - Real-time validation feedback
  - Değişiklik yoksa “Kaydet” butonu disabled
  - File upload validation (image type, size limits) — *foto API sonrası*
  - Şifre eşleşmesi ve boş şifre engeli
- **Kullanıcı Deneyimi:**
  - Optimistic update (kaydet sonrası UI güncellemesi — veya başarı yanıtına göre)
  - Başarılı güncelleme sonrası success notification (toast/snackbar)
  - Hata durumunda error mesajı ve gerekirse state geri alma
  - “İptal” butonuna basıldığında değişiklik kaybı için browser confirmation dialog
  - Beforeunload event (sayfa kapatılırken uyarı)
  - Image preview (upload öncesi) — *API sonrası*
  - Progress indicator (image upload için) — *API sonrası*
- **Teknik Detaylar:**
  - Form state management (initial values, edited values, dirty state)
  - File upload component — *API sonrası*
  - Image compression (client-side, before upload) — *API sonrası*
  - Image preview functionality — *API sonrası*
  - Routing (geri dönüş, kaydetme sonrası profil sayfasına dönüş)
  - Unsaved changes warning (browser navigation)
  - Form persistence (localStorage, draft saving) — opsiyonel
  - Gövde şeması: `ProfileUpdate` (`full_name`, `password` opsiyonel alanlar)

---

## 4. Hesap Silme Akışı

- **API Endpoint:** `DELETE /admin/users/{user_id}` (yalnızca admin, aynı stüdyo). Son kullanıcı için `DELETE /users/{userId}` şu an yok.
- **Görev:** Hesap / kullanıcı silme için web UI akışı: admin panelinde gerçek API; son kullanıcı self-delete için backend eklendikten sonra aynı UX şablonu.
- **UI Bileşenleri:**
  - “Hesabı Sil” / “Kullanıcıyı sil” butonu (danger button style)
  - Modal dialog (destructive action için)
  - Şifre doğrulama alanı (güvenlik için opsiyonel) — *self-delete endpoint’i ile uyumlu olacak şekilde*
  - Son onay ekranı (uyarı mesajları ile)
  - “Emin misiniz?” confirmation dialog (çift onay mekanizması)
  - Warning icons ve visual cues
- **Form Validasyonu:**
  - Admin silmede path `user_id` doğruluğu; opsiyonel onay metni eşleşmesi (UX)
- **Kullanıcı Deneyimi:**
  - Destructive action için görsel uyarılar (kırmızı renk, warning icons)
  - Açık ve net uyarı mesajları (“Bu işlem geri alınamaz”)
  - İptal seçeneği her zaman mevcut (modal close, cancel button)
  - Silme işlemi sırasında loading indicator
  - Başarılı silme sonrası: adminde liste yenileme; self-delete’te logout ve login sayfasına yönlendirme
  - Success message gösterilmesi
- **Akış Adımları:**
  1. Profil veya admin listede “Sil” butonuna tıklama
  2. İlk uyarı modal dialog’u gösterilmesi
  3. Onaylandığında şifre doğrulama (opsiyonel, self-delete ile)
  4. Son onay ekranı (detaylı uyarılar, checkbox confirmation)
  5. Silme işlemini API ile gerçekleştirme
  6. Başarılı silme sonrası logout (self-delete) veya liste güncelleme (admin) ve login sayfasına yönlendirme (self-delete)
- **Teknik Detaylar:**
  - Modal/Dialog component kullanımı
  - Multi-step flow yönetimi (state machine veya step-based)
  - Error handling (silme başarısız olursa — `404`, yetki)
  - Logout işlemi entegrasyonu (self-delete senaryosu)
  - Session storage ve localStorage temizleme
  - Redirect handling (login sayfasına dönüş)
  - Browser history management

---

## 5. Stüdyo Oluşturma ve İlk Admin Kaydı Sayfası

- **API Endpoint:** `POST /register-studio`
- **Görev:** Yeni stüdyo ve ilk admin kullanıcı oluşturma (herkese açık onboarding) sayfası tasarımı ve implementasyonu.
- **UI Bileşenleri:**
  - Responsive form: stüdyo adı, stüdyo kodu, admin adı, admin email, admin şifre + tekrar
  - Primary “Stüdyo oluştur” butonu; başarıda dönen `studio_code` vurgusu
  - “Giriş yap” linki
  - Loading spinner
  - Form container (card veya centered layout)
- **Form Validasyonu:**
  - HTML5 ve JS ile email, şifre politikası, şifre eşleşmesi
  - Sunucu `400`: stüdyo kodu / email çakışması mesajları
  - Tüm alanlar geçerli değilken buton disabled; double-submit koruması
- **Kullanıcı Deneyimi:**
  - Inline validation; başarı mesajı ve girişe yönlendirme önerisi
  - ARIA ve klavye erişimi
- **Teknik Detaylar:**
  - JSON gövde: `StudioRegister`
  - State: loading / error / success; routing
  - SEO ve WCAG hedefi

---

## 6. Giriş (Login) Sayfası

- **API Endpoint:** `POST /login`
- **Görev:** JWT ile oturum açma sayfası tasarımı ve implementasyonu.
- **UI Bileşenleri:**
  - Email input (`type="email"`, `autocomplete="username"` veya `email`)
  - Şifre input (`type="password"`, `autocomplete="current-password"`)
  - “Giriş Yap” butonu (primary)
  - “Kayıt ol”, “Stüdyo oluştur” linkleri
  - Şifre göster/gizle (opsiyonel)
  - Loading spinner
  - Form container (card veya centered layout)
- **Form Validasyonu:**
  - HTML5 required; email formatı
  - `401` için kullanıcı dostu mesaj
- **Kullanıcı Deneyimi:**
  - Inline hatalar; başarıda token saklama ve korumalı alana yönlendirme
  - Accessible labels, ARIA, Tab/Enter
- **Teknik Detaylar:**
  - `application/x-www-form-urlencoded`; `username` + `password`
  - Axios interceptor ile Bearer; React Context veya eşdeğeri
  - SEO (login sayfası meta)

---

## 7. Ders Listesi Sayfası

- **API Endpoint:** `GET /lessons`
- **Görev:** Stüdyonun gelecek derslerini listeleme arayüzü (`start_time >= NOW()`).
- **UI Bileşenleri:**
  - Responsive kart veya tablo: başlık, eğitmen, başlangıç zamanı, süre, kapasite, kalan koltuk (`remaining_seats`)
  - Ders detayına ve rezervasyon CTA’sına link
  - Opsiyonel client-side filtre/sıralama
  - Breadcrumb (opsiyonel)
- **Form Validasyonu:**
  - Uygulanmaz (salt okuma).
- **Kullanıcı Deneyimi:**
  - Loading skeleton; boş liste empty state
  - Tarih/saat yerel gösterim
  - Smooth transitions
- **Teknik Detaylar:**
  - Auth zorunlu; `401` handling
  - Deep link hazırlığı (detay sayfasına geçiş)
  - State: liste, loading, error

---

## 8. Ders Detay Sayfası

- **API Endpoint:** `GET /lessons/{lesson_id}`
- **Görev:** Tek ders detayı ve rezervasyon kararı için sayfa tasarımı ve implementasyonu.
- **UI Bileşenleri:**
  - Başlık (H1), açıklama, eğitmen, başlangıç, süre, kapasite, kalan yer
  - “Rezervasyon yap” butonu (primary veya CTA)
  - Breadcrumb (opsiyonel)
- **Form Validasyonu:**
  - Uygulanmaz.
- **Kullanıcı Deneyimi:**
  - Skeleton; `404` “Ders bulunamadı”; retry
  - Print-friendly (opsiyonel)
- **Teknik Detaylar:**
  - Route: `/lessons/:lesson_id`
  - Meta / başlık SEO
  - State: lesson, loading, error

---

## 9. Rezervasyon Oluşturma

- **API Endpoint:** `POST /reservations`
- **Görev:** Seçilen derse rezervasyon oluşturma (kredi düşümü) arayüzü.
- **UI Bileşenleri:**
  - Onay modalı veya ders detayında “Rezerve et” butonu
  - Loading state; başarı/hata geri bildirimi
- **Form Validasyonu:**
  - Gövde: `lesson_id` (integer, zorunlu)
  - Sunucu: `404`, `400` (ders dolu, zaten rezerve, kredi yok vb.) mesajlarının gösterimi
- **Kullanıcı Deneyimi:**
  - Başarı sonrası toast; `GET /membership` ve rezervasyon listelerini yenileme
  - Double-submit koruması
- **Teknik Detaylar:**
  - JSON: `ReservationCreate`
  - Optimistic veya pessimistic güncelleme stratejisi

---

## 10. Aktif Rezervasyonlarım Sayfası

- **API Endpoint:** `GET /my-reservations`
- **Görev:** Yalnızca aktif ve dersi bitmemiş rezervasyonları listeleme.
- **UI Bileşenleri:**
  - Responsive kart listesi; ders bilgisi, rezervasyon id
  - “İptal et” aksiyonu (`DELETE /reservations/{reservation_id}`)
  - Pull-to-refresh veya yenile butonu (opsiyonel)
- **Form Validasyonu:**
  - Uygulanmaz.
- **Kullanıcı Deneyimi:**
  - Skeleton; boş state (“Yaklaşan rezervasyonunuz yok”)
  - Tarih formatı ve saat dilimi
- **Teknik Detaylar:**
  - Geçmiş ile sekme veya alt rota ayrımı

---

## 11. Rezervasyon Geçmişi Sayfası

- **API Endpoint:** `GET /my-reservations/history`
- **Görev:** Aktif + iptal tüm geçmiş rezervasyonları gösterme.
- **UI Bileşenleri:**
  - Liste veya tablo; durum rozeti (`active` / `cancelled`)
  - Oluşturulma tarihi; ders özeti (başlık, eğitmen, zaman)
- **Form Validasyonu:**
  - Uygulanmaz.
- **Kullanıcı Deneyimi:**
  - “Yaklaşan” / “Geçmiş” sekmeleri ile bölüm 10 ile birleşik UX
  - Uzun liste için sayfalama veya sanal liste (opsiyonel)
- **Teknik Detaylar:**
  - Backend sıralama: `created_at DESC`

---

## 12. Rezervasyon İptali

- **API Endpoint:** `DELETE /reservations/{reservation_id}`
- **Görev:** Aktif rezervasyonu iptal etme; kredi iadesi akışı.
- **UI Bileşenleri:**
  - Destructive onay modalı; uyarı metni
  - Loading indicator
- **Form Validasyonu:**
  - Path parametresi doğru `reservation_id`
- **Kullanıcı Deneyimi:**
  - `400`: zaten iptal, ders başladıktan sonra iptal yok; `404` bulunamadı
  - Başarıda liste ve kredi güncellemesi
- **Akış Adımları:**
  1. “İptal et” tıklanır
  2. Onay modalı gösterilir
  3. Onayda DELETE isteği
  4. Başarı/hata geri bildirimi ve veri yenileme
- **Teknik Detaylar:**
  - İptal sonrası `GET /my-reservations`, `GET /membership` refetch
  - Modal/dialog bileşeni

---

## 13. Üyelik ve Kredi Özeti

- **API Endpoint:** `GET /membership`
- **Görev:** Kullanıcı üyeliği, kalan kredi ve stüdyo bilgisini gösterme (dashboard kartı veya ayrı sayfa).
- **UI Bileşenleri:**
  - `remaining_cred`, `status` vurgusu
  - Stüdyo adı ve kodu (`studio` objesi)
  - İkonlu özet kartları
- **Form Validasyonu:**
  - Uygulanmaz.
- **Kullanıcı Deneyimi:**
  - Skeleton; rezervasyon akışıyla tutarlı kredi gösterimi
- **Teknik Detaylar:**
  - İlk yüklemede backend üyelik oluşturabilir; state senkronu

---

## 14. Admin — Ders Listesi

- **API Endpoint:** `GET /admin/lessons`
- **Görev:** Admin için stüdyodaki tüm dersleri listeleme arayüzü.
- **UI Bileşenleri:**
  - Tablo veya kart listesi; düzenle, sil aksiyonları
  - “Yeni ders” butonu
  - Breadcrumb (opsiyonel)
- **Form Validasyonu:**
  - Uygulanmaz.
- **Kullanıcı Deneyimi:**
  - `403` yetkisiz yönlendirme; skeleton; boş liste
- **Teknik Detaylar:**
  - `RequireAdmin` route guard; state yönetimi

---

## 15. Admin — Yeni Ders Oluşturma

- **API Endpoint:** `POST /admin/lessons`
- **Görev:** Yeni ders oluşturma formu tasarımı ve implementasyonu.
- **UI Bileşenleri:**
  - `title`, `description`, `instructor_name`, `start_time`, `duration`, `capacity` alanları
  - Tarih-saat seçici (API string formatına uyum)
  - “Kaydet” (primary), “İptal” (secondary)
  - Loading spinner
- **Form Validasyonu:**
  - HTML5 + JS; pozitif `duration` ve `capacity`; `422` alan hataları
  - Geçerli değilken submit disabled
- **Kullanıcı Deneyimi:**
  - Inline hatalar; başarı toast; listeye dönüş
  - ARIA, klavye
- **Teknik Detaylar:**
  - JSON: `LessonCreate`
  - Routing ve SEO (admin sayfaları genelde noindex)

---

## 16. Admin — Ders Güncelleme

- **API Endpoint:** `PUT /admin/lessons/{lesson_id}`
- **Görev:** Mevcut ders bilgilerini kısmi güncelleme formu.
- **UI Bileşenleri:**
  - Mevcut değerlerle dolu form; değişen alanlar
  - Kaydet / İptal; unsaved changes indicator
- **Form Validasyonu:**
  - En az bir alan dolu (API `400` “Güncellenecek alan yok”)
  - `422` validation
- **Kullanıcı Deneyimi:**
  - `404` ders yok; toast; geri navigasyon
- **Teknik Detaylar:**
  - JSON: `LessonUpdate`
  - Dirty state yönetimi

---

## 17. Admin — Ders Silme

- **API Endpoint:** `DELETE /admin/lessons/{lesson_id}`
- **Görev:** Ders silme için onaylı destructive akış.
- **UI Bileşenleri:**
  - Sil butonu (danger); onay modalı
  - Loading indicator
- **Form Validasyonu:**
  - Uygulanmaz.
- **Kullanıcı Deneyimi:**
  - Net uyarı; iptal her zaman mümkün
  - Başarıda listeden kaldırma
- **Akış Adımları:**
  1. Sil tıklanır
  2. Onay modalı
  3. DELETE isteği
  4. Liste yenileme veya optimistic update
- **Teknik Detaylar:**
  - Hata handling; admin guard

---

## 18. Admin — Kullanıcı Listesi

- **API Endpoint:** `GET /admin/users`
- **Görev:** Stüdyo kullanıcılarını tabloda listeleme (`remaining_cred`, rol vb.).
- **UI Bileşenleri:**
  - Sortable/filterable tablo (opsiyonel client-side)
  - Satır aksiyonları: düzenle, sil, kredi ekle
  - “Yeni kullanıcı” butonu
- **Form Validasyonu:**
  - Uygulanmaz.
- **Kullanıcı Deneyimi:**
  - Skeleton; boş stüdyo mesajı
- **Teknik Detaylar:**
  - Pagination (opsiyonel, büyük listeler için)

---

## 19. Admin — Kullanıcı Oluşturma

- **API Endpoint:** `POST /admin/users`
- **Görev:** Admin tarafından yeni kullanıcı oluşturma formu.
- **UI Bileşenleri:**
  - `full_name`, `email`, `password`, `role` (varsayılan `user`)
  - Primary submit; iptal
  - Loading spinner
- **Form Validasyonu:**
  - Email, şifre politikası; `400` e-posta kayıtlı
  - Tüm zorunlu alanlar dolu değilken disabled
- **Kullanıcı Deneyimi:**
  - Inline validation; başarıda liste yenileme
- **Teknik Detaylar:**
  - JSON: `AdminUserCreate`

---

## 20. Admin — Kullanıcı Güncelleme

- **API Endpoint:** `PATCH /admin/users/{user_id}`
- **Görev:** Kullanıcı bilgilerini kısmi güncelleme (modal veya sayfa).
- **UI Bileşenleri:**
  - `full_name`, `email`, `password`, `role` alanları (gönderilenler güncellenir)
  - Kaydet / İptal
- **Form Validasyonu:**
  - En az bir alan; boş şifre `400`; e-posta çakışması `400`; `404`
- **Kullanıcı Deneyimi:**
  - Toast; modal kapanışı ve liste güncellemesi
- **Teknik Detaylar:**
  - JSON: `AdminUserUpdate`

---

## 21. Admin — Kullanıcı Silme

- **API Endpoint:** `DELETE /admin/users/{user_id}`
- **Görev:** Bölüm 4 ile aynı UX prensipleri; admin bağlamında listeden silme.
- **UI Bileşenleri:**
  - Danger buton; çift onay; opsiyonel email/teyit yazdırma
- **Form Validasyonu:**
  - Uygulanmaz (path id).
- **Kullanıcı Deneyimi:**
  - Bölüm 4’teki destructive UX maddeleri
- **Akış Adımları:**
  - Bölüm 4 akışına paralel; son adımda liste refetch, logout yok (admin oturumu devam)
- **Teknik Detaylar:**
  - `404` handling; admin guard

---

## 22. Admin — Kullanıcıya Kredi Ekleme

- **API Endpoint:** `PATCH /admin/users/{user_id}/credits`
- **Görev:** Belirtilen kullanıcıya kredi ekleme arayüzü.
- **UI Bileşenleri:**
  - Pozitif tam sayı input veya stepper (`add_credits`)
  - “Kredi ekle” butonu; mevcut kredi gösterimi (listeden)
- **Form Validasyonu:**
  - `add_credits` > 0; `400` aksi halde
- **Kullanıcı Deneyimi:**
  - Başarıda satırda güncel `remaining_cred`; toast
- **Teknik Detaylar:**
  - JSON: `AddCreditsBody`

---

## 23. Isınma Hareketleri — Liste

- **API Endpoint:** `GET /warmup-moves`
- **Görev:** Stüdyo isınma hareketlerini listeleyen kullanıcı arayüzü.
- **UI Bileşenleri:**
  - Responsive kart grid; başlık, açıklama
  - `video_url` varsa embed, harici link veya modal oynatıcı
  - Admin için “Yeni ekle” entry’si
- **Form Validasyonu:**
  - Uygulanmaz.
- **Kullanıcı Deneyimi:**
  - Skeleton; boş liste
  - Video erişilebilirlik (kontroller, klavye)
- **Teknik Detaylar:**
  - Auth gerekli; lazy load video thumbnail (opsiyonel)

---

## 24. Admin — Isınma Hareketi Oluşturma

- **API Endpoint:** `POST /warmup-moves`
- **Görev:** Yeni isınma hareketi ekleme formu (yalnızca admin).
- **UI Bileşenleri:**
  - `title` (zorunlu), `description`, `video_url`
  - Kaydet / İptal; loading
- **Form Validasyonu:**
  - `title` required; `video_url` formatı (doluysa)
  - `403` admin değilse uyarı
- **Kullanıcı Deneyimi:**
  - Başarıda listeye dönüş veya optimistic ekleme
- **Teknik Detaylar:**
  - JSON: `WarmupMoveCreate`

---

## 25. Admin — Isınma Hareketi Güncelleme

- **API Endpoint:** `PUT /warmup-moves/{move_id}`
- **Görev:** Mevcut isınma hareketini güncelleme formu.
- **UI Bileşenleri:**
  - Dolu form; Kaydet / İptal
- **Form Validasyonu:**
  - En az bir alan dolu (`400` hepsi boş)
  - `404` kayıt yok
- **Kullanıcı Deneyimi:**
  - Toast; geri navigasyon
- **Teknik Detaylar:**
  - JSON: `WarmupMoveUpdate`

---

## 26. Admin — Isınma Hareketi Silme

- **API Endpoint:** `DELETE /warmup-moves/{move_id}`
- **Görev:** Isınma hareketi silme; onaylı akış.
- **UI Bileşenleri:**
  - Danger aksiyon; onay modalı
- **Form Validasyonu:**
  - Uygulanmaz.
- **Kullanıcı Deneyimi:**
  - Başarıda listeden kaldırma
- **Akış Adımları:**
  1. Sil tıklanır
  2. Onay
  3. DELETE
  4. Liste yenileme
- **Teknik Detaylar:**
  - `404` handling

---

