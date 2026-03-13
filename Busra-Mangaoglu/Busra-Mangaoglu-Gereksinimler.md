# Busra Mangaoglu Requirements

## 1. List Lessons

- **API Method:** `GET /lessons`
- **Description:** Retrieves the list of lessons available in the system. Users can view available lessons along with their schedules and capacity information.

## 2. View Lesson Details

- **API Method:** `GET /lessons/{lesson_id}`
- **Description:** Retrieves detailed information about a specific lesson. This includes lesson title, instructor, start time, duration, and remaining capacity.

## 3. Create Lesson Reservation

- **API Method:** `POST /reservations`
- **Description:** Allows a user to create a reservation for a selected lesson. The user must have available lesson credits and the lesson must have remaining capacity.

## 4. List Active Reservations

- **API Method:** `GET /my-reservations`
- **Description:** Retrieves the list of active reservations created by the authenticated user.

## 5. View Reservation History

- **API Method:** `GET /my-reservations/history`
- **Description:** Retrieves the reservation history of the authenticated user, including both active and cancelled reservations.

## 6. Cancel Reservation

- **API Method:** `DELETE /reservations/{reservation_id}`
- **Description:** Allows a user to cancel a previously created reservation. Reservations for past lessons cannot be cancelled.

## 7. Admin List Lessons

- **API Method:** `GET /admin/lessons`
- **Description:** Allows a studio admin to retrieve a list of all lessons created in their studio.

## 8. Admin Create Lesson

- **API Method:** `POST /admin/lessons`
- **Description:** Allows a studio admin to create a new lesson by providing details such as title, instructor name, start time, duration, and capacity.

## 9. Admin Update Lesson

- **API Method:** `PUT /admin/lessons/{lesson_id}`
- **Description:** Allows a studio admin to update the details of an existing lesson.

## 10. Admin Delete Lesson

- **API Method:** `DELETE /admin/lessons/{lesson_id}`
- **Description:** Allows a studio admin to delete a lesson from the system.
