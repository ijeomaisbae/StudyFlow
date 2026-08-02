import React, { useState } from 'react';
import { ThemeConfig } from '../../types';

interface ThemePickerModalProps {
  isOpen: boolean;
  currentTheme: ThemeConfig;
  onClose: () => void;
  onApplyTheme: (theme: ThemeConfig) => void;
  onResetTheme: () => void;
}

const PRESET_THEMES: ThemeConfig[] = [
  {
    presetName: 'Default Soft Light',
    bgColor: '#f7f9fb',
    accentColor: '#4648d4',
    isDarkMode: false,
  },
  {
    presetName: 'Warm Parchment',
    bgColor: '#fbf9f4',
    accentColor: '#8a4b08',
    isDarkMode: false,
  },
  {
    presetName: 'Lavender Focus',
    bgColor: '#f6f5ff',
    accentColor: '#8127cf',
    isDarkMode: false,
  },
  {
    presetName: 'Emerald Calm',
    bgColor: '#f2fcf6',
    accentColor: '#006c49',
    isDarkMode: false,
  },
  {
    presetName: 'Sunset Rose',
    bgColor: '#fff5f7',
    accentColor: '#e11d48',
    isDarkMode: false,
  },
  {
    presetName: 'Midnight Dark',
    bgColor: '#0f172a',
    accentColor: '#6366f1',
    isDarkMode: true,
  },
  {
    presetName: 'Cyber Obsidian',
    bgColor: '#18181b',
    accentColor: '#a855f7',
    isDarkMode: true,
  },
];

const QUICK_BG_SWATCHES = [
  { name: 'Soft Gray', color: '#f7f9fb' },
  { name: 'Pure White', color: '#ffffff' },
  { name: 'Cream', color: '#fbf9f4' },
  { name: 'Mint', color: '#f0fdf4' },
  { name: 'Sky', color: '#f0f9ff' },
  { name: 'Peach', color: '#fff7ed' },
  { name: 'Dark Slate', color: '#0f172a' },
  { name: 'Deep Charcoal', color: '#18181b' },
  { name: 'Midnight Blue', color: '#090d16' },
];

const QUICK_ACCENT_SWATCHES = [
  { name: 'Royal Indigo', color: '#4648d4' },
  { name: 'Vibrant Purple', color: '#8127cf' },
  { name: 'Emerald', color: '#006c49' },
  { name: 'Rose', color: '#e11d48' },
  { name: 'Amber Gold', color: '#d97706' },
  { name: 'Teal', color: '#0d9488' },
  { name: 'Electric Cyan', color: '#06b6d4' },
];

