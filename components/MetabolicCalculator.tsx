'use client';

import React, { useState } from 'react';

export default function MetabolicCalculator() {
  const [weightLbs, setWeightLbs] = useState<number>(180);
  const [bodyFat, setBodyFat] = useState<number>(15);
  const [activity, setActivity] = useState<number>(1.55);
  const [goal, setGoal] = useState<number>(1); // 1 = Maintain, 1.1 = Bulk, 0.8 = Cut

  // The Katch-McArdle Math
  const weightKg = weightLbs / 2.20462;
  const lbm = weightKg * (1 - bodyFat / 100);
  const bmr = 370 + 21.6 * lbm;
  const tdee = bmr * activity;
  const targetCalories = tdee * goal;

  // Base AI Macro Heuristics
  const protein = weightLbs * 1.1; // 1.1g per lb
  const fats = weightLbs * 0.4;    // 0.4g per lb
  const carbs = Math.max(0, (targetCalories - (protein * 4 + fats * 9)) / 4);

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-2xl w-full max-w-3xl mx-auto my-12 font-sans">
      <div className="mb-6 border-b border-[#30363d] pb-4">
        <h3 className="text-white text-xl font-bold tracking-tight mb-1">Metabolic Target Engine</h3>
        <p className="text-[#8b949e] text-xs font-mono uppercase tracking-widest">Katch-McArdle Analytical Model</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-white block mb-2">Weight: {weightLbs} lbs</label>
            <input type="range" min="100" max="350" value={weightLbs} onChange={(e) => setWeightLbs(Number(e.target.value))} className="w-full accent-[#238636]" />
          </div>
          <div>
            <label className="text-sm font-semibold text-white block mb-2">Body Fat: {bodyFat}%</label>
            <input type="range" min="5" max="40" value={bodyFat} onChange={(e) => setBodyFat(Number(e.target.value))} className="w-full accent-[#238636]" />
          </div>
          <div>
            <label className="text-sm font-semibold text-white block mb-2">Activity Multiplier</label>
            <select value={activity} onChange={(e) => setActivity(Number(e.target.value))} className="w-full bg-[#0d1117] border border-[#30363d] text-sm text-[#c9d1d9] p-2.5 rounded-md focus:outline-none focus:border-[#58a6ff]">
              <option value={1.2}>Sedentary (1.2)</option>
              <option value={1.375}>Lightly Active (1.375)</option>
              <option value={1.55}>Moderately Active (1.55)</option>
              <option value={1.725}>Very Active (1.725)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-white block mb-2">Phase Goal</label>
            <select value={goal} onChange={(e) => setGoal(Number(e.target.value))} className="w-full bg-[#0d1117] border border-[#30363d] text-sm text-[#c9d1d9] p-2.5 rounded-md focus:outline-none focus:border-[#238636]">
              <option value={0.8}>Aggressive Cut (80%)</option>
              <option value={0.9}>Mild Cut (90%)</option>
              <option value={1.0}>Maintenance (100%)</option>
              <option value={1.1}>Lean Bulk (110%)</option>
            </select>
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6 flex flex-col justify-center space-y-4">
          <div className="flex justify-between items-center border-b border-[#30363d] pb-2">
            <span className="text-xs font-mono text-[#8b949e]">BMR (Basal Rate)</span>
            <span className="font-bold text-white">{Math.round(bmr)} kcal</span>
          </div>
          <div className="flex justify-between items-center border-b border-[#30363d] pb-2">
            <span className="text-xs font-mono text-[#8b949e]">TDEE (Expenditure)</span>
            <span className="font-bold text-white">{Math.round(tdee)} kcal</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-mono text-[#238636] font-bold">TARGET INTAKE</span>
            <span className="text-2xl font-black text-white">{Math.round(targetCalories)} <span className="text-sm text-[#8b949e]">kcal</span></span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded p-2 text-center">
              <span className="block text-[10px] uppercase font-bold text-[#58a6ff]">Protein</span>
              <span className="block font-mono text-sm text-white">{Math.round(protein)}g</span>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded p-2 text-center">
              <span className="block text-[10px] uppercase font-bold text-[#d2a8ff]">Carbs</span>
              <span className="block font-mono text-sm text-white">{Math.round(carbs)}g</span>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded p-2 text-center">
              <span className="block text-[10px] uppercase font-bold text-[#e3b341]">Fats</span>
              <span className="block font-mono text-sm text-white">{Math.round(fats)}g</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}