export const recipeRouterHelper = {
  DEBOUNCE: 'debounce',
  FAKE_IT_TILL_YOU_MOCK_IT: 'fake-it-till-you-mock-it',
  SKIP_TIMER_DELAYS: 'skip-timer-delays',
  VITEST_BROWSER_MODE: 'vitest-browser-mode',
  debounceRoute: () => ['/', recipeRouterHelper.DEBOUNCE],
  fakeItTillYouMockItRoute: () => [
    '/',
    recipeRouterHelper.FAKE_IT_TILL_YOU_MOCK_IT,
  ],
  skipTimerDelaysRoute: () => ['/', recipeRouterHelper.SKIP_TIMER_DELAYS],
  vitestBrowserModeRoute: () => ['/', recipeRouterHelper.VITEST_BROWSER_MODE],
};
