import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, Select, MenuItem } from '@mui/material';
import Hack from './assets/Artboard 1@2x.png';
import titleLogo from './assets/ICST-Logo-title.png';

// Function to generate time options for selectors
const generateTimeOptions = (limit) => {
  return Array.from({ length: limit }, (_, i) => i);
};

// TimeSelector component
const TimeSelector = ({ value, setValue, max }) => (
  <Select
    value={value}
    onChange={(e) => setValue(parseInt(e.target.value))}
    sx={{
      width: 100,
      m: 1,
      fontSize: '32px',
      '& .MuiSelect-select': {
        fontSize: '40px',
        fontWeight: 'bold',
        padding: '12px',
      },
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          fontSize: '30px',
        },
      },
    }}
  >
    {generateTimeOptions(max).map((val) => (
      <MenuItem key={val} value={val} sx={{ fontSize: '28px' }}>
        {val.toString().padStart(2, '0')}
      </MenuItem>
    ))}
  </Select>
);

// Format time to HH:MM:SS
const formatTotalTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  const pad = (val) => val.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const HackathonTimer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [ended, setEnded] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const timerRef = useRef(null);

  const setTotalTime = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total <= 0) {
      alert("Please set a valid time.");
      return;
    }
    setRemainingTime(total);
    setEnded(false);
    setShowForm(false);
  };

  useEffect(() => {
    if (running && remainingTime > 0) {
      timerRef.current = setTimeout(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    } else if (remainingTime === 0 && running) {
      setRunning(false);
      setEnded(true);
    }
    return () => clearTimeout(timerRef.current);
  }, [running, remainingTime]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <Box sx={{ height: '100vh', width: '100vw', overflow: 'hidden', m: 0, p: 0 }}>
      <Box sx={{ all: 'revert' }}>
        <Box
          sx={{
            height: '100%',
            width: '100%',
            backgroundColor: '#00000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(#ffffff)',
              backgroundSize: '350% 350%',
              animation: 'gradientBG 10s ease infinite',
              zIndex: 0,
            }}
          />

          <Box
            sx={{
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              width: '100%',
              height: '100%',
              padding: 2,
              boxSizing: 'border-box',
            }}
          >
            <Typography>
              <img src={titleLogo} alt="ICST Logo" style={{ height: '15vh', maxWidth: '90%' ,m:'0'}} />
            </Typography>

            <img src={Hack} alt="Hackathon Logo" style={{ height: '20vh', maxWidth: '100%', objectFit: 'contain' ,m:'0'}} />

            {showForm && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2,
                  backgroundColor: 'white',
                  padding: '10px',
                  borderRadius: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <TimeSelector value={hours} setValue={setHours} max={240} />
                <TimeSelector value={minutes} setValue={setMinutes} max={60} />
                <TimeSelector value={seconds} setValue={setSeconds} max={60} />
              </Box>
            )}

            <Typography
              variant="h2"
              sx={{
                
                fontWeight: 'bold',
                fontSize: '13rem',
                color: 'black',
                textShadow: '2px 2px 6px rgba(255,255,255,0.4)',
              }}
            >
              {ended ? 'Hackathon Over' : formatTotalTime(remainingTime)}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="info"
                sx={{ fontSize: '1rem', padding: '5px 10px', minWidth: '120px' }}
                onClick={() => {
                  setTotalTime();
                  setRunning(true);
                }}
              >
                Start
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ fontSize: '1rem', padding: '10px 20px', minWidth: '120px' }}
                onClick={() => setRunning(false)}
              >
                Pause
              </Button>
              <Button
                variant="contained"
                color="success"
                sx={{ fontSize: '1rem', padding: '10px 20px', minWidth: '120px' }}
                onClick={() => {
                  setRunning(false);
                  setRemainingTime(0);
                  setEnded(false);
                  setShowForm(true);
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>

          <style jsx="true">{`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }

            @keyframes scrollUp {
              0% { transform: translateY(100%); }
              100% { transform: translateY(0); }
            }

            @keyframes gradientBG {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }

            .scrolling-digit {
              animation: scrollUp 2s ease-in-out forwards;
              position: absolute;
            }
          `}</style>
        </Box>
      </Box>
    </Box>
  );
};

export default HackathonTimer;
