# REST API Görev Dağılımı

**REST API Adresi:** [api.platesia.com](https://pilatesia-production.up.railway.app/docs)

Bu dokümanda, proje ekibindeki her üyenin geliştirmekten sorumlu olduğu REST API metotları listelenmektedir.

---

# Pilatesia REST API Metotları


## 1. Register-studio
- **Endpoint:** `POST /register-studio`
- **Açıklama:** It creates a new studio and adds the first admin user.
- **Request Body:**
  ```json
   {
    "studio_name": " İstanbul Studio",
    "studio_code": "34ist",
    "admin_name": "Hasan Yilmaz",
    "admin_email": "hasan@gmail.com",
    "admin_password": "123456"
    }
    ```

- **Response:** `200 Ok` 
```json
    {
    "message": "Stüdyo oluşturuldu. Admin hesabıyla giriş yapabilirsiniz.",
    "studio_code": "34ist"
    }
```

## 2. register
- **Endpoint:** `POST /register`
- **Açıklama:** The user registers with the system using a valid studio code.
- **Request Body:**
```json
{
  "studio_code": "34ist",
  "full_name": "elif beyza",
  "email": "elifbb@gmail.com",
  "password": "123456"
}
```

- **Response:** `200 Ok` 
```json
{
    "message": "Kayıt başarılı. Giriş yapabilirsiniz."
}
```
    
## 3. Login

- **Endpoint:** `POST /login`
- **Açıklama:** The user logs in and receives JWT tokens.
- **Request Body:**

### Body (x-www-form-urlencoded)

| KEY        | VALUE              |
|------------|-------------------|
| username   | elifbb@gmail.com |
| password   | 123456            |


- **Response:** `200 Ok` 
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNSwiZXhwIjoxNzc0MDMwNzQ1fQ.sUGZPbrIgjt8g9UJ-xlpXp5H-Vk2p7VbAwRW4LRlPoI",
    "token_type": "bearer"
}
```
    
## 4. Me

- **Endpoint:** `GET /me`
-**Authentication:** Bearer Token required.
- **Açıklama:** Retrieves the information of the logged-in user. This endpoint is used to verify the user's identity. 
- **Request Body:**

Postman'de:
### 👉 Authorization tabına git

- Type: **Bearer Token**
- Token kısmına:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNSwiZXhwIjoxNzc0MDMwNzQ1fQ.sUGZPbrIgjt8g9UJ-xlpXp5H-Vk2p7VbAwRW4LRlPoI
```

- **Response:** `200 Ok` 
```json
{
    "id": 15,
    "studio_id": 11,
    "full_name": "elif beyza",
    "email": "elifbb@gmail.com",
    "role": "user",
    "created_at": "2026-03-19T18:16:40"
}
```
    
## 5. profile

- **Endpoint:** `POST /profile`
- **Açıklama:** Users can update their profile information (name, password, etc.).
-**Authentication:** Bearer Token required. (I explained how to do it in the upper section.)

- **Request Body:**

{
  "full_name": "elif beyza yeniiii",
  "password": "123456"
}

- **Response:** `200 Ok` 
```json
{
    "message": "Profil güncellendi"
}
```

## 6. Studios-check

- **Endpoint:** `GET /studios/check?studio_code=34ist`
- **Açıklama:** Checks whether the studio code entered during registration is valid.
- **Request Body:** None

- **Response:** `200 Ok` 
```json
{
    "valid": true,
    "name": "İstanbul Studio"
}
```


