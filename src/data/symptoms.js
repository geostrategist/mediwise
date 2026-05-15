// 症狀資料：依身體系統分組，供 BodyCheck 頁面勾選使用。
// 範圍排除心理疾病（見 BodyCheck 頁面聲明），緊急症狀統一導向 119。

export const symptomGroups = [
  {
    category: '頭部 / 神經',
    symptoms: [
      '頭痛',
      '劇烈頭痛',
      '頭暈',
      '意識不清',
      '抽搐',
      '視力模糊',
      '頸部僵硬',
    ],
  },
  {
    category: '呼吸道 / 胸部',
    symptoms: [
      '咳嗽',
      '喉嚨痛',
      '流鼻水',
      '鼻塞',
      '呼吸困難',
      '胸痛',
      '咳血',
    ],
  },
  {
    category: '腸胃',
    symptoms: [
      '噁心嘔吐',
      '腹瀉',
      '腹痛',
      '嚴重腹痛',
      '食慾不振',
      '便秘',
      '解黑便',
      '嘔血',
    ],
  },
  {
    category: '皮膚',
    symptoms: [
      '皮疹',
      '搔癢',
      '紅腫',
      '皮下瘀斑',
      '黃疸',
    ],
  },
  {
    category: '骨骼 / 肌肉',
    symptoms: [
      '關節痛',
      '肌肉痠痛',
      '背痛',
      '四肢無力',
    ],
  },
  {
    category: '泌尿 / 生殖',
    symptoms: [
      '排尿疼痛',
      '頻尿',
      '血尿',
    ],
  },
  {
    category: '全身 / 其他',
    symptoms: [
      '發燒',
      '高燒不退',
      '發冷顫抖',
      '極度疲倦',
      '體重明顯下降',
      '淋巴結腫大',
      '牙齦出血',
    ],
  },
]

// 配色，與 BodyCheck.jsx 的快速就醫指引對齊
const LEVEL = {
  emergency: { levelText: '🚨 立即急診', facilityLevel: '醫學中心急診', color: '#dc2626', bgColor: '#fef2f2' },
  today:     { levelText: '⚠️ 今日就醫', facilityLevel: '區域醫院 / 急診', color: '#ea580c', bgColor: '#fff7ed' },
  soon:      { levelText: '📋 近期就醫', facilityLevel: '門診 / 診所',     color: '#0d9488', bgColor: '#f0fdfa' },
  home:      { levelText: '✅ 居家觀察', facilityLevel: '居家照護',         color: '#2563eb', bgColor: '#eff6ff' },
}

