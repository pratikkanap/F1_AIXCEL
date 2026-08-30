from fastapi import APIRouter
from app.services.wiki_image_client import get_person_image, get_page_image, get_person_extract

router = APIRouter(prefix="/media", tags=["media"])


@router.get("/person-image")
def read_person_image(name: str):
    image_url = get_person_image(name)
    return {"name": name, "image_url": image_url}


@router.get("/page-image")
def read_page_image(title: str):
    image_url = get_page_image(title)
    return {"title": title, "image_url": image_url}


@router.get("/person-bio")
def read_person_bio(name: str):
    bio = get_person_extract(name)
    return {"name": name, "bio": bio}