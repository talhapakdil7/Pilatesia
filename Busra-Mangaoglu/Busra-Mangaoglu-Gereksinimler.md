# Busra Mangaoglu Gereksinimleri

## 1. Dersleri Listeleme

- **API Metodu:** `GET /classes`
- **Açıklama:** Sistemde tanımlı olan derslerin listesini getirir. Kullanıcılar tarih ve uygunluk durumuna göre dersleri görüntüleyebilir.

## 2. Ders Detayı Görüntüleme

- **API Metodu:** `GET /classes/{classId}`
- **Açıklama:** Seçilen derse ait detaylı bilgileri getirir. Ders saati, kapasite ve doluluk bilgisi görüntülenir.

## 3. Ders Rezervasyonu Oluşturma

- **API Metodu:** `POST /reservations`
- **Açıklama:** Kullanıcının seçtiği ders için rezervasyon oluşturmasını sağlar. Kullanıcının üyeliği aktif olmalıdır ve ders kapasitesi dolu olmamalıdır.

## 4. Rezervasyonları Listeleme

- **API Metodu:** `GET /reservations`
- **Açıklama:** Kullanıcının oluşturduğu rezervasyonları listeler. Kullanıcı yaklaşan ve geçmiş rezervasyonlarını görüntüleyebilir.

## 5. Rezervasyon İptal Etme

- **API Metodu:** `DELETE /reservations/{reservationId}`
- **Açıklama:** Kullanıcının oluşturduğu rezervasyonu iptal etmesini sağlar. Geçmiş ders rezervasyonları iptal edilemez.

## 6. Ders Listeleme (Admin)

- **API Metodu:** `GET /admin/classes`
- **Açıklama:** Admin rolüne sahip kullanıcının sistemdeki tüm dersleri listelemesini sağlar.

## 7. Ders Ekleme (Admin)

- **API Metodu:** `POST /admin/classes`
- **Açıklama:** Admin rolüne sahip kullanıcının sisteme yeni ders eklemesini sağlar.

## 8. Ders Güncelleme (Admin)

- **API Metodu:** `PUT /admin/classes/{classId}`
- **Açıklama:** Admin rolüne sahip kullanıcının mevcut ders bilgilerini güncellemesini sağlar.

## 9. Ders Silme (Admin)

- **API Metodu:** `DELETE /admin/classes/{classId}`
- **Açıklama:** Admin rolüne sahip kullanıcının dersi sistemden silmesini sağlar.