export const ThemePickerModal: React.FC<ThemePickerModalProps> = ({
  isOpen,
  currentTheme,
  onClose,
  onApplyTheme,
  onResetTheme,
}) => {
  const [bgColor, setBgColor] = useState(currentTheme.bgColor);
  const [accentColor, setAccentColor] = useState(currentTheme.accentColor);
  const [presetName, setPresetName] = useState(currentTheme.presetName || 'Custom');

  if (!isOpen) return null;

  // Determine if chosen bg is dark
  const isDarkColor = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) return false;
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    // YIQ contrast formula
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq < 128;
  };

  const handleSelectPreset = (preset: ThemeConfig) => {
    setBgColor(preset.bgColor);
    setAccentColor(preset.accentColor);
    setPresetName(preset.presetName);
    onApplyTheme(preset);
  };

  const handleCustomBgChange = (newBg: string) => {
    setBgColor(newBg);
    setPresetName('Custom');
    onApplyTheme({
      bgColor: newBg,
      accentColor,
      presetName: 'Custom',
      isDarkMode: isDarkColor(newBg),
    });
  };

  const handleCustomAccentChange = (newAccent: string) => {
    setAccentColor(newAccent);
    setPresetName('Custom');
    onApplyTheme({
      bgColor,
      accentColor: newAccent,
      presetName: 'Custom',
      isDarkMode: isDarkColor(bgColor),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-card bg-white/95 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-white/80 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4648d4] text-xl">palette</span>
            <div>
              <h3 className="font-headline font-bold text-lg text-[#191c1e]">Theme & Background Picker</h3>
              <p className="text-xs text-[#767586]">Customize background color and accent colors live</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-[#767586] hover:text-[#191c1e] p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Live Preview Box */}
        <div 
          className="p-5 rounded-2xl border shadow-inner space-y-3 transition-colors duration-300"
          style={{ 
            backgroundColor: bgColor,
            borderColor: isDarkColor(bgColor) ? '#334155' : '#e2e8f0',
            color: isDarkColor(bgColor) ? '#f8fafc' : '#0f172a'
          }}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">
              Live Canvas Preview ({presetName})
            </span>
            <span 
              className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white"
              style={{ backgroundColor: accentColor }}
            >
              Accent Color
            </span>
          </div>

          <div 
            className="p-3.5 rounded-xl border backdrop-blur-sm"
            style={{ 
              backgroundColor: isDarkColor(bgColor) ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
              borderColor: isDarkColor(bgColor) ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'
            }}
          >
            <h4 className="font-headline font-bold text-sm">Study Dashboard Card Preview</h4>
            <p className="text-xs opacity-80 mt-1">
              Your entire app interface adapts instantly to this background and accent tone!
            </p>
            <button 
              className="mt-3 px-4 py-1.5 rounded-lg text-white font-bold text-xs shadow-sm cursor-pointer transition-transform active:scale-95"
              style={{ backgroundColor: accentColor }}
            >
              Sample Accent Button
            </button>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase text-[#767586] tracking-wider">
            Curated Themes
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {PRESET_THEMES.map((theme) => {
              const isSelected = presetName === theme.presetName && bgColor === theme.bgColor && accentColor === theme.accentColor;
              return (
                <button
                  key={theme.presetName}
                  onClick={() => handleSelectPreset(theme)}
                  className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-[#4648d4] border-transparent shadow-md scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div 
                    className="w-7 h-7 rounded-xl border shadow-sm flex items-center justify-center shrink-0"
                    style={{ backgroundColor: theme.bgColor }}
                  >
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-[#191c1e] truncate">{theme.presetName}</p>
                    <span className="text-[10px] text-[#767586] block">
                      {theme.isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Background Color Section */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase text-[#767586] tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#4648d4]">format_color_fill</span>
              <span>Custom Background Color</span>
            </label>

            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={bgColor} 
                onChange={(e) => handleCustomBgChange(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                title="Choose custom background color"
              />
              <span className="text-xs font-mono uppercase bg-slate-100 px-2 py-1 rounded-md text-[#191c1e] font-semibold">
                {bgColor}
              </span>
            </div>
          </div>

          {/* Quick Swatches for Background */}
          <div className="flex flex-wrap gap-2">
            {QUICK_BG_SWATCHES.map((swatch) => (
              <button
                key={swatch.name}
                onClick={() => handleCustomBgChange(swatch.color)}
                className={`w-7 h-7 rounded-full border shadow-sm transition-all cursor-pointer hover:scale-110 flex items-center justify-center ${
                  bgColor.toLowerCase() === swatch.color.toLowerCase() ? 'ring-2 ring-indigo-600 ring-offset-1 scale-110' : 'border-slate-300'
                }`}
                style={{ backgroundColor: swatch.color }}
                title={`${swatch.name} (${swatch.color})`}
              />
            ))}
          </div>
        </div>

        {/* Custom Accent Color Section */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase text-[#767586] tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#8127cf]">colorize</span>
              <span>Custom Accent & Button Color</span>
            </label>

            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={accentColor} 
                onChange={(e) => handleCustomAccentChange(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                title="Choose custom accent color"
              />
              <span className="text-xs font-mono uppercase bg-slate-100 px-2 py-1 rounded-md text-[#191c1e] font-semibold">
                {accentColor}
              </span>
            </div>
          </div>

          {/* Quick Swatches for Accent */}
          <div className="flex flex-wrap gap-2">
            {QUICK_ACCENT_SWATCHES.map((swatch) => (
              <button
                key={swatch.name}
                onClick={() => handleCustomAccentChange(swatch.color)}
                className={`w-7 h-7 rounded-full border shadow-sm transition-all cursor-pointer hover:scale-110 flex items-center justify-center ${
                  accentColor.toLowerCase() === swatch.color.toLowerCase() ? 'ring-2 ring-indigo-600 ring-offset-1 scale-110' : 'border-slate-300'
                }`}
                style={{ backgroundColor: swatch.color }}
                title={`${swatch.name} (${swatch.color})`}
              />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onResetTheme();
              setBgColor('#f7f9fb');
              setAccentColor('#4648d4');
              setPresetName('Default Soft Light');
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#767586] hover:text-[#191c1e] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Reset Default
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#4648d4] text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 hover:bg-[#6063ee] transition-all cursor-pointer"
          >
            Done & Save
          </button>
        </div>
      </div>
    </div>
  );
};
