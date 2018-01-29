# eBay Auto Feedback Revisited
Fetches random feedback from The eBay Feedback Generator (http://thesurrealist.co.uk/feedback) and fills in the comment field on eBay feedback pages.

This userscript requires [Tampermonkey](https://tampermonkey.net) extension to work which is available for all popular browsers including Chrome, Firefox, Edge

## Changelog

### 1.0.2
- automatically set stars after selecting feedback type
  - Negative feedback = 1 star
  - Neutral feedback = 3 stars
  - Positive feedback = 5 stars

### 1.0.1
- lowered max. characters from 80 to 79 because in fact 80 has 81 characters and it blocks the feedback submit button
- force input change to let the form know it can be submitted

### 1.0.0
- initial release