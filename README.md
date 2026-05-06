# ZBTips Controller Symptom Checker V1

A free static web app built with plain HTML, CSS, and JavaScript.

## Files
- `index.html` = page shell and branded header
- `style.css` = full ZBTips UI styling
- `app.js` = symptom logic, routing, results, glossary
- `logo.png` = transparent ZBTips logo used in the header

## Local run
Open `index.html` in your browser.

## Free hosting
Best first option: GitHub Pages.

## Font update
- Orbitron is used for headings to match the ZBTips logo energy.
- Inter is used for body text for readability.


## Feedback update
- Added a How to use this tool screen.
- Added clearer recommended settings labels for Look Horizontal, Look Vertical, ADS Horizontal, and ADS Vertical.
- Added Fortnite settings path guidance.
- Added symptom-specific training map tasks.
- Added PS5 lag checklist for input delay results when the user selects PS5.

## How-to placement update
- The "How to use this tool" button now appears first at the top of the home screen.
- The visible header title now reads "Controller Symptom Checker" because the logo already carries the ZBTips brand.
- CSS and JS are cache-busted in `index.html` with a version query.

## Menu image root fix
- Menu screenshots are stored in the root folder, not an assets folder.
- Upload the four PNG screenshot files beside `index.html`, `style.css`, and `app.js`.
- Added collapsible "Where this is in Fortnite" sections for relevant settings results.


## Gyro / PC routing update
- Added "Gyro is stealing your aim assist" result and routing inside the aim assist flow.
- Added "Controller works everywhere except Fortnite" as a PC input routing checker.
- Added glossary entries for Gyro Aiming, Flick Stick, and PC Input Routing.
- Added routing from input delay when Fortnite ignores the controller or shows wrong buttons.


## Controller Lab promo + Stripe payment button

Added a homepage section advertising Controller Lab.

To connect Stripe:
1. Create your Stripe Payment Link.
2. Open `app.js`.
3. Find:
   `const CONTROLLER_LAB_PAYMENT_LINK = "PASTE_STRIPE_PAYMENT_LINK_HERE";`
4. Replace it with your Stripe Payment Link, for example:
   `const CONTROLLER_LAB_PAYMENT_LINK = "https://buy.stripe.com/abc123";`
5. Commit the change to GitHub.
6. Cloudflare will deploy automatically.

The "Already purchased?" link goes to:
https://controllerlabzbtips.com


## Stripe Buy Button connected

The Controller Lab promo section now uses the live Stripe Buy Button:

- buy-button-id: buy_btn_1TU5ua12GruX4WYOzJW1IIFV
- publishable key added in the Stripe embed

The old placeholder JavaScript payment link logic was removed.


## Fixed Stripe promo insertion

The Stripe script and CSS were present, but the actual promo section was missing from index.html.
This version inserts the Controller Lab promo section between the hero header and the checker app section.


## Home promo reposition update
- Moved Controller Lab promo to the bottom of the home screen so users see the symptom checker first
- Added a Controller Lab preview screenshot inside the promo section
- Kept the Stripe buy button inside the lower promo section
