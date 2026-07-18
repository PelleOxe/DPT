/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Download, Share2, Globe, ExternalLink } from 'lucide-react';
import { PWAButton } from './PWAButton.js';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
export const ShareModal = ({
  isOpen,
  onClose,
  appUrl
}) => {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [customUrl, setCustomUrl] = useState(appUrl);
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Sync custom URL with appUrl when changed
  useEffect(() => {
    setCustomUrl(appUrl);
  }, [appUrl]);

  // Generate QR Code with Favicon in the center
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate standard QR code first
    QRCode.toCanvas(canvas, customUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        // deep slate (high contrast dark)
        light: '#ffffff' // pure white
      },
      errorCorrectionLevel: 'H' // High error correction to allow logo overlay
    }, error => {
      if (error) {
        console.error('Error generating QR code', error);
        return;
      }

      // Draw the custom favicon/logo in the middle
      const logoSize = 48;
      const x = (canvas.width - logoSize) / 2;
      const y = (canvas.height - logoSize) / 2;

      // Draw a rounded white background badge behind the logo for separation
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(x - 4, y - 4, logoSize + 8, logoSize + 8, 12);
      ctx.fill();

      // Draw a subtle border around the logo badge
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Create a beautiful SVG or data-URL logo representing our app
      // Since we want the favicon in the middle, we can draw a beautiful mini device preview icon!
      const logoImg = new Image();

      // Let's use a gorgeous inline SVG favicon as our logo
      const svgLogo = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
            <rect width="100" height="100" rx="22" fill="#4f46e5"/>
            <rect x="20" y="15" width="60" height="70" rx="10" fill="#0f172a" stroke="#ffffff" stroke-width="3"/>
            <circle cx="50" cy="74" r="5" fill="#ffffff"/>
            <rect x="35" y="25" width="30" height="4" rx="2" fill="#ffffff" opacity="0.3"/>
            <path d="M42 40 L58 40 M42 48 L58 48 M42 56 L50 56" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
          </svg>
        `;
      logoImg.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgLogo);
      logoImg.onload = () => {
        ctx.drawImage(logoImg, x, y, logoSize, logoSize);
        setLogoLoaded(true);
      };
    });
  }, [isOpen, customUrl]);
  if (!isOpen) return null;
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(customUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };
  const downloadQRCode = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'pwa-device-tester-qr.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };
  return /*#__PURE__*/_jsx("div", {
    className: "fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in",
    children: /*#__PURE__*/_jsxs("div", {
      className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100 max-h-[90vh]",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx(Share2, {
            className: "w-5 h-5 text-indigo-500"
          }), /*#__PURE__*/_jsx("h3", {
            className: "text-base font-extrabold tracking-tight",
            children: "Dela senast version"
          })]
        }), /*#__PURE__*/_jsx("button", {
          onClick: onClose,
          className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
          children: /*#__PURE__*/_jsx(X, {
            className: "w-5 h-5"
          })
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "p-6 flex-1 overflow-y-auto flex flex-col items-center",
        children: [/*#__PURE__*/_jsx("p", {
          className: "text-xs text-slate-500 dark:text-slate-400 text-center mb-5 font-medium leading-relaxed",
          children: "\xD6ppna och testa denna applikation eller din egna anpassade l\xE4nk direkt p\xE5 en handh\xE5llen enhet! Skanna QR-koden nedan."
        }), /*#__PURE__*/_jsxs("div", {
          className: "bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-inner flex flex-col items-center",
          children: [/*#__PURE__*/_jsx("canvas", {
            ref: canvasRef,
            width: 320,
            height: 320,
            className: "rounded-xl w-64 h-64 shadow-sm"
          }), /*#__PURE__*/_jsxs("div", {
            className: "mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-teal-600 dark:text-teal-400",
            children: [/*#__PURE__*/_jsx("span", {
              className: "w-2 h-2 rounded-full bg-teal-500 animate-pulse"
            }), "QR-kod med inb\xE4ddad favicon"]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "w-full mt-6 space-y-2",
          children: [/*#__PURE__*/_jsx("label", {
            className: "text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block",
            children: "L\xE4nk som delas (redigerbar):"
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex gap-2",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "relative flex-1",
              children: [/*#__PURE__*/_jsx(Globe, {
                className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              }), /*#__PURE__*/_jsx("input", {
                type: "text",
                value: customUrl,
                onChange: e => setCustomUrl(e.target.value),
                className: "w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 font-mono",
                placeholder: "https://..."
              })]
            }), /*#__PURE__*/_jsx(PWAButton, {
              variant: "secondary",
              onClick: copyToClipboard,
              className: "py-2 px-3 text-xs shrink-0",
              children: copied ? /*#__PURE__*/_jsx(Check, {
                className: "w-4 h-4 text-emerald-500"
              }) : /*#__PURE__*/_jsx(Copy, {
                className: "w-4 h-4"
              })
            })]
          })]
        }), /*#__PURE__*/_jsxs("a", {
          href: customUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "w-full mt-4 flex items-center justify-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline py-1",
          children: ["\xD6ppna l\xE4nk i ny flik ", /*#__PURE__*/_jsx(ExternalLink, {
            className: "w-3.5 h-3.5"
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/60 flex justify-end gap-2.5",
        children: [/*#__PURE__*/_jsx(PWAButton, {
          variant: "secondary",
          onClick: onClose,
          children: "St\xE4ng"
        }), /*#__PURE__*/_jsxs(PWAButton, {
          variant: "accent",
          onClick: downloadQRCode,
          children: [/*#__PURE__*/_jsx(Download, {
            className: "w-4 h-4"
          }), "Ladda ner bild"]
        })]
      })]
    })
  });
};