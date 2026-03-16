export const recipeRouterHelper = {
  DEBOUNCE: 'debounce',
  FAKE_IT_TILL_YOU_MOCK_IT: 'fake-it-till-you-mock-it',
  VITEST_BROWSER_MODE: 'vitest-browser-mode',
  debounceRoute: () => ['/', recipeRouterHelper.DEBOUNCE],
  fakeItTillYouMockItRoute: () => [
    '/',
    recipeRouterHelper.FAKE_IT_TILL_YOU_MOCK_IT,
  ],
  vitestBrowserModeRoute: () => ['/', recipeRouterHelper.VITEST_BROWSER_MODE],
};
