# Mobile Testing Quick Checklist

**⏱️ Duration:** 10-15 minutes
**Purpose:** Rapid mobile smoke test for Base App and Farcaster compatibility

---

## Prerequisites (2 min)

```bash
# ✅ Quick checks before testing
☐ App deployed and accessible (public URL)
☐ Contract deployed on Base Sepolia
☐ Environment variables configured
☐ Paymaster policy active
☐ Mobile device ready (iOS or Android)
☐ Base App or Warpcast installed
```

---

## Base App Mobile Test (5 min)

### 1. Launch & Load (1 min)
```
☐ Open app in Base App
☐ Page loads within 2 seconds
☐ No horizontal scrolling
☐ All components visible
☐ No console errors (check via remote debugging if possible)
```

**✅ Pass:** App loads, looks good
**❌ Fail:** Horizontal scroll, missing components, or errors

---

### 2. MiniKit Wallet (30 sec)
```
☐ Wallet auto-connects (no manual connection needed)
☐ No "Connect Wallet" button appears
☐ OnchainKit components load
```

**✅ Pass:** Wallet works automatically
**❌ Fail:** Must manually connect or wallet not detected

---

### 3. Responsive UI (1 min)
```
☐ Tap all buttons - respond to single tap
☐ Buttons large enough (no accidental misses)
☐ Text readable without zooming
☐ Pixel borders crisp and visible
☐ Neon colors vibrant (green, gold, red)
```

**✅ Pass:** Everything tappable and readable
**❌ Fail:** Buttons too small, text tiny, or colors washed out

---

### 4. Gasless Transaction (2 min)
```
☐ Enter message (e.g., "Mobile Test")
☐ Tap "⚔️ USURP ⚔️" button
☐ Transaction modal appears
☐ NO gas fee prompt (should be gasless)
☐ Transaction confirms within 5 seconds
☐ ThroneCard updates with your data
☐ Attempts counter decrements (e.g., 9/10)
```

**✅ Pass:** Transaction gasless, succeeds, UI updates
**❌ Fail:** Gas fee prompted, transaction fails, or no update

---

### 5. Protection Timer (30 sec)
```
☐ After capture, protection timer appears
☐ Countdown shows: 3... 2... 1...
☐ USURP button disabled during countdown
☐ Button enables after timer ends
```

**✅ Pass:** Timer counts down, button re-enables
**❌ Fail:** Timer stuck, or button stays disabled

---

### 6. Farcaster Share (30 sec)
```
☐ Tap "📢 Challenge Friends" button
☐ Warpcast opens (new tab or app)
☐ Pre-filled text includes throne message
☐ App URL embedded
```

**✅ Pass:** Warpcast opens with pre-filled cast
**❌ Fail:** Button does nothing or error occurs

---

## Farcaster Mobile Test (3 min)

### 7. Share from Mobile Browser (1 min)
```
☐ Open app in mobile browser (Safari/Chrome)
☐ Capture throne
☐ Tap share button
☐ Warpcast compose opens
☐ Pre-filled text correct
```

**✅ Pass:** Share works from mobile browser
**❌ Fail:** Warpcast doesn't open

---

### 8. Access from Cast (1 min)
```
☐ Create a cast with app URL
☐ View cast in Warpcast app
☐ Tap URL in cast
☐ App opens (browser or in-app)
☐ Full functionality works
```

**✅ Pass:** App loads and works from cast link
**❌ Fail:** Link broken or app doesn't load

---

### 9. In-App Browser (1 min)
```
☐ Open app link in Warpcast in-app browser
☐ UI renders correctly
☐ Wallet connect works (or appropriate prompt)
☐ Can interact with app
```

**✅ Pass:** Works in Warpcast in-app browser
**❌ Fail:** Broken layout or wallet issues

---

## Critical Issues Check (1 min)

### 🚨 STOP SHIP Issues (must fix before launch):
```
☐ User must pay gas (Paymaster not working)
☐ App crashes on mobile
☐ Horizontal scrolling required
☐ Buttons not tappable
☐ Text unreadable
☐ MiniKit fails to initialize
☐ Transactions consistently fail
```

**If ANY checked:** ❌ **FAIL** - Fix before proceeding

---

### ⚠️ Warning Issues (should fix, not blocking):
```
☐ Slow load time (>3 seconds)
☐ Minor UI glitches
☐ Polling occasional lag
☐ Share button sometimes slow
```

