import React, { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: "Zayıf", color: "info", desc: "İdeal kilonun altında" };
  if (bmi < 25) return { label: "Normal", color: "success", desc: "İdeal kilo aralığında" };
  if (bmi < 30) return { label: "Fazla kilolu", color: "warning", desc: "İdeal kilonun üzerinde" };
  return { label: "Obez", color: "danger", desc: "Obezite sınırında veya üzerinde" };
}

const ACTIVITY_LEVELS = [
  { value: 1.2, label: "Hareketsiz (çok az egzersiz)", short: "Hareketsiz" },
  { value: 1.375, label: "Hafif aktif (haftada 1-3 gün)", short: "Hafif aktif" },
  { value: 1.55, label: "Orta aktif (haftada 3-5 gün)", short: "Orta aktif" },
  { value: 1.725, label: "Çok aktif (haftada 6-7 gün)", short: "Çok aktif" },
  { value: 1.9, label: "Ekstra aktif (ağır fiziksel iş)", short: "Ekstra aktif" },
];

function calcBMR(weight, heightCm, age, isMale) {
  // Mifflin-St Jeor
  const h = heightCm / 100;
  if (isMale) return 10 * weight + 6.25 * heightCm - 5 * age + 5;
  return 10 * weight + 6.25 * heightCm - 5 * age - 161;
}

