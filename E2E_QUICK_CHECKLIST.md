# E2E Quick Test Checklist
## King of the Base - 5 Minute Verification

Use this for rapid smoke testing during development.

---

## Prerequisites (1 min)

```bash
# 1. Install dependencies
npm install

# 2. Check environment variables
cat .env.local | grep -E "CDP_API_KEY|PAYMASTER_URL|CONTRACT_ADDRESS"

# 3. Start dev server
npm run dev
# ✓ Should see: Ready on http://localhost:3000
```

---

## Core Flow Test (4 mins)

### Step 1: Page Load (30 sec)
- [ ] Open http://localhost:3000
- [ ] Page loads without errors
- [ ] Press Start 2P font displays
- [ ] All components visible:
  - Header with title
  - Leaderboard (top 3)
  - ThroneCard
  - MessageInput
  - UsurpButton
  - ShareButton

**Console:** No errors ✓

---

### Step 2: Wallet Connect (30 sec)
- [ ] Click wallet connection (OnchainKit)
- [ ] Select wallet (MetaMask/Coinbase Wallet)
- [ ] Approve connection
- [ ] Switch to Base Sepolia (84532)
- [ ] Wallet address displays

**Connected:** Yes ✓

---

### Step 3: View Current State (30 sec)
- [ ] ThroneCard shows current king
- [ ] Reign duration updates live
- [ ] King's message displays
- [ ] Leaderboard shows top 3
- [ ] Protection status visible

**Polling:** Data updates every 2 sec ✓

---

### Step 4: Seize Throne (90 sec)
- [ ] Enter message: "Testing throne capture"
- [ ] Character counter shows: X/30
- [ ] Click ⚔️ USURP ⚔️ button
- [ ] Transaction modal appears
- [ ] **VERIFY: Gas shows $0.00 (gasless)** ✅
- [ ] Approve transaction in wallet
- [ ] Wait for confirmation (~5 sec)
- [ ] ThroneCard updates with YOUR address
- [ ] Your message displays
- [ ] Protection timer starts (3 sec)
- [ ] Attempts decrement (X/10)

**Gasless:** Yes ✓
**Transaction:** Success ✓

---

### Step 5: Protection Timer (30 sec)
- [ ] Timer shows 3s → 2s → 1s countdown
- [ ] Shield icon pulses
- [ ] UsurpButton disabled during protection
- [ ] Button shows "Throne Protected - Wait Xs"
- [ ] Timer disappears after 3 seconds
- [ ] Button re-enables

**Protection:** Works ✓

---

### Step 6: Share Button (30 sec)
- [ ] Click 📢 Challenge Friends
- [ ] Warpcast opens in new tab
- [ ] Pre-filled message includes:
  - "👑 I just became King of the Base!"
  - Your reign time
  - "Can you dethrone me?"
  - App URL

**Share:** Works ✓

---

### Step 7: Mobile Check (30 sec)
- [ ] Open DevTools → Device Toolbar
- [ ] Test at 375px (iPhone)
- [ ] All elements fit screen
- [ ] Text readable
- [ ] Buttons tappable
- [ ] No horizontal scroll

**Mobile:** Responsive ✓

---

## Quick Verification Commands

```bash
# Check contract address is set
echo $NEXT_PUBLIC_CONTRACT_ADDRESS

# Verify contract on Basescan
# https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS

# Check Paymaster configuration
# https://portal.cdp.coinbase.com/

# Test build for production
npm run build
# ✓ Should complete without errors
```

---

## Critical Success Indicators

### Must Have ✓
- ✅ **Gasless transactions work** (no gas payment)
- ✅ Real-time updates (2 sec polling)
- ✅ Protection period enforced (3 sec)
- ✅ No console errors
- ✅ Mobile responsive (320px+)

### Visual ✓
- ✅ Pixel font loads
- ✅ Neon green accents
- ✅ Dark theme
- ✅ Retro aesthetic

### Functional ✓
- ✅ Wallet connects
- ✅ Throne capture works
- ✅ Message displays
- ✅ Leaderboard updates
- ✅ Share opens Warpcast

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Wallet won't connect | Add Base Sepolia to wallet |
| Transaction fails | Check Paymaster active in CDP |
| UI doesn't update | Verify contract address in .env.local |
| Gasless not working | Check contract whitelisted in Paymaster |
| Protection timer stuck | Clear cache, reload page |
| 0 attempts remaining | Wait 24hrs or clear localStorage |

---

## DevTools Quick Check

**Console Tab:**
```
✓ No red errors
✓ No React warnings
✓ Font loads successfully
```

**Network Tab:**
```
✓ RPC calls every 2 seconds
✓ All requests return 200 OK
✓ Paymaster endpoint responding
```

**Application Tab → Local Storage:**
```
king-of-the-base-free-attempts
└─ { count: X, lastReset: "YYYY-MM-DD" }
```

---

## Test Result

**Date:** _______________
**Tester:** _______________
**Duration:** _____ minutes

**Result:** ☐ PASS / ☐ FAIL

**Issues Found:**
- _________________________________
- _________________________________

**Ready for Production:** ☐ YES / ☐ NO

---

## Next Steps After Passing

1. Complete full E2E test (see E2E_TESTING_GUIDE.md)
2. Test on actual mobile device (subtask-8-2)
3. Deploy to production (Base Mainnet)
4. Configure production Paymaster
5. Launch! 🚀
