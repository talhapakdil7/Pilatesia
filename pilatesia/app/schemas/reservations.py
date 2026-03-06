from pydantic import BaseModel

class ReservationCreate(BaseModel):
    lesson_id: int