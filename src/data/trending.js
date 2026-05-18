// 流行疾病動態資料
// ─────────────────────────────────────────────────────────────────
// 資料來源：attention_disparity_index.json（評估日 2026-05-16，Taiwan）
//   importance_score / category / alert_level / caseSummary / weeklyChange /
//   attentionReason / shortSummary 皆忠實取自該 JSON。
// 補充欄位（radar 數值、typicalSymptoms、transmissionRoutes、riskGroups、
//   riskRegions、action、householdAlert）依疾管署公開衛教資訊與該 JSON
//   的文字描述整理而成，供「衛教資訊」頁的流行疾病動態區塊使用。
// 僅收錄 importance_score 前 6 名。
// ─────────────────────────────────────────────────────────────────

// 雷達圖四軸（固定順序，與每筆 radar 陣列對應），數值 0–100。
export const RADAR_AXES = ['感染率', '傳播速度', '醫療載荷', '重症率']

// category 對應的中文標籤與配色
export const categoryMeta = {
  high_attention: { label: '高關注', color: '#dc2626', bg: '#fef2f2' },
  outbreak:       { label: '群聚警示', color: '#ea580c', bg: '#fff7ed' },
  epidemic:       { label: '流行期', color: '#d97706', bg: '#fffbeb' },
  monitoring:     { label: '監測中', color: '#0d9488', bg: '#f0fdfa' },
}

// alert_level 對應
export const alertMeta = {
  high:   { label: '高警戒', color: '#dc2626' },
  medium: { label: '中度警戒', color: '#ea580c' },
  low:    { label: '低度警戒', color: '#0d9488' },
}

export const trendingMeta = {
  asOfDate: '2026-05-16',
  region: '台灣',
  sources: '疾管署新聞稿與致醫界通函第 601–606 號、主流媒體輿情（2026 年 5 月）',
}

