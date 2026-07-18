/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { Wifi, Battery, Signal, RotateCcw, ShieldAlert, Laptop, Eye } from 'lucide-react';
import { PWAButton } from './PWAButton.js';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
export const DeviceFrame = ({
  device,
  isLandscape,
  scale,
  pwaTitle,
  pwaHtml,
  pwaUrl,
  mode
}) => {
  const [time, setTime] = useState('09:41');
  const [batteryLevel] = useState(88);
  const [iframeUrl, setIframeUrl] = useState('');
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const [autoScale, setAutoScale] = useState(1);

  // Update clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hrs}:${mins}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update iframe source
  useEffect(() => {
    if (mode === 'url') {
      setIframeUrl(pwaUrl);
    } else {
      // Create a Blob containing the HTML with viewport settings and local storage isolation support
      const blob = new Blob([pwaHtml], {
        type: 'text/html;charset=utf-8'
      });
      const url = URL.createObjectURL(blob);
      setIframeUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [pwaHtml, pwaUrl, mode]);

  // Handle auto-fit calculation
  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.parentElement?.clientWidth || 500;
      const parentHeight = 700; // standard container preview height limit

      const frameWidth = isLandscape ? device.height : device.width;
      const frameHeight = isLandscape ? device.width : device.height;
      const bezelOffset = device.bezelSize * 2;
      const totalW = frameWidth + bezelOffset;
      const totalH = frameHeight + bezelOffset;
      const scaleW = (parentWidth - 40) / totalW;
      const scaleH = (parentHeight - 40) / totalH;
      const bestScale = Math.min(scaleW, scaleH, 1); // clamp to max 100%

      setAutoScale(Number(bestScale.toFixed(2)));
    };
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [device, isLandscape]);

  // Reload iframe function
  const reloadViewport = () => {
    if (iframeRef.current) {
      // Force refreshing the iframe
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = currentSrc;
      }, 50);
    }
  };
  const activeScale = scale === 0 ? autoScale : scale;

  // Swapped sizes for landscape orientation
  const width = isLandscape ? device.height : device.width;
  const height = isLandscape ? device.width : device.height;

  // Bezel offset layout sizes
  const totalWidth = width + device.bezelSize * 2;
  const totalHeight = height + device.bezelSize * 2;
  return /*#__PURE__*/_jsxs("div", {
    className: "flex flex-col items-center justify-center w-full min-h-[500px] p-4 select-none",
    children: [/*#__PURE__*/_jsx("div", {
      ref: containerRef,
      className: "relative transition-all duration-300 ease-out origin-center flex flex-col items-center",
      style: {
        transform: `scale(${activeScale})`,
        width: totalWidth,
        height: totalHeight,
        margin: `${(activeScale - 1) * totalHeight / 2}px 0` // adjust margin so scaled device sits nicely
      },
      children: /*#__PURE__*/_jsx("div", {
        className: `absolute inset-0 bg-slate-900 dark:bg-slate-950 border-[3px] border-slate-700/80 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden ${device.borderRadius}`,
        style: {
          padding: `${device.bezelSize}px`
        },
        children: /*#__PURE__*/_jsxs("div", {
          className: "relative w-full h-full bg-slate-100 dark:bg-zinc-900 overflow-hidden rounded-[inherit] flex flex-col",
          children: [device.statusBarHeight > 0 && /*#__PURE__*/_jsx("div", {
            className: `w-full flex items-center justify-between px-6 text-xs select-none z-30 ${device.os === 'ios' ? 'font-sans font-medium text-slate-800 dark:text-slate-100' : 'font-sans text-slate-700 dark:text-slate-300'}`,
            style: {
              height: `${device.statusBarHeight}px`,
              paddingTop: device.notchType === 'island' && !isLandscape ? '12px' : '0px'
            },
            children: device.os === 'ios' ? /*#__PURE__*/_jsxs(_Fragment, {
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-xs font-semibold tracking-tight",
                children: time
              }), device.notchType === 'notch' && !isLandscape && /*#__PURE__*/_jsxs("div", {
                className: "absolute top-0 left-1/2 -translate-x-1/2 bg-black h-[28px] w-[140px] rounded-b-[20px] z-40 flex items-center justify-center",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "w-12 h-1 bg-zinc-800 rounded-full mb-1"
                }), /*#__PURE__*/_jsx("div", {
                  className: "w-2.5 h-2.5 bg-indigo-950 rounded-full border border-indigo-900/40 ml-2"
                })]
              }), device.notchType === 'island' && !isLandscape && /*#__PURE__*/_jsxs("div", {
                className: "absolute top-2 left-1/2 -translate-x-1/2 bg-black h-[25px] w-[110px] rounded-full z-40 flex items-center justify-between px-3",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "w-1.5 h-1.5 bg-zinc-950 rounded-full border border-zinc-900"
                }), /*#__PURE__*/_jsx("div", {
                  className: "w-3.5 h-1.5 bg-indigo-950 rounded-full border border-indigo-900/60"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1.5",
                children: [/*#__PURE__*/_jsx(Signal, {
                  className: "w-3.5 h-3.5 stroke-[2]"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-[10px] font-bold",
                  children: "5G"
                }), /*#__PURE__*/_jsx(Wifi, {
                  className: "w-3.5 h-3.5 stroke-[2]"
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-0.5",
                  children: [/*#__PURE__*/_jsxs("span", {
                    className: "text-[10px] font-semibold",
                    children: [batteryLevel, "%"]
                  }), /*#__PURE__*/_jsx(Battery, {
                    className: "w-4 h-4 stroke-[2]"
                  })]
                })]
              })]
            }) :
            /*#__PURE__*/
            /* Android Layout: Notifications Left, Time + Icons Right */
            _jsxs(_Fragment, {
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-[10px] font-bold tracking-tight",
                  children: time
                }), device.notchType === 'punch-hole' && !isLandscape && /*#__PURE__*/_jsx("div", {
                  className: "absolute top-2.5 left-1/2 -translate-x-1/2 bg-black w-3.5 h-3.5 rounded-full z-40"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1.5",
                children: [/*#__PURE__*/_jsx(Signal, {
                  className: "w-3.5 h-3.5 stroke-[2]"
                }), /*#__PURE__*/_jsx(Wifi, {
                  className: "w-3.5 h-3.5 stroke-[2]"
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-1",
                  children: [/*#__PURE__*/_jsxs("span", {
                    className: "text-[10px] font-bold",
                    children: [batteryLevel, "%"]
                  }), /*#__PURE__*/_jsx(Battery, {
                    className: "w-4 h-4 stroke-[1.5] rotate-0"
                  })]
                })]
              })]
            })
          }), device.notchType === 'punch-hole' && isLandscape && /*#__PURE__*/_jsx("div", {
            className: "absolute left-3.5 top-1/2 -translate-y-1/2 bg-black w-3.5 h-3.5 rounded-full z-40"
          }), device.notchType === 'home-button' && /*#__PURE__*/_jsx("div", {
            className: "absolute top-0 left-0 right-0 h-[40px] bg-slate-900 dark:bg-slate-950 z-30 flex items-center justify-center",
            children: /*#__PURE__*/_jsx("div", {
              className: "w-16 h-1 bg-zinc-800 rounded-full"
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex-1 w-full h-full relative bg-white dark:bg-black overflow-hidden",
            children: [iframeUrl ? /*#__PURE__*/_jsx("iframe", {
              ref: iframeRef,
              src: iframeUrl,
              title: pwaTitle,
              className: "w-full h-full border-none select-none",
              sandbox: "allow-scripts allow-same-origin allow-forms allow-popups",
              referrerPolicy: "no-referrer"
            }) : /*#__PURE__*/_jsxs("div", {
              className: "w-full h-full flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-center",
              children: [/*#__PURE__*/_jsx(Laptop, {
                className: "w-12 h-12 text-slate-400 mb-3 animate-pulse"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-slate-600 dark:text-slate-400 font-medium",
                children: "Ingen PWA inl\xE4st"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-slate-400 mt-1",
                children: "L\xE4s in en inbyggd demo eller sl\xE4pp en HTML-fil f\xF6r att starta."
              })]
            }), mode === 'url' && /*#__PURE__*/_jsxs("div", {
              className: "absolute bottom-2 left-2 right-2 bg-amber-500/90 backdrop-blur-sm border border-amber-400 text-slate-950 text-[10px] p-2 rounded-lg font-medium leading-normal flex gap-2 shadow-md z-40",
              children: [/*#__PURE__*/_jsx(ShieldAlert, {
                className: "w-4 h-4 shrink-0 mt-0.5 text-slate-950"
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("span", {
                  className: "font-bold",
                  children: "Notera:"
                }), " Vissa externa l\xE4nkar kan blockeras av webbl\xE4sarens s\xE4kerhet (CORS/X-Frame-Options). F\xF6r b\xE4st resultat, testa med de inbyggda demo-apparna eller ladda upp en HTML-fil."]
              })]
            })]
          }), device.homeBarHeight > 0 && /*#__PURE__*/_jsx("div", {
            className: "w-full flex items-center justify-center relative z-30 bg-transparent",
            style: {
              height: `${device.homeBarHeight}px`
            },
            children: device.os === 'ios' ?
            /*#__PURE__*/
            /* iOS Home Indicator Bar */
            _jsx("div", {
              className: "w-[120px] h-1 bg-slate-800 dark:bg-slate-300 rounded-full mb-1"
            }) :
            /*#__PURE__*/
            /* Android Navigation Bar Buttons */
            _jsxs("div", {
              className: "w-full flex items-center justify-around px-12 text-slate-400",
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-3.5 h-3.5 border-2 border-slate-500 dark:border-slate-400 rounded-sm"
              }), /*#__PURE__*/_jsx("div", {
                className: "w-3.5 h-3.5 border-2 border-slate-500 dark:border-slate-400 rounded-full"
              }), /*#__PURE__*/_jsx("div", {
                className: "w-3 h-3 border-l-2 border-b-2 border-slate-500 dark:border-slate-400 rotate-45 transform translate-x-0.5"
              })]
            })
          }), device.notchType === 'home-button' && /*#__PURE__*/_jsx("div", {
            className: "absolute bottom-0 left-0 right-0 h-[50px] bg-slate-900 dark:bg-slate-950 z-30 flex items-center justify-center",
            children: /*#__PURE__*/_jsx("button", {
              onClick: reloadViewport,
              className: "w-10 h-10 rounded-full border-[2.5px] border-zinc-700 dark:border-zinc-800 bg-transparent active:bg-zinc-800/50 flex items-center justify-center transition-all cursor-pointer",
              title: "Hemknapp - L\xE4s om sidan",
              children: /*#__PURE__*/_jsx("div", {
                className: "w-3.5 h-3.5 rounded-sm border border-zinc-600/40"
              })
            })
          })]
        })
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "mt-4 flex gap-2 z-20",
      children: [/*#__PURE__*/_jsxs(PWAButton, {
        variant: "secondary",
        onClick: reloadViewport,
        className: "py-1.5 px-3 text-xs flex items-center gap-1",
        children: [/*#__PURE__*/_jsx(RotateCcw, {
          className: "w-3.5 h-3.5"
        }), "Uppdatera vy"]
      }), /*#__PURE__*/_jsxs("div", {
        className: "bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-slate-600 dark:text-slate-300",
        children: [/*#__PURE__*/_jsx(Eye, {
          className: "w-3.5 h-3.5 text-indigo-500"
        }), /*#__PURE__*/_jsxs("span", {
          children: [isLandscape ? `${height}x${width}` : `${width}x${height}`, " px"]
        }), /*#__PURE__*/_jsx("span", {
          className: "opacity-40",
          children: "\u2022"
        }), /*#__PURE__*/_jsxs("span", {
          children: ["Skala: ", Math.round(activeScale * 100), "%"]
        })]
      })]
    })]
  });
};