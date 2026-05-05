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