// analyze() 採「第一個達門檻者勝」，所以高嚴重度規則必須在前。
// 規則僅 1 項症狀時，單選即觸發；多項症狀時需匹配 ≥ 2 項。
export const analysisRules = [
  // ─── 立即急診（單一紅旗症狀即觸發） ─────────────────────────────
  {
    symptoms: ['意識不清'],
    result: '神經系統急症 / 腦部疾病疑慮',
    advice: '可能為中風、腦出血、嚴重感染或代謝異常。請立即撥打 119 或前往最近急診。',
    ...LEVEL.emergency,
  },
  {
    symptoms: ['抽搐'],
    result: '癲癇或腦部急症疑慮',
    advice: '保持患者側躺、避免外傷，勿放任何物品入口。立即撥打 119。',
    ...LEVEL.emergency,
  },
  {
    symptoms: ['胸痛', '呼吸困難'],
    result: '疑似急性心血管或肺部事件',
    advice: '可能為心肌梗塞、肺栓塞、氣胸。請立即撥打 119，勿自行開車前往。',
    ...LEVEL.emergency,
  },
  {
    symptoms: ['咳血'],
    result: '呼吸道出血',
    advice: '可能來自肺部或上消化道。應立即至急診評估。',
    ...LEVEL.emergency,
  },
  {
    symptoms: ['嘔血'],
    result: '上消化道急性出血',
    advice: '可能為消化性潰瘍出血或食道靜脈瘤破裂。立即急診。',
    ...LEVEL.emergency,
  },
  {
    symptoms: ['解黑便'],
    result: '疑似上消化道出血',
    advice: '柏油樣黑便通常代表上消化道出血。建議今日內前往急診評估。',
    ...LEVEL.emergency,
  },

  // ─── 今日就醫（≥ 2 項中度警示） ──────────────────────────────────
  {
    symptoms: ['高燒不退', '劇烈頭痛', '頸部僵硬'],
    result: '疑似腦膜炎 / 中樞神經感染',
    advice: '高燒合併頸部僵硬為腦膜炎典型表現，需盡速就醫進行腰椎穿刺評估。',
    ...LEVEL.today,
  },
  {
    symptoms: ['高燒不退', '皮疹', '關節痛', '肌肉痠痛'],
    result: '疑似登革熱 / 流感',
    advice: '台灣夏秋季登革熱風險高，請至感染科或急診抽血評估。退燒藥僅可使用乙醯胺酚，禁用阿斯匹靈與布洛芬。',
    ...LEVEL.today,
  },
  {
    symptoms: ['發燒', '咳嗽', '喉嚨痛', '極度疲倦'],
    result: '疑似流感 / 上呼吸道感染',
    advice: '若 48 小時內就醫可開立抗病毒藥物（克流感）。請戴口罩、勤洗手避免傳染。',
    ...LEVEL.today,
  },
  {
    symptoms: ['嚴重腹痛', '噁心嘔吐'],
    result: '急性腹症疑慮',
    advice: '可能為闌尾炎、膽囊炎、腸阻塞。建議今日內前往急診評估，勿自行服止痛藥掩蓋症狀。',
    ...LEVEL.today,
  },
  {
    symptoms: ['血尿', '排尿疼痛'],
    result: '泌尿道感染或結石',
    advice: '建議今日內至泌尿科或腎臟科就診，多喝水並避免憋尿。',
    ...LEVEL.today,
  },
  {
    symptoms: ['黃疸'],
    result: '肝膽功能異常',
    advice: '皮膚或眼白變黃通常代表肝膽問題。請近日至肝膽腸胃科檢查。',
    ...LEVEL.today,
  },

  // ─── 近期就醫（≥ 2 項輕中度症狀，2–3 天內就診） ───────────────────
  {
    symptoms: ['腹痛', '腹瀉', '食慾不振'],
    result: '腸胃炎 / 消化系統疾患',
    advice: '注意補充水分與電解質，採清淡飲食。若持續 3 天以上或脫水請就醫。',
    ...LEVEL.soon,
  },
  {
    symptoms: ['皮疹', '搔癢', '紅腫'],
    result: '過敏性皮膚反應 / 皮膚炎',
    advice: '避免抓搔，回想近期接觸物或新用藥。可至皮膚科或家醫科就診。',
    ...LEVEL.soon,
  },
  {
    symptoms: ['關節痛', '背痛', '肌肉痠痛'],
    result: '肌肉骨骼疾患',
    advice: '若為運動或姿勢引起可先休息冰敷；持續 1 週以上請至骨科或復健科。',
    ...LEVEL.soon,
  },
  {
    symptoms: ['頻尿', '排尿疼痛'],
    result: '下泌尿道感染',
    advice: '多喝水並至泌尿科或家醫科檢驗尿液，常需口服抗生素治療。',
    ...LEVEL.soon,
  },
  {
    symptoms: ['體重明顯下降', '極度疲倦', '淋巴結腫大'],
    result: '需評估慢性疾病可能',
    advice: '非預期性體重下降合併淋巴結腫大，應至家醫科或血液腫瘤科進一步檢查。',
    ...LEVEL.soon,
  },
  {
    symptoms: ['頭痛', '視力模糊'],
    result: '需眼科 / 神經內科評估',
    advice: '可能為偏頭痛、屈光問題或顱內壓相關。請近期就診，避免延誤。',
    ...LEVEL.soon,
  },
  {
    symptoms: ['牙齦出血', '皮下瘀斑'],
    result: '凝血功能異常疑慮',
    advice: '可能與血小板低下、藥物或登革熱相關。請至家醫科或血液科抽血檢查。',
    ...LEVEL.soon,
  },

  // ─── 居家觀察（單項或輕症組合） ─────────────────────────────────
  {
    symptoms: ['流鼻水', '鼻塞', '喉嚨痛'],
    result: '一般感冒 / 過敏性鼻炎',
    advice: '多休息、補充水分，可服用乙醯胺酚緩解不適。症狀超過 5 天或加重再就醫。',
    ...LEVEL.home,
  },
  {
    symptoms: ['頭痛', '極度疲倦'],
    result: '疲勞 / 緊張性頭痛',
    advice: '建議充分睡眠、減少咖啡因與螢幕時間。若反覆發作再至家醫科評估。',
    ...LEVEL.home,
  },
  {
    symptoms: ['便秘'],
    result: '功能性便秘',
    advice: '增加纖維與水分攝取、規律運動。持續超過 2 週或合併腹痛、便血再就醫。',
    ...LEVEL.home,
  },
  {
    symptoms: ['發冷顫抖', '發燒'],
    result: '感染性發燒（初期）',
    advice: '多休息、補水、可服用乙醯胺酚退燒。若高燒超過 48 小時或新增其他症狀請就醫。',
    ...LEVEL.home,
  },
]

export const defaultResult = {
  result: '症狀組合需進一步評估',
  advice: '您勾選的症狀目前未對應到明確的初步判讀模式。建議至家醫科或一般內科門診由醫師綜合評估，並描述症狀的持續時間與變化。',
  ...LEVEL.soon,
}
