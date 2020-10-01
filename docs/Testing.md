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
   1. Ensure there is no extraneous output
   1. Ensure code coverage remains at 100%

## Stage 2: Localhost Testing

1. `npm start`
1. Navigate to `https://localhost:3000`
1. Make sure there is no logging in the console (Ctrl+Shift+I)
1. Perform manual sanity checks, consider adding automated UI tests at this point

## Stage 3: Build Testing

1. Update "Last updated" message on [the home page](../src/pages/Home.tsx)
1. `npm run build && serve -s build`
1. Navigate to `https://localhost:5000`
1. Make sure there is no logging in the console (Ctrl+Shift+I)
1. Perform manual sanity checks
1. Commit the code, merge into release (or master if you plan to deploy changes right away)

## Stage 4: Deployment

1. `npm run deploy`
1. Navigate to `mathwithmark.com` (Ideally this site would change away from the production site)
1. Refresh the page until the "Last updated" message reflects the new time (should take less than five minutes)
1. Make sure there is no logging in the console (Ctrl+Shift+I)
1. Perform manual sanity checks
1. If anything fails, revert the changes and run `npm run deploy`

## Future Testing Plans

Ideally there would be a separate development site, but for the the development site _is_ the production site.
