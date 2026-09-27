import sys
import os
import time
from playwright.sync_api import sync_playwright

DEVICE_MATRIX = [
    # --- 1. iPhone (5 款) ---
    {
        "id": "iphone_16_pro_max",
        "name": "iPhone 16 Pro Max",
        "category": "iPhone",
        "width": 440,
        "height": 956,
        "dpr": 3,
        "is_mobile": True,
        "has_touch": True,
    },
    {
        "id": "iphone_16_pro",
        "name": "iPhone 16 Pro",
        "category": "iPhone",
        "width": 402,
        "height": 874,
        "dpr": 3,
        "is_mobile": True,
        "has_touch": True,
    },
    {
        "id": "iphone_16_standard",
        "name": "iPhone 16 / 15",
        "category": "iPhone",
        "width": 393,
        "height": 852,
        "dpr": 3,
        "is_mobile": True,
        "has_touch": True,
    },
    {
        "id": "iphone_14_plus",
        "name": "iPhone 14 Plus / 13 Pro Max",
        "category": "iPhone",
        "width": 428,
        "height": 926,
        "dpr": 3,
        "is_mobile": True,
        "has_touch": True,
    },
    {
        "id": "iphone_se_3rd",
        "name": "iPhone SE (3rd) / 13 mini",
        "category": "iPhone",
        "width": 375,
        "height": 667,
        "dpr": 2,
        "is_mobile": True,
        "has_touch": True,
    },

    # --- 2. Android Phone (5 款) ---
    {
        "id": "galaxy_s24_ultra",
        "name": "Samsung Galaxy S24 Ultra",
        "category": "Android Phone",
        "width": 412,
        "height": 915,
        "dpr": 3.5,
        "is_mobile": True,
        "has_touch": True,
    },
    {
        "id": "pixel_9_pro",
        "name": "Google Pixel 9 Pro",
        "category": "Android Phone",
        "width": 412,
        "height": 892,
        "dpr": 3.5,
        "is_mobile": True,
        "has_touch": True,
    },
    {
        "id": "xiaomi_15",
        "name": "Xiaomi 15 / 14",
        "category": "Android Phone",
        "width": 393,
        "height": 873,
        "dpr": 3,
        "is_mobile": True,
        "has_touch": True,
    },
    {
        "id": "galaxy_z_fold_6_outer",
        "name": "Samsung Galaxy Z Fold 6 (外屏超窄)",
        "category": "Android Phone",
        "width": 344,
        "height": 882,
        "dpr": 2.6,
        "is_mobile": True,
        "has_touch": True,
    },
    {
        "id": "galaxy_z_fold_6_inner",
        "name": "Samsung Galaxy Z Fold 6 (内屏方屏展开)",
        "category": "Android Phone",
        "width": 768,
        "height": 960,
        "dpr": 2.6,
        "is_mobile": True,
        "has_touch": True,
    },

    # --- 3. Apple iPad (3 款) ---
    {
        "id": "ipad_pro_13",
        "name": "iPad Pro 13\" (M4)",
        "category": "Apple iPad",
        "width": 1024,
        "height": 1366,
        "dpr": 2,
        "is_mobile": True,
        "has_touch": True,
    },
    {
        "id": "ipad_pro_11",
        "name": "iPad Pro 11\" / iPad Air",
        "category": "Apple iPad",
        "width": 834,
        "height": 1194,
        "dpr": 2,
        "is_mobile": True,
        "has_touch": True,
    },
    {
        "id": "ipad_mini_7",
        "name": "iPad mini 7 / 6",
        "category": "Apple iPad",
        "width": 744,
        "height": 1133,
        "dpr": 2,
        "is_mobile": True,
        "has_touch": True,
    },

    # --- 4. Android Pad (3 款) ---
    {
        "id": "galaxy_tab_s10_ultra",
        "name": "Samsung Galaxy Tab S10 Ultra",
        "category": "Android Pad",
        "width": 1107,
        "height": 1770,
        "dpr": 2.25,
        "is_mobile": True,
        "has_touch": True,
    },
    {
        "id": "xiaomi_pad_7_pro",
        "name": "Xiaomi Pad 7 / 6 Pro",
        "category": "Android Pad",
        "width": 864,
        "height": 1382,
        "dpr": 2,
        "is_mobile": True,
        "has_touch": True,
    },
    {
        "id": "pixel_tablet",
        "name": "Google Pixel Tablet / Lenovo Tab",
        "category": "Android Pad",
        "width": 800,
        "height": 1280,
        "dpr": 2,
        "is_mobile": True,
        "has_touch": True,
    },

    # --- 5. MacBook (3 款) ---
    {
        "id": "macbook_air_13",
        "name": "MacBook Air 13\"",
        "category": "MacBook",
        "width": 1440,
        "height": 900,
        "dpr": 2,
        "is_mobile": False,
        "has_touch": False,
    },
    {
        "id": "macbook_pro_14",
        "name": "MacBook Pro 14\"",
        "category": "MacBook",
        "width": 1512,
        "height": 982,
        "dpr": 2,
        "is_mobile": False,
        "has_touch": False,
    },
    {
        "id": "macbook_pro_16",
        "name": "MacBook Pro 16\"",
        "category": "MacBook",
        "width": 1728,
        "height": 1117,
        "dpr": 2,
        "is_mobile": False,
        "has_touch": False,
    },

    # --- 6. Windows Laptop (3 款) ---
    {
        "id": "win_laptop_1080p_125",
        "name": "经典 1080p @ 125% 轻薄本",
        "category": "Windows Laptop",
        "width": 1536,
        "height": 864,
        "dpr": 1.25,
        "is_mobile": False,
        "has_touch": False,
    },
    {
        "id": "win_laptop_1080p_100",
        "name": "标准 1080p @ 100% 标准本",
        "category": "Windows Laptop",
        "width": 1920,
        "height": 1080,
        "dpr": 1,
        "is_mobile": False,
        "has_touch": False,
    },
    {
        "id": "win_laptop_compact_768",
        "name": "紧凑型 / 低分辨率基线 (1366x768)",
        "category": "Windows Laptop",
        "width": 1366,
        "height": 768,
        "dpr": 1,
        "is_mobile": False,
        "has_touch": False,
    },
]

