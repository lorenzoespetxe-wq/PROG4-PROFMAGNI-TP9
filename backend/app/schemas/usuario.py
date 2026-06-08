from pydantic import BaseModel, ConfigDict


class LoginData(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UsuarioResponse(BaseModel):
    id: int
    username: str
    rol: str

    model_config = ConfigDict(from_attributes=True)
