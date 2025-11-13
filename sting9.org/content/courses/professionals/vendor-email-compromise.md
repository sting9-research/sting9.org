---
title: Vendor Email Compromise (VEC)
duration: 10 min
learningObjectives:
  - Understand VEC attack vectors and supply chain vulnerabilities
  - Recognize compromised vendor communications
  - Implement vendor security verification procedures
---

# Vendor Email Compromise (VEC)

Vendor Email Compromise attacks target the supply chain by compromising vendor email accounts to intercept payments, steal data, or gain access to customer systems. With 69% of companies targeted and 137% increase in financial services, VEC represents a growing threat vector.

## The Scale of the Problem

**2024 Statistics:**
- **69% of companies** targeted by VEC
- **137% increase** in financial services sector
- **78% increase** in supply chain attacks overall
- **66% increase** in H1 2024 alone
- **$2.4 billion** lost to VEC attacks
- **Average 3 months** before detection

## How VEC Works

Attackers compromise vendor email through phishing, stolen credentials, or malware. They then monitor communications to understand relationships, payment schedules, and procedures before striking.

**Attack progression:**
1. Compromise vendor email account
2. Monitor customer communications (weeks/months)
3. Learn payment processes and timing
4. Intercept invoice or send fake one
5. Customer pays scammer instead of vendor
6. Move money quickly before discovery

## Common VEC Scenarios

**Invoice interception:** Scammer modifies real invoice in transit
**Payment diversion:** "Our bank account changed" from compromised vendor
**Data theft:** Access to customer contracts, pricing, strategies
**Lateral movement:** Use vendor trust to attack customers
**Supply chain poisoning:** Inject malware in software updates

## Red Flags

🚩 Unexpected payment method changes
🚩 Urgent requests from vendor
🚩 Different email style or tone
🚩 Requests bypassing normal process
🚩 New contact person without introduction
🚩 Pressure to act quickly

## Verification Procedures

**For vendor payment changes:**
- Call known contact (not number in email)
- Require formal documentation
- Test small payment first
- Verify with multiple vendor contacts

**For suspicious vendor emails:**
- Check email headers
- Verify through alternate channel
- Review recent vendor communications
- Confirm with your account manager

## Protection Strategies

**Vendor security requirements:**
- MFA required for all vendors
- Annual security assessments
- Incident notification clauses
- Regular access reviews

**Technical controls:**
- Email authentication (SPF/DKIM/DMARC)
- External sender warnings
- Payment verification systems
- Vendor portal for invoice submission

**Vendor management:**
- Centralized vendor database
- Regular information verification
- Formal change procedures
- Risk-based vendor segmentation

## Key Takeaways

- ✅ **69% of companies** targeted by VEC attacks
- ✅ **Verify all vendor payment changes** through known contacts
- ✅ **Monitor vendor relationships** for suspicious communications
- ✅ **Require vendor security standards** in contracts
- ✅ **Use secure portals** for sensitive communications
- ✅ **Regular vendor audits** prevent compromise
