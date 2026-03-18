# Talha Pakdil Requirements

## 1. Register Studio and Admin

- **API Method:** `POST /register-studio`
- **Description:** Allows a new studio to be created in the system together with its first admin user. The studio name, studio code, admin name, admin email, and admin password are provided during registration.

## 2. User Registration

- **API Method:** `POST /register`
- **Description:** Allows users to create an account in the system by providing their studio code, full name, email, and password. A new user account is created under the related studio and the default role is assigned as "user".

## 3. User Login

- **API Method:** `POST /login`
- **Description:** Allows users to log into their accounts in the system. Email and password are validated, and after a successful login, an access token is generated for authentication.

## 4. View Current User Profile

- **API Method:** `GET /me`
- **Description:** Retrieves the profile information of the authenticated user. The user can view their personal account information such as full name, email, role, and studio-related data.

## 5. Update Profile

- **API Method:** `PUT /profile`
- **Description:** Allows the authenticated user to update their profile information such as full name or password.

## 6. Check Studio Code

- **API Method:** `GET /studios/check`
- **Description:** Checks whether a given studio code is valid before user registration. This helps users verify that they are joining the correct studio.

## 7. View Membership Information

- **API Method:** `GET /membership`
- **Description:** Retrieves the membership information of the authenticated user, including membership status and remaining lesson credits.

## 8. Admin List Users

- **API Method:** `GET /admin/users`
- **Description:** Allows a studio admin to retrieve the list of users belonging to their own studio.

## 9. Admin Create User

- **API Method:** `POST /admin/users`
- **Description:** Allows a studio admin to create a new user account within their own studio.

## 10. Admin Update User

- **API Method:** `PATCH /admin/users/{user_id}`
- **Description:** Allows a studio admin to update the information of an existing user in their own studio.

## 11. Admin Delete User

- **API Method:** `DELETE /admin/users/{user_id}`
- **Description:** Allows a studio admin to remove a user from their own studio.

## 12. Admin Add User Credits

- **API Method:** `PATCH /admin/users/{user_id}/credits`
- **Description:** Allows a studio admin to add lesson credits to a user in their own studio account.

## 13. List Warmup Moves

- **API Method:** `GET /warmup-moves`
- **Description:** Retrieves the list of warmup moves available in the system for authenticated users.

## 14. Create Warmup Move

- **API Method:** `POST /warmup-moves`
- **Description:** Allows authorized users to create a new warmup move by providing information such as title, description, and video URL.

## 15. Update Warmup Move

- **API Method:** `PUT /warmup-moves/{move_id}`
- **Description:** Allows authorized users to update an existing warmup move.

## 16. Delete Warmup Move

- **API Method:** `DELETE /warmup-moves/{move_id}`
- **Description:** Allows authorized users to delete an existing warmup move.



## 17. List Lessons

- **API Method:** `GET /lessons`
- **Description:** Retrieves the list of lessons available in the system. Users can view available lessons along with their schedules and capacity information.

## 18. View Lesson Details

- **API Method:** `GET /lessons/{lesson_id}`
- **Description:** Retrieves detailed information about a specific lesson. This includes lesson title, instructor, start time, duration, and remaining capacity.

## 19. Create Lesson Reservation

- **API Method:** `POST /reservations`
- **Description:** Allows a user to create a reservation for a selected lesson. The user must have available lesson credits and the lesson must have remaining capacity.

## 20. List Active Reservations

- **API Method:** `GET /my-reservations`
- **Description:** Retrieves the list of active reservations created by the authenticated user.

## 21. View Reservation History

- **API Method:** `GET /my-reservations/history`
- **Description:** Retrieves the reservation history of the authenticated user, including both active and cancelled reservations.

## 22. Cancel Reservation

- **API Method:** `DELETE /reservations/{reservation_id}`
- **Description:** Allows a user to cancel a previously created reservation. Reservations for past lessons cannot be cancelled.

## 23. Admin List Lessons

- **API Method:** `GET /admin/lessons`
- **Description:** Allows a studio admin to retrieve a list of all lessons created in their studio.

## 24. Admin Create Lesson

- **API Method:** `POST /admin/lessons`
- **Description:** Allows a studio admin to create a new lesson by providing details such as title, instructor name, start time, duration, and capacity.

## 25. Admin Update Lesson

- **API Method:** `PUT /admin/lessons/{lesson_id}`
- **Description:** Allows a studio admin to update the details of an existing lesson.

## 26. Admin Delete Lesson

- **API Method:** `DELETE /admin/lessons/{lesson_id}`
- **Description:** Allows a studio admin to delete a lesson from the system.
