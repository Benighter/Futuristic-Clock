import React, { useState, useEffect } from 'react';
import { Sun, Cloud, Droplets, Snowflake, Zap, Wind } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Slider } from './components/ui/slider';
import { Switch } from './components/ui/switch';

const themes = {
  default: {
    className: 'bg-gray-800 text-white',
    clockFace: 'stroke-white fill-gray-800',
    hourHand: 'stroke-white',
    minuteHand: 'stroke-white',
    secondHand: 'stroke-red-500',
    numbers: 'fill-white',
    animation: 'animate-pulse',
  },
  neon: {
    className: 'bg-black text-green-400 font-mono',
    clockFace: 'stroke-green-400 fill-black',
    hourHand: 'stroke-green-400',
    minuteHand: 'stroke-green-400',
    secondHand: 'stroke-pink-500',
    numbers: 'fill-green-400',
    animation: 'animate-neon',
  },
  sunset: {
    className: 'bg-gradient-to-br from-orange-500 to-pink-500 text-white',
    clockFace: 'stroke-white fill-orange-300',
    hourHand: 'stroke-red-800',
    minuteHand: 'stroke-red-800',
    secondHand: 'stroke-yellow-300',
    numbers: 'fill-red-800',
    animation: 'animate-sunset',
  },
  underwater: {
    className: 'bg-blue-900 text-cyan-300',
    clockFace: 'stroke-cyan-300 fill-blue-700',
    hourHand: 'stroke-cyan-300',
    minuteHand: 'stroke-cyan-300',
    secondHand: 'stroke-yellow-400',
    numbers: 'fill-cyan-300',
    animation: 'animate-underwater',
  },
  space: {
    className: 'bg-gray-900 text-purple-300',
    clockFace: 'stroke-purple-300 fill-transparent',
    hourHand: 'stroke-purple-300',
    minuteHand: 'stroke-purple-300',
    secondHand: 'stroke-yellow-300',
    numbers: 'fill-purple-300',
    animation: 'animate-space',
  },
};

const timeZones = [
  { name: 'Local Time', value: 'local' },
  { name: 'UTC', value: 'UTC' },
  { name: 'New York', value: 'America/New_York' },
  { name: 'London', value: 'Europe/London' },
  { name: 'Tokyo', value: 'Asia/Tokyo' },
  { name: 'Sydney', value: 'Australia/Sydney' },
];

const weatherIcons = {
  Clear: <Sun className="text-yellow-400" />,
  Clouds: <Cloud className="text-gray-400" />,
  Rain: <Droplets className="text-blue-400" />,
  Snow: <Snowflake className="text-white" />,
  Thunderstorm: <Zap className="text-yellow-500" />,
  Windy: <Wind className="text-blue-300" />,
};

