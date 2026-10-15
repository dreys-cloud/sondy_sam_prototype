# Sondy Sam Salon Management System (SSSMS)
## High-Fidelity HCI Coded Prototype

### Included screens
1. Home / Landing Page
2. Salon Services
3. Appointment Scheduling (step 1)
4. Customer Details (step 2)
5. Appointment Review (step 3)
6. Appointment Confirmation
7. Admin Dashboard
8. Inventory Management (inside the Admin Dashboard)

### How to run
**Option 1 — easiest**
1. Download and extract `sondy_sam_prototype.zip`.
2. Open the extracted folder.
3. Double-click `index.html`. It should open in your browser.

**Option 2 — using Visual Studio Code**
1. Open the extracted folder in VS Code.
2. If you have the Live Server extension, right-click `index.html`.
3. Choose **Open with Live Server**.

No framework, build step, or backend is required.

### Try the main user flow
Home → Services → Choose service → Book Appointment → Select date/time → Enter customer details → Review appointment → Confirm appointment → Admin Demo.

The admin dashboard shows bookings saved in this browser and allows stock quantities to be updated.

### Notes
- Service prices, time slots, and inventory are sample demo data. Replace them with verified salon information before presenting as factual.
- Appointments are saved to browser `localStorage` on the same browser/device. They are not sent to the real salon.
- Inventory changes are in-memory demo changes and reset when the page is refreshed.
- A production system would need a backend/database, secure admin authentication, and real appointment availability checks.
- The hero photo loads from Unsplash, and the fonts load from Google Fonts, so those visual assets need an internet connection. The rest of the interface runs locally.

### HCI principles demonstrated
- Consistency: repeated buttons, colors, typography, and navigation
- Visibility: clear page titles, steps, prices, stock labels, and primary actions
- Feedback: toast messages, form errors, and confirmation page
- User control: back/edit flow and option to book another appointment
- Error prevention: required fields, email/phone validation, past-date prevention
- Clear navigation: top navigation and sequential booking steps
- Visual hierarchy: contrast, spacing, card layout, and prominent primary actions

### Example usability test notes
Use these as starting points, then test with a classmate and adjust based on what actually happens.
1. **Potential issue:** Some customers might not know the listed times are not live availability. **Improvement:** Add an availability disclaimer beside the time selector.
2. **Potential issue:** On a narrow phone, the booking steps may look crowded. **Improvement:** Test on a small screen and shorten step labels if users struggle.
3. **Potential issue:** A customer may assume confirmation means the salon has received the booking. **Improvement:** Clearly label it as a request and explain that this demo does not contact the salon.
