# API Tasarımı - OpenAPI Specification Örneği

**OpenAPI Spesifikasyon Dosyası:** [platesia.yaml](platesia.yaml)

Bu doküman, OpenAPI Specification (OAS) 3.1 standardına göre hazırlanmış örnek bir API tasarımını içermektedir.

## OpenAPI Specification

```yaml
openapi: 3.1.0
title: Pilatesia API
info:
  title: Pilatesia API
  description: |
    Pilates stüdyosu rezervasyon ve yönetim platformu için RESTful API.

    ## Özellikler
    - Kullanıcı ve üye yönetimi
    - Pilates dersleri ve eğitmen yönetimi
    - Ders rezervasyon sistemi
    - BMI hesaplama ve kullanıcı sağlık verileri
    - JWT tabanlı kimlik doğrulama
  version: 1.0.0
  contact:
    name: API Destek Ekibi
    email: talhapakdil7@gmail.com
    url: https://talha-portfolioo.vercel.app/
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

tags:
  - name: auth
    description: Kimlik doğrulama işlemleri

  - name: lessons
    description: Pilates dersleri ve program yönetimi

  - name: reservations
    description: Ders rezervasyon işlemleri

  - name: membership
    description: Üyelik ve kredi bilgileri işlemleri

  - name: admin-lessons
    description: Admin tarafında ders yönetimi işlemleri

  - name: admin-users
    description: Kullanıcı ve admin yönetimi işlemleri

  - name: warmups
    description: Isınma hareketleri yönetimi işlemleri
    
paths:
  "/register":
    post:
      tags:
      - auth
      summary: Register
      operationId: register_register_post
      requestBody:
        content:
          application/json:
            schema:
              "$ref": "#/components/schemas/UserRegister"
        required: true
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/HTTPValidationError"
  "/login":
    post:
      tags:
      - auth
      summary: Login
      operationId: login_login_post
      requestBody:
        content:
          application/x-www-form-urlencoded:
            schema:
              "$ref": "#/components/schemas/Body_login_login_post"
        required: true
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/HTTPValidationError"
  "/me":
    get:
      tags:
      - auth
      summary: Me
      operationId: me_me_get
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
      security:
      - OAuth2PasswordBearer: []
  "/profile":
    put:
      tags:
      - auth
      summary: Update Profile
      operationId: update_profile_profile_put
      requestBody:
        content:
          application/json:
            schema:
              "$ref": "#/components/schemas/ProfileUpdate"
        required: true
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/HTTPValidationError"
      security:
      - OAuth2PasswordBearer: []
  "/lessons":
    get:
      tags:
      - lessons
      summary: Get Lessons
      operationId: get_lessons_lessons_get
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
  "/lessons/{lesson_id}":
    get:
      tags:
      - lessons
      summary: Get Lesson Detail
      operationId: get_lesson_detail_lessons__lesson_id__get
      parameters:
      - name: lesson_id
        in: path
        required: true
        schema:
          type: integer
          title: Lesson Id
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/HTTPValidationError"
  "/reservations":
    post:
      tags:
      - reservations
      summary: Create Reservation
      operationId: create_reservation_reservations_post
      requestBody:
        content:
          application/json:
            schema:
              "$ref": "#/components/schemas/ReservationCreate"
        required: true
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/HTTPValidationError"
      security:
      - OAuth2PasswordBearer: []
  "/my-reservations":
    get:
      tags:
      - reservations
      summary: My Reservations
      description: SADECE aktif rezervasyonlar
      operationId: my_reservations_my_reservations_get
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
      security:
      - OAuth2PasswordBearer: []
  "/my-reservations/history":
    get:
      tags:
      - reservations
      summary: My Reservations History
      description: Tüm geçmiş (active + cancelled)
      operationId: my_reservations_history_my_reservations_history_get
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
      security:
      - OAuth2PasswordBearer: []
  "/reservations/{reservation_id}":
    delete:
      tags:
      - reservations
      summary: Cancel Reservation
      operationId: cancel_reservation_reservations__reservation_id__delete
      security:
      - OAuth2PasswordBearer: []
      parameters:
      - name: reservation_id
        in: path
        required: true
        schema:
          type: integer
          title: Reservation Id
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/HTTPValidationError"
  "/membership":
    get:
      tags:
      - membership
      summary: Get Membership
      operationId: get_membership_membership_get
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
      security:
      - OAuth2PasswordBearer: []
  "/admin/lessons":
    get:
      tags:
      - admin-lessons
      summary: Admin List Lessons
      operationId: admin_list_lessons_admin_lessons_get
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
      security:
      - OAuth2PasswordBearer: []
    post:
      tags:
      - admin-lessons
      summary: Admin Create Lesson
      operationId: admin_create_lesson_admin_lessons_post
      requestBody:
        content:
          application/json:
            schema:
              "$ref": "#/components/schemas/LessonCreate"
        required: true
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/HTTPValidationError"
      security:
      - OAuth2PasswordBearer: []
  "/admin/lessons/{lesson_id}":
    put:
      tags:
      - admin-lessons
      summary: Admin Update Lesson
      operationId: admin_update_lesson_admin_lessons__lesson_id__put
      security:
      - OAuth2PasswordBearer: []
      parameters:
      - name: lesson_id
        in: path
        required: true
        schema:
          type: integer
          title: Lesson Id
      requestBody:
        required: true
        content:
          application/json:
            schema:
              "$ref": "#/components/schemas/LessonUpdate"
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/HTTPValidationError"
    delete:
      tags:
      - admin-lessons
      summary: Admin Delete Lesson
      operationId: admin_delete_lesson_admin_lessons__lesson_id__delete
      security:
      - OAuth2PasswordBearer: []
      parameters:
      - name: lesson_id
        in: path
        required: true
        schema:
          type: integer
          title: Lesson Id
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/HTTPValidationError"
  "/admin/users":
    get:
      tags:
      - admin-users
      summary: List Users
      operationId: list_users_admin_users_get
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
      security:
      - OAuth2PasswordBearer: []
    post:
      tags:
      - admin-users
      summary: Create User
      operationId: create_user_admin_users_post
      requestBody:
        content:
          application/json:
            schema:
              "$ref": "#/components/schemas/AdminUserCreate"
        required: true
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/HTTPValidationError"
      security:
      - OAuth2PasswordBearer: []
  "/admin/users/{user_id}":
    patch:
      tags:
      - admin-users
      summary: Update User
      operationId: update_user_admin_users__user_id__patch
      security:
      - OAuth2PasswordBearer: []
      parameters:
      - name: user_id
        in: path
        required: true
        schema:
          type: integer
          title: User Id
      requestBody:
        required: true
        content:
          application/json:
            schema:
              "$ref": "#/components/schemas/AdminUserUpdate"
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/HTTPValidationError"
    delete:
      tags:
      - admin-users
      summary: Delete User
      operationId: delete_user_admin_users__user_id__delete
      security:
      - OAuth2PasswordBearer: []
      parameters:
      - name: user_id
        in: path
        required: true
        schema:
          type: integer
          title: User Id
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/HTTPValidationError"
  "/admin/users/{user_id}/credits":
    patch:
      tags:
      - admin-users
      summary: Add User Credits
      operationId: add_user_credits_admin_users__user_id__credits_patch
      security:
      - OAuth2PasswordBearer: []
      parameters:
      - name: user_id
        in: path
        required: true
        schema:
          type: integer
          title: User Id
      requestBody:
        required: true
        content:
          application/json:
            schema:
              "$ref": "#/components/schemas/AddCreditsBody"
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/HTTPValidationError"
  "/warmup-moves":
    get:
      tags:
      - warmups
      summary: List Warmup Moves
      operationId: list_warmup_moves_warmup_moves_get
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
    post:
      tags:
      - warmups
      summary: Create Warmup Move
      operationId: create_warmup_move_warmup_moves_post
      requestBody:
        content:
          application/json:
            schema:
              "$ref": "#/components/schemas/WarmupMoveCreate"
        required: true
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/HTTPValidationError"
      security:
      - OAuth2PasswordBearer: []
  "/warmup-moves/{move_id}":
    put:
      tags:
      - warmups
      summary: Update Warmup Move
      operationId: update_warmup_move_warmup_moves__move_id__put
      security:
      - OAuth2PasswordBearer: []
      parameters:
      - name: move_id
        in: path
        required: true
        schema:
          type: integer
          title: Move Id
      requestBody:
        required: true
        content:
          application/json:
            schema:
              "$ref": "#/components/schemas/WarmupMoveUpdate"
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/HTTPValidationError"
    delete:
      tags:
      - warmups
      summary: Delete Warmup Move
      operationId: delete_warmup_move_warmup_moves__move_id__delete
      security:
      - OAuth2PasswordBearer: []
      parameters:
      - name: move_id
        in: path
        required: true
        schema:
          type: integer
          title: Move Id
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema: {}
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/HTTPValidationError"
components:
  schemas:
    AddCreditsBody:
      properties:
        add_credits:
          type: integer
          title: Add Credits
      type: object
      required:
      - add_credits
      title: AddCreditsBody
    AdminUserCreate:
      properties:
        full_name:
          type: string
          title: Full Name
        email:
          type: string
          title: Email
        password:
          type: string
          title: Password
        role:
          type: string
          title: Role
          default: user
      type: object
      required:
      - full_name
      - email
      - password
      title: AdminUserCreate
    AdminUserUpdate:
      properties:
        full_name:
          anyOf:
          - type: string
          - type: 'null'
          title: Full Name
        email:
          anyOf:
          - type: string
          - type: 'null'
          title: Email
        password:
          anyOf:
          - type: string
          - type: 'null'
          title: Password
        role:
          anyOf:
          - type: string
          - type: 'null'
          title: Role
      type: object
      title: AdminUserUpdate
    Body_login_login_post:
      properties:
        grant_type:
          anyOf:
          - type: string
            pattern: "^password$"
          - type: 'null'
          title: Grant Type
        username:
          type: string
          title: Username
        password:
          type: string
          format: password
          title: Password
        scope:
          type: string
          title: Scope
          default: ''
        client_id:
          anyOf:
          - type: string
          - type: 'null'
          title: Client Id
        client_secret:
          anyOf:
          - type: string
          - type: 'null'
          format: password
          title: Client Secret
      type: object
      required:
      - username
      - password
      title: Body_login_login_post
    HTTPValidationError:
      properties:
        detail:
          items:
            "$ref": "#/components/schemas/ValidationError"
          type: array
          title: Detail
      type: object
      title: HTTPValidationError
    LessonCreate:
      properties:
        title:
          type: string
          title: Title
        description:
          anyOf:
          - type: string
          - type: 'null'
          title: Description
        instructor_name:
          type: string
          title: Instructor Name
        start_time:
          type: string
          title: Start Time
        duration:
          type: integer
          title: Duration
        capacity:
          type: integer
          title: Capacity
      type: object
      required:
      - title
      - instructor_name
      - start_time
      - duration
      - capacity
      title: LessonCreate
    LessonUpdate:
      properties:
        title:
          anyOf:
          - type: string
          - type: 'null'
          title: Title
        description:
          anyOf:
          - type: string
          - type: 'null'
          title: Description
        instructor_name:
          anyOf:
          - type: string
          - type: 'null'
          title: Instructor Name
        start_time:
          anyOf:
          - type: string
          - type: 'null'
          title: Start Time
        duration:
          anyOf:
          - type: integer
          - type: 'null'
          title: Duration
        capacity:
          anyOf:
          - type: integer
          - type: 'null'
          title: Capacity
      type: object
      title: LessonUpdate
    ProfileUpdate:
      properties:
        full_name:
          anyOf:
          - type: string
          - type: 'null'
          title: Full Name
        password:
          anyOf:
          - type: string
          - type: 'null'
          title: Password
      type: object
      title: ProfileUpdate
    ReservationCreate:
      properties:
        lesson_id:
          type: integer
          title: Lesson Id
      type: object
      required:
      - lesson_id
      title: ReservationCreate
    UserRegister:
      properties:
        full_name:
          type: string
          title: Full Name
        email:
          type: string
          title: Email
        password:
          type: string
          title: Password
      type: object
      required:
      - full_name
      - email
      - password
      title: UserRegister
    ValidationError:
      properties:
        loc:
          items:
            anyOf:
            - type: string
            - type: integer
          type: array
          title: Location
        msg:
          type: string
          title: Message
        type:
          type: string
          title: Error Type
        input:
          title: Input
        ctx:
          type: object
          title: Context
      type: object
      required:
      - loc
      - msg
      - type
      title: ValidationError
    WarmupMoveCreate:
      properties:
        title:
          type: string
          title: Title
        description:
          anyOf:
          - type: string
          - type: 'null'
          title: Description
        video_url:
          anyOf:
          - type: string
          - type: 'null'
          title: Video Url
      type: object
      required:
      - title
      title: WarmupMoveCreate
    WarmupMoveUpdate:
      properties:
        title:
          anyOf:
          - type: string
          - type: 'null'
          title: Title
        description:
          anyOf:
          - type: string
          - type: 'null'
          title: Description
        video_url:
          anyOf:
          - type: string
          - type: 'null'
          title: Video Url
      type: object
      title: WarmupMoveUpdate
  securitySchemes:
    OAuth2PasswordBearer:
      type: oauth2
      flows:
        password:
          scopes: {}
          tokenUrl: login

```