**If ANY checked:** ⚠️ **PASS WITH WARNINGS** - Document for later fix

---

## Device Matrix Quick Check

Test on at least 2 devices:

### Device 1: _____________
```
OS: iOS / Android
Screen: Small / Medium / Large
Result: ☐ PASS  ☐ FAIL  ☐ WARNINGS
```

### Device 2: _____________
```
OS: iOS / Android
Screen: Small / Medium / Large
Result: ☐ PASS  ☐ FAIL  ☐ WARNINGS
```

---

## Quick Result Summary

```
=== MOBILE QUICK TEST RESULTS ===
Date: _______________
Tester: _______________

Base App: ☐ PASS  ☐ FAIL  ☐ WARNINGS
Farcaster: ☐ PASS  ☐ FAIL  ☐ WARNINGS

Critical Issues: ___ (count)
Warning Issues: ___ (count)

Overall: ☐ PASS  ☐ FAIL  ☐ PASS WITH WARNINGS

Notes:
____________________________________
____________________________________
____________________________________
```

---

## Common Quick Fixes

### Issue: Gasless Not Working
```bash
# Check Paymaster URL
echo $NEXT_PUBLIC_PAYMASTER_URL
# Verify in CDP dashboard: portal.cdp.coinbase.com
```

### Issue: UI Too Small on Mobile
```tsx
// Check tailwind.config.ts has mobile breakpoints
// Check globals.css has base font size
// Verify: className="text-[8px] sm:text-[10px]"
```

### Issue: MiniKit Not Loading
```tsx
// Verify in src/app/providers.tsx:
useEffect(() => {
  MiniKit.install();
}, []);
```

### Issue: Share Button Not Working
```tsx
// Check window.open not blocked:
window.open(url, '_blank', 'noopener,noreferrer');
```

---

## Next Steps

### ✅ If All Tests Pass:
1. Document results in MOBILE_TESTING_GUIDE.md
2. Update implementation_plan.json: subtask-8-2 → "completed"
3. Commit changes
4. Proceed to production deployment

### ❌ If Tests Fail:
1. Document failures with screenshots
2. Fix critical issues immediately
3. Re-run quick checklist
4. Full test with MOBILE_TESTING_GUIDE.md

### ⚠️ If Warnings Only:
1. Document warnings
2. Create follow-up issues
3. Can proceed to production
4. Schedule fixes for next iteration

---

## DevTools Quick Commands

### Remote Debugging Console Check:
```javascript
// Check MiniKit
console.log('MiniKit:', !!window.MiniKit);

// Check wallet
console.log('Wallet:', !!window.ethereum);

// Check OnchainKit
console.log('OnchainKit:', !!window.OnchainKitConfig);

// Check localStorage attempts
console.log('Attempts:', localStorage.getItem('kingOfTheBase_attempts_count'));

// Check contract address
console.log('Contract:', process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
```

### Network Check:
```javascript
// In DevTools Network tab, filter by:
// - Type: Fetch/XHR (should see polling every 2 sec)
// - Domain: api.developer.coinbase.com (Paymaster calls)
// - Status: 200 (all green)
```

---

## Performance Quick Check

### Lighthouse Mobile (2 min):
```
1. Open Chrome DevTools
2. Lighthouse tab
3. Select "Mobile" device
4. Run: Performance + Accessibility
5. Target: Both > 80 (green)
```

### Network Throttling (1 min):
```
1. DevTools → Network tab
2. Throttling: Slow 3G
3. Reload page
4. Should load within 5 seconds
```

---

## Final Verification

Before marking subtask-8-2 complete:

```
☐ Tested on at least 2 mobile devices (iOS + Android)
☐ Base App test passed
☐ Farcaster test passed
☐ No critical issues found
☐ Gasless transactions confirmed working
☐ MiniKit wallet integration verified
☐ UI responsive and readable
☐ Touch interactions smooth
☐ Documentation updated

☐ READY TO MARK SUBTASK-8-2 COMPLETE
```

---

**⏱️ Total Time:** 10-15 minutes for complete mobile smoke test
**📋 Full Testing:** See MOBILE_TESTING_GUIDE.md for comprehensive tests
**🚀 Production Ready:** After this quick check passes + full guide tests
