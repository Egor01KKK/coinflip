# End-to-End Testing Guide
## King of the Base - Integration Verification

This guide covers complete end-to-end testing of the King of the Base application, verifying the full user flow from wallet connection to throne seizure.

---

## Prerequisites

Before starting E2E tests, ensure all setup is complete:

### 1. Dependencies Installed ✓
```bash
npm install
```

### 2. Smart Contract Deployed ✓
- [ ] Contract deployed to Base Sepolia
- [ ] Contract address added to `.env.local`
- [ ] Contract verified on Basescan
- [ ] Contract address: `_________________`

### 3. Environment Variables Configured ✓
Check `.env.local` file contains:
```bash
NEXT_PUBLIC_CDP_API_KEY=<your_cdp_api_key>
NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base-sepolia/<your_key>
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed_contract_address>
NEXT_PUBLIC_CHAIN_ID=84532
```

### 4. Paymaster Configured ✓
- [ ] CDP Paymaster policy created
- [ ] Contract address whitelisted
- [ ] Rate limits configured (10/day, 3/hour)
- [ ] Budget allocated ($100 monthly)

### 5. Development Server Running ✓
```bash
npm run dev
```
Expected output: `✓ Ready on http://localhost:3000`

---

## E2E Test Scenarios

### Test 1: Initial Page Load

**Objective:** Verify the application loads without errors

**Steps:**
1. Open browser and navigate to `http://localhost:3000`
2. Wait for page to fully load

