---
title: Wire Transfer and Invoice Fraud
duration: 10 min
learningObjectives:
  - Understand wire transfer fraud mechanisms and vulnerabilities
  - Recognize invoice manipulation and payment diversion tactics
  - Implement multi-layer verification procedures for payments
---

# Wire Transfer and Invoice Fraud

Wire transfer and invoice fraud represents the most financially devastating category of BEC attacks. With 90% of companies targeted and 63% experiencing actual fraud, these attacks exploit payment processes to divert funds to criminal accounts.

## The Scale of the Problem

**2024 Statistics:**
- **90% of companies** targeted by wire fraud attempts
- **63% experienced** successful wire transfer fraud
- **60% lost over $5 million** (136% increase from 2023)
- **$2.9 billion** lost to wire fraud globally
- **Vendor Email Compromise** increased 66% in H1 2024
- **Average recovery rate:** Less than 15% of stolen funds

**Why so devastating:**
- Wire transfers are immediate and difficult to reverse
- International transfers nearly impossible to recover
- Scammers work quickly to move/withdraw funds
- Banks have limited liability once transfer authorized

## Types of Wire Transfer and Invoice Fraud

### **1. Invoice Manipulation**

**How it works:**
- Scammer compromises email (employee, vendor, or customer)
- Monitors correspondence to understand payment processes
- Intercepts legitimate invoice
- Modifies bank account details
- Sends to accounting with new payment information

**Common variations:**
- PDF invoice with altered bank details
- Email from compromised vendor account
- "Updated banking information" notification
- "We've changed banks" announcements

### **2. Payment Diversion**

**How it works:**
- Email appears to be from vendor
- Claims bank account changed due to merger, security, or other reason
- Provides new wire transfer instructions
- Accounting updates vendor information
- All future payments diverted to scammer

**Red flags:**
- Unexpected change notification
- Urgent "verify immediately"
- Sent via email instead of formal letter
- Bank account in different country/state than vendor

### **3. Man-in-the-Middle Invoice Fraud**

**How it works:**
- Scammer compromises one party's email
- Monitors invoice/payment communications
- Intercepts and modifies invoices in transit
- Neither party realizes fraud until payment doesn't arrive

**Example:**
- Vendor sends invoice to customer
- Scammer intercepts, changes bank details
- Customer pays scammer thinking it's vendor
- Vendor never receives payment, demands payment again
- Customer realizes fraud, money is gone

### **4. CEO Fraud Wire Transfer**

**How it works:**
- Email impersonating CEO/CFO
- Requests urgent wire transfer
- Claims confidential acquisition/deal
- Instructs bypassing normal procedures
- Finance authorizes to avoid angering executive

**Why it works:**
- Authority bias (obey executives)
- Urgency bypasses verification
- Confidentiality prevents discussion
- Fear of questioning leadership

### **5. Attorney/Legal Impersonation**

**How it works:**
- Email claims to be from law firm handling transaction
- Professional letterhead and language
- Requests wire transfer for closing, settlement, legal fees
- Provides bank account information

**Common targets:**
- Real estate transactions
- Mergers and acquisitions
- Legal settlements
- Contract payments

## Real-World Case Studies

### **Case 1: Toyota Boshoku Corporation ($37 Million, 2019)**

**What happened:**
- Finance employee received email from "executive"
- Requested fund transfer for acquisition
- Email looked legitimate (spoofed domain)
- Employee authorized transfer of $37M
- Funds sent to multiple international accounts
- Discovered days later when real executive inquired

**Outcome:** Partial recovery through quick action and law enforcement cooperation, but majority lost.

### **Case 2: Vendor Account Change Scam (Manufacturing Company, $2.3M, 2024)**

**What happened:**
- Email from long-time vendor notifying of bank change
- Professional email matching vendor's style
- Vendor's email account had been compromised
- Accounting updated vendor records
- Three months of payments ($2.3M) sent to scammer
- Real vendor contacted about non-payment
- By then, money moved through multiple countries

**Outcome:** Less than 10% recovered.

### **Case 3: Real Estate Wire Fraud ($150K, 2024)**

**What happened:**
- Home buyer received closing instructions via email
- Email appeared to be from title company
- Included wiring instructions for down payment
- Buyer wired $150K as instructed
- At closing, title company had no record of payment
- Email was from scammer monitoring transaction

**Outcome:** Unrecovered. Buyer lost down payment and house sale.

## Verification Procedures

### **For ALL Wire Transfers:**

**Mandatory multi-step verification:**

1. **Callback verification:**
   - Call known phone number (not from email)
   - Verify with person you know at company
   - Confirm exact amount and account details
   - Document who you spoke with and when

2. **Dual approval:**
   - Two people must approve wires over threshold
   - Approvers cannot be related or report to each other
   - Physical signatures or secure digital approval

3. **Waiting period:**
   - 24-48 hour hold for unusual requests
   - New vendors require extended verification
   - Large amounts (>$50K) require executive approval

4. **Test transaction:**
   - Send small amount first ($1-10)
   - Confirm receipt with vendor
   - Send remainder only after confirmation

### **For Vendor Banking Changes:**

**Strict verification protocol:**

1. **Never accept via email alone:**
   - Require formal letter on company letterhead
   - Call known contact to verify (not number in email)
   - Request in-person meeting if possible
   - Verify with multiple contacts at vendor

