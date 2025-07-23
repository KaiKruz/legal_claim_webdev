import React, { useState, useEffect } from 'react';
import { formatTime } from '../utils/helpers';

const Clock = ({ className = '', showSeconds = true, showDate = false }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTimeString = (date) => {
    if (showSeconds) {
      return formatTime(date);
    }
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateString = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg border">
        <span className="text-primary-600 mr-2">🕒</span>
        <div className="text-right">
          <div className="font-mono text-gray-700 font-semibold text-sm">
            {formatTimeString(currentTime)}
          </div>
          {showDate && (
            <div className="text-xs text-gray-500 font-medium">
              {formatDateString(currentTime)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clock;