BASE_URL = "http://127.0.0.1:3001"
COOKIE_VALUE = "2b11c782a345e661.ggrThIM6GPu9lFGNtc91KGJHJttoj2LGp8bIRuNTNmU"
ARTIFACT_DIR = "/Users/luojin/.gemini/antigravity-cli/brain/0d231da9-b48f-4c6f-907a-2c0f782595ee"

def run_tests():
    print(f"Starting E2E Multi-Device Tests across {len(DEVICE_MATRIX)} devices...")
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for idx, dev in enumerate(DEVICE_MATRIX, 1):
            dev_id = dev["id"]
            name = dev["name"]
            width = dev["width"]
            height = dev["height"]
            dpr = dev["dpr"]
            category = dev["category"]
            print(f"[{idx}/{len(DEVICE_MATRIX)}] Testing {name} ({width}x{height} @{dpr}x)...")

            context = browser.new_context(
                viewport={"width": width, "height": height},
                device_scale_factor=dpr,
                is_mobile=dev["is_mobile"],
                has_touch=dev["has_touch"],
            )
            # Add owner session cookie
            context.add_cookies([{
                "name": "pelican_owner",
                "value": COOKIE_VALUE,
                "domain": "127.0.0.1",
                "path": "/",
                "httpOnly": True,
                "sameSite": "Strict",
            }])

            page = context.new_page()

            test_errors = []

            # 1. Test Home page
            try:
                page.goto(BASE_URL, wait_until="domcontentloaded", timeout=15000)
                page.wait_for_selector(".toolbar", timeout=5000)
                time.sleep(0.4)

                # Check horizontal page overflow
                overflow_info = page.evaluate("""() => {
                    return {
                        scrollWidth: document.documentElement.scrollWidth,
                        clientWidth: document.documentElement.clientWidth,
                        bodyScrollWidth: document.body.scrollWidth,
                        bodyClientWidth: document.body.clientWidth
                    };
                }""")
                if overflow_info["scrollWidth"] > overflow_info["clientWidth"] + 2:
                    test_errors.append(f"Horizontal page overflow: scrollWidth {overflow_info['scrollWidth']} > clientWidth {overflow_info['clientWidth']}")

                # Verify toolbar brand and menus are visible
                brand_vis = page.is_visible(".brand")
                if not brand_vis:
                    test_errors.append("Toolbar brand is not visible")

                # Verify '▶ 跑一次' button is clickable
                run_btn = page.locator(".run-once-label")
                if not run_btn.is_visible():
                    test_errors.append("RunOnce button not visible")
                else:
                    # Click Run Once
                    run_btn.click(timeout=5000)
                    page.wait_for_selector(".run-once-panel", timeout=5000)
                    time.sleep(0.3)

                    # Verify modal fits in viewport
                    panel_bounds = page.locator(".run-once-panel").bounding_box()
                    if panel_bounds:
                        if panel_bounds["x"] < -2 or (panel_bounds["x"] + panel_bounds["width"]) > width + 2:
                            test_errors.append(f"RunOnce panel overflows viewport horizontally: bounds={panel_bounds}, viewport={width}x{height}")
                    else:
                        test_errors.append("RunOnce panel bounding box null")

                    # If mobile, test tab switching
                    if width <= 640:
                        prompts_tab = page.locator(".run-once-head-cell").nth(1)
                        if prompts_tab.is_visible():
                            prompts_tab.click()
                            time.sleep(0.2)
                            models_tab = page.locator(".run-once-head-cell").nth(0)
                            models_tab.click()
                            time.sleep(0.2)

                    # Capture RunOnce modal screenshot for key representative devices
                    if dev_id in ["iphone_16_standard", "galaxy_z_fold_6_outer", "ipad_pro_11", "macbook_pro_14", "win_laptop_1080p_125"]:
                        page.screenshot(path=os.path.join(ARTIFACT_DIR, f"e2e_{dev_id}_run_once.png"))

                    # Close modal
                    if page.locator(".run-once-close").is_visible():
                        page.locator(".run-once-close").click()
                    else:
                        page.keyboard.press("Escape")
                    time.sleep(0.3)

                # Capture Home screenshot for representative devices
                if dev_id in ["iphone_16_standard", "galaxy_z_fold_6_outer", "ipad_pro_11", "macbook_pro_14", "win_laptop_1080p_125", "galaxy_s24_ultra"]:
                    page.screenshot(path=os.path.join(ARTIFACT_DIR, f"e2e_{dev_id}_home.png"))

                # 2. Test /config page
                page.goto(f"{BASE_URL}/config", wait_until="domcontentloaded", timeout=10000)
                page.wait_for_selector(".config", timeout=5000)
                time.sleep(0.4)

                config_overflow = page.evaluate("""() => {
                    return {
                        scrollWidth: document.documentElement.scrollWidth,
                        clientWidth: document.documentElement.clientWidth
                    };
                }""")
                if config_overflow["scrollWidth"] > config_overflow["clientWidth"] + 2:
                    test_errors.append(f"Config page horizontal overflow: scrollWidth {config_overflow['scrollWidth']} > clientWidth {config_overflow['clientWidth']}")

                # Check schedule runtime card is visible
                sched_card = page.locator(".schedule-runtime-card")
                if not sched_card.is_visible():
                    test_errors.append("Schedule runtime card not visible on /config")

                # Check timeout form with effort tiers
                timeout_card = page.locator(".timeout-tier-card").first
                if not timeout_card.is_visible():
                    test_errors.append("Timeout tier card not visible on /config")

                # Capture config screenshot for representative devices
                if dev_id in ["iphone_16_standard", "galaxy_z_fold_6_outer", "macbook_pro_14"]:
                    page.screenshot(path=os.path.join(ARTIFACT_DIR, f"e2e_{dev_id}_config.png"))

                # 3. Return to Home and test modal dialog if folder exists
                page.goto(BASE_URL, wait_until="domcontentloaded", timeout=10000)
                page.wait_for_selector(".toolbar", timeout=5000)
                time.sleep(0.3)
                folders = page.locator(".folder")
                if folders.count() > 0:
                    folders.first.click()
                    page.wait_for_selector(".modal", timeout=5000)
                    time.sleep(0.3)
                    modal_bounds = page.locator(".modal").bounding_box()
                    if modal_bounds:
                        if modal_bounds["x"] < -2 or (modal_bounds["x"] + modal_bounds["width"]) > width + 2:
                            test_errors.append(f"Card modal overflows viewport: bounds={modal_bounds}")
                    if dev_id in ["iphone_16_standard", "macbook_pro_14"]:
                        page.screenshot(path=os.path.join(ARTIFACT_DIR, f"e2e_{dev_id}_modal.png"))
                    close_btn = page.locator(".modal-close")
                    if close_btn.is_visible():
                        close_btn.click()
                        time.sleep(0.2)

            except Exception as e:
                test_errors.append(f"Exception during test: {str(e)}")

            passed = len(test_errors) == 0
            status_symbol = "PASS" if passed else "FAIL"
            print(f"  [{status_symbol}] {name}: {'All checks passed' if passed else '; '.join(test_errors)}")

            results.append({
                "dev": dev,
                "passed": passed,
                "errors": test_errors,
            })
            context.close()

        browser.close()

    total = len(results)
    passed_count = sum(1 for r in results if r["passed"])
    print(f"\n==============================")
    print(f"RESULTS: {passed_count}/{total} devices passed.")
    print(f"==============================")

    if passed_count < total:
        print("\nFailures:")
        for r in results:
            if not r["passed"]:
                print(f"- {r['dev']['name']}: {r['errors']}")
        sys.exit(1)
    else:
        print("\nAll 22 devices passed responsive E2E tests flawlessly!")
        sys.exit(0)

if __name__ == "__main__":
    run_tests()