2. **Documentation required:**
   - Official bank letter confirming new account
   - Vendor authorization signed by officer
   - Updated W-9 form
   - Test payment verification

3. **Flag in system:**
   - Mark account as "recently changed"
   - Require extra verification for 90 days
   - Alert all team members who work with vendor

### **For Invoice Review:**

**Every invoice should be checked for:**

1. **Consistency checks:**
   - Matches previous invoices (format, bank details)
   - Same contact information
   - Expected delivery/service dates
   - Normal pricing and quantities

2. **Bank account verification:**
   - Compare to previous payments
   - Any change requires verification
   - Check country/bank matches vendor location

3. **Communication verification:**
   - Confirm invoice via phone
   - Use contact info from previous correspondence, not current email
   - Verify specific details (PO number, amount, date)

## Technical Controls

### **Email Security:**

1. **Email authentication:**
   - SPF, DKIM, DMARC configured and enforced
   - Reject emails failing authentication
   - Display warnings for external emails

2. **Domain monitoring:**
   - Alert on similar domains (companyinc vs company-inc)
   - Monitor for typosquatting
   - Register common misspellings

3. **Email filtering:**
   - Flag requests for bank account changes
   - Alert on wire transfer keywords
   - Highlight external emails requesting payments

### **Financial Controls:**

1. **Segregation of duties:**
   - Different people: request, approve, execute
   - No single person can complete wire transfer
   - Regular rotation of responsibilities

2. **Transaction limits:**
   - Daily limits per person
   - Amount thresholds for approval levels
   - Limit who can authorize wires

3. **Vendor management:**
   - Centralized vendor database
   - Regular audits of vendor information
   - Formal change request procedures
   - Annual verification of banking information

4. **Payment automation:**
   - ACH instead of wire when possible
   - Positive pay systems
   - Real-time fraud monitoring
   - Virtual credit cards for specific vendors

### **Monitoring and Auditing:**

1. **Real-time monitoring:**
   - Alert on unusual payment amounts
   - Flag payments to new accounts
   - Monitor international transfers
   - Detect deviations from patterns

2. **Regular audits:**
   - Review wire transfers monthly
   - Verify vendor banking information quarterly
   - Test verification procedures
   - Analyze fraud attempt patterns

## Response Procedures

### **If Wire Fraud is Suspected or Confirmed:**

**Immediate actions (within minutes):**

1. **Call your bank immediately:**
   - Request wire recall
   - Success depends on speed (hours matter)
   - Provide all transaction details
   - Request hold on beneficiary account

2. **Contact receiving bank:**
   - Your bank will typically do this
   - Can request account freeze
   - International requires swift action

3. **Contact FBI:**
   - FBI IC3: ic3.gov
   - File complaint immediately
   - FBI can contact international banks
   - Speed is critical (24-48 hour window)

4. **Preserve evidence:**
   - Don't delete emails
   - Screenshot everything
   - Save email headers
   - Document timeline

**Within 24 hours:**

5. **Report to authorities:**
   - Local police (file report)
   - FBI IC3 (online complaint)
   - FinCEN (Financial Crimes Enforcement Network)
   - State banking regulator

6. **Notify stakeholders:**
   - Company leadership
   - Legal counsel
   - Insurance carrier (cyber insurance)
   - Audit committee

7. **Forensic investigation:**
   - Determine how email was compromised
   - Review all recent transactions
   - Identify other potential victims
   - Patch security vulnerabilities

**Ongoing:**

8. **Recovery efforts:**
   - Work with FBI and banks
   - International law enforcement if needed
   - Civil litigation against beneficiary banks (rarely successful)
   - Insurance claim if covered

9. **Prevent recurrence:**
   - Implement stronger controls
   - Enhanced training
   - Review and update procedures
   - Increase verification requirements

## Training and Culture

### **Employee Training:**

**Key topics:**
- Real examples of wire fraud
- Verification procedures (practice)
- Authority to question and verify
- "See something, say something"
- Consequences of fraud (jobs, company survival)

**Training frequency:**
- Initial onboarding training
- Quarterly refreshers
- After any incident (company-wide)
- Role-specific training (finance, accounting, procurement)

### **Creating Verification Culture:**

**Leadership must:**
- Publicly support verification procedures
- Follow procedures themselves (no exceptions)
- Praise employees who verify
- Never punish "excessive caution"
- Fund adequate staffing for controls

**Clear messaging:**
- "Verification is part of your job"
- "We'd rather delay payment than lose millions"
- "If in doubt, verify"
- "No one is too important to verify"

## Key Takeaways

- ✅ **90% of companies** targeted; 63% experience successful fraud
- ✅ **Callback verification** mandatory for all wire transfers
- ✅ **Dual approval** required for large amounts
- ✅ **Never accept banking changes via email alone**
- ✅ **Test transactions** before sending large amounts
- ✅ **Speed is critical** - contact banks/FBI within hours of discovery
- ✅ **Technical controls:** Email authentication, monitoring, limits
- ✅ **Culture matters:** Verification must be expected and praised

**Remember:** Wire transfers are immediate and nearly irreversible. The few minutes spent verifying can save millions. No legitimate vendor or executive will object to verification procedures. Build multiple layers of defense—technical controls, verification procedures, and a culture that values caution over speed.
