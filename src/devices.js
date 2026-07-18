/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const DEVICES = [
// iOS Phones
{
  id: 'iphone-14-pro',
  name: 'iPhone 14 Pro',
  brand: 'Apple',
  width: 393,
  height: 852,
  type: 'phone',
  os: 'ios',
  notchType: 'island',
  bezelSize: 12,
  borderRadius: 'rounded-[48px]',
  statusBarHeight: 44,
  homeBarHeight: 18
}, {
  id: 'iphone-14-pro-max',
  name: 'iPhone 14 Pro Max',
  brand: 'Apple',
  width: 430,
  height: 932,
  type: 'phone',
  os: 'ios',
  notchType: 'island',
  bezelSize: 12,
  borderRadius: 'rounded-[50px]',
  statusBarHeight: 44,
  homeBarHeight: 18
}, {
  id: 'iphone-13-14',
  name: 'iPhone 13 / 14',
  brand: 'Apple',
  width: 390,
  height: 844,
  type: 'phone',
  os: 'ios',
  notchType: 'notch',
  bezelSize: 14,
  borderRadius: 'rounded-[44px]',
  statusBarHeight: 40,
  homeBarHeight: 18
}, {
  id: 'iphone-se',
  name: 'iPhone SE (Retro)',
  brand: 'Apple',
  width: 375,
  height: 667,
  type: 'phone',
  os: 'ios',
  notchType: 'home-button',
  bezelSize: 24,
  // thicker bezels on top and bottom
  borderRadius: 'rounded-[20px]',
  statusBarHeight: 20,
  homeBarHeight: 0 // uses physical home button
},
// Android Phones
{
  id: 'galaxy-s23',
  name: 'Galaxy S23',
  brand: 'Samsung',
  width: 360,
  height: 800,
  type: 'phone',
  os: 'android',
  notchType: 'punch-hole',
  bezelSize: 10,
  borderRadius: 'rounded-[32px]',
  statusBarHeight: 28,
  homeBarHeight: 16
}, {
  id: 'galaxy-s23-ultra',
  name: 'Galaxy S23 Ultra',
  brand: 'Samsung',
  width: 385,
  height: 860,
  type: 'phone',
  os: 'android',
  notchType: 'punch-hole',
  bezelSize: 8,
  borderRadius: 'rounded-[16px]',
  // sharp rectangular corners
  statusBarHeight: 28,
  homeBarHeight: 16
}, {
  id: 'pixel-7-pro',
  name: 'Pixel 7 Pro',
  brand: 'Google',
  width: 412,
  height: 892,
  type: 'phone',
  os: 'android',
  notchType: 'punch-hole',
  bezelSize: 10,
  borderRadius: 'rounded-[36px]',
  statusBarHeight: 30,
  homeBarHeight: 16
}, {
  id: 'oneplus-11',
  name: 'OnePlus 11',
  brand: 'OnePlus',
  width: 392,
  height: 851,
  type: 'phone',
  os: 'android',
  notchType: 'punch-hole',
  bezelSize: 9,
  borderRadius: 'rounded-[34px]',
  statusBarHeight: 28,
  homeBarHeight: 16
},
// iOS Tablets
{
  id: 'ipad-air-5',
  name: 'iPad Air 5',
  brand: 'Apple',
  width: 820,
  height: 1180,
  type: 'tablet',
  os: 'ios',
  notchType: 'none',
  bezelSize: 18,
  borderRadius: 'rounded-[24px]',
  statusBarHeight: 24,
  homeBarHeight: 14
}, {
  id: 'ipad-pro-12',
  name: 'iPad Pro 12.9"',
  brand: 'Apple',
  width: 1024,
  height: 1366,
  type: 'tablet',
  os: 'ios',
  notchType: 'none',
  bezelSize: 20,
  borderRadius: 'rounded-[28px]',
  statusBarHeight: 24,
  homeBarHeight: 14
}, {
  id: 'ipad-mini-6',
  name: 'iPad Mini 6',
  brand: 'Apple',
  width: 744,
  height: 1133,
  type: 'tablet',
  os: 'ios',
  notchType: 'none',
  bezelSize: 16,
  borderRadius: 'rounded-[22px]',
  statusBarHeight: 24,
  homeBarHeight: 14
},
// Android Tablets
{
  id: 'galaxy-tab-s9',
  name: 'Galaxy Tab S9',
  brand: 'Samsung',
  width: 800,
  height: 1280,
  type: 'tablet',
  os: 'android',
  notchType: 'none',
  bezelSize: 16,
  borderRadius: 'rounded-[24px]',
  statusBarHeight: 24,
  homeBarHeight: 14
}, {
  id: 'lenovo-tab-p11',
  name: 'Lenovo Tab P11 Pro',
  brand: 'Lenovo',
  width: 800,
  height: 1200,
  type: 'tablet',
  os: 'android',
  notchType: 'none',
  bezelSize: 14,
  borderRadius: 'rounded-[20px]',
  statusBarHeight: 24,
  homeBarHeight: 14
}, {
  id: 'pixel-tablet',
  name: 'Google Pixel Tablet',
  brand: 'Google',
  width: 800,
  height: 1280,
  type: 'tablet',
  os: 'android',
  notchType: 'none',
  bezelSize: 20,
  borderRadius: 'rounded-[30px]',
  statusBarHeight: 24,
  homeBarHeight: 14
}];