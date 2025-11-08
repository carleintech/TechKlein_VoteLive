# Testing Email Verification

## Quick Setup

### 1. Get Resend API Key
1. Go to [https://resend.com/signup](https://resend.com/signup)
2. Create a free account (100 emails/day free)
3. Go to API Keys section
4. Create new API key
5. Copy the key (starts with `re_`)

### 2. Add API Key to Environment
```bash
# Open .env.local and add:
RESEND_API_KEY=re_your_key_here
```

### 3. Verify Domain (Optional for Production)
For production emails from `noreply@haitivote.org`:
1. Go to Resend Dashboard → Domains
2. Add domain: `haitivote.org`
3. Add DNS records they provide
4. Wait for verification (usually instant)

**For testing:** Use `onboarding@resend.dev` (no domain verification needed)

## Testing Locally

### Start Development Server
```bash
pnpm dev
```

### Test Email Verification Flow

1. **Open App**: http://localhost:3000
2. **Select a Candidate**: Click any candidate card
3. **Fill Form**:
   - Choose "Email" verification method
   - Enter your email address
   - Fill other fields (name, DOB, country)
   - Click "Voye Kòd Email"

4. **Check Email**:
   - Look in your inbox for "Kòd Verifikasyon VoteLive"
   - Code is displayed in large gradient box
   - Valid for 10 minutes

5. **Enter OTP**:
   - Enter 6-digit code from email
   - Click verify
   - Should see success message

6. **Verify Vote Recorded**:
   - Check Supabase → Table Editor → votes table
   - Should see new vote with timestamp

### Test Phone Verification Flow

1. **Select Candidate**
2. **Fill Form**:
   - Choose "Telefòn (SMS)" verification method
   - Enter phone number with country code (+509 for Haiti)
   - Fill other fields
   - Click "Voye Kòd SMS"

3. **Check SMS**: Receive code via Twilio
4. **Enter OTP**: Verify code
5. **Confirm Vote**

## Dev Mode Testing (No API Key)

If `RESEND_API_KEY` is not set:
- Email OTP codes are logged to console: `📧 [DEV MODE] Email OTP for user@example.com: 123456`
- Check terminal/console for the code
- Still fully functional for testing UI/UX

## Testing Scenarios

### ✅ Positive Tests
- [ ] Email verification complete flow
- [ ] Phone verification complete flow  
- [ ] Switch between email and phone before submit
- [ ] Valid email formats (gmail.com, yahoo.com, etc.)
- [ ] International phone numbers (+1, +509, +33, etc.)

### ⚠️ Negative Tests
- [ ] Invalid email format → Should show error
- [ ] Invalid phone format → Should show error
- [ ] Wrong OTP code → Should show "Invalid code"
- [ ] Expired OTP (wait 10 min) → Should show "Code expired"
- [ ] Same email twice → Should show "Email already used"
- [ ] Same phone twice → Should show "Phone already used"
- [ ] Submit without phone OR email → Should show "Phone or email required"

### 🔒 Security Tests
- [ ] OTP codes are hashed in database (check `private_otps` table)
- [ ] Codes expire after 10 minutes
- [ ] Max 5 verification attempts
- [ ] Rate limiting on verification endpoint
- [ ] Unique constraints prevent duplicate votes

## Monitoring

### Check Database
```sql
-- Check recent OTPs
SELECT 
  id,
  email,
  phone,
  verification_method,
  is_verified,
  created_at,
  expires_at
FROM public.private_otps
ORDER BY created_at DESC
LIMIT 10;

-- Check voter records with email
SELECT 
  id,
  normalized_first_name,
  normalized_last_name,
  email,
  email_verified_at,
  normalized_phone,
  voted_at
FROM public.private_voter_records
WHERE email IS NOT NULL
ORDER BY voted_at DESC
LIMIT 10;

-- Check votes count
SELECT COUNT(*) as total_votes FROM public.votes;
```

### Check Logs
```bash
# Terminal where dev server is running
# Look for:
📧 [DEV MODE] Email OTP for user@example.com: 123456
🔍 Verifying OTP: { method: 'email', identifier: 'user@example.com', ... }
✅ OTP sent successfully
```

## Common Issues

### Issue: Email not received
**Solutions:**
- Check spam folder
- Verify RESEND_API_KEY is set correctly
- Check Resend dashboard for delivery status
- For testing, check console logs (dev mode)

### Issue: "Failed to send email"
**Solutions:**
- Verify API key is correct
- Check Resend account status
- Verify domain if using custom domain
- Use `onboarding@resend.dev` for testing

### Issue: "Invalid verification code"
**Solutions:**
- Code expires after 10 minutes - request new one
- Max 5 attempts - request new code if exceeded
- Ensure you're copying code correctly (6 digits)
- Check if verification method matches (email vs phone)

### Issue: "Email already used to vote"
**Solutions:**
- Each email can only vote once
- This is working as intended (duplicate prevention)
- Use different email for testing
- Clear database for development testing

## Production Deployment Checklist

- [ ] Add `RESEND_API_KEY` to Vercel environment variables
- [ ] Verify `haitivote.org` domain with Resend
- [ ] Update from email from `onboarding@resend.dev` to `noreply@haitivote.org`
- [ ] Test email delivery in production
- [ ] Monitor Resend dashboard for delivery rates
- [ ] Set up email alerts for delivery failures
- [ ] Update privacy policy to mention email collection
- [ ] Test rate limiting in production
- [ ] Monitor fraud logs for email patterns

## Performance Metrics

### Expected Metrics
- Email delivery: < 2 seconds
- SMS delivery: 3-5 seconds
- OTP verification: < 500ms
- Total vote flow: 30-60 seconds

### Monitor
- Email delivery success rate (target: >98%)
- Email open rate (if tracked)
- Email vs SMS usage ratio
- Average time to complete verification
- Failed verification attempts

## Support

### Resend Dashboard
- [https://resend.com/emails](https://resend.com/emails) - Email logs
- [https://resend.com/api-keys](https://resend.com/api-keys) - API keys
- [https://resend.com/domains](https://resend.com/domains) - Domain verification

### Supabase Dashboard
- SQL Editor - Run queries
- Table Editor - View data
- Logs - Check API errors

### Local Development
- Console logs - OTP codes in dev mode
- Network tab - API requests
- React DevTools - Component state

---

**Ready to test!** 🚀

Start with dev mode (no API key) to test UI/UX, then add RESEND_API_KEY for full email testing.
