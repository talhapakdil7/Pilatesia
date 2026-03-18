from pydantic import BaseModel


class UserRegister(BaseModel):
    studio_code: str
    full_name: str
    email: str
    password: str


class StudioRegister(BaseModel):
    studio_name: str
    studio_code: str
    admin_name: str
    admin_email: str
    admin_password: str
