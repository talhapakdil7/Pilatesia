# Talha Pakdil Gereksinimleri

## 1. Üye Olma

- **API Metodu:** `POST /auth/register`
- **Açıklama:** Kullanıcıların email ve şifre belirleyerek sisteme kayıt olmasını sağlar. Yeni kullanıcı hesabı oluşturulur ve varsayılan rol "member" olarak atanır.


## 2. Giriş Yapma

- **API Metodu:** `POST /auth/login`
- **Açıklama:** Kullanıcıların sistemdeki hesaplarına giriş yapmasını sağlar. Email ve şifre doğrulanır. Başarılı giriş sonrası kullanıcıya yetkilendirme için erişim belirteci (token) oluşturulur.



## 3. Profil Görüntüleme

- **API Metodu:** `GET /me`
- **Açıklama:** Giriş yapmış kullanıcının profil bilgilerini getirir. Kullanıcı ad, email ve üyelik bilgileri görüntülenebilir.



## 9. Üyelik Durumu Görüntüleme

- **API Metodu:** `GET /me/membership`
- **Açıklama:** Kullanıcının üyelik durumunu getirir. Üyeliğin aktif veya pasif olduğu, başlangıç ve bitiş tarihleri görüntülenir.



## 10. Kalan Ders Hakkını Görüntüleme

- **API Metodu:** `GET /me/credits`
- **Açıklama:** Kullanıcının kalan ders hakkını getirir. Kullanıcının kaç adet ders rezervasyonu yapabileceği görüntülenir.



## 11. Profil Güncelleme

- **API Metodu:** `PUT /me`
- **Açıklama:** Kullanıcının profil bilgilerini güncellemesini sağlar. Kullanıcı adı ve diğer kişisel bilgiler değiştirilebilir.



## 16. Kullanıcı Listeleme (Admin)

- **API Metodu:** `GET /admin/users`
- **Açıklama:** Admin rolüne sahip kullanıcının sistemdeki tüm kullanıcıları listelemesini sağlar.



## 17. Kullanıcı Ekleme (Admin)

- **API Metodu:** `POST /admin/users`
- **Açıklama:** Admin rolüne sahip kullanıcının sisteme yeni kullanıcı eklemesini sağlar.



## 18. Kullanıcı Güncelleme (Admin)

- **API Metodu:** `PUT /admin/users/{userId}`
- **Açıklama:** Admin rolüne sahip kullanıcının mevcut kullanıcı bilgilerini güncellemesini sağlar.



## 19. Kullanıcı Silme (Admin)

- **API Metodu:** `DELETE /admin/users/{userId}`
- **Açıklama:** Admin rolüne sahip kullanıcının sistemi kullanan kullanıcıyı silmesini sağlar.