const AdvancedClock = () => {
  const [time, setTime] = useState(new Date());
  const [theme, setTheme] = useState('default');
  const [timeZone, setTimeZone] = useState('local');
  const [isAnalog, setIsAnalog] = useState(false);
  const [is24Hour, setIs24Hour] = useState(true);
  const [showSeconds, setShowSeconds] = useState(true);
  const [fontSize, setFontSize] = useState(6);
  const [weather, setWeather] = useState({ temp: 20, condition: 'Clear' });

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date();
      setTime(newTime);
      updateWeather(newTime);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateWeather = (currentTime) => {
    const hour = currentTime.getHours();
    let baseTemp = 20 + Math.sin((hour - 6) * Math.PI / 12) * 5;
    const tempVariation = Math.random() * 4 - 2;
    const newTemp = Math.round(baseTemp + tempVariation);

    const conditions = ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm', 'Windy'];
    const newCondition = conditions[Math.floor(Math.random() * conditions.length)];

    if (currentTime.getMinutes() === 0) {
      setWeather({ temp: newTemp, condition: newCondition });
    }
  };

  const formatTime = (date) => {
    try {
      const options = { 
        hour: 'numeric', 
        minute: 'numeric',
        second: showSeconds ? 'numeric' : undefined,
        hour12: !is24Hour,
        timeZone: timeZone === 'local' ? undefined : timeZone,
      };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Error displaying time';
    }
  };

  const AnalogClock = () => {
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours() % 12;

    return (
      <svg className={`w-64 h-64 ${themes[theme].animation}`} viewBox="0 0 100 100">
        <circle className={`${themes[theme].clockFace} stroke-2`} cx="50" cy="50" r="45" />
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            className={`${themes[theme].hourHand} stroke-1`}
            x1="50"
            y1="10"
            x2="50"
            y2="15"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
        {[...Array(12)].map((_, i) => {
          const angle = (i * Math.PI) / 6 - Math.PI / 2;
          const x = 50 + 38 * Math.cos(angle);
          const y = 50 + 38 * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              className={`${themes[theme].numbers} text-xs font-medium`}
            >
              {i === 0 ? '12' : i}
            </text>
          );
        })}
        <line
          className={`${themes[theme].hourHand} stroke-2 origin-center`}
          x1="50"
          y1="50"
          x2="50"
          y2="30"
          style={{ transform: `rotate(${(hours + minutes / 60) * 30}deg)` }}
        />
        <line
          className={`${themes[theme].minuteHand} stroke-1 origin-center`}
          x1="50"
          y1="50"
          x2="50"
          y2="20"
          style={{ transform: `rotate(${minutes * 6}deg)` }}
        />
        <line
          className={`${themes[theme].secondHand} stroke-1 origin-center`}
          x1="50"
          y1="50"
          x2="50"
          y2="15"
          style={{ transform: `rotate(${seconds * 6}deg)`, transition: 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)' }}
        />
        <circle cx="50" cy="50" r="1.5" className={themes[theme].secondHand} />
      </svg>
    );
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-8 ${themes[theme].className} transition-all duration-1000`}>
      <style jsx global>{`
        @keyframes neon-glow {
          0%, 100% { text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00; }
          50% { text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00; }
        }
        @keyframes sunset-colors {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes underwater-bubbles {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes space-twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-neon {
          animation: neon-glow 2s ease-in-out infinite;
        }
        .animate-sunset {
          background-size: 200% 200%;
          animation: sunset-colors 10s ease infinite;
        }
        .animate-underwater {
          animation: underwater-bubbles 3s ease-in-out infinite;
        }
        .animate-space {
          animation: space-twinkle 2s ease-in-out infinite;
        }
      `}</style>
      <div className={`text-${fontSize}xl font-bold mb-4 transition-all duration-500 ${themes[theme].animation}`}>
        {isAnalog ? <AnalogClock /> : formatTime(time)}
      </div>
      <div className={`text-2xl mb-8 transition-all duration-500 ${themes[theme].animation}`}>
        {time.toLocaleDateString(undefined, { timeZone: timeZone === 'local' ? undefined : timeZone })}
      </div>
      <div className={`flex items-center mb-4 transition-all duration-500 ${themes[theme].animation}`}>
        {weatherIcons[weather.condition]}
        <span className="ml-2">{weather.temp}°C</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Select onValueChange={setTheme} defaultValue={theme}>
          <SelectTrigger className="w-[180px] bg-opacity-50 backdrop-blur-sm">
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(themes).map((themeName) => (
              <SelectItem key={themeName} value={themeName} className="flex items-center">
                <span className="ml-2">{themeName.charAt(0).toUpperCase() + themeName.slice(1)}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setTimeZone} defaultValue={timeZone}>
          <SelectTrigger className="w-[180px] bg-opacity-50 backdrop-blur-sm">
            <SelectValue placeholder="Select time zone" />
          </SelectTrigger>
          <SelectContent>
            {timeZones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>{tz.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <span>Analog Clock</span>
        <Switch checked={isAnalog} onCheckedChange={setIsAnalog} />
      </div>
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <span>24-hour format</span>
        <Switch checked={is24Hour} onCheckedChange={setIs24Hour} />
      </div>
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <span>Show seconds</span>
        <Switch checked={showSeconds} onCheckedChange={setShowSeconds} />
      </div>
      <div className="w-full max-w-md mb-8">
        <span>Font size</span>
        <Slider
          min={4}
          max={12}
          step={1}
          value={[fontSize]}
          onValueChange={([value]) => setFontSize(value)}
        />
      </div>
      {theme === 'neon' && (
        <div className="mt-8 text-sm animate-neon">
          Welcome to the digital frontier
        </div>
      )}
      {theme === 'sunset' && (
        <div className="mt-8 text-sm animate-sunset">
          Enjoy the warm glow of the setting sun
        </div>
      )}
      {theme === 'underwater' && (
        <div className="mt-8 text-sm animate-underwater">
          Dive into the depths of time
        </div>
      )}
      {theme === 'space' && (
        <div className="mt-8 text-sm animate-space">
          Explore the cosmos of possibilities
        </div>
      )}
    </div>
  );
};

export default AdvancedClock;