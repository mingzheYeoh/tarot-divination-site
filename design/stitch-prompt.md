# 塔罗牌占卜网站 — Google Stitch 设计提示词文档

> 用途:本文档是给 [Google Stitch](https://stitch.withgoogle.com) 用的完整设计输入。可以整段复制"设计系统主提示词"作为项目开场白,然后逐页复制对应的"页面提示词"生成每个界面。
>
> 语言说明:提示词正文用英文书写(AI 设计工具普遍对英文提示的理解与出图质量更稳定),但界面文案(按钮、标题)保留中文原文,Stitch 会按提示词里引号中的原文渲染文字。如果生成效果不理想,也可以直接把中文说明整段贴给 Stitch 试试(Stitch 基于 Gemini,中文理解能力也不错)。

---

## 〇、项目基调(先读这个,建立整体印象)

**产品**:一个沉浸式塔罗牌在线占卜网站。用户带着一个问题走进来,经历"冥想 → 洗牌 → 选牌 → 翻牌 → 解读"的完整仪式感流程,离开时感觉像是真的做了一场占卜,而不是"填了个表单看了段文字"。

**情绪基调**:午夜神谕(Midnight Oracle)——深邃的宇宙神秘感 + 天鹅绒质感的复古占卜馆触感。不是廉价的"万圣节风",而是高级、克制、带一点奢华感的神秘学美学,参考方向:暗色高级美妆品牌 × 占星 App × 教堂彩窗的光影感。

**核心设计原则**:
1. 每一步交互都要有"仪式感"停顿,不要让用户觉得是在"点按钮走流程"
2. 暗色背景为主,用金色线条 / 光效做点缀,避免大面积高饱和撞色
3. 卡牌本身是绝对主角,其余 UI 元素都应该衬托卡牌,而不是抢戏
4. 抽卡与翻牌是全站最重要的两个"高光时刻",设计上应该给足空间和特效描述

---

## 一、设计系统主提示词(Master Prompt — 先贴这段,建立整站风格基准)

```
Design a cohesive visual system for a mystical, premium tarot reading website called "Midnight Oracle" (夜语塔罗). The overall mood is "midnight oracle": deep cosmic mysticism meets velvet-lined vintage fortune-telling parlor — elegant and restrained, not cheap-Halloween.

Color palette:
- Background: near-black deep indigo (#0B0714 to #120C1F), with soft radial gradients of dark violet (#2A1B3D) glowing faintly at the center of key sections
- Primary accent: antique/muted gold (#C9A24B), used for borders, icons, button fills, thin linework
- Secondary accent: deep amethyst violet (#5B2C8F) and magenta-violet (#7B4397) for glows and gradients
- Highlight glow color: soft lavender-white (#E8DFFF), used sparingly for particle light and card-reveal bursts
- Card back color: deep burgundy/maroon (#3D0C29) with fine gold filigree linework pattern

Typography:
- Display/heading font: Cinzel (elegant engraved serif, small-caps feel), used for page titles and card names
- Secondary display font: Playfair Display italic, used for taglines and quotes
- Body font: a clean modern sans-serif (e.g. Inter), high readability, generous line height, used for descriptive/reading text

Texture and lighting language:
- Subtle film-grain / noise overlay across dark backgrounds so black never looks flat
- Soft radial vignettes darkening the edges of the viewport
- Thin god-ray light beams crossing diagonally behind hero content
- A drifting starfield / nebula particle background (small soft-glow dots, some larger blurred star clusters, very slow parallax drift)
- Gold UI elements should read as slightly metallic/foil — subtle gradient + soft specular highlight, not flat gold fill

Component language:
- Buttons look like wax-seal medallions or embossed gold coins: circular or pill-shaped, thin gold border, soft inner glow on hover, small radiating light on press
- Cards have rounded corners, a thin gold border, and a soft ambient glow/shadow beneath them as if lit by candlelight
- Section dividers use thin ornamental gold line-art (small flourish/moon-phase motifs), not plain horizontal rules
- Icons are thin-line, single-weight, celestial/occult motifs (moon phases, stars, sun, eye, wands, cups, swords, pentacles)

Keep the system elegant, high-contrast for readability, accessible, and consistent across every screen described below.
```

---

## 二、分页面提示词

> 每一段都可以单独贴给 Stitch 生成对应页面,生成后记得手动检查文字是否为指定的中文文案。

### 2.1 首页 / Hero Page

```
Design the hero landing page for the "Midnight Oracle" (夜语塔罗) tarot reading website, using the established design system (deep indigo background, gold accents, starfield particles, Cinzel typography).

Layout:
- Full-bleed dark background with a slowly drifting starfield and faint violet nebula glow concentrated behind the center content
- Large ornate circular emblem behind the title — a thin gold linework mandala combining a crescent moon, a sun, and an eye motif, rotating very slowly (describe as a subtle static illustration with implied rotation via a curved motion-trail hint)
- Centered title in Cinzel serif, large: "夜语塔罗" with a soft golden glow behind the letters
- Subtitle in Playfair Display italic, smaller, beneath the title: a one-line evocative tagline about listening to the cards at midnight
- A prominent circular/pill call-to-action button styled as a wax-seal medallion, gold border with soft inner glow, labeled "开始占卜"
- Three to four small tarot card silhouettes drifting subtly in the background at different depths (parallax layers), softly blurred, suggesting cards floating in space
- A minimal top navigation bar, transparent/glass background, with thin gold text links: 首页 / 抽牌占卜 / 牌意图鉴 / 关于
- A small fixed audio mute/unmute icon (crescent moon toggle) in the bottom-right corner
```

### 2.2 抽牌页 / Draw Page — 核心仪式流程(四个状态)

这一页是全站的体验核心,按顺序描述"许愿 → 洗牌 → 选牌 → 翻牌"四个状态,建议分别生成四张截图/原型状态,再在 Stitch 里串成一个 flow。

**状态一:许愿/冥想(Intention)**

```
Design the first state of the tarot drawing ritual page, on the "Midnight Oracle" dark mystical design system. This is the "set your intention" step before shuffling.

Layout:
- Centered on a dark, candlelit round velvet table viewed from a slightly elevated angle, softly lit by a warm gold glow from below (like candlelight), surrounded by darkness and drifting faint smoke/incense wisps at the edges
- In the center of the table, a glowing orb or crystal (soft pulsing lavender-white light, breathing animation implied by concentric soft glow rings)
- Above the orb, an instruction in Cinzel/Playfair type: "静下心来,默念你的问题" (Calm your mind, silently ask your question)
- A minimal text input styled like a parchment scroll strip where the user can optionally type their question, with placeholder text "输入你想问的问题(可选)"
- A gold wax-seal button below labeled "开始洗牌"
- Subtle floating star particles drifting upward around the table
```

**状态二:洗牌(Shuffle)**

```
Design the shuffle animation state of the tarot ritual page, same dark velvet-table environment as before.

Layout:
- The full 78-card deck shown as a single cohesive stack of ornate card backs (deep burgundy with gold filigree pattern) sitting at the center of the velvet table
- Illustrate a implied riffle-bridge shuffle motion: two half-stacks slightly fanned toward each other with a soft golden light-smear/motion-blur trail connecting them, suggesting movement
- A thin gold circular progress ring around the deck indicating the shuffle is in progress
- Small floating rune/glyph symbols briefly appearing and fading around the deck as it shuffles
- Caption text below in elegant serif: "命运正在交织..." (Fate is weaving...)
```

**状态三:选牌(Select — fanned spread)**

```
Design the card-selection state of the tarot ritual page, same velvet-table environment.

Layout:
- The shuffled deck has fanned out into a wide arc of face-down cards (show around 12-15 overlapping card backs in a smooth fan across the table), each with the same burgundy/gold filigree back design
- One card in the fan is shown in a "hovered" state: slightly lifted off the table, tilted toward the viewer in subtle 3D perspective, with a soft gold foil shimmer sweep across its back and a warm glow underneath it, visually distinct from the rest
- Caption above the fan: "选择召唤你的那张牌" (Choose the card that calls to you)
- A subtle counter/indicator in the corner if the spread requires multiple cards, e.g. "1 / 1" for single-card draws (for future multi-card spreads this would show "1 / 3")
```

**状态四:翻牌揭示(Reveal)**

```
Design the dramatic card-reveal moment of the tarot ritual page — this is the single most important emotional beat of the entire site, so make it visually striking.

Layout:
- The selected card, now large and centered, shown mid-flip: rendered as if caught in the exact moment the card turns to face the viewer, with a burst of golden light particles radiating outward from behind the card in all directions
- A soft radial light flash/vignette emanating from the card illuminates the surrounding darkness, momentarily pushing back the darkness around the table
- Fine gold light rays crossing behind the card like a halo
- The revealed card face shows an illustrated major arcana card (e.g. "The Star") in a painterly, richly colored illustration style with a thin gold border frame and the card's name in Cinzel caps beneath the illustration ("星星 · THE STAR")
- Small dust/spark particles continuing to drift away from the card
- Below the card, a soft-appearing button, partially faded in, labeled "查看解读" (visually depict at ~50% opacity as if still fading in)
```

### 2.3 结果解读页 / Result Page

```
Design the reading/result page for the "Midnight Oracle" tarot website, on the same dark mystical design system.

Layout:
- Left or top: the revealed tarot card shown large, gently floating (implied by a soft drop shadow separated from the card, suggesting levitation), with a slow ambient gold glow pulsing behind it
- Right or below: a reading panel on a subtle parchment-textured dark card/glass panel containing, in staggered vertical order: card name in Cinzel ("星星 · THE STAR"), a row of 3-4 small keyword pills with thin gold outline (e.g. "希望" "疗愈" "信念"), then a body-text paragraph in the clean sans-serif body font giving the card's meaning, then a shorter "给你的建议" advice paragraph
- Each block should look like it fades/slides in with slight vertical offset (depict as a subtle staggered layout with soft opacity gradient on lower blocks to suggest sequential reveal)
- A small line-icon toggle near the card indicating upright/reversed orientation (a small vertical arrow icon)
- A small speaker/play icon near the card labeled subtly, suggesting an audio narration option for the reading
- Two buttons at the bottom: a primary gold wax-seal button "再抽一张" (draw again) and a secondary ghost-outline button "保存此次占卜" (save this reading)
```

### 2.4 牌意图鉴页 / Encyclopedia Page(78 张牌)

```
Design the tarot card encyclopedia/gallery page for "Midnight Oracle", same dark design system.

Layout:
- A top filter tab bar with five ornate gold-underlined tabs: 全部 / 大阿卡纳 / 权杖 / 圣杯 / 宝剑 / 星币
- A search bar styled like a thin gold-bordered scroll/ribbon input with a small magnifier icon, placeholder "搜索牌名..."
- Below, a responsive grid of card thumbnails (roughly 6 columns on desktop), each showing the ornate card-back design by default
- One card in the grid shown in a "hovered/flipped" state revealing its front illustration and name label beneath, to demonstrate the hover-to-reveal interaction
- Each grid cell has a subtle gold border that brightens on hover
- Generous dark negative space between cards so the grid doesn't feel cluttered
```

### 2.5 关于页 / About Page

```
Design the "About" page for "Midnight Oracle", same dark mystical design system, styled like reading an old parchment scroll floating in starlit darkness.

Layout:
- A centered vertical parchment-textured panel (dark aged-paper texture with subtle torn/deckled edges, softly lit) containing:
  - A small ornate gold divider glyph at the top
  - A heading in Cinzel: "关于夜语塔罗"
  - Two to three short paragraphs of body text (placeholder lorem ok) in an elegant serif, describing the site's mystical narrator persona and the intention behind the project
  - A smaller section crediting the tarot deck artwork source and a gentle disclaimer that readings are for reflection/entertainment, not professional advice
- Faint drifting stars visible in the darkness surrounding the parchment panel
```

### 2.6 三牌阵 / Three-Card Spread(过去·现在·未来)

补充于单牌流程之上:选牌与翻牌阶段复用 2.2 节的状态二/三/四(选牌悬停反馈、翻牌高光时刻都与张数无关,逐张翻开即可,2.2 节状态三已预留了 "1 / 3" 这样的计数器)。以下两段是三牌阵**独有**、需要新画的两个画面:铺牌布局,以及结果解读页。

**铺牌布局(三张牌摊开于桌面)**

```
Design the three-card spread laying state for "Midnight Oracle", extending the existing single-card ritual flow (same velvet-table environment, starfield, candlelight). This state occurs as the user reveals the three drawn cards in sequence.

Layout:
- Three card slots arranged in a horizontal row at the center of the velvet table, evenly spaced with generous negative space between them
- Each slot has a thin gold outline glowing softly even before a card is placed, subtly numbered "I" "II" "III" in small Cinzel caps beneath each slot
- Small position labels beneath each slot in Playfair Display italic: "过去" (Past) under slot I, "现在" (Present) under slot II, "未来" (Future) under slot III
- Slot I and II already show revealed cards (painterly illustrated major arcana fronts with thin gold border), while slot III shows a card mid-flip with the golden light-burst reveal effect from the single-card ritual, since revealing happens one card at a time in sequence
- A thin progress indicator above the spread reads "2 / 3" in small gold Cinzel type
- Caption above the table in elegant serif: "命运的三重回响" (The threefold echo of fate)
```

**结果解读页**

```
Design the three-card spread result/reading page for "Midnight Oracle", extending the single-card result page's visual language (same dark parchment-glass panel system, staggered fade-in blocks).

Layout:
- Top: three revealed cards displayed side by side, each with its position label above it in Cinzel small-caps ("过去" / "现在" / "未来"), card name beneath each card, each card gently floating with its own soft ambient glow
- Below the three cards: a horizontal ornamental gold divider (moon-phase motif)
- Below the divider: three side-by-side reading panels (one under each card, on the subtle parchment-textured dark glass), each containing a short keyword-pill row and 2-3 sentence interpretation specific to that position
- Beneath the three individual panels, a wider unified panel titled "整体指引" (Overall guidance) in Cinzel, containing a synthesized paragraph that weaves the three cards into one coherent narrative arc
- Two buttons at the bottom, same wax-seal/ghost-outline style as the single-card result page: "再抽一次" (draw again) and "保存此次占卜" (save this reading)
```

### 2.7 凯尔特十字 / Celtic Cross Spread(十张牌)

同样复用 2.2 节的选牌/翻牌交互,以下两段是凯尔特十字**独有**的画面。位置命名采用最通行的现代十位版本(源自 Waite 原始阵型、被绝大多数塔罗书籍与 App 采用),确保牌阵本身对懂塔罗的人来说是"正宗"的:

I 现状 · II 挑战 · III 根基 · IV 近期过去 · V 可能结果 · VI 近期未来 · VII 自身态度 · VIII 外部影响 · IX 希望与恐惧 · X 最终结果

**铺牌布局(十字 + 侧列)**

```
Design the Celtic Cross ten-card spread laying state for "Midnight Oracle", same velvet-table dark mystical environment, extending the established ritual flow.

Layout:
- The classic Celtic Cross layout rendered on the velvet table: a central cross of six cards (one card horizontal, laid crosswise directly on top of a second vertical card at the center, surrounded by four cards above/below/left/right forming a small cross), plus a vertical staff of four cards running along the right side of the table from bottom to top
- Each of the 10 positions has a thin gold outline slot, small position number in Cinzel caps (I through X)
- A subtle position-name key rendered as a small collapsible gold-bordered legend card in the lower-left corner listing all ten position names in compact Chinese text: "I 现状 II 挑战 III 根基 IV 近期过去 V 可能结果 VI 近期未来 VII 自身态度 VIII 外部影响 IX 希望与恐惧 X 最终结果"
- Several of the ten slots already show revealed painterly major-arcana card fronts, with the currently-active slot mid-flip showing the golden light-burst reveal effect
- A thin progress indicator reads "7 / 10" in small gold Cinzel type
- Caption above the table: "命运的十重织锦" (The tenfold tapestry of fate)
```

**结果解读页**

```
Design the Celtic Cross result/reading page for "Midnight Oracle", extending the established dark parchment-glass reading panel language.

Layout:
- Top section: a compact static rendering of the completed ten-card cross-and-staff layout (small card thumbnails in their correct spread positions, each labeled with a small Roman numeral), acting as a visual map of the reading
- Below the map: a vertical accordion-style list of all ten positions, each row showing: position number + name (e.g. "III 根基 · Foundation"), the card's name and small thumbnail, a 2-3 sentence position-specific interpretation; only the first 2-3 rows shown expanded by default with the rest collapsed to avoid overwhelming the reader
- Beneath the accordion, a wider "整体指引" (Overall guidance) panel synthesizing the ten cards into one coherent narrative, same styling as the three-card spread's synthesis panel
- Same two-button footer as other result pages: "再抽一次" / "保存此次占卜"
```

### 2.8 注册 · 占卜师身份仪式 / Register — Diviner Identity Ritual

用三步式的"身份仪式"取代传统注册表单,呼应"游戏角色创建"的体验:选原型 → 铸造印记 → 用邮箱密码封印契约。三个状态分别贴给 Stitch 生成。底层技术仍是 Supabase 标准的 email+password 注册,只是把最后一步包装成"封印仪式"。

**步骤一:选择原型(Choose Archetype)**

```
Design the first step of the account registration ritual for "Midnight Oracle" — choosing a diviner archetype, replacing a traditional signup form with a game-like character selection moment. Same dark mystical design system (deep indigo, gold accents, starfield).

Layout:
- Centered heading in Cinzel: "你，是哪一种占卜者？" (What kind of diviner are you?)
- A subtitle in Playfair Display italic beneath: "选择你的原型，它将伴随你走过每一次占卜" (Choose your archetype — it will accompany every reading)
- A row/grid of 4-5 archetype cards, each a tall gold-bordered card with: a unique thin-line celestial icon (crescent moon for "先知 Seer", alchemical triangle for "炼金术士 Alchemist", eight-pointed star for "占星家 Astrologer", eye for "灵媒 Medium", open book for "贤者 Sage"), the archetype name in Cinzel, and a one-line italic descriptor beneath in small type
- One card shown in a "selected/hovered" state: slightly larger, lifted with a soft gold glow and a thin animated-looking light ring around its border, visually distinct from the others
- A progress indicator at the top: three small dots/glyphs, first one filled gold (step 1 of 3)
- A gold wax-seal "下一步" (Next) button at the bottom, disabled/dim until a card is selected
```

**步骤二:铸造印记(Forge Your Sigil)**

```
Design the second step of the registration ritual — creating a personal sigil/crest, same dark mystical design system, continuing from the archetype-selection step.

Layout:
- Progress indicator now shows step 2 of 3
- Centered heading: "铸造属于你的印记" (Forge your own sigil)
- A large circular emblem in the center showing a sigil being assembled from thin gold linework — a base circle with 3-4 small selectable symbol slots around it (moon phase, star, wand, cup, sword, pentacle motifs), one or two already placed and glowing softly
- Below the circle, a horizontal row of selectable symbol chips (thin gold-outlined circles with celestial icons) that the user can add to their sigil, one shown in an "active/dragging toward center" state with a faint golden trail connecting it to the circle
- A small "重新铸造" (reforge/reset) ghost-outline button off to the side
- A gold wax-seal "下一步" (Next) button at the bottom
```

**步骤三:封印仪式(Seal the Pact — email/password)**

```
Design the third and final step of the registration ritual — sealing the account with credentials, same dark mystical design system.

Layout:
- Progress indicator shows step 3 of 3, all three glyphs now gold-filled
- Centered heading: "以你的真名，封印这份契约" (Seal this pact with your true name)
- A preview of the just-created identity above the form: the chosen archetype icon + assembled sigil, small and centered, with the archetype name in Cinzel beneath it
- Below that, two minimal parchment-style input fields with thin gold bottom-borders (no boxy outlines): "邮箱" (Email) and "密码" (Password), Playfair Display italic placeholder text
- A large gold wax-seal button labeled "完成封印" (Complete the seal), styled with a dripping-wax-seal visual metaphor — small animated-looking wax drop icon beside the text
- Small text link beneath: "已经踏上旅程？前往登录" (Already on the journey? Go to login)
```

### 2.9 登录页 / Login(Returning Diviner)

```
Design the login page for returning users on "Midnight Oracle", same dark mystical design system, deliberately shorter/simpler than the registration ritual since this is a quick return visit rather than a first-time ceremony.

Layout:
- Centered heading in Cinzel: "欢迎回来，旅人" (Welcome back, traveler)
- Small subtitle in Playfair Display italic: "星辰记得你的名字" (The stars remember your name)
- Two minimal parchment-style input fields, same thin gold bottom-border style as the registration seal step: "邮箱" (Email) and "密码" (Password)
- A gold wax-seal button labeled "进入" (Enter)
- A small ghost-outline secondary option below: "忘记密码？" (Forgot password?) and a subtle divider with "或" (or) leading to a Google icon button for OAuth sign-in
- Small text link at the bottom: "初次到访？开始身份仪式" (First time here? Begin the identity ritual)
```

### 2.10 占卜师主页 / Profile Dashboard

```
Design the logged-in user's personal profile/dashboard page for "Midnight Oracle", same dark mystical design system.

Layout:
- Top profile header section: the user's sigil/crest emblem large and centered-left, their chosen archetype name in Cinzel beside it (e.g. "先知 · 艾莉丝的旅程"), a small "仪式等级" (ritual rank) label beneath in gold small-caps
- A row of 2-3 stat chips beside the header: "仪式频率" (streak) shown as a small flame/star icon with a number ("连续 7 天" / 7-day streak), "总占卜次数" (total readings) with a count, styled as pill-shaped gold-outlined chips consistent with the keyword-pill style from the result pages
- Below the header: an ornamental gold divider
- A section titled "占卜记录" (Reading history) in Cinzel, showing a vertical list of past-reading cards — each row a compact dark glass panel with: small card thumbnail(s) (1 for single-card readings, 3/10 small thumbnails for spread readings), the date, the spread type label, and a truncated preview of the question/first line of interpretation; each row has a soft gold border that brightens on hover
- Rows fade in with a slight staggered vertical offset, consistent with the result page's reveal pattern
- A small settings/gear icon in the top-right corner for account settings, consistent placement with the top nav bar's existing gear icon from the homepage design
```

---

## 三、"极具创意性"的抽卡/阅卡体验设计说明

> 这一节是专门给"抽卡、阅卡要有创意"这个要求写的深化构想。Stitch 只能画出静态/原型状态,下面这些是给我们后续用代码(GSAP / Framer Motion / 音频)实现时的创意清单,已经在上面第 2.2 节的四个状态提示词里埋了对应的视觉线索。

**抽牌流程的五个巧思**
1. **许愿仪式**:开始洗牌前加一个"对着水晶球默念问题"的停顿步骤,水晶球随呼吸节奏明暗脉动,给用户一个心理准备的仪式感,而不是直接跳进洗牌
2. **洗牌手感**:模拟真实纸牌的"桥接洗牌"(riffle shuffle)动作,而不是简单的乱序位移——两叠牌交错插入的动画质感会明显比"卡片乱飘"更有真实感
3. **选牌的悬停反馈**:鼠标/手指靠近扇形中的某张牌时,那张牌轻微抬起 + 金色描边高光扫过(foil shimmer sweep),给用户"这张牌在回应我"的感觉
4. **翻牌高光时刻**:翻牌一瞬间用粒子爆发 + 短暂全屏光晕(vignette flash)+ 轻微镜头推近感,这是全站最重要的情绪高点,值得投入最多的动画预算
5. **卡牌拖出光尾**:发牌/选中卡牌飞向中心时,卡牌身后拖一条渐隐的金色光尾(comet trail),而不是直接瞬移

**环境级微交互**
- 全站鼠标移动时有极淡的星尘粒子跟随光标漂浮(cursor stardust trail)
- 卡牌 hover 时做基于鼠标位置的轻微 3D 视差倾斜(parallax tilt),增强"实体卡牌"的触感
- 页面切换用"月相/瞳孔开合"式的 iris wipe 转场,而不是普通的淡入淡出
- 背景粒子的呼吸节奏可以和(可选开启的)背景音乐节拍做轻微同步,增强沉浸感

**无障碍与容错**
- 提供"减少动效"开关(遵循用户系统的 prefers-reduced-motion 设置),关闭后用简单淡入淡出替代所有粒子/3D 特效
- 音频默认静音,由用户主动点击"开始占卜"后才解锁音频上下文(浏览器自动播放策略限制,也更礼貌)

---

## 四、动效实现说明(不属于 Stitch 范围,记录给实现阶段用)

Stitch 只产出静态稿/原型,以下是实际写代码时"从其他地方导入动画素材"的具体来源建议:

- **GSAP**(https://gsap.com):负责洗牌/翻牌/发牌的时间轴编排,是整个仪式流程动画的骨架
- **Lottie / LottieFiles**(https://lottiefiles.com):搜索 "sparkle burst" "magic particles" "moon phase" 等关键词,找现成的矢量动画小图标(星光爆闪、月相变化),导入后用 lottie-react 播放,注意逐个确认授权协议(部分免费素材仅限个人/需署名)
- **tsParticles**(https://github.com/tsparticles/tsparticles):星空背景 + 翻牌粒子爆发效果
- **CodePen 参考**(仅作动效实现思路参考,不直接抄样式):搜索 "Click Responsive Shuffling Tarot Cards w/GSAP"、"Card Flip Animation" 获取洗牌/翻牌的时间轴写法灵感
- **Framer Motion**:负责页面间的 iris-wipe / 淡入淡出转场,以及结果页文字逐条 stagger 淡入

---

## 五、音频设计说明(不属于 Stitch 范围,记录给实现阶段用)

Stitch 无法生成音频,这部分是产品概念记录,供后续实现时使用。

**背景音乐**
- 环境向的空灵合成器 pad/drone,可循环、无明显节奏起伏,音量默认较低
- 素材来源建议:Pixabay Audio(https://pixabay.com/music/)、Freesound(https://freesound.org/)—— 优先选 CC0 或明确允许商用的曲目,下载前核对许可条款

**音效(SFX)**
| 交互时机 | 音效意象 |
|---|---|
| 洗牌 | 纸牌摩擦"唰唰"声 |
| 选中卡牌 | 轻柔的铃/钟一声 |
| 翻牌揭示瞬间 | 短促的"whoosh + 悠远钟鸣"叠加,呼应视觉上的光爆 |
| 页面转场 | 极轻的风铃声 |

**交互与合规细节**
- 全局静音/音量按钮固定在角落(见 2.1 首页提示词里的月亮图标),默认状态为静音
- 音频上下文必须在用户主动点击"开始占卜"之后才初始化播放(浏览器自动播放策略限制,提前播放会被浏览器拦截)
- 所有音频素材需确认可商用/免版税授权,下载前逐一核对许可证,与塔罗牌图片素材同样对待

---

## 六、如何使用这份文档

1. 打开 https://stitch.withgoogle.com,新建项目
2. 先把第一节"设计系统主提示词"整段贴进去生成一次,建立整站的色彩/字体/质感基准
3. 依次贴第二节里每个页面(含抽牌页的四个状态)的提示词,逐个生成
4. 生成后人工检查:文字是否为要求的中文文案、深色对比度是否够、金色是否显得廉价(如果显得塑料感,可以在提示词里追加 "matte metallic gold, not glossy plastic gold" 类似的修饰语重新生成)
5. 满意后导出图片/Figma 链接给我,我会照着稿子在代码里做视觉还原,并把第三、四、五节里的创意动效与音频构想在代码阶段落地
