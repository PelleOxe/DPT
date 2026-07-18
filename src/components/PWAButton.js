/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
export const PWAButton = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  // Base classes for the distinctive tactical tactile look
  const baseClasses = "relative font-semibold select-none flex items-center justify-center gap-2 cursor-pointer transition-all duration-[80ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] " + "active:translate-y-[2px] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  // Different theme variants with high contrast and great shadows
  let variantClasses = "";
  if (variant === 'primary') {
    variantClasses = "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_3px_0_#4338ca] hover:shadow-[0_2px_0_#4338ca] active:shadow-none " + "px-5 py-2.5 rounded-xl text-sm border border-indigo-700/30";
  } else if (variant === 'accent') {
    variantClasses = "bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-[0_3px_0_#0f766e] hover:shadow-[0_2px_0_#0f766e] active:shadow-none " + "px-5 py-2.5 rounded-xl text-sm border border-teal-600/30";
  } else if (variant === 'secondary') {
    variantClasses = "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 " + "border border-slate-200 dark:border-slate-700 shadow-[0_3px_0_#cbd5e1] dark:shadow-[0_3px_0_#1e293b] " + "hover:shadow-[0_2px_0_#cbd5e1] dark:hover:shadow-[0_2px_0_#1e293b] active:shadow-none px-5 py-2.5 rounded-xl text-sm";
  } else if (variant === 'ghost') {
    variantClasses = "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-lg text-sm " + "active:bg-slate-200 dark:active:bg-slate-700 active:shadow-none";
  } else if (variant === 'icon') {
    variantClasses = "p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 " + "border border-slate-200 dark:border-slate-700/60 shadow-[0_2px_0_#cbd5e1] dark:shadow-[0_2px_0_#1e293b] " + "active:shadow-none bg-white dark:bg-slate-800";
  }
  return /*#__PURE__*/_jsx("button", {
    className: `${baseClasses} ${variantClasses} ${className}`,
    ...props,
    children: children
  });
};