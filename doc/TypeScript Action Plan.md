## TypeScript Action Plan

We've started adding the TypeScript support to Vue Storefront - mostly because of the following reasons:
- developer convinience (intelisense support in the IDE's)
- types safety and code-testability
- making Vue Storefront code base easier to understand for new-comers.

## Desired state

**Type Script is for internal implementation only. Does NOT affect ES users, but should improve TS integration for TS users.**

Desired state is that Vue Storefront Core outputs JS libraries, it's written using some TypeScript features, but all the user code (themes, extensions) is still JavaScript. No TypeScript experience is required to build Vue Storefront stores. **This is just for core developers and transparent to the end users.**

Therefore we're refactoring just:
- core/api
- core/store
- core/lib

Where it makes sense. The key TypeScript feature we feel is usable are data types.

We're in the middle of [refactoring `core/components` to `core/api` modules](https://github.com/DivanteLtd/vue-storefront/issues/1213). All the modules should be created using TypeScript

### The Action Plan:

1. Introduce types - move *.js modules to *.ts modules incrementally without breaking changes. 
2. Use Types when it's approprierate in Your newly written modules and new features.
3. One Vuex module, or just few components refactored within one release (once a month) is fine.
4. All Vue Storefront modules should be created using TypeScript.
5. All new modules and vuex stores should be created using TypeScript.
6. **For now please don't refactor existing UI layer (components, pages) to use TypeScript. We should focus at Vuex, core libraries and API's at first to not introduce a chaos into theme development.**
6. We should put the types/interfaces inside appropiate modules inside `types` for all Entity/Data related models.
7. We should use minimal possible set of interfaces. Try to introduce 1-2 interfaces per entity (e.g. Product shouldn't be represented by more than 2 interfaces)
