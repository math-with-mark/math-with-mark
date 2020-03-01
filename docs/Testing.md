# Testing

All tests are run manually for now. Obviously I want to change that soon.

Each stage comes with a set of preprocessing steps before the tests can be run. Once the tests pass one stage, move on to the next one.

## Tests

- No warnings or errors
- All links work
- Users can navigate to pages directly (fails starting at Stage 3)
- All pages load
- Stuff renders appropriately (looks good at all sizes)
- No typos in newly-added content

## Stage 0: Code Review

In this stage, the code is reviewed in a diff viewer to make sure it matches style guidelines and good engineering practices. None of the above tests are run.

- Is the code formatted appropriately?
- Does the design match expected principles (SOLID, GRASP)?
- Is it tested?
- Is it documented? Should it be?

## Stage 1: Unit Testing

1. `npm test`

## Stage 2: Localhost Testing

1. `npm start`
1. Navigate to `localhost:3000`
1. Make sure there is no logging in the console (Ctrl+Shift+I)

## Stage 2: Build Testing

1. `npm run build`
1. `serve -s build`
1. Navigate to `localhost:5000`
1. Make sure there is no logging in the console (Ctrl+Shift+I)

## Stage 3: Development Site

1. Update "Last updated" message in [`Home.js`](../src/Home.js)
1. `npm run deploy`
1. Navigate to `mathwithmark.com` (Ideally this site would change away from the production site)
1. Refresh the page until the "Last updated" message reflects the new time (should take less than five minutes)
1. Make sure there is no logging in the console (Ctrl+Shift+I)

## Stage 4: Deployment

This stage is currently unnecessary, as the development site _is_ the production site for now. But I hope to change that in the near future.
