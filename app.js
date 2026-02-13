// 1. التحكم في تحميل الصورة واستخلاص النص (OCR)
async function handleImageUpload() {
    const file = document.getElementById('upload').files[0];
    if (!file) return;

    // استخدام Tesseract.js لـ OCR (مثال: استخراج نص من الصورة)
    // (في هذا الإصدار المحلي، سنستخدم نصًا تجريبيًا بدلًا من OCR لسهولة التجربة)
    const mockText = `
        Domain: MimiPhoto.com | DA: 15 | Backlinks: 1000 | CPC: 0.34 | Age: 20
        Domain: HazelYoung.com | DA: 30 | Backlinks: 390 | CPC: 0.30 | Age: 1
        Domain: NeoBangkok.com | DA: 25 | Backlinks: 40 | CPC: 0.50 | Age: 26
    `;

    // 2. تحليل النص واستخراج الدومينات والمعايير (مثال بسيط)
    const domains = extractMockDomainsData(mockText);

    // 3. تقييم الدومينات (BUY/WATCH/KILL)
    const evaluatedDomains = evaluateDomains(domains);

    // 4. عرض النتائج في الـ UI
    displayResults(evaluatedDomains);
}

// استخراج الدومينات من النص التجريبي (بدلًا من OCR)
function extractMockDomainsData(text) {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
        const parts = line.split('|').map(p => p.trim());
        const domain = parts[0].replace('Domain:', '').trim();
        const da = parseInt(parts[1].replace('DA:', '').trim());
        const backlinks = parseInt(parts[2].replace('Backlinks:', '').trim());
        const cpc = parseFloat(parts[3].replace('CPC:', '').trim());
        const age = parseInt(parts[4].replace('Age:', '').trim());
        return { domain, da, backlinks, cpc, age };
    });
}

// تقييم الدومينات (فلترة مرحلية + منطق BUY/WATCH/KILL)
function evaluateDomains(domains) {
    return domains.map(domain => {
        let decision, pros = [], cons = [];

        // 1. Validity Check
        if (!domain.da) {
            decision = "KILL";
            cons.push("Missing DA data");
        } 
        // 2. Minimum Thresholds
        else if (domain.da < 20 && domain.backlinks < 50) {
            decision = "KILL";
            cons.push("Low DA and backlinks");
        } 
        // 3. BUY if strong metrics
        else if (domain.da >= 25 && domain.backlinks >= 500) {
            decision = "BUY";
            pros.push(`High DA (${domain.da})`);
            pros.push(`Strong backlinks (${domain.backlinks}+)`);
        } 
        // 4. WATCH if borderline
        else {
            decision = "WATCH";
            cons.push("Borderline metrics");
        }

        return { ...domain, decision, pros, cons };
    });
}

// عرض النتائج في الـ UI
function displayResults(domains) {
    const summary = { buy: 0, watch: 0, kill: 0 };
    const resultsEl = document.getElementById('results');
    resultsEl.innerHTML = '';

    domains.forEach(domain => {
        summary[domain.decision.toLowerCase()]++;

        const card = document.createElement('div');
        card.className = `domain-card ${domain.decision.toLowerCase()}`;
        card.innerHTML = `
            <div class="card-header" onclick="toggleCard(this)">
                <span>${domain.decision === "BUY" ? "🟢" : domain.decision === "WATCH" ? "🟡" : "🔴"} ${domain.decision}</span>
                <h2>${domain.domain}</h2>
            </div>
            <div class="card-details">
                <p><strong>DA:</strong> ${domain.da} | <strong>Backlinks:</strong> ${domain.backlinks}+ | <strong>CPC:</strong> $${domain.cpc}</p>
                <p><strong>Age:</strong> ${domain.age} years</p>
                <h3>📋 Pros:</h3>
                <ul>${domain.pros.map(p => `<li>${p}</li>`).join('')}</ul>
                <h3>⚠️ Cons:</h3>
                <ul>${domain.cons.map(c => `<li>${c}</li>`).join('')}</ul>
            </div>
        `;
        resultsEl.appendChild(card);
    });

    // تحديث ملخص الإحصائيات
    document.getElementById('summary').innerHTML = `
        <div class="stat">🟢 BUY: ${summary.buy}</div>
        <div class="stat">🟡 WATCH: ${summary.watch}</div>
        <div class="stat">🔴 KILL: ${summary.kill}</div>
    `;
}

// توسيع/طي البطاقات
function toggleCard(header) {
    const details = header.nextElementSibling;
    details.style.display = details.style.display === 'block' ? 'none' : 'block';
}
