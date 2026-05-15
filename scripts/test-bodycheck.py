from playwright.sync_api import sync_playwright

URL = 'http://localhost:5173/#/check'

def panel_text(page):
    return page.locator('.result-panel').inner_text()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    errors = []
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errors.append(str(e)))

    page.goto(URL)
    page.wait_for_load_state('networkidle')

    groups = page.locator('.symptom-group-title').all_inner_texts()
    print('症狀分組:', groups)
    boxes = page.locator('.symptom-checkbox').count()
    print('症狀總數:', boxes)

    page.screenshot(path='/tmp/bc-initial.png', full_page=True)

    def select(*symptoms):
        page.locator('button:has-text("清除全部")').first.click() if page.locator('button:has-text("清除全部")').count() else None
        for s in symptoms:
            page.locator(f'label:has-text("{s}")').first.click()
        page.wait_for_timeout(150)

    tests = [
        (['意識不清'], '立即急診'),
        (['胸痛', '呼吸困難'], '立即急診'),
        (['高燒不退', '皮疹', '關節痛', '肌肉痠痛'], '今日就醫'),
        (['流鼻水', '鼻塞', '喉嚨痛'], '居家觀察'),
        (['頭暈'], '進一步評估'),  # 單一未命中規則 -> defaultResult
    ]

    for symptoms, expect in tests:
        select(*symptoms)
        txt = panel_text(page)
        ok = expect in txt
        print(f'{"PASS" if ok else "FAIL"}  選 {symptoms}  期待含「{expect}」')
        if not ok:
            print('  實際面板:', txt.replace(chr(10), ' | '))

    select('意識不清', '抽搐')
    page.screenshot(path='/tmp/bc-result.png', full_page=True)

    print('Console/page errors:', errors if errors else 'none')
    browser.close()
