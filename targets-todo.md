# Definite steps to take to move from incentives to target:

- [ ] Replace every list and display of incentives with targets
- [ ] Get the API calls for all targets.. and I guess simplify everything since we're not going to update the list of targets after we make the call... so probably replace a bunch of the "update list of things when other thing was clicked" to instead say "update our __moneyexpected__ variable when this thing is checked"
- [ ] Fix all calculators to handle.. what? it's not like we can just add up all the targets.. we have to like introduce a new concept we pass around?
- [ ] Fix all the tests for the same
- [ ] probably a lot of other stuff I haven't figured yet
- [ ] Delete all the client calls and model for incentives
- [ ] Create new model, client calls, and caches for targets
- [ ] rename all CSS classes for targets instead of incentives
- [ ] Update text and module names in React for targets instead of rebates/incentives