export default function HealthTools() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmiResult, setBmiResult] = useState(null);

  const [calWeight, setCalWeight] = useState("");
  const [calHeight, setCalHeight] = useState("");
  const [calAge, setCalAge] = useState("");
  const [calGender, setCalGender] = useState("female");
  const [calActivity, setCalActivity] = useState(1.375);
  const [calResult, setCalResult] = useState(null);

  const handleBmiSubmit = (e) => {
    e.preventDefault();
    const w = parseFloat(weight.replace(",", "."));
    const h = parseFloat(height.replace(",", ".")) / 100;
    if (!w || !h || w <= 0 || h <= 0) return;
    const bmi = w / (h * h);
    setBmiResult({ bmi, ...getBMICategory(bmi) });
  };

  const handleCalSubmit = (e) => {
    e.preventDefault();
    const w = parseFloat(calWeight.replace(",", "."));
    const h = parseFloat(calHeight.replace(",", "."));
    const age = parseInt(calAge, 10);
    if (!w || !h || !age || w <= 0 || h <= 0 || age <= 0 || age > 120) return;
    const bmr = Math.round(calcBMR(w, h, age, calGender === "male"));
    const tdee = Math.round(bmr * calActivity);
    setCalResult({ bmr, tdee, activityLabel: ACTIVITY_LEVELS.find((a) => a.value === calActivity)?.short });
  };

  return (
    <div className="container py-4" style={{ maxWidth: 560 }}>
      <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Sağlık Araçları" }]} />
      <div className="page-header">
        <h3 className="fw-bold m-0">Sağlık Araçları</h3>
        <p className="text-muted small mb-0 mt-1">Vücut kitle indeksi ve günlük kalori ihtiyacı hesaplayıcıları.</p>
      </div>

      {/* BMI */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-2">
            <i className="bi bi-speedometer2 me-2 text-primary" />
            BMI Hesapla
          </h5>
          <p className="text-muted small mb-3">
            Vücut Kitle İndeksi (BMI), kilonuzun boyunuza göre kabaca değerlendirilmesidir. Sağlık teşhisi yerine geçmez.
          </p>
          <form onSubmit={handleBmiSubmit} className="d-grid gap-3">
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label">Kilo (kg)</label>
                <input type="text" inputMode="decimal" className="form-control" placeholder="Örn: 70" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
              <div className="col-6">
                <label className="form-label">Boy (cm)</label>
                <input type="text" inputMode="decimal" className="form-control" placeholder="Örn: 175" value={height} onChange={(e) => setHeight(e.target.value)} />
              </div>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-dark">Hesapla</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => { setWeight(""); setHeight(""); setBmiResult(null); }}>Temizle</button>
            </div>
          </form>
          {bmiResult && (
            <div className={`mt-4 p-3 rounded-3 bmi-result bmi-result-${bmiResult.color}`}>
              <div className="d-flex align-items-baseline gap-2 mb-1">
                <span className="fs-2 fw-bold">{bmiResult.bmi.toFixed(1)}</span>
                <span className="text-muted small">kg/m²</span>
              </div>
              <div className="fw-bold">{bmiResult.label}</div>
              <div className="small text-muted">{bmiResult.desc}</div>
            </div>
          )}
        </div>
      </div>

      {/* Kalori ihtiyacı */}
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-2">
            <i className="bi bi-fire me-2 text-danger" />
            Günlük Kalori İhtiyacı
          </h5>
          <p className="text-muted small mb-3">
            Bazal metabolizma (BMR) ve aktivite seviyenize göre günlük yaklaşık kalori ihtiyacınızı hesaplar (Mifflin-St Jeor formülü).
          </p>
          <form onSubmit={handleCalSubmit} className="d-grid gap-3">
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label">Kilo (kg)</label>
                <input type="text" inputMode="decimal" className="form-control" placeholder="Örn: 70" value={calWeight} onChange={(e) => setCalWeight(e.target.value)} />
              </div>
              <div className="col-6">
                <label className="form-label">Boy (cm)</label>
                <input type="text" inputMode="decimal" className="form-control" placeholder="Örn: 175" value={calHeight} onChange={(e) => setCalHeight(e.target.value)} />
              </div>
            </div>
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label">Yaş</label>
                <input type="number" min="10" max="120" className="form-control" placeholder="Örn: 30" value={calAge} onChange={(e) => setCalAge(e.target.value)} />
              </div>
              <div className="col-6">
                <label className="form-label">Cinsiyet</label>
                <select className="form-select" value={calGender} onChange={(e) => setCalGender(e.target.value)}>
                  <option value="female">Kadın</option>
                  <option value="male">Erkek</option>
                </select>
              </div>
            </div>
            <div>
              <label className="form-label">Aktivite seviyesi</label>
              <select className="form-select" value={calActivity} onChange={(e) => setCalActivity(parseFloat(e.target.value))}>
                {ACTIVITY_LEVELS.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-dark">Hesapla</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setCalResult(null)}>Temizle</button>
            </div>
          </form>
          {calResult && (
            <div className="mt-4 p-3 rounded-3 calorie-result">
              <div className="row g-3">
                <div className="col-6">
                  <div className="small text-muted">Bazal metabolizma (BMR)</div>
                  <div className="fs-4 fw-bold text-primary">{calResult.bmr.toLocaleString("tr-TR")} <span className="fs-6 fw-normal text-muted">kcal/gün</span></div>
                </div>
                <div className="col-6">
                  <div className="small text-muted">Günlük kalori ihtiyacı ({calResult.activityLabel})</div>
                  <div className="fs-4 fw-bold">{calResult.tdee.toLocaleString("tr-TR")} <span className="fs-6 fw-normal text-muted">kcal/gün</span></div>
                </div>
              </div>
              <p className="small text-muted mb-0 mt-2">Kilo vermek için bu değerin altında, kilo almak için üstünde kalori alabilirsiniz. Sağlık için diyetisyen görüşü önerilir.</p>
            </div>
          )}
        </div>
      </div>

      <div className="card shadow-sm mt-3">
        <div className="card-body p-3">
          <h6 className="fw-bold mb-2">BMI aralıkları</h6>
          <ul className="small text-muted mb-0 ps-3">
            <li>18.5 altı: Zayıf</li>
            <li>18.5 – 24.9: Normal</li>
            <li>25 – 29.9: Fazla kilolu</li>
            <li>30 ve üzeri: Obez</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
