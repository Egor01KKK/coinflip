# Mobile Testing Guide - King of the Base

## Overview

This guide covers manual testing of "King of the Base" on mobile devices, specifically:
- **Base App** (Coinbase mobile mini-app platform)
- **Farcaster Frames** (Farcaster mobile app integration)

The application is optimized for mobile-first gameplay with MiniKit wallet integration and responsive pixel-art design.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Testing on Base App](#testing-on-base-app)
3. [Testing on Farcaster Frames](#testing-on-farcaster-frames)
4. [MiniKit Wallet Verification](#minikit-wallet-verification)
5. [Mobile UI/UX Testing](#mobile-uiux-testing)
6. [Performance Testing](#performance-testing)
7. [Troubleshooting](#troubleshooting)
8. [Acceptance Criteria](#acceptance-criteria)

---

## Prerequisites

### 1. Application Deployment

**Required:**
- ✅ Application deployed to Vercel or accessible via public URL
- ✅ Smart contract deployed on Base Sepolia (or Base Mainnet)
- ✅ Environment variables configured (CDP API Key, Paymaster URL, Contract Address)
- ✅ Paymaster policy active and configured

**Verification:**
```bash
# Check deployment URL is accessible
curl -I https://your-app.vercel.app

# Verify environment variables exist
grep NEXT_PUBLIC_ .env.local
```

### 2. Mobile Devices

**Recommended Test Devices:**
- iOS 15+ (iPhone SE, iPhone 12+, iPhone 13+, iPhone 14+)
- Android 10+ (Various screen sizes: 320px - 768px width)

**Browser Support:**
- Safari Mobile (iOS)
- Chrome Mobile (Android)
- In-app browsers (Base App, Farcaster, Warpcast)

### 3. Test Accounts

**Base App Testing:**
- Coinbase account (linked to Base App)
- Base Sepolia testnet ETH (not required for gasless transactions)
- Base App installed on iOS or Android

**Farcaster Testing:**
- Farcaster account (via Warpcast)
- Warpcast app installed on iOS or Android
- Farcaster Frame URL configured

### 4. Tools & Setup

```bash
# Generate test Frame URL (for Farcaster)
npx @farcaster/frame-sdk test-url https://your-app.vercel.app

# Tunnel for local testing (optional)
npx ngrok http 3000

# Mobile device inspector (optional)
npx weinre --boundHost -all- --httpPort 8080
```

---

## Testing on Base App

### What is Base App?

Base App is Coinbase's mobile platform for mini-applications (mini-apps) built on Base blockchain. It provides:
- Native wallet integration via MiniKit SDK
- Gasless transaction support via Coinbase Paymaster
- Mobile-optimized UX for web3 apps

### Installation & Access

1. **Download Base App**
   - iOS: [App Store Link](https://apps.apple.com/app/coinbase-wallet/id1278383455)
   - Android: [Play Store Link](https://play.google.com/store/apps/details?id=org.toshi)

2. **Open Your Mini-App in Base App**
   ```
   Option A: Deep link (if configured)
   base://mini-app?url=https://your-app.vercel.app

   Option B: QR Code
   1. Generate QR code with app URL
   2. Scan in Base App

   Option C: Direct URL
   1. Open Base App
   2. Navigate to "Apps" or "Discover"
   3. Enter your deployment URL
   ```

3. **Configure as Mini-App** (if needed)
   ```json
   // next.config.js - Add mini-app headers
   async headers() {
     return [
       {
         source: '/:path*',
         headers: [
           { key: 'X-Frame-Options', value: 'ALLOW-FROM https://base.org' },
           { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://base.org" }
         ]
       }
     ]
   }
   ```

### Test Scenarios for Base App

#### Test 1: MiniKit Initialization
**Objective:** Verify MiniKit SDK installs correctly on Base App

**Steps:**
1. Open app in Base App
2. Open browser DevTools (if available) or use remote debugging
3. Check console for MiniKit initialization message

**Expected Result:**
- No errors in console
- MiniKit.install() completes successfully
- App providers load without issues

**DevTools Check:**
```javascript
// In browser console (remote debugging)
window.MiniKit !== undefined
// Expected: true
```

---

#### Test 2: Wallet Auto-Connection
**Objective:** Verify wallet connects automatically in Base App context

**Steps:**
1. Open app in Base App (first time)
2. Observe wallet connection status
3. Check if user address is detected

**Expected Result:**
- Wallet connects automatically (no manual connect needed)
- User address displayed in UI (if applicable)
- OnchainKit components recognize Base App wallet

**Manual Verification:**
- Look for wallet address in app UI
- Verify no "Connect Wallet" prompt appears

---

#### Test 3: Responsive Layout (Mobile)
**Objective:** Verify UI fits mobile screen sizes in Base App

**Device Sizes to Test:**
- iPhone SE: 375x667 (small)
- iPhone 12/13: 390x844 (medium)
- iPhone 14 Pro Max: 430x932 (large)
- Android Small: 360x640
- Android Medium: 412x915

**Steps:**
1. Open app on each device size
2. Check all components are visible without horizontal scroll
3. Verify text is readable (minimum 8px font size)
4. Test touch targets (buttons at least 44x44px)

**Expected Result:**
- No horizontal scrolling required
- All text readable without zooming
- Buttons easily tappable (pixel-button classes work)
- Neon borders visible and crisp
- Press Start 2P font renders correctly

**Specific Checks:**
- [ ] Header title fits on one line or wraps gracefully
- [ ] Leaderboard (top 3) displays in row on mobile
- [ ] ThroneCard fits in viewport (no overflow)
- [ ] MessageInput is wide enough for 30 characters
- [ ] UsurpButton is full-width on mobile
- [ ] Protection timer is clearly visible
- [ ] ShareButton is accessible without scrolling

---

#### Test 4: Gasless Transaction in Base App
**Objective:** Verify Paymaster-sponsored transactions work via MiniKit

**Prerequisites:**
- Throne not protected (wait 3 seconds after last capture)
- Free attempts remaining (1-10)
- Valid message (0-30 characters)

**Steps:**
1. Enter a king message (e.g., "Base App Test")
2. Click "⚔️ USURP ⚔️" button
3. Observe transaction flow
4. Wait for confirmation

**Expected Result:**
- Transaction modal appears (OnchainKit TransactionStatus)
- **No gas fee prompt** (gasless via Paymaster)
- Transaction submits successfully
- Confirmation appears within 3-5 seconds
- ThroneCard updates with new king data
- Protection timer starts (3 second countdown)
- Free attempts counter decrements (e.g., 9/10)

**Error Scenarios:**
- If "Insufficient funds" appears → Paymaster NOT working
- If transaction fails → Check Paymaster policy allows contract
- If no response → Check network connectivity

**Verification:**
```javascript
// Check transaction was gasless
// In successful transaction, gas should be 0 or paid by Paymaster
// Look for "Sponsored" badge in transaction status
```

---

#### Test 5: Real-Time Updates on Mobile
**Objective:** Verify 2-second polling works on mobile network

**Steps:**
1. Open app in Base App
2. Have another user (or second device) capture the throne
3. Watch your device for updates

**Expected Result:**
- ThroneCard updates within 2 seconds
- New king's address appears
- New message displays
- Reign duration starts counting from 00:00
- Your device reflects the change without manual refresh

**Performance Check:**
- Updates arrive smoothly (no freezing)
- No excessive battery drain
- Network requests efficient (check DevTools Network tab)

---

#### Test 6: Protection Timer on Mobile
**Objective:** Verify 3-second protection countdown works on mobile

**Steps:**
1. Capture the throne (or wait for someone else to)
2. Observe protection timer component
3. Watch countdown: 3... 2... 1...
4. Try to click USURP during protection

**Expected Result:**
- ProtectionTimer component appears with shield icon 🛡️
- Countdown displays: "Protected: 3s" → "2s" → "1s"
- Progress bar animates (green → yellow → red)
- UsurpButton is DISABLED during countdown
- Disabled reason shows: "Throne protected for Xs"
- After 3 seconds, timer disappears
- UsurpButton becomes ENABLED
- Button color changes to active state (neon red)

---

#### Test 7: Farcaster Share from Base App
**Objective:** Verify share button opens Warpcast on mobile

**Steps:**
1. Capture the throne (become king)
2. Scroll to ShareButton
3. Click "📢 Challenge Friends" button
4. Observe what happens

**Expected Result:**
- New tab/window opens (or in-app browser)
- Warpcast compose URL loads: `https://warpcast.com/~/compose`
- Pre-filled text includes:
  - "👑 I just became King of the Base!"
  - "Reigned for Xs"
  - "Can you dethrone me?"
  - App URL embedded
- User can edit and cast
- Casting to Farcaster succeeds

**Mobile-Specific Behavior:**
- May open Warpcast app if installed
- Or opens mobile browser to warpcast.com
- Deep link handling should be smooth

---

#### Test 8: Daily Attempts Limit (localStorage)
**Objective:** Verify 10 daily attempts limit persists on mobile

**Steps:**
1. Open app in Base App
2. Check initial attempts (should be 10/10)
3. Capture throne successfully
4. Check attempts (should be 9/10)
5. Repeat 9 more times until 0/10
6. Try to capture when at 0/10
7. Close app and reopen
8. Check if attempts reset (only after 24 hours)

**Expected Result:**
- Attempts counter displays correctly (X/10)
- Decrements on each successful capture
- At 0/10, UsurpButton is DISABLED
- Disabled reason: "No free attempts remaining"
- Attempts persist in localStorage (survive app close/reopen)
- Attempts reset to 10/10 after 24 hours (next UTC day)

**localStorage Check** (via remote debugging):
```javascript
// Check localStorage
localStorage.getItem('kingOfTheBase_attempts_count')
// Expected: "10" → "9" → ... → "0"

localStorage.getItem('kingOfTheBase_attempts_date')
// Expected: "2026-01-23" (current UTC date)
```

---

#### Test 9: Touch Interactions
**Objective:** Verify all buttons and inputs work with touch

**Steps:**
1. Tap all buttons: USURP, Share, Leaderboard items
2. Tap input field (MessageInput)
3. Type on mobile keyboard
4. Tap outside to dismiss keyboard
5. Test rapid tapping (should not double-trigger)

**Expected Result:**
- All buttons respond to single tap
- Tap targets are large enough (44x44px minimum)
- No double-tap required
- Buttons show active/pressed state on touch
- Input field focuses on tap
- Mobile keyboard appears for text input
- No accidental taps on closely-spaced elements

**Accessibility:**
- Pixel borders provide clear tap boundaries
- Button labels are readable
- Sufficient spacing between interactive elements

---

#### Test 10: Network Interruption Handling
**Objective:** Verify app handles poor mobile network gracefully

**Steps:**
1. Open app with good connection
2. Enable Airplane mode on device
3. Try to capture throne
4. Re-enable connection
5. Observe recovery

**Expected Result:**
- During offline: Transaction fails gracefully
- Error message appears (TransactionStatus shows error)
- No app crash
- After reconnection: Polling resumes automatically
- Next capture attempt works
- UI updates normally

---

### Base App Acceptance Criteria

✅ **Pass if:**
- MiniKit initializes without errors
- Wallet connects automatically
- UI is fully responsive (320px - 768px)
- Gasless transactions work (Paymaster sponsors gas)
- Real-time updates arrive within 2 seconds
- Protection timer counts down correctly
- Share opens Warpcast with pre-filled text
- Daily attempts limit enforces correctly
- Touch interactions are smooth
- Network interruptions handled gracefully

❌ **Fail if:**
- MiniKit fails to install
- User must pay gas fees (Paymaster not working)
- UI has horizontal scroll on mobile
- Buttons too small to tap
- Polling doesn't work on mobile network
- Share button does nothing
- localStorage doesn't persist attempts

---

## Testing on Farcaster Frames

### What are Farcaster Frames?

Farcaster Frames are interactive mini-apps embedded in Farcaster casts (posts). They allow:
- Rich interactions within Warpcast feed
- Button-based UX (no full page navigation)
- Wallet integration via Farcaster identity
- Transactions signed by Farcaster app

**Key Difference from Base App:**
- Frames run in iframe within Warpcast app
- Limited screen space (smaller viewport)
- Button-based navigation (4 buttons max per frame)
- Must use Farcaster Frame protocol

### Frame Configuration

#### 1. Add Frame Metadata to `src/app/page.tsx`

```tsx
// src/app/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'King of the Base - Social Throne Game',
  description: 'Compete for the throne. One king, one throne. Last to claim rules.',

  // Farcaster Frame metadata
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://your-app.vercel.app/api/og',
    'fc:frame:button:1': 'Seize Throne ⚔️',
    'fc:frame:button:1:action': 'post',
    'fc:frame:button:1:target': 'https://your-app.vercel.app/api/frame/seize',
    'fc:frame:button:2': 'View King',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': 'https://your-app.vercel.app',
    'fc:frame:button:3': 'Share',
    'fc:frame:button:3:action': 'link',
    'fc:frame:button:3:target': 'https://warpcast.com/~/compose?text=Check%20out%20King%20of%20the%20Base',
  },
};
```

#### 2. Create Frame API Route (Optional - for embedded Frame experience)

```typescript
// src/app/api/frame/seize/route.ts
import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export async function POST(req: NextRequest) {
  // Parse Farcaster Frame message
  const body = await req.json();

  // Validate signature (Farcaster protocol)
  // ... validation logic ...

  // Return new frame state
  return new ImageResponse(
    (
      <div style={{ /* frame UI */ }}>
        Throne Seized! 👑
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

**Note:** Full Frame API implementation is out of scope for MVP. Testing focuses on mobile web experience accessed from Farcaster.

### Test Scenarios for Farcaster

#### Test 1: Share to Farcaster
**Objective:** Verify users can share to Farcaster from app

**Steps:**
1. Open app on mobile browser
2. Capture throne (become king)
3. Click "📢 Challenge Friends" button
4. Verify Warpcast opens

**Expected Result:**
- Warpcast compose page opens
- Pre-filled cast text includes:
  - "👑 I just became King of the Base!"
  - Reign time
  - App URL
- User can edit and publish cast
- Cast appears in Farcaster feed

---

#### Test 2: Access App from Farcaster Cast
**Objective:** Verify users can click link in cast to open app

**Steps:**
1. Create a cast with app URL
2. Publish to Farcaster
3. View cast on another device
4. Click app URL in cast
5. App opens in mobile browser (or in-app browser)

**Expected Result:**
- Cast displays correctly in Warpcast feed
- URL is clickable
- App opens in browser
- Full app functionality works
- Wallet connection works (via OnchainKit)

---

#### Test 3: In-App Browser Compatibility
**Objective:** Verify app works in Warpcast's in-app browser

**Steps:**
1. Open Warpcast app on mobile
2. Find a cast with app link
3. Click link (opens in-app browser)
4. Test full capture flow

**Expected Result:**
- App loads completely
- Styling renders correctly (pixel borders, neon colors)
- OnchainKit wallet connect works in iframe
- Transactions can be submitted
- No console errors
- No blocked features

**Common Issues:**
- Third-party cookies may be blocked
- localStorage might not work in iframe
- Wallet connect may require popup (could be blocked)

**Workaround:**
- Provide "Open in Browser" button if iframe issues occur
- Detect iframe and show warning: "For best experience, open in browser"

---

#### Test 4: Frame Image Preview (OG Image)
**Objective:** Verify cast preview image displays correctly

**Prerequisites:**
- OG image endpoint configured (`/api/og`)
- Frame metadata in page.tsx

**Steps:**
1. Share app URL to Farcaster
2. Before posting, observe preview
3. Post cast
4. View cast in feed

**Expected Result:**
- Preview image shows game branding
- Image dimensions correct (1200x630)
- Title: "King of the Base"
- Description visible
- Visual quality good (pixel art clear)

**Create OG Image Endpoint:**
```typescript
// src/app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: '#0a0a0a',
        color: '#00ff88',
        fontSize: 64,
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        👑 King of the Base
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

export const runtime = 'edge';
```

---

### Farcaster Acceptance Criteria

✅ **Pass if:**
- Share button opens Warpcast with pre-filled text
- App URL works when shared in casts
- App functions in Warpcast in-app browser
- OG image preview displays correctly
- Full wallet functionality works from Farcaster context

❌ **Fail if:**
- Share button doesn't open Warpcast
- App doesn't load from cast links
- Wallet connect fails in in-app browser
- Preview image missing or broken

---

## MiniKit Wallet Verification

### MiniKit SDK Integration Check

**File:** `src/app/providers.tsx`

**Verification:**
```tsx
// ✅ Correct implementation
'use client';
import { useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export function Providers({ children }) {
  useEffect(() => {
    MiniKit.install();
  }, []);

  return (
    // ... providers
  );
}
```

### Mobile DevTools Check

**Remote Debugging Setup:**

**iOS (Safari):**
1. On iPhone: Settings → Safari → Advanced → Web Inspector: ON
2. On Mac: Safari → Preferences → Advanced → Show Develop menu
3. Connect iPhone via USB
4. Open app in Safari on iPhone
5. On Mac: Develop → [Your iPhone] → [App Page]

**Android (Chrome):**
1. On Android: Settings → About Phone → Tap Build Number 7x (Developer Mode)
2. Settings → Developer Options → USB Debugging: ON
3. Connect Android via USB
4. On Computer: Chrome → More Tools → Remote Devices
5. Inspect app page

**Console Commands:**
```javascript
// Check MiniKit installed
console.log('MiniKit:', window.MiniKit);
// Expected: Object with install() method

// Check wallet connection
console.log('Wallet:', window.ethereum);
// Expected: Provider object (if connected)

// Check OnchainKit
console.log('OnchainKit loaded:', !!window.OnchainKitConfig);
// Expected: true
```

### Transaction Signing with MiniKit

**What to Verify:**
- Transactions use MiniKit's signing method
- User doesn't see MetaMask popup (MiniKit handles it)
- Signature flow is native to Base App

**Expected Flow:**
1. User clicks "⚔️ USURP ⚔️"
2. OnchainKit Transaction modal appears
3. MiniKit handles signing (invisible to user in Base App)
4. Transaction submits to Base Sepolia
5. Paymaster sponsors gas
6. Confirmation appears

**Not Expected:**
- MetaMask popup (should NOT appear in Base App)
- Manual gas approval (Paymaster covers it)
- Long wait times (should be < 5 seconds)

---

## Mobile UI/UX Testing

### Screen Size Testing Matrix

| Device | Width | Height | Breakpoint | Status |
|--------|-------|--------|------------|--------|
| iPhone SE | 375px | 667px | Base | ☐ Pass |
| iPhone 12/13 | 390px | 844px | Base | ☐ Pass |
| iPhone 14 Pro | 393px | 852px | Base | ☐ Pass |
| iPhone 14 Pro Max | 430px | 932px | Base | ☐ Pass |
| Galaxy S21 | 360px | 800px | Base | ☐ Pass |
| Pixel 5 | 393px | 851px | Base | ☐ Pass |
| iPad Mini | 768px | 1024px | md | ☐ Pass |
| Landscape (any) | Varies | N/A | N/A | ☐ Pass |

### Visual Checklist (Per Device)

#### Typography
- [ ] Press Start 2P font loads (not system font)
- [ ] Text readable at smallest size (8px minimum)
- [ ] No text cut off or hidden
- [ ] Line heights prevent overlap
- [ ] Character spacing comfortable

#### Layout
- [ ] No horizontal scrolling
- [ ] All components visible without vertical scroll (or appropriate scroll)
- [ ] Proper spacing between sections (16px - 24px)
- [ ] Margins consistent (px-4 on mobile)
- [ ] Safe area respected (bottom padding for iPhone notch)

#### Colors & Styling
- [ ] Neon green (#00ff88) visible and vibrant
- [ ] Gold (#ffd700) used for king/throne elements
- [ ] Red (#ff4444) for USURP button
- [ ] Dark background (#0a0a0a) renders correctly
- [ ] Pixel borders crisp (not blurry)
- [ ] Glow effects visible but not overwhelming
- [ ] High contrast for readability

#### Buttons
- [ ] Touch targets minimum 44x44px (iOS guideline)
- [ ] Buttons respond to single tap
- [ ] Active/pressed state visible
- [ ] Disabled state clearly distinguishable
- [ ] No accidental double-taps
- [ ] Sufficient spacing between buttons

#### Input Fields
- [ ] MessageInput tap-to-focus works
- [ ] Mobile keyboard appears
- [ ] Input visible above keyboard (not hidden)
- [ ] Character counter updates in real-time
- [ ] 30 character limit enforced
- [ ] Visual feedback at limit (red border)

#### Animations
- [ ] Protection timer countdown smooth
- [ ] Pulse animations (gold crown) work
- [ ] Neon glow animations render
- [ ] No jank or stuttering
- [ ] No excessive battery drain
- [ ] Reduced motion respected (if user preference set)

#### Performance
- [ ] Page load < 2 seconds on 4G
- [ ] First contentful paint < 1.5 seconds
- [ ] Time to interactive < 3 seconds
- [ ] Polling doesn't lag UI
- [ ] Smooth scrolling
- [ ] No layout shifts (CLS < 0.1)

### Accessibility on Mobile

- [ ] Text scalable (respects iOS text size settings)
- [ ] Touch targets large enough for accessibility
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Labels on form inputs
- [ ] Error messages readable by screen readers
- [ ] Keyboard navigation works (if supported on mobile)

---

## Performance Testing

### Mobile Network Conditions

Test on various network speeds:

**4G (Good):**
- Download: 4 Mbps
- Upload: 1 Mbps
- Latency: 50ms

**3G (Moderate):**
- Download: 1.6 Mbps
- Upload: 768 Kbps
- Latency: 150ms

**Slow 3G (Poor):**
- Download: 400 Kbps
- Upload: 400 Kbps
- Latency: 400ms

**Verification:**
- App should load on all network types
- Graceful degradation on slow networks
- Loading states visible during slow loads
- Timeouts handled properly

**Chrome DevTools Network Throttling:**
```
Chrome → DevTools → Network → Throttling → Slow 3G
```

### Lighthouse Mobile Audit

**Run Lighthouse:**
```bash
# In Chrome DevTools
1. Open app in mobile view (DevTools → Toggle device toolbar)
2. Lighthouse tab
3. Select "Mobile"
4. Categories: Performance, Accessibility, Best Practices
5. Click "Generate report"
```

**Target Scores:**
- **Performance:** > 80 (green)
- **Accessibility:** > 90
- **Best Practices:** > 90
- **SEO:** > 80

**Key Metrics:**
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Total Blocking Time (TBT): < 200ms
- Cumulative Layout Shift (CLS): < 0.1
- Speed Index: < 3.4s

### Battery & Resource Usage

**Monitor:**
- CPU usage (shouldn't exceed 30% idle)
- Memory usage (< 50 MB for app)
- Battery drain (polling should be efficient)

**Tools:**
- Xcode Instruments (iOS)
- Android Profiler (Android Studio)
- Chrome Task Manager

---

## Troubleshooting

### Issue: MiniKit Not Detected

**Symptoms:**
- `window.MiniKit` is undefined
- Console error: "MiniKit is not defined"

**Solutions:**
1. **Check MiniKit installation:**
   ```bash
   npm list @worldcoin/minikit-js
   # Should show version 1.0.0+
   ```

2. **Verify providers.tsx:**
   ```tsx
   useEffect(() => {
     MiniKit.install();
   }, []);
   ```

3. **Check script loading order:**
   - MiniKit should load before app code
   - Use `'use client'` directive in providers.tsx

4. **Test outside Base App first:**
   - MiniKit may only initialize in Base App context
   - Test basic functionality in mobile browser first

---

### Issue: Wallet Not Connecting on Mobile

**Symptoms:**
- "Connect Wallet" button does nothing
- OnchainKit components don't load
- No wallet provider detected

**Solutions:**
1. **Check environment variables:**
   ```bash
   # Must be set for OnchainKit
   NEXT_PUBLIC_CDP_API_KEY=...
   ```

2. **Try different wallet:**
   - Coinbase Wallet (recommended for Base App)
   - MetaMask Mobile
   - WalletConnect

3. **Check network:**
   - Ensure Base Sepolia is selected
   - Check RPC endpoint is accessible

4. **Clear cache:**
   - Close and reopen app
   - Clear browser cache
   - Try incognito/private mode

---

### Issue: Transactions Not Gasless

**Symptoms:**
- User prompted to pay gas fees
- Transaction fails with "insufficient funds"
- Paymaster not sponsoring

**Solutions:**
1. **Verify Paymaster configuration:**
   ```bash
   # Check environment variable
   echo $NEXT_PUBLIC_PAYMASTER_URL
   # Should be: https://api.developer.coinbase.com/rpc/v1/base-sepolia/YOUR_KEY
   ```

2. **Check Paymaster policy in CDP dashboard:**
   - Log in to https://portal.cdp.coinbase.com/
   - Navigate to Paymaster section
   - Verify policy is ACTIVE
   - Check contract address is whitelisted
   - Verify spending limits not exceeded

3. **Verify OnchainKit Transaction component:**
   ```tsx
   <Transaction
     chainId={84532}
     isSponsored={true}  // ← Must be true!
     calls={calls}
   >
   ```

4. **Test with different account:**
   - Rate limits may be per-address
   - Try fresh wallet

---

### Issue: UI Not Responsive on Mobile

**Symptoms:**
- Horizontal scroll required
- Elements cut off
- Text too small to read

**Solutions:**
1. **Check viewport meta tag:**
   ```html
   <!-- src/app/layout.tsx -->
   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
   ```

2. **Verify Tailwind breakpoints:**
   ```tsx
   // Use mobile-first approach
   className="w-full md:w-auto"
   // Not: className="w-auto md:w-full"
   ```

3. **Test with Chrome DevTools:**
   - Toggle device toolbar (Cmd+Shift+M)
   - Select device: iPhone SE, iPhone 12, etc.
   - Check responsive design mode

4. **Check pixel.css:**
   - Media queries should be present
   - Mobile styles at bottom (cascade)

---

### Issue: Share Button Doesn't Work

**Symptoms:**
- Clicking "📢 Challenge Friends" does nothing
- Warpcast doesn't open
- No error message

**Solutions:**
1. **Check mobile browser popup settings:**
   - Popups may be blocked
   - Allow popups for your domain

2. **Verify ShareButton component:**
   ```tsx
   // Should use window.open, not <a> tag
   const handleShare = () => {
     window.open(warpcastUrl, '_blank', 'noopener,noreferrer');
   };
   ```

3. **Test Warpcast URL manually:**
   ```
   https://warpcast.com/~/compose?text=Test&embeds[]=https://your-app.vercel.app
   ```

4. **Check deep link handling:**
   - On iOS, may open Warpcast app if installed
   - On Android, may prompt to choose app or browser

---

### Issue: Real-Time Updates Not Working

**Symptoms:**
- ThroneCard doesn't update
- Leaderboard stale
- Changes only visible after manual refresh

**Solutions:**
1. **Check polling interval:**
   ```typescript
   // useKingData.ts
   refetchInterval: 2000  // Should be 2 seconds
   ```

2. **Verify network connectivity:**
   - Mobile network may throttle requests
   - Try on Wi-Fi

3. **Check browser background throttling:**
   - Some browsers pause timers when tab backgrounded
   - Return to app, updates should resume

4. **Inspect network requests:**
   - Remote debugging → Network tab
   - Should see requests every 2 seconds
   - Check for errors (CORS, timeout, etc.)

---

### Issue: localStorage Not Persisting

**Symptoms:**
- Daily attempts reset unexpectedly
- Attempts don't survive app close/reopen
- Shows 10/10 every time

**Solutions:**
1. **Check private browsing mode:**
   - localStorage disabled in incognito/private mode
   - Ask user to use normal browsing mode

2. **Check third-party cookie settings:**
   - In iframe (Farcaster), localStorage may be blocked
   - Fallback to in-memory storage

3. **Verify useFreeAttempts hook:**
   ```typescript
   // Should use STORAGE_KEYS from constants
   localStorage.setItem(STORAGE_KEYS.attemptsCount, '10');
   ```

4. **Test with DevTools:**
   ```javascript
   // Application tab → Local Storage
   localStorage.getItem('kingOfTheBase_attempts_count')
   ```

---

### Issue: Protection Timer Not Counting Down

**Symptoms:**
- Timer stuck at 3 seconds
- Timer doesn't disappear after 3 seconds
- USURP button stays disabled

**Solutions:**
1. **Check contract protectionEndTime:**
   ```typescript
   // Should be block.timestamp + 3
   ```

2. **Verify ProtectionTimer component:**
   ```typescript
   // Should use setInterval or similar
   useEffect(() => {
     const timer = setInterval(() => {
       // Update remaining time
     }, 100);  // Update every 100ms for smooth countdown
     return () => clearInterval(timer);
   }, []);
   ```

3. **Check time synchronization:**
   - Device time may be incorrect
   - Contract uses block.timestamp (blockchain time)
   - Frontend should calculate: protectionEndTime - Date.now()

---

## Acceptance Criteria

### ✅ Base App Testing - PASS Criteria

**MiniKit Integration:**
- [ ] MiniKit.install() completes without errors
- [ ] No console errors related to MiniKit
- [ ] Wallet auto-connects in Base App context

**Gasless Transactions:**
- [ ] User does NOT pay gas fees
- [ ] Transaction submits successfully
- [ ] Confirmation within 5 seconds
- [ ] Paymaster sponsors 100% of transactions

**Responsive Design:**
- [ ] No horizontal scrolling on any device (320px - 768px)
- [ ] All text readable (minimum 8px font size)
- [ ] Buttons tappable (44x44px minimum)
- [ ] Pixel borders crisp and visible
- [ ] Neon colors vibrant (#00ff88, #ffd700, #ff4444)

**Real-Time Updates:**
- [ ] ThroneCard updates within 2 seconds of change
- [ ] Leaderboard reflects new data
- [ ] Polling works on mobile network (3G/4G/5G)

**Protection Timer:**
- [ ] 3-second countdown displays
- [ ] Timer counts down smoothly (3 → 2 → 1)
- [ ] USURP button disabled during countdown
- [ ] Button enables after countdown completes

**Daily Attempts:**
- [ ] Counter displays correctly (X/10)
- [ ] Decrements on successful capture
- [ ] Persists across app close/reopen
- [ ] Resets after 24 hours (next UTC day)

**Farcaster Share:**
- [ ] Share button opens Warpcast
- [ ] Pre-filled text includes reign time and app URL
- [ ] User can edit and publish cast

**Performance:**
- [ ] Page load < 2 seconds on 4G
- [ ] Lighthouse mobile score > 80
- [ ] No UI jank or stuttering
- [ ] Smooth scrolling

**Touch Interactions:**
- [ ] All buttons respond to single tap
- [ ] No double-tap required
- [ ] Active/pressed states visible
- [ ] Keyboard appears for text input

### ❌ Base App Testing - FAIL Criteria

**Any of the following indicate FAILURE:**
- User must pay gas fees (Paymaster not working)
- MiniKit fails to initialize
- Horizontal scrolling required on mobile
- Text unreadable without zooming
- Buttons too small to tap (<44px)
- Real-time updates don't work (>5 second delay)
- Protection timer doesn't count down
- Share button doesn't open Warpcast
- localStorage doesn't persist attempts
- App crashes on mobile device
- Transaction fails consistently
- Polling stops working
- UI elements overlap or cut off

---

### ✅ Farcaster Frames Testing - PASS Criteria

**Share Functionality:**
- [ ] Share button opens Warpcast compose
- [ ] Pre-filled text correct
- [ ] App URL embedded
- [ ] Cast publishes successfully

**Cast Link Access:**
- [ ] App URL in cast is clickable
- [ ] App opens in browser or in-app browser
- [ ] Full functionality works from cast link

**In-App Browser:**
- [ ] App loads in Warpcast in-app browser
- [ ] Wallet connect works
- [ ] Styling renders correctly
- [ ] Transactions can be submitted

**OG Image Preview:**
- [ ] Preview image displays in cast
- [ ] Image dimensions correct (1200x630)
- [ ] Title and description visible
- [ ] Branding clear

### ❌ Farcaster Frames Testing - FAIL Criteria

**Any of the following indicate FAILURE:**
- Share button doesn't open Warpcast
- App doesn't load from cast links
- Wallet connect fails in in-app browser
- OG image missing or broken
- Styling broken in iframe
- Transactions fail in Farcaster context

---

## Testing Checklist Template

Use this checklist for each mobile test session:

```
=== MOBILE TESTING SESSION ===
Date: ___________
Tester: ___________
Device: ___________
OS Version: ___________
App Version: ___________
Environment: Base App ☐ | Farcaster ☐ | Mobile Browser ☐

--- BASE APP TESTING ---
☐ MiniKit initializes correctly
☐ Wallet auto-connects
☐ UI responsive (no horizontal scroll)
☐ All text readable
☐ Buttons tappable (44x44px)
☐ Gasless transaction works (Paymaster sponsors)
☐ Real-time updates (2 sec polling)
☐ Protection timer counts down (3 sec)
☐ Share opens Warpcast
☐ Daily attempts limit enforces (10/day)
☐ Touch interactions smooth
☐ Network interruption handled gracefully

--- FARCASTER TESTING ---
☐ Share to Farcaster works
☐ App loads from cast link
☐ Works in Warpcast in-app browser
☐ OG image preview correct
☐ Wallet connect works from Farcaster

--- PERFORMANCE ---
☐ Page load < 2 seconds
☐ Lighthouse score > 80
☐ No UI lag or jank
☐ Smooth scrolling

--- ISSUES FOUND ---
Issue 1: ________________________________
Severity: Low / Medium / High / Critical
Solution: ________________________________

Issue 2: ________________________________
Severity: Low / Medium / High / Critical
Solution: ________________________________

--- OVERALL RESULT ---
☐ PASS - All criteria met
☐ FAIL - Critical issues found
☐ PASS WITH WARNINGS - Minor issues, not blocking

Notes:
_____________________________________________
_____________________________________________
_____________________________________________
```

---

## Summary

This mobile testing guide covers:
- **Base App**: MiniKit wallet, gasless transactions, mobile UX
- **Farcaster Frames**: Share functionality, in-app browser compatibility
- **Mobile UI/UX**: Responsive design, touch interactions, performance
- **Troubleshooting**: Common issues and solutions

**Key Success Metrics:**
1. Gasless transactions work on mobile (Paymaster sponsors)
2. MiniKit wallet integrates seamlessly in Base App
3. UI fully responsive (320px - 768px)
4. Real-time updates work on mobile network
5. Share to Farcaster functions correctly
6. Touch interactions smooth and accessible

**Test on Real Devices:**
- Don't rely solely on browser DevTools simulation
- Test on physical iOS and Android devices
- Verify in actual Base App and Warpcast app
- Test on various network conditions (3G, 4G, 5G, Wi-Fi)

**Documentation:**
- Record all findings in testing checklist
- Screenshot any issues
- Note device/OS/browser details for bugs
- Update DEPLOYMENT_STATUS.md with mobile test results

---

## Next Steps

After completing mobile testing:

1. **Update Implementation Plan:**
   ```bash
   # Mark subtask-8-2 as completed
   # Update implementation_plan.json
   ```

2. **Document Results:**
   - Fill out testing checklist template
   - Add screenshots to test report
   - Update DEPLOYMENT_STATUS.md

3. **Fix Any Issues:**
   - Address critical bugs immediately
   - Plan medium/low priority fixes for next iteration

4. **Final Verification:**
   - Run through E2E_QUICK_CHECKLIST.md on mobile
   - Verify all acceptance criteria met
   - Get sign-off from stakeholders

5. **Production Deployment:**
   - Switch contract to Base Mainnet (if ready)
   - Update Paymaster policy for mainnet
   - Deploy to production domain
   - Re-test on mobile in production environment

---

**End of Mobile Testing Guide**
