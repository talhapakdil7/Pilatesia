# Talha Pakdil Requirements

## 1. User Registration

- **API Method:** `POST /register`
- **Description:** Allows users to create an account in the system by providing their email and password. A new user account is created and the default role is assigned as "user".

## 2. User Login

- **API Method:** `POST /login`
- **Description:** Allows users to log into their accounts in the system. Email and password are validated. After a successful login, an access token is generated for authentication.

## 3. View Profile

- **API Method:** `GET /me`
- **Description:** Retrieves the profile information of the authenticated user. The user can view their name, email, and other profile information.

## 4. View Membership Status

- **API Method:** `GET /membership`
- **Description:** Retrieves the membership information of the authenticated user. The user can view membership status and related details.

## 5. View Remaining Credits

- **API Method:** `GET /membership`
- **Description:** Retrieves the remaining lesson credits of the authenticated user, showing how many lessons the user can still reserve.

## 6. Update Profile

- **API Method:** `PUT /profile`
- **Description:** Allows the user to update their profile information such as full name or password.

## 7. List Users (Admin)

- **API Method:** `GET /admin/users`
- **Description:** Allows an admin user to retrieve a list of all users in the system.

## 8. Create User (Admin)

- **API Method:** `POST /admin/users`
- **Description:** Allows an admin user to create a new user in the system.

## 9. Update User (Admin)

- **API Method:** `PATCH /admin/users/{user_id}`
- **Description:** Allows an admin user to update the information of an existing user.

## 10. Delete User (Admin)

- **API Method:** `DELETE /admin/users/{user_id}`
- **Description:** Allows an admin user to remove a user from the system.
