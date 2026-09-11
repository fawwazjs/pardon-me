"use client";

import React, { useState } from "react";
import {
  Calculator,
  Compass,
  ArrowRightLeft,
  Navigation,
  Mountain,
  Map,
  Globe2,
  Layers,
  Camera,
  Activity,
  Plus,
  Trash2,
} from "lucide-react";

export default function GeomaticsCalculatorSection() {
  const [activeCategory, setActiveCategory] = useState<
    "scientific" | "coord" | "terestris" | "azimuth" | "earth_scale" | "photogrammetry" | "area"
  >("scientific");

  // --- 1. SCIENTIFIC CALCULATOR STATE ---
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [angleUnit, setAngleUnit] = useState<"deg" | "rad">("deg");
  const [history, setHistory] = useState<string[]>([]);

  const handleCalcBtn = (val: string) => {
    if (val === "AC") {
      setCalcDisplay("0");
      return;
    }
    if (val === "C") {
      setCalcDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      return;
    }
    if (val === "=") {
      try {
        let expr = calcDisplay
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/π/g, "Math.PI")
          .replace(/e/g, "Math.E");

        const toRad = angleUnit === "deg" ? "(Math.PI/180)*" : "";
        expr = expr
          .replace(/sin\(([^)]+)\)/g, `Math.sin(${toRad}($1))`)
          .replace(/cos\(([^)]+)\)/g, `Math.cos(${toRad}($1))`)
          .replace(/tan\(([^)]+)\)/g, `Math.tan(${toRad}($1))`)
          .replace(/asin\(([^)]+)\)/g, `Math.asin($1)${angleUnit === "deg" ? "*(180/Math.PI)" : ""}`)
          .replace(/acos\(([^)]+)\)/g, `Math.acos($1)${angleUnit === "deg" ? "*(180/Math.PI)" : ""}`)
          .replace(/atan\(([^)]+)\)/g, `Math.atan($1)${angleUnit === "deg" ? "*(180/Math.PI)" : ""}`)
          .replace(/sqrt\(([^)]+)\)/g, "Math.sqrt($1)")
          .replace(/log\(([^)]+)\)/g, "Math.log10($1)")
          .replace(/ln\(([^)]+)\)/g, "Math.log($1)");

        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${expr})`)();
        const formatted = Number.isFinite(res) ? String(parseFloat(res.toFixed(8))) : "Error";
        setHistory((prev) => [`${calcDisplay} = ${formatted}`, ...prev.slice(0, 3)]);
        setCalcDisplay(formatted);
      } catch {
        setCalcDisplay("Error");
      }
      return;
    }

    if (["sin", "cos", "tan", "asin", "acos", "atan", "sqrt", "log", "ln"].includes(val)) {
      setCalcDisplay((prev) => (prev === "0" ? `${val}(` : `${prev}${val}(`));
    } else {
      setCalcDisplay((prev) => (prev === "0" && !["+", "-", "×", "÷", "."].includes(val) ? val : `${prev}${val}`));
    }
  };

  // --- 2. KOORDINAT & SISTEM GEODESI STATE ---
  const [ddInput, setDdInput] = useState("-6.9175");
  const ddVal = parseFloat(ddInput) || 0;
  const absDD = Math.abs(ddVal);
  const calcD = Math.floor(absDD);
  const calcM = Math.floor((absDD - calcD) * 60);
  const calcS = ((absDD - calcD - calcM / 60) * 3600).toFixed(2);
  const calcDir = ddVal < 0 ? "S (Lintang Selatan)" : "N (Lintang Utara)";

  const [dmsDeg, setDmsDeg] = useState(6);
  const [dmsMin, setDmsMin] = useState(55);
  const [dmsSec, setDmsSec] = useState(3.0);
  const [dmsDir, setDmsDir] = useState<"S" | "N" | "E" | "W">("S");
  const convertedDD = ((dmsDir === "S" || dmsDir === "W" ? -1 : 1) * (dmsDeg + dmsMin / 60 + dmsSec / 3600)).toFixed(6);

  // Zona UTM & Central Meridian
  const [utmLong, setUtmLong] = useState("107.6191");
  const [utmLat, setUtmLat] = useState("-6.9175");
  const uLong = parseFloat(utmLong) || 0;
  const uLat = parseFloat(utmLat) || 0;
  const utmZoneNum = Math.floor((uLong + 180) / 6) + 1;
  const utmZoneHemisphere = uLat >= 0 ? "Utara (N)" : "Selatan (S)";
  const centralMeridian = utmZoneNum * 6 - 183;

  // Undulasi Geoid (h = H + N)
  const [geoidMode, setGeoidMode] = useState<"calc_H" | "calc_h" | "calc_N">("calc_H");
  const [valH_ellipsoid, setValH_ellipsoid] = useState("782.45");
  const [valH_orthometric, setValH_orthometric] = useState("755.20");
  const [valN_undulation, setValN_undulation] = useState("27.25");
  const hEll = parseFloat(valH_ellipsoid) || 0;
  const hOrt = parseFloat(valH_orthometric) || 0;
  const nUnd = parseFloat(valN_undulation) || 0;

  // --- 3. SURVEI TERESTRIS STATE ---
  const [terestrisSub, setTerestrisSub] = useState<"polar" | "waterpass" | "tacheometry" | "slope">("polar");
  const [polarX0, setPolarX0] = useState("790120.500");
  const [polarY0, setPolarY0] = useState("9234500.250");
  const [polarDist, setPolarDist] = useState("124.750");
  const [polarAzDeg, setPolarAzDeg] = useState("45.5");

  const pX0 = parseFloat(polarX0) || 0;
  const pY0 = parseFloat(polarY0) || 0;
  const pDist = parseFloat(polarDist) || 0;
  const pAzRad = ((parseFloat(polarAzDeg) || 0) * Math.PI) / 180;
  const deltaX = pDist * Math.sin(pAzRad);
  const deltaY = pDist * Math.cos(pAzRad);
  const newX = (pX0 + deltaX).toFixed(3);
  const newY = (pY0 + deltaY).toFixed(3);

  // Sipat Datar / Waterpass
  const [wpHa, setWpHa] = useState("750.000");
  const [wpBaB, setWpBaB] = useState("1.650");
  const [wpBtB, setWpBtB] = useState("1.500");
  const [wpBbB, setWpBbB] = useState("1.350");
  const [wpBaM, setWpBaM] = useState("1.420");
  const [wpBtM, setWpBtM] = useState("1.250");
  const [wpBbM, setWpBbM] = useState("1.080");

  const btb = parseFloat(wpBtB) || 0;
  const btm = parseFloat(wpBtM) || 0;
  const deltaH_wp = btb - btm;
  const newHb = ((parseFloat(wpHa) || 0) + deltaH_wp).toFixed(3);
  const distBelakang = ((parseFloat(wpBaB) || 0) - (parseFloat(wpBbB) || 0)) * 100;
  const distMuka = ((parseFloat(wpBaM) || 0) - (parseFloat(wpBbM) || 0)) * 100;
  const checkBelakang = (parseFloat(wpBaB) || 0) + (parseFloat(wpBbB) || 0);
  const isValidBelakang = Math.abs(checkBelakang - 2 * btb) < 0.003;
  const checkMuka = (parseFloat(wpBaM) || 0) + (parseFloat(wpBbM) || 0);
  const isValidMuka = Math.abs(checkMuka - 2 * btm) < 0.003;

  // Takimetri
  const [takiDistMode, setTakiDistMode] = useState<"slope" | "stadia">("slope");
  const [takiSlopeDist, setTakiSlopeDist] = useState("85.400");
  const [takiBa, setTakiBa] = useState("1.850");
  const [takiBb, setTakiBb] = useState("1.000");
  const [takiVertDeg, setTakiVertDeg] = useState("12.5");
  const [takiTi, setTakiTi] = useState("1.520");
  const [takiTp, setTakiTp] = useState("1.600");

  const vRad = ((parseFloat(takiVertDeg) || 0) * Math.PI) / 180;
  const takiTiNum = parseFloat(takiTi) || 0;
  const takiTpNum = parseFloat(takiTp) || 0;

  let takiDatar = 0;
  let takiDeltaH = 0;
  if (takiDistMode === "slope") {
    const sMiring = parseFloat(takiSlopeDist) || 0;
    takiDatar = sMiring * Math.cos(vRad);
    takiDeltaH = sMiring * Math.sin(vRad) + takiTiNum - takiTpNum;
  } else {
    const ba = parseFloat(takiBa) || 0;
    const bb = parseFloat(takiBb) || 0;
    const sOptis = (ba - bb) * 100;
    takiDatar = sOptis * Math.cos(vRad) * Math.cos(vRad);
    takiDeltaH = 0.5 * sOptis * Math.sin(2 * vRad) + takiTiNum - takiTpNum;
  }

  // Kemiringan Lereng
  const [slopeDeltaH, setSlopeDeltaH] = useState("15.2");
  const [slopeDatar, setSlopeDatar] = useState("120.0");
  const sDH = parseFloat(slopeDeltaH) || 0;
  const sDatar = parseFloat(slopeDatar) || 1;
  const slopePercent = ((sDH / sDatar) * 100).toFixed(2);
  const slopeDegree = ((Math.atan(sDH / sDatar) * 180) / Math.PI).toFixed(2);
  const slopeRatio = (sDatar / (sDH || 1)).toFixed(1);

  // --- 4. JARAK & AZIMUTH GEODETIK STATE ---
  const [ptA, setPtA] = useState({ x: 107.6087, y: -6.9248 });
  const [ptB, setPtB] = useState({ x: 107.6191, y: -6.9175 });

  const R = 6371000;
  const phi1 = (ptA.y * Math.PI) / 180;
  const phi2 = (ptB.y * Math.PI) / 180;
  const deltaPhi = ((ptB.y - ptA.y) * Math.PI) / 180;
  const deltaLambda = ((ptB.x - ptA.x) * Math.PI) / 180;
  const aHav =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const cHav = 2 * Math.atan2(Math.sqrt(aHav), Math.sqrt(1 - aHav));
  const haversineDistMeters = (R * cHav).toFixed(2);
  const haversineDistKm = ((R * cHav) / 1000).toFixed(3);

  const yAz = Math.sin(deltaLambda) * Math.cos(phi2);
  const xAz = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  let azimuthDeg = (Math.atan2(yAz, xAz) * 180) / Math.PI;
  if (azimuthDeg < 0) azimuthDeg += 360;
  const azD = Math.floor(azimuthDeg);
  const azM = Math.floor((azimuthDeg - azD) * 60);
  const azS = ((azimuthDeg - azD - azM / 60) * 3600).toFixed(1);

  // --- 5. LENGKUNG BUMI & SKALA PETA STATE ---
  const [distanceKm, setDistanceKm] = useState("5.0");
  const distVal = parseFloat(distanceKm) || 0;
  const curvatureCorrectionM = (0.0675 * distVal * distVal).toFixed(4);

  const [mapDistanceCm, setMapDistanceCm] = useState("4.5");
  const [scaleDenominator, setScaleDenominator] = useState("25000");
  const dCm = parseFloat(mapDistanceCm) || 0;
  const sDenom = parseFloat(scaleDenominator) || 1;
  const realDistanceM = ((dCm * sDenom) / 100).toFixed(2);
  const realDistanceKm = ((dCm * sDenom) / 100000).toFixed(3);

  // --- 6. FOTOGRAMETRI & DRONE UAV STATE ---
  const [droneH, setDroneH] = useState("120");
  const [focalLength, setFocalLength] = useState("8.8");
  const [sensorWidth, setSensorWidth] = useState("13.2");
  const [imageWidthPx, setImageWidthPx] = useState("5472");
  const [sensorHeight, setSensorHeight] = useState("8.8");
  const [imageHeightPx, setImageHeightPx] = useState("3648");

  const dH = parseFloat(droneH) || 1;
  const fMm = parseFloat(focalLength) || 1;
  const sW = parseFloat(sensorWidth) || 1;
  const sH = parseFloat(sensorHeight) || 1;
  const imW = parseFloat(imageWidthPx) || 1;
  const imH = parseFloat(imageHeightPx) || 1;

  const gsdH = ((dH * sW) / (fMm * imW)) * 100;
  const photoScaleDenom = Math.round((dH * 1000) / fMm);
  const groundWidthM = ((sW * dH) / fMm).toFixed(1);
  const groundHeightM = ((sH * dH) / fMm).toFixed(1);
  const groundAreaHa = (((parseFloat(groundWidthM) * parseFloat(groundHeightM)) / 10000)).toFixed(2);

  // --- 7. LUAS POLIGON TANAH (SHOELACE) STATE ---
  const [polyPoints, setPolyPoints] = useState<{ id: number; x: string; y: string }[]>([
    { id: 1, x: "100.0", y: "100.0" },
    { id: 2, x: "150.0", y: "110.0" },
    { id: 3, x: "140.0", y: "170.0" },
    { id: 4, x: "90.0", y: "150.0" },
  ]);

  const addPoint = () => {
    setPolyPoints((prev) => [
      ...prev,
      { id: Date.now(), x: "0.0", y: "0.0" },
    ]);
  };

  const removePoint = (id: number) => {
    if (polyPoints.length <= 3) return;
    setPolyPoints((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePoint = (id: number, field: "x" | "y", val: string) => {
    setPolyPoints((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  let shoelaceArea = 0;
  let polygonPerimeter = 0;
  const nPoints = polyPoints.length;
  if (nPoints >= 3) {
    let sum1 = 0;
    let sum2 = 0;
    let perim = 0;
    for (let i = 0; i < nPoints; i++) {
      const nextIdx = (i + 1) % nPoints;
      const xi = parseFloat(polyPoints[i].x) || 0;
      const yi = parseFloat(polyPoints[i].y) || 0;
      const xNext = parseFloat(polyPoints[nextIdx].x) || 0;
      const yNext = parseFloat(polyPoints[nextIdx].y) || 0;

      sum1 += xi * yNext;
      sum2 += yi * xNext;

      const edgeDist = Math.sqrt((xNext - xi) ** 2 + (yNext - yi) ** 2);
      perim += edgeDist;
    }
    shoelaceArea = Math.abs(sum1 - sum2) / 2;
    polygonPerimeter = perim;
  }

  return (
    <section id="kalkulator-geodesi" className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-400/20 text-rose-600 dark:text-rose-400 text-xs font-mono uppercase tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Kalkulator Lengkap Geomatika & Geodesi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-stone-900 dark:text-white">
            Kalkulator & Geodesi
          </h2>
          <p className="text-stone-600 dark:text-rose-200/80 text-sm mt-2 max-w-xl mx-auto">
            Rumus matematis lengkap survei terestris, sistem koordinat, geodesi satelit, hingga fotogrametri UAV.
          </p>
        </div>

        {/* Category Selector Bar */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mb-8">
          {[
            { id: "scientific", label: "Saintifik", icon: Calculator },
            { id: "coord", label: "Koordinat & UTM", icon: ArrowRightLeft },
            { id: "terestris", label: "Survei Terestris", icon: Activity },
            { id: "azimuth", label: "Jarak & Azimuth", icon: Navigation },
            { id: "earth_scale", label: "Lengkung & Skala", icon: Mountain },
            { id: "photogrammetry", label: "Drone & GSD", icon: Camera },
            { id: "area", label: "Luas Poligon", icon: Map },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-mono tracking-wide transition-all shadow-sm ${
                  isActive
                    ? "bg-rose-500 text-white font-semibold shadow-rose-500/20"
                    : "bg-white dark:bg-rose-950/40 text-stone-700 dark:text-rose-200 border border-rose-200/70 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. SCIENTIFIC CALCULATOR */}
        {activeCategory === "scientific" && (
          <div className="max-w-md mx-auto rounded-3xl p-6 theme-card shadow-lg border border-rose-200/80 dark:border-rose-900/60">
            {/* Display */}
            <div className="mb-4 p-4 rounded-2xl bg-stone-100 dark:bg-rose-950/70 border border-rose-200/60 dark:border-rose-900/50 text-right font-mono">
              <div className="flex items-center justify-between text-[10px] text-stone-400 dark:text-rose-400 mb-1">
                <button
                  onClick={() => setAngleUnit(angleUnit === "deg" ? "rad" : "deg")}
                  className="px-2 py-0.5 rounded bg-rose-200/60 dark:bg-rose-900/60 text-rose-700 dark:text-rose-200 font-bold"
                >
                  MODE: {angleUnit.toUpperCase()}
                </button>
                <span>{history[0] || ""}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none">
                {calcDisplay}
              </div>
            </div>

            {/* Keypad Grid */}
            <div className="grid grid-cols-5 gap-2 text-xs font-mono">
              {[
                { label: "sin", val: "sin" },
                { label: "cos", val: "cos" },
                { label: "tan", val: "tan" },
                { label: "π", val: "π" },
                { label: "AC", val: "AC", color: "text-rose-600 bg-rose-100 dark:bg-rose-950/80 font-bold" },

                { label: "asin", val: "asin" },
                { label: "acos", val: "acos" },
                { label: "atan", val: "atan" },
                { label: "e", val: "e" },
                { label: "C", val: "C", color: "text-rose-600 bg-rose-100 dark:bg-rose-950/80 font-bold" },

                { label: "√", val: "sqrt" },
                { label: "(", val: "(" },
                { label: ")", val: ")" },
                { label: "^", val: "**" },
                { label: "÷", val: "÷", color: "text-rose-600 font-bold text-base" },

                { label: "log", val: "log" },
                { label: "7", val: "7" },
                { label: "8", val: "8" },
                { label: "9", val: "9" },
                { label: "×", val: "×", color: "text-rose-600 font-bold text-base" },

                { label: "ln", val: "ln" },
                { label: "4", val: "4" },
                { label: "5", val: "5" },
                { label: "6", val: "6" },
                { label: "-", val: "-", color: "text-rose-600 font-bold text-base" },

                { label: "1/x", val: "1/(" },
                { label: "1", val: "1" },
                { label: "2", val: "2" },
                { label: "3", val: "3" },
                { label: "+", val: "+", color: "text-rose-600 font-bold text-base" },

                { label: "%", val: "/100" },
                { label: "0", val: "0" },
                { label: "00", val: "00" },
                { label: ".", val: "." },
                { label: "=", val: "=", color: "bg-rose-500 hover:bg-rose-600 text-white font-bold text-base shadow-sm" },
              ].map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCalcBtn(btn.val)}
                  className={`h-10 rounded-xl flex items-center justify-center transition-all border border-rose-200/60 dark:border-rose-900/50 active:scale-95 ${
                    btn.color || "bg-white dark:bg-rose-950/40 text-stone-800 dark:text-rose-100 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. KOORDINAT & SISTEM GEODESI */}
        {activeCategory === "coord" && (
          <div className="space-y-6">
            {/* DD ⇄ DMS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 theme-card p-6 sm:p-8 rounded-3xl shadow-lg border border-rose-200/80 dark:border-rose-900/60">
              {/* DD ke DMS */}
              <div className="space-y-4 p-5 rounded-2xl bg-stone-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40">
                <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-300 font-mono">
                  Desimal Derajat (DD) ➔ DMS
                </h3>
                
                {/* Clean Math Formula Banner */}
                <div className="p-3 rounded-xl bg-rose-50/90 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 text-[11px] font-mono text-stone-700 dark:text-rose-200 space-y-1">
                  <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-wider">Rumus Matematis:</div>
                  <div>D = ⌊|DD|⌋</div>
                  <div>M = ⌊(|DD| − D) × 60⌋</div>
                  <div>S = (|DD| − D − M/60) × 3600</div>
                </div>

                <div>
                  <label className="text-xs text-stone-500 dark:text-rose-300/70 block mb-1">
                    Nilai DD (misal: -6.9175):
                  </label>
                  <input
                    type="text"
                    value={ddInput}
                    onChange={(e) => setDdInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-sm font-mono text-stone-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="p-3.5 rounded-xl bg-rose-100/70 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 font-mono text-xs space-y-1">
                  <div className="text-[10px] text-rose-600 dark:text-rose-300 font-semibold uppercase">Hasil Konversi:</div>
                  <div className="text-base font-bold">
                    {calcD}° {calcM}&apos; {calcS}&quot; {calcDir}
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-rose-300/70">
                    Derajat: {calcD}° | Menit: {calcM}&apos; | Detik: {calcS}&quot;
                  </div>
                </div>
              </div>

              {/* DMS ke DD */}
              <div className="space-y-4 p-5 rounded-2xl bg-stone-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40">
                <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-300 font-mono">
                  DMS ➔ Desimal Derajat (DD)
                </h3>

                {/* Clean Math Formula Banner */}
                <div className="p-3 rounded-xl bg-rose-50/90 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 text-[11px] font-mono text-stone-700 dark:text-rose-200 space-y-1">
                  <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-wider">Rumus Matematis:</div>
                  <div className="font-semibold text-rose-700 dark:text-rose-300">
                    DD = ± (Derajat + <sup>Menit</sup>/<sub>60</sub> + <sup>Detik</sup>/<sub>3600</sub>)
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-rose-300/70">
                    Bertanda minus (−) untuk LS / BB, plus (+) untuk LU / BT
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Derajat (°)</label>
                    <input
                      type="number"
                      value={dmsDeg}
                      onChange={(e) => setDmsDeg(parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono text-stone-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Menit (&apos;)</label>
                    <input
                      type="number"
                      value={dmsMin}
                      onChange={(e) => setDmsMin(parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono text-stone-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Detik (&quot;)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={dmsSec}
                      onChange={(e) => setDmsSec(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono text-stone-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Arah</label>
                    <select
                      value={dmsDir}
                      onChange={(e) => setDmsDir(e.target.value as any)}
                      className="w-full px-2 py-2 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono text-stone-900 dark:text-white"
                    >
                      <option value="S">S (LS)</option>
                      <option value="N">N (LU)</option>
                      <option value="E">E (BT)</option>
                      <option value="W">W (BB)</option>
                    </select>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-100/70 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 font-mono text-xs space-y-1">
                  <div className="text-[10px] text-rose-600 dark:text-rose-300 font-semibold uppercase">Hasil Konversi:</div>
                  <div className="text-base font-bold">{convertedDD}°</div>
                </div>
              </div>
            </div>

            {/* Zona UTM & Central Meridian */}
            <div className="theme-card p-6 sm:p-8 rounded-3xl shadow-lg border border-rose-200/80 dark:border-rose-900/60 space-y-4">
              <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-300 font-mono flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-rose-500" />
                <span>Penetapan Zona UTM & Central Meridian (CM)</span>
              </h3>

              {/* Clean Math Formula Banner */}
              <div className="p-3 rounded-xl bg-rose-50/90 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 text-[11px] font-mono text-stone-700 dark:text-rose-200 flex flex-wrap gap-x-6 gap-y-2">
                <div>
                  <span className="font-semibold text-rose-600 dark:text-rose-300">Nomor Zona UTM: </span>
                  ⌊(Bujur + 180°) / 6⌋ + 1
                </div>
                <div>
                  <span className="font-semibold text-rose-600 dark:text-rose-300">Meridian Sentral (λ₀): </span>
                  (Zona × 6°) − 183°
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-500 dark:text-rose-300/70 block mb-1">
                    Bujur / Longitude (°):
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={utmLong}
                    onChange={(e) => setUtmLong(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 dark:text-rose-300/70 block mb-1">
                    Lintang / Latitude (°):
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={utmLat}
                    onChange={(e) => setUtmLat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-rose-100/70 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Zona UTM:</span>
                  <span className="text-lg font-bold">Zona {utmZoneNum} {uLat >= 0 ? "N" : "S"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Belahan Bumi:</span>
                  <span className="text-base font-semibold">{utmZoneHemisphere}</span>
                </div>
                <div>
                  <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Central Meridian (CM):</span>
                  <span className="text-base font-semibold">{centralMeridian}° E</span>
                </div>
              </div>
            </div>

            {/* Hubungan Tinggi: h = H + N (Undulasi Geoid) */}
            <div className="theme-card p-6 sm:p-8 rounded-3xl shadow-lg border border-rose-200/80 dark:border-rose-900/60 space-y-4">
              <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-300 font-mono flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-500" />
                <span>Hubungan Tinggi Geodesi: h = H + N (Undulasi Geoid)</span>
              </h3>

              {/* Clean Math Formula Banner */}
              <div className="p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 font-mono text-xs text-stone-700 dark:text-rose-200 space-y-1.5">
                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-rose-600 dark:text-rose-300">
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                    h = H + N
                  </span>
                  <span>⇔</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                    H = h − N
                  </span>
                  <span>⇔</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                    N = h − H
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 dark:text-rose-300/80 pt-1 flex flex-wrap gap-x-4 gap-y-1">
                  <span><strong>h</strong> = Tinggi Elipsoid (GNSS)</span>
                  <span><strong>H</strong> = Tinggi Ortometrik (Sipat Datar / MSL)</span>
                  <span><strong>N</strong> = Undulasi Geoid</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setGeoidMode("calc_H")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                    geoidMode === "calc_H"
                      ? "bg-rose-500 text-white font-semibold"
                      : "bg-stone-100 dark:bg-rose-950/60 text-stone-700 dark:text-rose-200"
                  }`}
                >
                  Hitung H (Ortometrik)
                </button>
                <button
                  onClick={() => setGeoidMode("calc_h")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                    geoidMode === "calc_h"
                      ? "bg-rose-500 text-white font-semibold"
                      : "bg-stone-100 dark:bg-rose-950/60 text-stone-700 dark:text-rose-200"
                  }`}
                >
                  Hitung h (Elipsoid)
                </button>
                <button
                  onClick={() => setGeoidMode("calc_N")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                    geoidMode === "calc_N"
                      ? "bg-rose-500 text-white font-semibold"
                      : "bg-stone-100 dark:bg-rose-950/60 text-stone-700 dark:text-rose-200"
                  }`}
                >
                  Hitung N (Undulasi)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {geoidMode !== "calc_h" && (
                  <div>
                    <label className="text-[11px] text-stone-500 dark:text-rose-300/70 block mb-1">
                      Tinggi Elipsoid h (meter):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={valH_ellipsoid}
                      onChange={(e) => setValH_ellipsoid(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono"
                    />
                  </div>
                )}
                {geoidMode !== "calc_H" && (
                  <div>
                    <label className="text-[11px] text-stone-500 dark:text-rose-300/70 block mb-1">
                      Tinggi Ortometrik H (meter):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={valH_orthometric}
                      onChange={(e) => setValH_orthometric(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono"
                    />
                  </div>
                )}
                {geoidMode !== "calc_N" && (
                  <div>
                    <label className="text-[11px] text-stone-500 dark:text-rose-300/70 block mb-1">
                      Undulasi Geoid N (meter):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={valN_undulation}
                      onChange={(e) => setValN_undulation(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-rose-100/70 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 font-mono text-xs">
                <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Hasil Perhitungan:</span>
                <span className="text-xl font-bold">
                  {geoidMode === "calc_H" && `H = ${(hEll - nUnd).toFixed(3)} meter (Ortometrik)`}
                  {geoidMode === "calc_h" && `h = ${(hOrt + nUnd).toFixed(3)} meter (Elipsoid)`}
                  {geoidMode === "calc_N" && `N = ${(hEll - hOrt).toFixed(3)} meter (Undulasi Geoid)`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. SURVEI TERESTRIS */}
        {activeCategory === "terestris" && (
          <div className="space-y-6">
            {/* Sub Nav */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-rose-200/80 dark:border-rose-900/50">
              {[
                { id: "polar", label: "Poligon (Polar Titik Baru)" },
                { id: "waterpass", label: "Sipat Datar (Waterpass)" },
                { id: "tacheometry", label: "Takimetri & Trigonometri" },
                { id: "slope", label: "Kemiringan Lereng (Slope)" },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setTerestrisSub(sub.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-colors ${
                    terestrisSub === sub.id
                      ? "bg-rose-500 text-white font-semibold"
                      : "bg-white dark:bg-rose-950/40 text-stone-700 dark:text-rose-200 border border-rose-200/60 dark:border-rose-900/40"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub 1: Poligon Polar Titik Baru */}
            {terestrisSub === "polar" && (
              <div className="theme-card p-6 sm:p-8 rounded-3xl shadow-lg border border-rose-200/80 dark:border-rose-900/60 space-y-4">
                <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-300 font-mono">
                  Hitungan Koordinat Titik Baru (Metode Polar / Sudut Jurusan & Jarak)
                </h3>

                {/* Clean Math Formula Banner */}
                <div className="p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 text-xs font-mono text-stone-700 dark:text-rose-200 space-y-1.5">
                  <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-wider">
                    Rumus Matematis:
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm font-bold text-rose-600 dark:text-rose-300">
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                      X<sub>B</sub> = X<sub>A</sub> + d · sin(α)
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                      Y<sub>B</sub> = Y<sub>A</sub> + d · cos(α)
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-rose-300/80 pt-1">
                    di mana <span className="font-semibold text-rose-600 dark:text-rose-300">ΔX = d · sin(α)</span> dan <span className="font-semibold text-rose-600 dark:text-rose-300">ΔY = d · cos(α)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">X Titik Awal (m):</label>
                    <input
                      type="number"
                      step="0.001"
                      value={polarX0}
                      onChange={(e) => setPolarX0(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Y Titik Awal (m):</label>
                    <input
                      type="number"
                      step="0.001"
                      value={polarY0}
                      onChange={(e) => setPolarY0(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Jarak Datar d (m):</label>
                    <input
                      type="number"
                      step="0.001"
                      value={polarDist}
                      onChange={(e) => setPolarDist(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Azimuth α (° desimal):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={polarAzDeg}
                      onChange={(e) => setPolarAzDeg(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-rose-100/70 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Pergeseran Koordinat:</span>
                    <div>ΔX = {deltaX.toFixed(3)} m</div>
                    <div>ΔY = {deltaY.toFixed(3)} m</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Koordinat Titik Baru (B):</span>
                    <div className="text-base font-bold text-rose-950 dark:text-white">
                      X<sub>B</sub> = {newX} m
                    </div>
                    <div className="text-base font-bold text-rose-950 dark:text-white">
                      Y<sub>B</sub> = {newY} m
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub 2: Sipat Datar / Waterpass */}
            {terestrisSub === "waterpass" && (
              <div className="theme-card p-6 sm:p-8 rounded-3xl shadow-lg border border-rose-200/80 dark:border-rose-900/60 space-y-5">
                <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-300 font-mono">
                  Pengukuran Sipat Datar (Levelling / Waterpass)
                </h3>

                {/* Clean Math Formula Banner */}
                <div className="p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 text-xs font-mono text-stone-700 dark:text-rose-200 space-y-1.5">
                  <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-wider">
                    Rumus Matematis:
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-300">
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                      Δh = BT<sub>Belakang</sub> − BT<sub>Muka</sub>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                      H<sub>B</sub> = H<sub>A</sub> + Δh
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                      Kontrol: 2 · BT = BA + BB
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                      d = (BA − BB) × 100
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-500 dark:text-rose-300/70 block mb-1">
                    Tinggi Titik Awal / Benchmark H<sub>A</sub> (meter):
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={wpHa}
                    onChange={(e) => setWpHa(e.target.value)}
                    className="w-48 px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Rambu Belakang */}
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 space-y-2">
                    <span className="text-xs font-mono font-bold text-rose-500">Rambu Belakang (B)</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block">BA (m):</label>
                        <input
                          type="number"
                          step="0.001"
                          value={wpBaB}
                          onChange={(e) => setWpBaB(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block">BT (m):</label>
                        <input
                          type="number"
                          step="0.001"
                          value={wpBtB}
                          onChange={(e) => setWpBtB(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block">BB (m):</label>
                        <input
                          type="number"
                          step="0.001"
                          value={wpBbB}
                          onChange={(e) => setWpBbB(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-stone-500 dark:text-rose-300/80">
                      Jarak: {distBelakang.toFixed(1)} m | Kontrol:{" "}
                      <span className={isValidBelakang ? "text-emerald-500 font-semibold" : "text-amber-500"}>
                        {isValidBelakang ? "Valid (2BT = BA+BB)" : "Cek bacaan rambu"}
                      </span>
                    </div>
                  </div>

                  {/* Rambu Muka */}
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 space-y-2">
                    <span className="text-xs font-mono font-bold text-rose-500">Rambu Muka (M)</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block">BA (m):</label>
                        <input
                          type="number"
                          step="0.001"
                          value={wpBaM}
                          onChange={(e) => setWpBaM(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block">BT (m):</label>
                        <input
                          type="number"
                          step="0.001"
                          value={wpBtM}
                          onChange={(e) => setWpBtM(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block">BB (m):</label>
                        <input
                          type="number"
                          step="0.001"
                          value={wpBbM}
                          onChange={(e) => setWpBbM(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-stone-500 dark:text-rose-300/80">
                      Jarak: {distMuka.toFixed(1)} m | Kontrol:{" "}
                      <span className={isValidMuka ? "text-emerald-500 font-semibold" : "text-amber-500"}>
                        {isValidMuka ? "Valid (2BT = BA+BB)" : "Cek bacaan rambu"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-rose-100/70 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">
                      Beda Tinggi (Δh = BT<sub>B</sub> − BT<sub>M</sub>):
                    </span>
                    <div className="text-lg font-bold">
                      {deltaH_wp >= 0 ? `+${deltaH_wp.toFixed(3)}` : deltaH_wp.toFixed(3)} meter
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">
                      Tinggi Titik B (H<sub>B</sub> = H<sub>A</sub> + Δh):
                    </span>
                    <div className="text-xl font-bold text-rose-950 dark:text-white">
                      {newHb} meter
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub 3: Takimetri / Total Station */}
            {terestrisSub === "tacheometry" && (
              <div className="theme-card p-6 sm:p-8 rounded-3xl shadow-lg border border-rose-200/80 dark:border-rose-900/60 space-y-4">
                <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-300 font-mono">
                  Pengukuran Takimetri & Trigonometris (Total Station / Theodolite)
                </h3>

                {/* Clean Math Formula Banner */}
                <div className="p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 text-xs font-mono text-stone-700 dark:text-rose-200 space-y-1.5">
                  <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-wider">
                    Rumus Matematis:
                  </div>
                  {takiDistMode === "slope" ? (
                    <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-300">
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                        Jarak Datar: D = S · cos(V)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                        Beda Tinggi: Δh = S · sin(V) + Ti − Tp
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-300">
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                        D = 100 · (BA − BB) · cos²(V)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                        Δh = 50 · (BA − BB) · sin(2V) + Ti − Tp
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setTakiDistMode("slope")}
                    className={`px-3 py-1 rounded-xl text-xs font-mono ${
                      takiDistMode === "slope" ? "bg-rose-500 text-white" : "bg-stone-100 dark:bg-rose-950/60"
                    }`}
                  >
                    Jarak Miring Elektronik (EDM)
                  </button>
                  <button
                    onClick={() => setTakiDistMode("stadia")}
                    className={`px-3 py-1 rounded-xl text-xs font-mono ${
                      takiDistMode === "stadia" ? "bg-rose-500 text-white" : "bg-stone-100 dark:bg-rose-950/60"
                    }`}
                  >
                    Benang Stadia Optis (BA & BB)
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {takiDistMode === "slope" ? (
                    <div>
                      <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Jarak Miring S (m):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={takiSlopeDist}
                        onChange={(e) => setTakiSlopeDist(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Benang Atas BA (m):</label>
                        <input
                          type="number"
                          step="0.001"
                          value={takiBa}
                          onChange={(e) => setTakiBa(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Benang Bawah BB (m):</label>
                        <input
                          type="number"
                          step="0.001"
                          value={takiBb}
                          onChange={(e) => setTakiBb(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Sudut Vertikal V (°):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={takiVertDeg}
                      onChange={(e) => setTakiVertDeg(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Tinggi Alat Ti (m):</label>
                    <input
                      type="number"
                      step="0.001"
                      value={takiTi}
                      onChange={(e) => setTakiTi(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Tinggi Target/Prisma Tp (m):</label>
                    <input
                      type="number"
                      step="0.001"
                      value={takiTp}
                      onChange={(e) => setTakiTp(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-rose-100/70 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Jarak Datar (D):</span>
                    <div className="text-xl font-bold">{takiDatar.toFixed(3)} meter</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Beda Tinggi (Δh):</span>
                    <div className="text-xl font-bold">
                      {takiDeltaH >= 0 ? `+${takiDeltaH.toFixed(3)}` : takiDeltaH.toFixed(3)} meter
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub 4: Kemiringan Lereng / Slope */}
            {terestrisSub === "slope" && (
              <div className="theme-card p-6 sm:p-8 rounded-3xl shadow-lg border border-rose-200/80 dark:border-rose-900/60 space-y-4">
                <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-300 font-mono">
                  Hitung Kemiringan Lereng (Slope, Grade % & Derajat)
                </h3>

                {/* Clean Math Formula Banner */}
                <div className="p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 text-xs font-mono text-stone-700 dark:text-rose-200 space-y-1.5">
                  <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-wider">
                    Rumus Matematis:
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-300">
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                      Grade (%) = (<sup>Δh</sup>/<sub>D</sub>) × 100%
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                      Sudut (θ) = arctan(<sup>Δh</sup>/<sub>D</sub>)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                      Rasio = 1 : (<sup>D</sup>/<sub>Δh</sub>)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-stone-500 dark:text-rose-300/70 block mb-1">
                      Beda Tinggi Vertikal Δh (meter):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={slopeDeltaH}
                      onChange={(e) => setSlopeDeltaH(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 dark:text-rose-300/70 block mb-1">
                      Jarak Datar Horisontal D (meter):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={slopeDatar}
                      onChange={(e) => setSlopeDatar(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-rose-100/70 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Persentase Grade (%):</span>
                    <span className="text-xl font-bold">{slopePercent}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Sudut Kemiringan (°):</span>
                    <span className="text-xl font-bold">{slopeDegree}°</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Rasio Lereng (1 : n):</span>
                    <span className="text-xl font-bold">1 : {slopeRatio}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. JARAK & AZIMUTH GEODETIK */}
        {activeCategory === "azimuth" && (
          <div className="theme-card p-6 sm:p-8 rounded-3xl shadow-lg border border-rose-200/80 dark:border-rose-900/60 space-y-5">
            <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-300 font-mono">
              Hitungan Jarak & Sudut Jurusan (Azimuth) Geodetik
            </h3>

            {/* Clean Math Formula Banner */}
            <div className="p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 text-xs font-mono text-stone-700 dark:text-rose-200 space-y-1.5">
              <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-wider">
                Rumus Geodesi (Haversine & Forward Azimuth):
              </div>
              <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-300">
                <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                  a = sin²(<sup>Δφ</sup>/<sub>2</sub>) + cos(φ₁) · cos(φ₂) · sin²(<sup>Δλ</sup>/<sub>2</sub>)
                </span>
                <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                  c = 2 · atan2(√a, √(1−a))
                </span>
                <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                  d = R · c  (R = 6.371.000 m)
                </span>
              </div>
              <div className="text-[11px] text-stone-500 dark:text-rose-300/80 pt-1">
                Sudut Jurusan: <span className="font-semibold text-rose-600 dark:text-rose-300">α = atan2(sin Δλ · cos φ₂, cos φ₁ · sin φ₂ − sin φ₁ · cos φ₂ · cos Δλ)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Titik A */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 space-y-2">
                <span className="text-xs font-mono font-bold text-rose-500">Titik A (Awal)</span>
                <div>
                  <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block">Longitude / X (E):</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={ptA.x}
                    onChange={(e) => setPtA({ ...ptA, x: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block">Latitude / Y (S):</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={ptA.y}
                    onChange={(e) => setPtA({ ...ptA, y: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Titik B */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 space-y-2">
                <span className="text-xs font-mono font-bold text-rose-500">Titik B (Tujuan)</span>
                <div>
                  <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block">Longitude / X (E):</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={ptB.x}
                    onChange={(e) => setPtB({ ...ptB, x: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block">Latitude / Y (S):</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={ptB.y}
                    onChange={(e) => setPtB({ ...ptB, y: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-rose-100/70 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-800">
                <div className="text-[10px] font-mono text-rose-600 dark:text-rose-300 uppercase font-semibold">
                  Jarak Geodetik (Permukaan Bumi)
                </div>
                <div className="text-xl font-bold text-rose-900 dark:text-rose-100 font-mono mt-1">
                  {haversineDistMeters} meter
                </div>
                <div className="text-xs font-mono text-stone-600 dark:text-rose-300/80 mt-0.5">
                  ({haversineDistKm} kilometer)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-100/70 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-800">
                <div className="text-[10px] font-mono text-rose-600 dark:text-rose-300 uppercase font-semibold">
                  Sudut Jurusan (Azimuth A ➔ B)
                </div>
                <div className="text-xl font-bold text-rose-900 dark:text-rose-100 font-mono mt-1">
                  {azD}° {azM}&apos; {azS}&quot;
                </div>
                <div className="text-xs font-mono text-stone-600 dark:text-rose-300/80 mt-0.5">
                  Desimal: {azimuthDeg.toFixed(4)}°
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. LENGKUNG BUMI & SKALA PETA */}
        {activeCategory === "earth_scale" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lengkung Bumi */}
            <div className="theme-card p-6 rounded-3xl shadow-lg border border-rose-200/80 dark:border-rose-900/60 space-y-4">
              <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-300 font-mono">
                Koreksi Lengkung Bumi & Refraksi
              </h3>

              {/* Clean Math Formula Banner */}
              <div className="p-3 rounded-xl bg-rose-50/90 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 text-[11px] font-mono text-stone-700 dark:text-rose-200 space-y-1">
                <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-wider">
                  Rumus Matematis:
                </div>
                <div className="font-bold text-rose-700 dark:text-rose-300 text-sm">
                  C = 0.0675 × D²  (meter)
                </div>
                <div className="text-[10px] text-stone-500 dark:text-rose-300/70">
                  C = (1 − k) · (<sup>D²</sup>/<sub>2R</sub>)  dengan koefisien refraksi k = 0.13
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-500 dark:text-rose-300/70 block mb-1">
                  Jarak Bidik D (Kilometer):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 text-sm font-mono"
                />
              </div>
              <div className="p-4 rounded-2xl bg-rose-100/70 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 font-mono text-xs">
                <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Nilai Koreksi C:</span>
                <span className="text-2xl font-bold">{curvatureCorrectionM} meter</span>
              </div>
            </div>

            {/* Skala Peta */}
            <div className="theme-card p-6 rounded-3xl shadow-lg border border-rose-200/80 dark:border-rose-900/60 space-y-4">
              <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-300 font-mono">
                Kalkulator Skala Peta
              </h3>

              {/* Clean Math Formula Banner */}
              <div className="p-3 rounded-xl bg-rose-50/90 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 text-[11px] font-mono text-stone-700 dark:text-rose-200 space-y-1">
                <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-wider">
                  Rumus Matematis:
                </div>
                <div className="font-bold text-rose-700 dark:text-rose-300">
                  Jarak Sebenarnya = Jarak Peta (cm) × Penyebut Skala (n)
                </div>
                <div className="text-[10px] text-stone-500 dark:text-rose-300/70">
                  Skala = 1 : (<sup>Jarak Lapangan</sup>/<sub>Jarak Peta</sub>)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Jarak Peta (cm):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={mapDistanceCm}
                    onChange={(e) => setMapDistanceCm(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Skala 1 : n:</label>
                  <input
                    type="number"
                    step="1000"
                    value={scaleDenominator}
                    onChange={(e) => setScaleDenominator(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                  />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-rose-100/70 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 font-mono text-xs">
                <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Jarak Lapangan:</span>
                <div className="text-2xl font-bold">{realDistanceM} m</div>
                <div className="text-[11px] text-stone-500 dark:text-rose-300/80">({realDistanceKm} km)</div>
              </div>
            </div>
          </div>
        )}

        {/* 6. FOTOGRAMETRI & DRONE UAV (GSD & CAKUPAN) */}
        {activeCategory === "photogrammetry" && (
          <div className="theme-card p-6 sm:p-8 rounded-3xl shadow-lg border border-rose-200/80 dark:border-rose-900/60 space-y-5">
            <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-300 font-mono flex items-center gap-2">
              <Camera className="w-4 h-4 text-rose-500" />
              <span>Fotogrametri Udara & Drone UAV (Ground Sampling Distance / GSD)</span>
            </h3>

            {/* Clean Math Formula Banner */}
            <div className="p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 text-xs font-mono text-stone-700 dark:text-rose-200 space-y-1.5">
              <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-wider">
                Rumus Matematis:
              </div>
              <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-300">
                <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                  GSD = (<sup>H × S<sub>w</sub></sup>/<sub>f × I<sub>w</sub></sub>) × 100  (cm/pixel)
                </span>
                <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                  Skala Foto = 1 : (<sup>H × 1000</sup>/<sub>f</sub>)
                </span>
                <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                  Cakupan = (<sup>S<sub>w</sub> × H</sup>/<sub>f</sub>) × (<sup>S<sub>h</sub> × H</sup>/<sub>f</sub>)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Tinggi Terbang H (m):</label>
                <input
                  type="number"
                  step="1"
                  value={droneH}
                  onChange={(e) => setDroneH(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Focal Length f (mm):</label>
                <input
                  type="number"
                  step="0.1"
                  value={focalLength}
                  onChange={(e) => setFocalLength(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Lebar Sensor Sw (mm):</label>
                <input
                  type="number"
                  step="0.1"
                  value={sensorWidth}
                  onChange={(e) => setSensorWidth(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-500 dark:text-rose-300/70 block mb-1">Resolusi Sensor (px):</label>
                <input
                  type="number"
                  step="1"
                  value={imageWidthPx}
                  onChange={(e) => setImageWidthPx(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-rose-100/70 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 font-mono text-xs">
              <div>
                <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">GSD (Ketelitian Spasial):</span>
                <span className="text-xl font-bold">{gsdH.toFixed(2)} cm/pixel</span>
              </div>
              <div>
                <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Skala Foto Udara:</span>
                <span className="text-xl font-bold">1 : {photoScaleDenom.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Cakupan per Frame:</span>
                <span className="text-base font-bold">{groundWidthM}m × {groundHeightM}m</span>
                <div className="text-[10px] text-stone-500 dark:text-rose-300/80">({groundAreaHa} Hektar)</div>
              </div>
            </div>
          </div>
        )}

        {/* 7. LUAS POLIGON TANAH (METODE SHOELACE KOORDINAT) */}
        {activeCategory === "area" && (
          <div className="theme-card p-6 sm:p-8 rounded-3xl shadow-lg border border-rose-200/80 dark:border-rose-900/60 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-300 font-mono">
                  Hitung Luas Bidang Tanah (Metode Koordinat Shoelace / Gauss)
                </h3>
                <p className="text-xs text-stone-500 dark:text-rose-300/80 font-light">
                  Masukkan koordinat titik batas berurutan mengelilingi bidang tanah.
                </p>
              </div>
              <button
                onClick={addPoint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-mono transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Titik</span>
              </button>
            </div>

            {/* Clean Math Formula Banner */}
            <div className="p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 text-xs font-mono text-stone-700 dark:text-rose-200 space-y-1.5">
              <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-wider">
                Rumus Matematis Shoelace (Gauss):
              </div>
              <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-300">
                <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                  Luas = ½ |∑ (X<sub>i</sub> · Y<sub>i+1</sub> − Y<sub>i</sub> · X<sub>i+1</sub>)|
                </span>
                <span className="px-2 py-0.5 rounded bg-white dark:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800">
                  Keliling = ∑ √((X<sub>i+1</sub> − X<sub>i</sub>)² + (Y<sub>i+1</sub> − Y<sub>i</sub>)²)
                </span>
              </div>
            </div>

            {/* Points Table */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {polyPoints.map((pt, idx) => (
                <div key={pt.id} className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-mono">
                  <span className="w-6 text-center font-bold text-rose-500">#{idx + 1}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-stone-400">X:</span>
                    <input
                      type="number"
                      step="0.01"
                      value={pt.x}
                      onChange={(e) => updatePoint(pt.id, "x", e.target.value)}
                      className="w-full px-2 py-1 rounded bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-stone-400">Y:</span>
                    <input
                      type="number"
                      step="0.01"
                      value={pt.y}
                      onChange={(e) => updatePoint(pt.id, "y", e.target.value)}
                      className="w-full px-2 py-1 rounded bg-white dark:bg-rose-950/60 border border-rose-200 text-xs font-mono"
                    />
                  </div>
                  {polyPoints.length > 3 && (
                    <button
                      onClick={() => removePoint(pt.id)}
                      className="p-1 text-stone-400 hover:text-rose-500 transition-colors"
                      title="Hapus titik"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-rose-100/70 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 font-mono text-xs">
              <div>
                <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Luas Bidang (m²):</span>
                <span className="text-xl font-bold">{shoelaceArea.toFixed(2)} m²</span>
              </div>
              <div>
                <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Luas Hektar (Ha):</span>
                <span className="text-xl font-bold">{(shoelaceArea / 10000).toFixed(4)} Ha</span>
              </div>
              <div>
                <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase block font-semibold">Keliling Batas:</span>
                <span className="text-xl font-bold">{polygonPerimeter.toFixed(2)} meter</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