export const trendingDiseases = [
  {
    id: 'hanta-andes',
    name: '漢他病毒安地斯型',
    englishName: 'Hantavirus (Andes virus)',
    icon: '🐀',
    importanceScore: 88,
    category: 'high_attention',
    alertLevel: 'high',
    caseSummary: '安地斯型國內 0 例（境外郵輪群聚事件）；全國漢他病毒病今年累計 2 例本土確診、1 例死亡',
    weeklyChange: '本週無新增（最近發病日 3/14）',
    cdcLink: 'https://nidss.cdc.gov.tw/nndss/disease?id=HANTA',
    radar: [15, 35, 20, 92],
    typicalSymptoms: ['發燒', '頭痛', '肌肉痠痛', '腹痛', '咳嗽', '呼吸急促', '低血壓休克'],
    transmissionRoutes: ['吸入帶病毒鼠類排泄物形成的氣膠', '接觸鼠類分泌物或被鼠咬', '安地斯型為唯一具有限度人傳人能力的漢他病毒'],
    riskGroups: ['近期搭乘國際郵輪之旅客', '鼠類接觸者', '曾赴南美洲旅遊者', '免疫低下者'],
    riskRegions: ['國際郵輪', '南美洲（阿根廷、智利）', '齧齒動物孳生的密閉環境'],
    action: {
      visit: '若近期有郵輪旅遊史或鼠類接觸史並出現發燒、肌肉痠痛，請先撥打 1922 或就醫前主動告知旅遊史，由醫院感染科評估採檢，勿直接擠入一般門診。',
      mask: '照顧疑似個案時佩戴 N95 口罩；一般民眾於鼠患密閉環境清掃時戴口罩，並先以濕式作業降低揚塵。',
    },
    householdAlert: '同住者若曾同行郵輪或共同曝險，應一併進行自主健康管理至潛伏期結束；家中如有免疫低下者，疑似個案應分房並全程戴口罩。',
    attentionReason: 'MV Hondius 國際郵輪境外群聚 3 死、11+ 例，紐西蘭籍乘客 5/7 入境台灣（採檢陰性、加強型自主健康管理至 6/6）。具人傳人特性與高致死率，台灣歷年從未檢出此型，恐慌敘事強；甚至出現詐騙集團冒名「漢坦病毒防疫國家隊」需 CDC 澄清。',
    shortSummary: '境外輸入威脅 + 高致死率 + 人傳人潛能 + 媒體放大效應的典型案例；實際公衛風險目前為低，但社會關注度位居本週最高。',
  },
  {
    id: 'measles',
    name: '麻疹',
    englishName: 'Measles',
    icon: '🔴',
    importanceScore: 75,
    category: 'outbreak',
    alertLevel: 'high',
    caseSummary: '今年累計 7+ 例（含 2 例本土），已 4+ 起群聚',
    weeklyChange: '持續新增境外移入並衍生群聚',
    radar: [45, 95, 60, 35],
    typicalSymptoms: ['發燒', '咳嗽', '流鼻水', '結膜炎（紅眼）', '口腔柯氏斑點', '全身紅疹'],
    transmissionRoutes: ['空氣傳播（飛沫核可懸浮數小時）', '接觸病人鼻咽分泌物', '傳染力極高（R0 12–18）'],
    riskGroups: ['未滿 1 歲未接種疫苗的嬰兒', '未完成 MMR 疫苗接種者', '孕婦', '醫護人員', '機場與航空從業人員'],
    riskRegions: ['國際機場與航班', '醫療院所候診區', '已公布之確診者活動足跡地點'],
    action: {
      visit: '出現發燒合併紅疹，就醫前務必先致電院所或 1922，依指示走專用動線、避免進入一般候診區，以防院內傳播。',
      mask: '疑似個案及照顧者全程配戴外科口罩；麻疹屬空氣傳播，醫護需 N95 口罩並採負壓隔離。',
    },
    householdAlert: '確診者應與家中未接種疫苗的嬰幼兒、孕婦完全隔離；同住接觸者需匡列觀察，並由醫師評估是否補接種疫苗或施打免疫球蛋白。',
    attentionReason: '已發生 4+ 起群聚事件，累計匡列接觸者超過 2,000 人。全球麻疹疫情升溫（墨西哥 8,000+、美國 1,500+、日本創近 7 年同期最高），亞洲多國持續流行，境外輸入壓力大。',
    shortSummary: '符合 outbreak 定義：局部多起群聚 + 高傳染力 + 接觸者大量匡列；非全國流行但需密切防堵。',
  },
  {
    id: 'enterovirus',
    name: '腸病毒（含 D68 型）',
    englishName: 'Enterovirus (incl. D68)',
    icon: '👶',
    importanceScore: 72,
    category: 'epidemic',
    alertLevel: 'medium',
    caseSummary: '上週門急診 3,526 人次，累計 4 例重症',
    weeklyChange: '+16.5%（前週 3,027 人次）',
    radar: [70, 75, 65, 55],
    typicalSymptoms: ['發燒', '疱疹性咽峽炎（口腔潰瘍）', '手足口疹', '喉嚨痛', '食慾不振', 'D68 型可致肢體無力'],
    transmissionRoutes: ['糞口傳播', '飛沫傳播', '接觸口鼻分泌物或皮膚水泡液', '幼托機構內快速擴散'],
    riskGroups: ['5 歲以下幼兒（重症高危險群）', '新生兒', '幼兒園與托嬰中心孩童', '照顧幼兒的成人'],
    riskRegions: ['幼兒園、托嬰中心', '親子館與兒童遊戲區', '人口密集的居家環境'],
    action: {
      visit: '幼兒若出現重症前兆（持續嗜睡、手腳無力、肌躍型抽搐、持續嘔吐、呼吸急促），應立即送大醫院急診；一般症狀至兒科診所即可。',
      mask: '腸病毒主要靠糞口與接觸傳染，口罩效果有限；重點為勤洗手（肥皂濕洗），玩具與環境以含氯漂白水消毒。',
    },
    householdAlert: '家中一名幼兒確診，其他幼兒感染風險高：應分開作息與餐具、大人接觸後徹底洗手；新生兒須與病童隔離以避免重症。',
    attentionReason: '已進入年度好發季，疫情上升趨勢明確；累計 4 例重症（含 D68 型 2 例）。D68 型自上次流行已 3 年，署長公開提醒可能引起明顯流行，預估 6 月中達高峰。',
    shortSummary: '符合 epidemic 定義：病例週週增加、進入歷史季節高峰前期、有重症監測訊號；D68 型回流是本季最大風險因子。',
  },
  {
    id: 'h7n7',
    name: 'H7N7 新型 A 型流感',
    englishName: 'Influenza A (H7N7)',
    icon: '🦆',
    importanceScore: 58,
    category: 'monitoring',
    alertLevel: 'low',
    caseSummary: '本土首例 1 例（已出院，接觸者監測結束）',
    weeklyChange: '0 — 事件已落幕',
    radar: [8, 15, 10, 25],
    typicalSymptoms: ['結膜炎（紅眼）', '輕微發燒', '咳嗽', '流鼻水'],
    transmissionRoutes: ['接觸感染禽鳥或其排泄物', '屬低病原性禽流感（LPAI）', '基因定序顯示無禽傳人增強突變，目前無人傳人證據'],
    riskGroups: ['禽畜養殖從業人員', '禽鳥撲殺與防疫人員', '活禽市場工作者'],
    riskRegions: ['家禽養殖場', '活禽運輸與市場', '曾通報個案的養禽地區'],
    action: {
      visit: '禽畜業者若出現紅眼、發燒等症狀，就醫時主動告知禽鳥接觸史，由醫院評估採檢；一般民眾風險極低，無須恐慌。',
      mask: '接觸禽鳥時佩戴口罩及手套，工作後更衣洗手；一般生活情境無須額外防護。',
    },
    householdAlert: '同住的禽畜業者如有共同曝險，留意自身症狀即可；此型別無持續人傳人能力，家庭內擴散風險低。',
    attentionReason: '4 月初為重大新聞事件（彰化 70 多歲鴨農首例本土禽傳人，匡列 33 名接觸者），5 月中已落幕。基因定序顯示與野鳥 H7 最相近，研判為偶發事件。',
    shortSummary: '事件已實質結案，但因「首例本土禽傳人」之歷史意義仍須監測；現階段風險低於媒體先前報導所暗示之程度。',
  },
  {
    id: 'nipah',
    name: '立百病毒感染症',
    englishName: 'Nipah Virus Infection',
    icon: '🦇',
    importanceScore: 55,
    category: 'monitoring',
    alertLevel: 'medium',
    caseSummary: '國內 0 病例（4/2 已列為第五類法定傳染病）',
    weeklyChange: '0 — 無病例',
    radar: [5, 45, 15, 85],
    typicalSymptoms: ['發燒', '頭痛', '頭暈', '意識混亂', '急性腦炎', '呼吸道症狀'],
    transmissionRoutes: ['接觸果蝠或其分泌物污染的食物（如生椰棗汁）', '接觸感染豬隻', '近距離照顧個案時有限度人傳人'],
    riskGroups: ['南亞旅遊史者', '養豬或屠宰從業人員', '照顧疑似個案的醫護與家屬'],
    riskRegions: ['南亞（印度、孟加拉）', '果蝠棲息與養豬區域'],
    action: {
      visit: '有南亞旅遊史並出現發燒、腦炎症狀，應於就醫前告知旅遊史，由感染科或神經科評估並通報。',
      mask: '照顧疑似個案須配戴 N95、手套與護目裝備並採隔離措施；一般民眾國內無病例，無須防護。',
    },
    householdAlert: '若家屬照顧疑似個案，應做好個人防護並避免共用餐具、近距離接觸分泌物；國內目前無本土或境外移入病例。',
    attentionReason: '南亞印度、孟加拉持續發生病例，致死率極高（40–75%）且無疫苗或核准藥物；台灣以制度性預警（升級為法定傳染病）回應，國內無病例。',
    shortSummary: '公共衛生制度警戒升級，但社會關注度低；屬「高致命率 × 低當前風險」的監測類別。',
  },
  {
    id: 'meningococcal',
    name: '流行性腦脊髓膜炎',
    englishName: 'Meningococcal Meningitis',
    icon: '🧠',
    importanceScore: 50,
    category: 'outbreak',
    alertLevel: 'medium',
    caseSummary: '5/5 新增 2 例確定病例',
    weeklyChange: '短期內 +2 例',
    radar: [20, 50, 25, 62],
    typicalSymptoms: ['突發高燒', '劇烈頭痛', '頸部僵硬', '畏光', '噁心嘔吐', '皮膚瘀斑', '意識改變'],
    transmissionRoutes: ['飛沫傳播', '接觸病人口鼻分泌物', '長時間密切接觸（同住、共用空間）'],
    riskGroups: ['嬰幼兒與青少年', '團體生活者（宿舍、軍營）', '脾臟功能異常或免疫低下者', '確診者的密切接觸者'],
    riskRegions: ['宿舍、軍營等團體機構', '人口密集的密閉空間'],
    action: {
      visit: '突發高燒合併劇烈頭痛、頸部僵硬或皮膚瘀斑屬醫療急症，應立即至急診；病程可在數小時內惡化，切勿等待。',
      mask: '病人及照顧者配戴外科口罩；密切接觸者應就醫評估是否需預防性抗生素。',
    },
    householdAlert: '同住家人屬高風險密切接觸者，應儘速就醫評估預防性投藥，並留意自身是否出現發燒、頭痛等症狀。',
    attentionReason: '短期內 2 例為相對罕見的疾病警訊，疾管署公開呼籲注意呼吸道衛生；致死率高（10–15%）且可進展迅速，需密切追蹤。',
    shortSummary: '醫學上具警示性但媒體關注度有限；屬「重要但未引爆」的 outbreak 類別。',
  },
]
