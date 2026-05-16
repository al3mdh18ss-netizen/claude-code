import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, Globe } from 'lucide-react';

interface TimeZone {
  name: string;
  offset: number;
  flag: string;
  city: string;
}

const DigitalClock: React.FC = () => {
  const [localTime, setLocalTime] = useState<string>('');
  const [localDate, setLocalDate] = useState<string>('');
  const [is24Hour, setIs24Hour] = useState<boolean>(false);
  const [copiedZone, setCopiedZone] = useState<string | null>(null);

  const timeZones: TimeZone[] = [
    { name: 'New York', offset: -5, flag: '🇺🇸', city: 'EST' },
    { name: 'Los Angeles', offset: -8, flag: '🇺🇸', city: 'PST' },
    { name: 'London', offset: 0, flag: '🇬🇧', city: 'GMT' },
    { name: 'Paris', offset: 1, flag: '🇫🇷', city: 'CET' },
    { name: 'Moscow', offset: 3, flag: '🇷🇺', city: 'MSK' },
    { name: 'Dubai', offset: 4, flag: '🇦🇪', city: 'GST' },
    { name: 'Mumbai', offset: 5.5, flag: '🇮🇳', city: 'IST' },
    { name: 'Singapore', offset: 8, flag: '🇸🇬', city: 'SGT' },
    { name: 'Hong Kong', offset: 8, flag: '🇭🇰', city: 'HKT' },
    { name: 'Tokyo', offset: 9, flag: '🇯🇵', city: 'JST' },
    { name: 'Sydney', offset: 10, flag: '🇦🇺', city: 'AEST' },
    { name: 'São Paulo', offset: -3, flag: '🇧🇷', city: 'BRT' },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Format local time
      const hours = is24Hour ? now.getHours() : now.getHours() % 12 || 12;
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = !is24Hour ? (now.getHours() >= 12 ? 'PM' : 'AM') : '';

      const timeString = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}${ampm ? ' ' + ampm : ''}`;
      setLocalTime(timeString);

      // Format date
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const dateString = now.toLocaleDateString('en-US', options);
      setLocalDate(dateString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [is24Hour]);

  const getTimeInZone = (offsetHours: number): string => {
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const zoneTime = new Date(utcTime + offsetHours * 60 * 60 * 1000);

    const hours = is24Hour ? zoneTime.getHours() : zoneTime.getHours() % 12 || 12;
    const minutes = String(zoneTime.getMinutes()).padStart(2, '0');
    const seconds = String(zoneTime.getSeconds()).padStart(2, '0');
    const ampm = !is24Hour ? (zoneTime.getHours() >= 12 ? 'PM' : 'AM') : '';

    return `${String(hours).padStart(2, '0')}:${minutes}:${seconds}${ampm ? ' ' + ampm : ''}`;
  };

  const copyToClipboard = (zone: TimeZone) => {
    const time = getTimeInZone(zone.offset);
    navigator.clipboard.writeText(time);
    setCopiedZone(zone.name);
    setTimeout(() => setCopiedZone(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-white" size={32} />
            <h1 className="text-4xl font-bold text-white">World Digital Clock</h1>
          </div>
          <p className="text-blue-100 text-lg">Check the current time across 12 major time zones</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Local Time Display */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-2xl p-8 text-center">
            <h2 className="text-blue-100 text-lg mb-2">YOUR LOCAL TIME</h2>
            <div className="text-6xl font-bold text-white font-mono mb-3">{localTime}</div>
            <div className="text-blue-100 text-lg">{localDate}</div>
          </div>
        </div>

        {/* Format Toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIs24Hour(!is24Hour)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
          >
            {is24Hour ? 'Switch to 12-Hour' : 'Switch to 24-Hour'}
          </button>
        </div>

        {/* Time Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timeZones.map((zone) => (
            <div
              key={zone.name}
              onClick={() => copyToClipboard(zone)}
              className="bg-slate-700 hover:bg-slate-600 rounded-lg shadow-lg p-6 cursor-pointer transition-all duration-200 transform hover:scale-105 border border-slate-600 hover:border-blue-500"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{zone.flag}</span>
                  <div>
                    <h3 className="text-white font-bold text-lg">{zone.name}</h3>
                    <p className="text-slate-400 text-sm">UTC{zone.offset > 0 ? '+' : ''}{zone.offset}</p>
                  </div>
                </div>
                {copiedZone === zone.name ? (
                  <CheckCircle className="text-green-400" size={24} />
                ) : (
                  <Copy className="text-slate-400 hover:text-blue-400" size={24} />
                )}
              </div>

              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-4xl font-mono text-blue-400 font-bold text-center mb-2">
                  {getTimeInZone(zone.offset)}
                </div>
                <div className="text-slate-400 text-sm text-center">{zone.city}</div>
              </div>

              {copiedZone === zone.name && (
                <div className="mt-3 text-green-400 text-sm text-center font-medium">
                  ✓ Copied to clipboard
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-slate-700 rounded-lg p-6 border border-slate-600">
          <h3 className="text-white font-bold text-lg mb-3">💡 How to Use</h3>
          <ul className="text-slate-300 space-y-2">
            <li>✓ Click any time zone card to copy the time to your clipboard</li>
            <li>✓ Use the format toggle button to switch between 12-hour and 24-hour formats</li>
            <li>✓ Times update automatically every second</li>
            <li>✓ All times are calculated in real-time from your system clock</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-800 border-t border-slate-700 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p>🌍 World Digital Clock | Real-time Time Zone Converter</p>
          <p className="text-sm mt-2">All times synchronized with your system clock</p>
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;
