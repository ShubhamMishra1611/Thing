#!/usr/bin/env python
"""Static contract tests for the Engineer's Codex portfolio landing."""

from __future__ import annotations

import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "quanta-log"
INDEX = SITE / "index.html"
CSS = SITE / "assets" / "portfolio.css"
JS = SITE / "assets" / "portfolio.js"
SECTIONS = ("work", "research", "writing", "profile")


class LandingParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: set[str] = set()
        self.links: list[dict[str, str]] = []
        self.buttons: list[dict[str, str]] = []
        self.scripts: list[dict[str, str]] = []
        self.dialogs: list[dict[str, str]] = []
        self.statuses: list[dict[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key: value or "" for key, value in attrs}
        if values.get("id"):
            self.ids.add(values["id"])
        if tag == "a":
            self.links.append(values)
        elif tag == "button":
            self.buttons.append(values)
        elif tag == "script":
            self.scripts.append(values)
        if values.get("role") == "dialog":
            self.dialogs.append(values)
        if values.get("role") == "status" or values.get("aria-live"):
            self.statuses.append(values)


class EngineersCodexLandingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.html = INDEX.read_text(encoding="utf-8")
        cls.parser = LandingParser()
        cls.parser.feed(cls.html)
        cls.css = CSS.read_text(encoding="utf-8") if CSS.exists() else ""
        cls.js = JS.read_text(encoding="utf-8") if JS.exists() else ""

    def test_centralized_landing_assets_exist_and_are_loaded(self) -> None:
        self.assertTrue(CSS.is_file(), "missing assets/portfolio.css")
        self.assertTrue(JS.is_file(), "missing assets/portfolio.js")
        self.assertRegex(self.html, r'href=["\']assets/portfolio\.css["\']')
        self.assertRegex(self.html, r'src=["\']assets/portfolio\.js["\']')

    def test_approved_codex_landing_language_is_present(self) -> None:
        required = (
            "Building<br>machines<br>that reason.",
            "What I cannot create, I do not understand.",
            "Richard Feynman",
            ">MEMORY<",
            ">REASON<",
            ">MACHINE<",
        )
        for text in required:
            self.assertIn(text, self.html)

        prototype_only = (
            "Moss Registry",
            "Index rerum",
            "Selected mechanisms",
            "Investigations",
            "Commonplace book",
            "About the maker",
            "MEMORIA",
            "RATIO",
            "MACHINA",
            "Intersections of memory, mechanism, and judgement.",
        )
        for text in prototype_only:
            self.assertNotIn(text, self.html)

        for label in ("Work", "Research", "Writing", "Profile"):
            section = label.lower()
            self.assertRegex(
                self.html,
                rf'(?is)<button\b(?=[^>]*\bclass=["\']registry-entry["\'])(?=[^>]*\bdata-section=["\']{section}["\'])[^>]*>'
                rf'(?:(?!</button>).)*?<span\b[^>]*class=["\']entry-name["\'][^>]*>{label}</span>'
                rf'(?:(?!</button>).)*?</button>',
            )

    def test_side_concept_labels_clear_the_mobile_description(self) -> None:
        for label in ("REASON", "MACHINE"):
            match = re.search(rf'<text\b[^>]*\by=["\'](\d+)["\'][^>]*>{label}</text>', self.html)
            self.assertIsNotNone(match, f"missing {label} diagram label")
            self.assertGreaterEqual(int(match.group(1)), 400)

    def test_four_registry_triggers_and_sections_exist(self) -> None:
        for section in SECTIONS:
            self.assertIn(f"section-{section}", self.parser.ids)
            triggers = [b for b in self.parser.buttons if b.get("data-section") == section]
            self.assertGreaterEqual(len(triggers), 1, f"missing {section} trigger")
            self.assertIn(f"#{section}", self.html)

    def test_accessible_dialog_and_controls_exist(self) -> None:
        self.assertEqual(len(self.parser.dialogs), 1)
        dialog = self.parser.dialogs[0]
        self.assertEqual(dialog.get("aria-modal"), "true")
        self.assertTrue(dialog.get("aria-labelledby"))
        self.assertIn("hidden", dialog)
        self.assertTrue(any(b.get("data-close-drawer") == "" for b in self.parser.buttons))
        self.assertTrue(any(b.get("data-copy-profile") == "" for b in self.parser.buttons))
        self.assertTrue(self.parser.statuses, "copy action needs an accessible status region")

    def test_copy_profile_action_is_visible_on_landing(self) -> None:
        landing = re.search(r'(?is)<main\b[^>]*class=["\']landing["\'][^>]*>(.*?)</main>', self.html)
        self.assertIsNotNone(landing, "landing main region is missing")
        self.assertIn("data-copy-profile", landing.group(1))
        self.assertIn('id="copy-status"', landing.group(1))

    def test_interaction_and_history_hooks_exist(self) -> None:
        for hook in (
            "pushState",
            "popstate",
            "keydown",
            "Escape",
            "Tab",
            "navigator.clipboard",
            "execCommand",
            "data-copy-profile",
        ):
            self.assertIn(hook, self.js)
        self.assertRegex(self.css, r"body\.drawer-open[^}]*overflow\s*:\s*hidden")
        self.assertIn(":focus-visible", self.css)
        self.assertIn("prefers-reduced-motion", self.css)
        self.assertRegex(self.css, r"min-height\s*:\s*44px")
        self.assertIn('button[data-section="${section}"]', self.js)
        self.assertIn("window.history.replaceState", self.js)
        self.assertRegex(
            self.js,
            r"state\.portfolioDirect\s*\?\s*landingTrigger\(closingSection\)",
        )
        self.assertNotIn("moss", self.js.lower())
        self.assertIn('action.querySelector(".copy-fallback")', self.js)

    def test_required_palette_is_centralized(self) -> None:
        for color in ("#e6ddc2", "#252a24", "#8d3728", "#eee5ca"):
            self.assertIn(color, self.css.lower())

    def test_small_accent_text_and_active_tabs_meet_wcag_contrast(self) -> None:
        def luminance(color: str) -> float:
            channels = [int(color[index:index + 2], 16) / 255 for index in (1, 3, 5)]
            adjusted = [
                value / 12.92 if value <= 0.04045 else ((value + 0.055) / 1.055) ** 2.4
                for value in channels
            ]
            return 0.2126 * adjusted[0] + 0.7152 * adjusted[1] + 0.0722 * adjusted[2]

        def contrast(first: str, second: str) -> float:
            bright, dark = sorted((luminance(first), luminance(second)), reverse=True)
            return (bright + 0.05) / (dark + 0.05)

        accent_match = re.search(r"--accent:\s*(#[0-9a-f]{6})", self.css, re.I)
        self.assertIsNotNone(accent_match, "small accent text needs a contrast-safe token")
        accent = accent_match.group(1)
        self.assertGreaterEqual(contrast(accent, "#e6ddc2"), 4.5)
        self.assertGreaterEqual(contrast("#eee5ca", accent), 4.5)

    def test_required_content_is_present(self) -> None:
        required = (
            "Agentic GIS",
            "MLnode",
            "Game Lag Detector",
            "PRISM",
            "CanSat",
            "Cross-Modal Image Learning for HER2 Status Detection",
            "ISBI 2026",
            "LLMGuard",
            "AAAI 2024",
            "ML world",
            "Personal",
            "Audria",
            "IIT Jodhpur",
            "Currently working",
            "Currently reading",
            "Currently watching",
            "Copy AI-readable profile",
        )
        for text in required:
            self.assertIn(text, self.html)

    def test_goatcounter_endpoint_and_loader_are_preserved(self) -> None:
        analytics = [s for s in self.parser.scripts if s.get("data-goatcounter")]
        self.assertEqual(len(analytics), 1)
        self.assertEqual(
            analytics[0]["data-goatcounter"],
            "https://shubhammihsra.goatcounter.com/count",
        )
        self.assertEqual(analytics[0].get("src"), "//gc.zgo.at/count.js")

    def test_internal_links_resolve_to_existing_files(self) -> None:
        missing: list[str] = []
        for link in self.parser.links:
            href = link.get("href", "")
            parsed = urlsplit(href)
            if not href or parsed.scheme or href.startswith(("//", "#", "mailto:")):
                continue
            path = unquote(parsed.path)
            target = SITE / path.lstrip("/") if path.startswith("/") else INDEX.parent / path
            if path.endswith("/"):
                target /= "index.html"
            if not target.exists():
                missing.append(href)
        self.assertEqual(missing, [], f"missing internal links: {missing}")

    def test_external_new_tab_links_are_safe(self) -> None:
        unsafe = []
        for link in self.parser.links:
            href = link.get("href", "")
            if urlsplit(href).scheme in {"http", "https"}:
                rel = set(link.get("rel", "").split())
                if link.get("target") != "_blank" or "noopener" not in rel:
                    unsafe.append(href)
        self.assertEqual(unsafe, [], f"unsafe external links: {unsafe}")

    def test_removed_landing_features_do_not_return(self) -> None:
        forbidden = (
            "<canvas",
            "equations.js",
            "katex",
            "Equation of the day",
            "Game of Life",
            "LLM mode",
            "llm-view",
        )
        lowered = self.html.lower()
        for token in forbidden:
            self.assertNotIn(token.lower(), lowered)

    def test_document_has_basic_valid_structure_and_unique_ids(self) -> None:
        self.assertRegex(self.html, r"(?is)^\s*<!doctype html>")
        self.assertEqual(len(re.findall(r"(?i)<html\b", self.html)), 1)
        self.assertEqual(len(re.findall(r"(?i)</html\s*>", self.html)), 1)
        ids = re.findall(r'\bid=["\']([^"\']+)["\']', self.html)
        self.assertEqual(len(ids), len(set(ids)), "duplicate HTML ids")


if __name__ == "__main__":
    unittest.main(verbosity=2)