**Expected Results:**
- ✅ Page renders without errors
- ✅ Press Start 2P font loads correctly (pixel/retro style)
- ✅ Dark background (#0a0a0a) with neon accents
- ✅ App title displays: "👑 KING OF THE BASE"
- ✅ App description visible with neon glow
- ✅ No console errors in browser DevTools
- ✅ Loading skeleton appears while data fetches
- ✅ All components render after loading completes

**Components to Verify:**
- [x] Header (title + description)
- [x] Leaderboard (top 3 players)
- [x] ThroneCard (current king display)
- [x] MessageInput (text input for king message)
- [x] ProtectionTimer (countdown if active)
- [x] UsurpButton (seize throne button)
- [x] ShareButton (Farcaster share)
- [x] Footer (Paymaster + Base branding)

---

### Test 2: Wallet Connection via OnchainKit

**Objective:** Verify wallet connection works via OnchainKit

**Steps:**
1. Look for wallet connection UI provided by OnchainKit
2. Click "Connect Wallet" button
3. Select wallet provider (MetaMask, Coinbase Wallet, etc.)
4. Approve connection in wallet popup
5. Switch to Base Sepolia network if prompted

**Expected Results:**
- ✅ OnchainKit wallet selector appears
- ✅ Multiple wallet options available
- ✅ Wallet connects successfully
- ✅ Network switches to Base Sepolia (84532)
- ✅ Wallet address displays in UI
- ✅ No errors in console
- ✅ Connection persists on page refresh

**Wallet Address:** `_________________`

**Screenshots:**
- [ ] Wallet selector UI
- [ ] Connected state

---

### Test 3: View Current King Data

**Objective:** Verify real-time polling and data display

**Steps:**
1. After page loads, observe ThroneCard component
2. Wait for contract data to load (2 sec polling interval)
3. Check if king data updates automatically

**Expected Results:**
- ✅ ThroneCard displays current king address
- ✅ King's avatar (deterministic emoji) displays
- ✅ Truncated address format: `0x1234...5678`
- ✅ Reign duration displays and updates live
- ✅ Reign time format: `MM:SS` or `HH:MM:SS`
- ✅ King's message displays (or empty state if none)
- ✅ Protection badge shows if throne is protected
- ✅ Data updates every 2 seconds (verify in Network tab)
- ✅ Empty throne state displays if no king yet

**Current King Data:**
- King Address: `_________________`
- Reign Duration: `_________________`
- Message: `_________________`
- Protected: `_________________`

---

### Test 4: View Leaderboard

**Objective:** Verify leaderboard displays top 3 players

**Steps:**
1. Observe Leaderboard component at top of page
2. Check podium-style display (2nd, 1st, 3rd order)
3. Verify player data is accurate

**Expected Results:**
- ✅ Leaderboard displays top 3 players
- ✅ Players ordered by total reign time (descending)
- ✅ 1st place in center (larger), with crown 👑
- ✅ 2nd place on left, 3rd place on right
- ✅ Medal emojis: 🥇 🥈 🥉
- ✅ Deterministic avatar for each player
- ✅ Truncated addresses displayed
- ✅ Reign times formatted correctly (42s, 5m 23s, 2h 15m)
- ✅ Empty slots shown if < 3 players
- ✅ Data updates every 2 seconds

**Top 3 Players:**
1. 1st: `_________________` - Time: `_________________`
2. 2nd: `_________________` - Time: `_________________`
3. 3rd: `_________________` - Time: `_________________`

---

### Test 5: Enter King Message

**Objective:** Verify message input with character limit

**Steps:**
1. Click into the "Your message as King:" input field
2. Type a message (e.g., "Follow @mychannel")
3. Try typing more than 30 characters
4. Observe character counter

**Expected Results:**
- ✅ Input field accepts text
- ✅ Placeholder text displays when empty
- ✅ Press Start 2P font applies to input
- ✅ Character counter shows: `X/30`
- ✅ Counter turns yellow at 20+ chars
- ✅ Counter turns red at 28+ chars
- ✅ Warning message appears at limit
- ✅ Input prevents typing beyond 30 characters
- ✅ Neon border effect on focus
- ✅ Input clears after successful throne seizure

**Test Message:** `_________________`

---

### Test 6: Check Protection Timer

**Objective:** Verify 3-second protection countdown displays correctly

**Prerequisites:** Throne must currently be protected (within 3 sec of last capture)

**Steps:**
1. Observe ProtectionTimer component
2. Watch countdown progress
3. Verify visual indicators

**Expected Results:**
- ✅ Timer displays remaining seconds: `3s`, `2s`, `1s`
- ✅ Shield icon (🛡️) animates/pulses
- ✅ Color changes: green → yellow → red
- ✅ Progress bar depletes over 3 seconds
- ✅ Timer auto-hides when protection expires
- ✅ UsurpButton is disabled while protected
- ✅ Button shows "Throne Protected" message

**Protection End Time:** `_________________`

---

### Test 7: Seize Throne (Gasless Transaction)

**Objective:** Verify complete gasless transaction flow

**Prerequisites:**
- Wallet connected
- Protection period expired (no active countdown)
- Free attempts remaining (shown as `X/10`)
- Message entered (max 30 chars)

**Steps:**
1. Enter a king message in the input field
2. Verify UsurpButton is enabled (not disabled)
3. Click "⚔️ USURP ⚔️" button
4. Observe OnchainKit transaction UI
5. Approve transaction in wallet (should NOT require gas payment)
6. Wait for transaction confirmation

**Expected Results:**

**Transaction Initiation:**
- ✅ UsurpButton enabled when conditions met
- ✅ Button disabled states show clear reasons:
  - "Throne Protected - Wait Xs"
  - "No attempts remaining (0/10)"
  - "Message too long"
- ✅ Clicking button triggers OnchainKit Transaction component
- ✅ Transaction modal/UI appears

**Gasless Verification (CRITICAL):**
- ✅ **NO gas payment required in wallet**
- ✅ Gas fee shows as "$0.00" or "Sponsored"
- ✅ Paymaster sponsors the transaction
- ✅ Wallet balance doesn't decrease (except throne state change)

**Transaction Status:**
- ✅ TransactionStatus component shows progress:
  - "Preparing transaction..."
  - "Awaiting signature..."
  - "Confirming..."
  - "Success! ✅"
- ✅ No errors during transaction
- ✅ Transaction confirms within 5 seconds

**Post-Transaction State:**
- ✅ ThroneCard updates with YOUR address as king
- ✅ Your message displays in ThroneCard
- ✅ Reign timer starts from 00:00
- ✅ Protection timer appears (3 sec countdown)
- ✅ UsurpButton disables during protection
- ✅ Message input clears automatically
- ✅ Free attempts counter decrements (e.g., 9/10)
- ✅ You appear in Leaderboard

**Transaction Details:**
- Transaction Hash: `_________________`
- Block Number: `_________________`
- Gas Paid: `$0.00` ✅ (Paymaster sponsored)
- Confirmation Time: `_________________`

**Verify on Basescan:**
1. Copy transaction hash
2. Go to https://sepolia.basescan.org/
3. Paste transaction hash
4. Verify:
   - ✅ Transaction successful
   - ✅ Called `seizeThrone(string message)`
   - ✅ Event emitted: `ThroneSeized(address, string, uint256)`
   - ✅ Gas paid by Paymaster (not your address)

---

### Test 8: UI Real-Time Updates

**Objective:** Verify UI updates automatically via polling

**Steps:**
1. After seizing throne, keep page open
2. Wait and observe without refreshing
3. Watch reign duration increment
4. If another player takes throne, verify UI updates

**Expected Results:**
- ✅ Reign duration updates every 1-2 seconds
- ✅ No page refresh required
- ✅ Polling hits contract every 2 seconds (check Network tab)
- ✅ If throne captured by another player:
  - ThroneCard updates with new king
  - Your address moves to Leaderboard
  - Total reign time accumulates correctly
- ✅ Leaderboard updates automatically
- ✅ Protection timer updates automatically
- ✅ No lag or UI freezing

**Network Activity (DevTools → Network):**
- ✅ Requests to RPC endpoint every ~2 seconds
- ✅ Requests call `getKingData` function
- ✅ Responses contain current throne state

---

### Test 9: Protection Period Enforcement

**Objective:** Verify 3-second protection prevents immediate re-capture

**Steps:**
1. Seize throne successfully
2. Immediately try to click UsurpButton again
3. Wait for protection timer to expire
4. Try clicking button again

**Expected Results:**

**During Protection (0-3 seconds):**
- ✅ UsurpButton is disabled
- ✅ Button shows "Throne Protected - Wait Xs"
- ✅ Button has visual disabled state (grayed out)
- ✅ Clicking does nothing
- ✅ ProtectionTimer displays countdown: 3s → 2s → 1s
- ✅ Protection indicator on ThroneCard

**After Protection Expires (3+ seconds):**
- ✅ UsurpButton becomes enabled
- ✅ Button text returns to "⚔️ USURP ⚔️"
- ✅ Button style returns to active state
- ✅ ProtectionTimer component hides
- ✅ Clicking button initiates new transaction
- ✅ Protection badge removed from ThroneCard

---

### Test 10: Daily Free Attempts Limit

**Objective:** Verify 10 daily attempts limit tracked in localStorage

**Steps:**
1. Check initial attempts counter (should show `X/10`)
2. Seize throne successfully
3. Observe counter decrement
4. Repeat up to 10 times (if testing thoroughly)
5. After 10 attempts, verify button behavior

**Expected Results:**

**Attempts 1-10:**
- ✅ Counter starts at `10/10` (first use of the day)
- ✅ Each successful seizure decrements counter
- ✅ Counter updates immediately after transaction
- ✅ Counter displays below UsurpButton: `X/10 attempts today`
- ✅ Counter persists on page refresh (localStorage)

**After 10 Attempts:**
- ✅ Counter shows `0/10 attempts today`
- ✅ UsurpButton becomes disabled
- ✅ Button shows "No attempts remaining (0/10)"
- ✅ Cannot seize throne even if other conditions met
- ✅ Error message or tooltip explains limit

**Verification:**
- Open DevTools → Application → Local Storage
- Check key: `king-of-the-base-free-attempts`
- Verify structure: `{ count: X, lastReset: "YYYY-MM-DD" }`

**Daily Reset:**
- ✅ Counter resets to 10/10 after midnight UTC
- (Test by manually changing localStorage date if needed)

**Current Attempts:** `_________________`

---

### Test 11: Farcaster Share Button

**Objective:** Verify share functionality opens Warpcast

**Prerequisites:** Have seized throne at least once (to show reign time)

**Steps:**
1. Click "📢 Challenge Friends" button
2. Verify Warpcast compose window opens
3. Check pre-filled message content

**Expected Results:**
- ✅ ShareButton displays below UsurpButton
- ✅ Button has pixel-art gold styling
- ✅ Clicking opens new browser tab
- ✅ URL navigates to `https://warpcast.com/~/compose`
- ✅ Pre-filled text includes:
  - "👑 I just became King of the Base!"
  - Reign time: "Reigned for Xs" (dynamic)
  - "Can you dethrone me?"
  - "🎮 Play now:"
- ✅ App URL embedded in cast
- ✅ User can edit message before posting
- ✅ No errors in console
- ✅ Optional: Post the cast and verify it appears in Farcaster

**Warpcast Compose URL:**
```
https://warpcast.com/~/compose?text=<encoded_text>&embeds[]=<app_url>
```

**Screenshot:**
- [ ] Warpcast compose screen

---

### Test 12: Mobile Responsiveness

**Objective:** Verify mobile-friendly UI (320px - 768px)

**Steps:**
1. Open DevTools → Toggle device toolbar
2. Test at multiple breakpoints:
   - 320px (iPhone SE)
   - 375px (iPhone 12/13)
   - 390px (iPhone 14)
   - 768px (iPad)
3. Test in landscape orientation
4. Test on actual mobile device if possible

**Expected Results:**

**Layout:**
- ✅ All elements fit on screen (no horizontal scroll)
- ✅ Text sizes readable at 320px:
  - Title: text-2xl → text-5xl (responsive)
  - Body: text-[10px] → text-sm
- ✅ Proper padding on all sides (px-2, sm:px-4, md:px-8)
- ✅ Components stack vertically on mobile
- ✅ Leaderboard avatars scale appropriately
- ✅ ThroneCard max-width prevents stretching
- ✅ Buttons full-width on mobile, auto on desktop

**Touch Targets:**
- ✅ UsurpButton large enough (min 44x44px)
- ✅ ShareButton easily tappable
- ✅ MessageInput usable with mobile keyboard
- ✅ No elements too close together

**Performance:**
- ✅ Page loads quickly on mobile
- ✅ Animations smooth (no jank)
- ✅ Pixel font readable at small sizes
- ✅ Images/emojis render correctly

**Mobile Safe Area:**
- ✅ Bottom padding avoids home indicator
- ✅ No content hidden behind notch

**Breakpoint Verification:**
- [ ] 320px: All elements visible and functional
- [ ] 375px: Comfortable spacing
- [ ] 768px: Optimal tablet layout
- [ ] 1024px+: Desktop layout with max-width

---

### Test 13: Error Handling

**Objective:** Verify graceful error handling

**Test Cases:**

#### 13a. Wallet Disconnection During Transaction
1. Connect wallet
2. Start throne seizure transaction
3. Disconnect wallet mid-transaction

**Expected:** Error message displays, app doesn't crash

#### 13b. Network Switch During Usage
1. Use app on Base Sepolia
2. Switch to different network in wallet
3. Try to seize throne

**Expected:** Network error or prompt to switch back to Base Sepolia

#### 13c. Transaction Rejection
1. Click UsurpButton
2. Reject transaction in wallet

**Expected:** Transaction cancelled, UI returns to ready state, no crash

#### 13d. Contract Not Deployed
1. Set `NEXT_PUBLIC_CONTRACT_ADDRESS` to invalid address
2. Reload page

**Expected:** Error state displays with retry option, not blank page

#### 13e. RPC Endpoint Down
1. Simulate RPC failure (modify Paymaster URL to invalid)
2. Reload page

**Expected:** Loading state times out, error message displays

**Error Handling Verification:**
- ✅ Errors display in pixel-art styled error component
- ✅ Error messages are user-friendly (not raw technical errors)
- ✅ Retry button allows user to recover
- ✅ App doesn't crash or show blank screen
- ✅ Console errors are logged for debugging
- ✅ ErrorFallback component renders correctly

---

### Test 14: Browser DevTools Verification

**Objective:** Verify no console errors or warnings

**Steps:**
1. Open DevTools → Console
2. Clear console
3. Perform complete user flow (connect → seize → share)
4. Check for errors/warnings

**Expected Results:**
- ✅ No uncaught errors
- ✅ No React warnings
- ✅ No 404 errors (missing resources)
- ✅ No CORS errors
- ✅ Font loads successfully
- ✅ All API calls return 200 OK
- ✅ WebSocket connections stable (if any)

**DevTools → Network Tab:**
- ✅ All requests successful (green)
- ✅ RPC calls to Paymaster endpoint working
- ✅ Contract calls returning valid data
- ✅ No failed image/font loads

**DevTools → Performance:**
- ✅ Page load time < 2 seconds
- ✅ Time to Interactive (TTI) < 3 seconds
- ✅ No layout shift (CLS near 0)
- ✅ Smooth animations (60 FPS)

---

## Acceptance Criteria Summary

### Functional ✅
- [x] User can connect wallet via OnchainKit
- [x] User can seize throne with one click
- [x] Transactions are gasless (Paymaster sponsored)
- [x] Protection time (3 sec) works correctly
- [x] King's message displays and updates
- [x] Real-time state updates (2 sec polling)
- [x] Top-3 leaderboard displays
- [x] Share to Farcaster works
- [x] 10 daily attempts limit tracked

### Performance ✅
- [x] Page loads in < 2 seconds
- [x] Transaction confirms in < 5 seconds
- [x] UI is responsive on mobile (320px+)

### Visual ✅
- [x] Pixel font "Press Start 2P" applied
- [x] Neon green accents (#00ff88)
- [x] Dark background (#0a0a0a)
- [x] Pixel borders on main elements
- [x] Retro 8-bit aesthetic maintained

### Security ✅
- [x] No sensitive data in frontend
- [x] Environment variables properly configured
- [x] Paymaster rate limits enforced
- [x] Contract protection period works

---

## Testing Checklist

Copy this checklist for each test run:

```
Date: _______________
Tester: _______________
Environment: Base Sepolia
Build Version: _______________

□ Test 1: Initial Page Load
□ Test 2: Wallet Connection
□ Test 3: View King Data
□ Test 4: View Leaderboard
□ Test 5: Enter King Message
□ Test 6: Protection Timer
□ Test 7: Seize Throne (Gasless)
□ Test 8: Real-Time Updates
□ Test 9: Protection Enforcement
□ Test 10: Daily Attempts Limit
□ Test 11: Farcaster Share
□ Test 12: Mobile Responsive
□ Test 13: Error Handling
□ Test 14: DevTools Verification

Overall Result: PASS / FAIL

Notes:
_________________________________
_________________________________
_________________________________
```

---

## Troubleshooting

### Issue: Wallet Won't Connect
**Solutions:**
- Ensure Base Sepolia network added to wallet
- Check wallet extension is latest version
- Try different browser
- Clear browser cache

### Issue: Gasless Transaction Fails
**Solutions:**
- Verify Paymaster policy is active in CDP dashboard
- Check contract address is whitelisted
- Verify rate limits not exceeded
- Check Paymaster budget not exhausted

### Issue: UI Doesn't Update
**Solutions:**
- Check RPC endpoint responding (Network tab)
- Verify contract address correct in .env.local
- Clear browser cache
- Check TanStack Query devtools for stale data

### Issue: Protection Timer Not Working
**Solutions:**
- Verify contract deployed correctly
- Check block timestamp vs protection end time
- Test in separate browser tab
- Verify polling interval (2 sec)

---

## Test Environment Details

**Deployment Information:**
- Contract Address: `_________________`
- Deployed Block: `_________________`
- Deployer Address: `_________________`
- Deployment Tx: `_________________`

**CDP Configuration:**
- CDP API Key: `✓ Configured`
- Paymaster URL: `✓ Configured`
- Policy Name: `King of the Base - Gasless`
- Rate Limit: 10/day, 3/hour
- Budget: $100/month

**Test Wallet:**
- Address: `_________________`
- Network: Base Sepolia (84532)
- Balance: `_________________` ETH

---

## Post-Testing Actions

After all tests pass:

1. ✅ Mark subtask-8-1 as completed in implementation_plan.json
2. ✅ Commit E2E testing documentation
3. ✅ Update build-progress.txt with test results
4. ✅ Document any issues found in GitHub Issues
5. ✅ Proceed to subtask-8-2: Mobile device testing

---

## Next Steps

After E2E verification completes:
- Move to subtask-8-2: Mobile device testing on Base App / Farcaster
- Prepare for production deployment to Base Mainnet
- Configure production Paymaster policy
- Update environment variables for production

---

**Testing Completed:** ☐ YES / ☐ NO
**All Tests Passed:** ☐ YES / ☐ NO
**Ready for Production:** ☐ YES / ☐ NO

**Tester Signature:** _________________
**Date:** _________________
