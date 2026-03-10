# Busra Mangaoglu Requirements

## 1. List Lessons

- **API Method:** `GET /lessons`
- **Description:** Retrieves the list of lessons defined in the system. Users can view available lessons based on schedule and availability.

## 2. View Lesson Details

- **API Method:** `GET /lessons/{lesson_id}`
- **Description:** Retrieves detailed information about the selected lesson. Lesson time, capacity, and availability information are displayed.

## 3. Create Lesson Reservation

- **API Method:** `POST /reservations`
- **Description:** Allows a user to create a reservation for a selected lesson. The user must have an active membership and the lesson must have available capacity.

## 4. List User Reservations

- **API Method:** `GET /my-reservations`
- **Description:** Lists the active reservations created by the user.

## 5. Cancel Reservation

- **API Method:** `DELETE /reservations/{reservation_id}`
- **Description:** Allows the user to cancel a reservation they previously created. Past lesson reservations cannot be cancelled.

## 6. List Lessons (Admin)

- **API Method:** `GET /admin/lessons`
- **Description:** Allows an admin user to list all lessons available in the system.

## 7. Create Lesson (Admin)

- **API Method:** `POST /admin/lessons`
- **Description:** Allows an admin user to create and add a new lesson to the system.

## 8. Update Lesson (Admin)

- **API Method:** `PUT /admin/lessons/{lesson_id}`
- **Description:** Allows an admin user to update the details of an existing lesson.

## 9. Delete Lesson (Admin)

- **API Method:** `DELETE /admin/lessons/{lesson_id}`
- **Description:** Allows an admin user to delete a lesson from the system.
