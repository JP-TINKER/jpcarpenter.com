# Policy exception log

**Program owner:** `[Name]` · **Review cadence:** `[monthly / quarterly]` · **Last review:** `[date]`

**Use:** Track temporary deviations from written policy with owners, expiry, and compensating controls.  
**Not:** Blanket waivers, permanent shadow policy, or risk acceptance without a named human.

## Register

| ID | Policy / control | Exception (what is allowed) | Business justification | Owner | Compensating control | Approved by | Expires | Review date | Status |
|----|------------------|----------------------------|------------------------|-------|----------------------|-------------|---------|-------------|--------|
| EX-001 | MFA for admins | Break-glass without MFA | Emergency recovery | | Hardware key in sealed envelope + dual control | | | | Open |
| EX-002 | | | | | | | | | |
| EX-003 | | | | | | | | | |

## Rules of use

1. **No open-ended exceptions.** Every row needs an expiry.  
2. **Owner must be a named human**, not a team alias alone.  
3. **Compensating control** is required when residual risk is Medium or High.  
4. **Expired open rows become findings** on the next review.  
5. **Renewals** get a new ID or a clear revision note; do not silently extend.

## Monthly / quarterly review agenda (copy into calendar)

1. List exceptions expiring in the next 30 days.  
2. Confirm compensating controls still operate (spot-check one).  
3. Close rows that are no longer needed.  
4. Escalate any High residual risk still open.

## Sample finding language

> Exception EX-00X (MFA skip for break-glass) expired on [date] with no renewal. Compensating control was not evidenced. Treat as an open access-control finding until remediated or formally re-accepted.

## Credits

Exception hygiene is standard GRC practice; table shape is original. Use alongside access and change templates when auditors ask how deviations are governed.
