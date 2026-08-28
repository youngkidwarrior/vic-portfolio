"""Build the public one-page resume from the shared JSON content."""

from __future__ import annotations

import html
import json
from pathlib import Path
from typing import Any

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content" / "resume.json"
OUTPUT = ROOT / "public" / "victor-ginelli-resume.pdf"

PAPER = colors.HexColor("#F1EADB")
INK = colors.HexColor("#11110F")
MUTED = colors.HexColor("#51483C")
BLUE = colors.HexColor("#0057A8")
RED = colors.HexColor("#D12732")
LINE = colors.HexColor("#B8A991")


def require_string(value: Any, field: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field} must be a non-empty string")
    return value.strip()


def load_content() -> dict[str, Any]:
    data = json.loads(SOURCE.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("resume content must be a JSON object")

    for field in ("name", "title", "location", "email", "website", "profile"):
        data[field] = require_string(data.get(field), field)

    experience = data.get("experience")
    if not isinstance(experience, list) or not experience:
        raise ValueError("experience must be a non-empty list")
    for index, role in enumerate(experience):
        if not isinstance(role, dict):
            raise ValueError(f"experience[{index}] must be an object")
        for field in ("company", "role", "period"):
            role[field] = require_string(role.get(field), f"experience[{index}].{field}")
        bullets = role.get("bullets")
        if not isinstance(bullets, list) or not bullets:
            raise ValueError(f"experience[{index}].bullets must be a non-empty list")
        role["bullets"] = [
            require_string(bullet, f"experience[{index}].bullets") for bullet in bullets
        ]

    skills = data.get("skills")
    if not isinstance(skills, list) or not skills:
        raise ValueError("skills must be a non-empty list")
    for index, skill in enumerate(skills):
        if not isinstance(skill, dict):
            raise ValueError(f"skills[{index}] must be an object")
        skill["label"] = require_string(skill.get("label"), f"skills[{index}].label")
        skill["items"] = require_string(skill.get("items"), f"skills[{index}].items")

    for section in ("recognition", "education"):
        value = data.get(section)
        if not isinstance(value, dict):
            raise ValueError(f"{section} must be an object")

    return data


def escaped(value: str) -> str:
    return html.escape(value, quote=True)


def page_background(canvas: Any, document: Any) -> None:
    canvas.saveState()
    width, height = letter
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, width, height, stroke=0, fill=1)
    canvas.setFillColor(RED)
    canvas.rect(0, height - 0.18 * inch, width * 0.38, 0.18 * inch, stroke=0, fill=1)
    canvas.setFillColor(BLUE)
    canvas.rect(width * 0.38, height - 0.18 * inch, width * 0.62, 0.18 * inch, stroke=0, fill=1)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 6.5)
    canvas.drawRightString(width - document.rightMargin, 0.32 * inch, "victor.she.energy")
    canvas.restoreState()


