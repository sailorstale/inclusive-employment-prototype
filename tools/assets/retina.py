"""
КАРТИНКИ В ДВОЙНОМ РАЗМЕРЕ (@2x).

Разработчик забирает файлы к себе и ставит их в конструктор. Значит файл должен
быть ровно вдвое больше своего места на экране: на обычном мониторе он ужмётся
без потерь, на retina покажется чётко. Больше — лишний вес, меньше — мыло.

Размеры на экране (из макета):
  логотип организации   80 × 40  → файл 160 × 80
  аватар автора цитаты  40 × 40  → файл  80 × 80
  портрет человека      82 × 82  → файл 164 × 164

Логотипы лежат прозрачными PNG — прозрачность сохраняем. Аватары и портреты
JPEG, там же и кадрирование по квадрату уже сделано раньше.

Прежние файлы никуда не деваются: они в истории репозитория, вернуть можно
командой git checkout.

    python3 tools/assets/retina.py --dry     # показать, что изменится
    python3 tools/assets/retina.py           # пересобрать
"""

import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]

# Папка → размер файла (ширина, высота). Это УЖЕ удвоенный размер.
TARGETS = {
    ROOT / "public/figma/logos": (160, 80),
    ROOT / "public/figma/avatars": (80, 80),
}

# Портреты людей крупнее аватаров: они стоят в теле страницы, а не в цитате.
PERSONS = {"gulnara-gorishnyaya", "yuliya-ermilova", "yuliya-frolova"}
PERSON_SIZE = (164, 164)

dry = "--dry" in sys.argv


def fit(img: Image.Image, box: tuple[int, int]) -> Image.Image:
    """
    Вписать в коробку, сохранив пропорции, и отцентровать на прозрачном фоне.

    Логотипы разной формы: широкие, узкие, квадратные. Растянуть их до 160 × 80
    нельзя — исказятся. Поэтому вписываем и центруем; лишнее место остаётся
    прозрачным, и на странице логотип выглядит так же, как в макете.
    """
    src = img.convert("RGBA")
    src.thumbnail(box, Image.LANCZOS)
    out = Image.new("RGBA", box, (0, 0, 0, 0))
    out.paste(src, ((box[0] - src.width) // 2, (box[1] - src.height) // 2), src)
    return out


def square(img: Image.Image, box: tuple[int, int]) -> Image.Image:
    """Фото уже кадрировано квадратом — просто ужимаем до нужного размера."""
    return img.convert("RGB").resize(box, Image.LANCZOS)


changed = 0
for folder, box in TARGETS.items():
    for path in sorted(folder.iterdir()):
        if path.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
            continue
        target = PERSON_SIZE if path.stem in PERSONS else box
        with Image.open(path) as img:
            if img.size == target:
                continue
            print(f"{path.relative_to(ROOT)}: {img.size[0]}×{img.size[1]} → {target[0]}×{target[1]}")
            if dry:
                changed += 1
                continue
            if path.suffix.lower() == ".png":
                fit(img, target).save(path, "PNG", optimize=True)
            else:
                square(img, target).save(path, "JPEG", quality=90, optimize=True)
        changed += 1

print(f"\n{'Изменилось бы' if dry else 'Пересобрано'} файлов: {changed}")