def build_resume(data: dict[str, Any]) -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        leftMargin=0.52 * inch,
        rightMargin=0.52 * inch,
        topMargin=0.42 * inch,
        bottomMargin=0.48 * inch,
        title=f"{data['name']} Resume",
        author=data["name"],
        subject=data["profile"],
        invariant=1,
    )

    sample = getSampleStyleSheet()
    name_style = ParagraphStyle(
        "Name", parent=sample["Normal"], fontName="Helvetica-Bold", fontSize=31,
        leading=32, textColor=INK, spaceAfter=3,
    )
    title_style = ParagraphStyle(
        "Title", parent=sample["Normal"], fontName="Helvetica", fontSize=11,
        leading=13, textColor=BLUE,
    )
    contact_style = ParagraphStyle(
        "Contact", parent=sample["Normal"], fontName="Helvetica", fontSize=8.2,
        leading=10.2, textColor=MUTED, alignment=TA_RIGHT,
    )
    section_style = ParagraphStyle(
        "Section", parent=sample["Normal"], fontName="Helvetica-Bold", fontSize=8.4,
        leading=10, textColor=RED, spaceBefore=7, spaceAfter=5,
    )
    profile_style = ParagraphStyle(
        "Profile", parent=sample["Normal"], fontName="Helvetica", fontSize=9.5,
        leading=12.5, textColor=INK, spaceAfter=4,
    )
    company_style = ParagraphStyle(
        "Company", parent=sample["Normal"], fontName="Helvetica-Bold", fontSize=10,
        leading=11.5, textColor=INK,
    )
    role_style = ParagraphStyle(
        "Role", parent=sample["Normal"], fontName="Helvetica", fontSize=8,
        leading=9.5, textColor=BLUE,
    )
    period_style = ParagraphStyle(
        "Period", parent=sample["Normal"], fontName="Helvetica-Bold", fontSize=7.9,
        leading=9.5, textColor=MUTED, alignment=TA_RIGHT,
    )
    bullet_style = ParagraphStyle(
        "Bullet", parent=sample["Normal"], fontName="Helvetica", fontSize=8.05,
        leading=10.2, textColor=MUTED, leftIndent=8, firstLineIndent=-5,
        bulletIndent=0, spaceAfter=2.2,
    )
    small_style = ParagraphStyle(
        "Small", parent=sample["Normal"], fontName="Helvetica", fontSize=7.75,
        leading=9.8, textColor=MUTED,
    )

    contact = (
        f"{escaped(data['location'])}<br/>"
        f"<link href=\"mailto:{escaped(data['email'])}\" color=\"#0057A8\">{escaped(data['email'])}</link><br/>"
        f"<link href=\"https://{escaped(data['website'])}\" color=\"#0057A8\">{escaped(data['website'])}</link>"
    )
    header = Table(
        [[Paragraph(escaped(data["name"]), name_style), Paragraph(contact, contact_style)],
         [Paragraph(escaped(data["title"]), title_style), ""]],
        colWidths=[4.7 * inch, 2.26 * inch],
    )
    header.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("SPAN", (1, 0), (1, 1)),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))

    story: list[Any] = [header, Spacer(1, 7), Paragraph("PROFILE", section_style),
                        Paragraph(escaped(data["profile"]), profile_style),
                        Paragraph("EXPERIENCE", section_style)]

    for experience in data["experience"]:
        heading = Table(
            [[Paragraph(escaped(experience["company"]), company_style),
              Paragraph(escaped(experience["period"]), period_style)],
             [Paragraph(escaped(experience["role"]), role_style), ""]],
            colWidths=[5.6 * inch, 1.36 * inch],
        )
        heading.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("SPAN", (1, 0), (1, 1)),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]))
        block: list[Any] = [heading, Spacer(1, 2)]
        block.extend(
            Paragraph(f"- {escaped(bullet)}", bullet_style) for bullet in experience["bullets"]
        )
        block.append(Spacer(1, 5))
        story.append(KeepTogether(block))

    skills = "<br/>".join(
        f"<b>{escaped(skill['label'])}</b> - {escaped(skill['items'])}" for skill in data["skills"]
    )
    recognition = data["recognition"]
    education = data["education"]
    right_column = (
        f"<b>{escaped(recognition['title'])}</b><br/>{escaped(recognition['detail'])}"
        f"<br/><br/><b>{escaped(education['school'])}</b><br/>{escaped(education['detail'])}"
    )
    lower = Table(
        [[Paragraph("TECHNICAL RANGE", section_style), Paragraph("RECOGNITION & EDUCATION", section_style)],
         [Paragraph(skills, small_style), Paragraph(right_column, small_style)]],
        colWidths=[4.36 * inch, 2.6 * inch],
    )
    lower.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LINEABOVE", (0, 0), (-1, 0), 0.6, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (0, -1), 12),
        ("LEFTPADDING", (1, 0), (1, -1), 12),
        ("RIGHTPADDING", (1, 0), (1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(lower)

    document.build(story, onFirstPage=page_background, onLaterPages=page_background)
    page_count = len(PdfReader(str(OUTPUT)).pages)
    if page_count != 1:
        OUTPUT.unlink(missing_ok=True)
        raise RuntimeError(f"resume must render as one page, rendered {page_count}")


def main() -> None:
    build_resume(load_content())
    print(OUTPUT)


if __name__ == "__main__":
    main()
