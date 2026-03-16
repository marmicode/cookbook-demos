export const recipeRouterHelper = {
  FAKE_IT_TILL_YOU_MOCK_IT: 'fake-it-till-you-mock-it',
  VITEST_BROWSER_MODE: 'vitest-browser-mode',

  fakeItTillYouMockItRoute: () => [
    '/',
    recipeRouterHelper.FAKE_IT_TILL_YOU_MOCK_IT,
  ],
  vitestBrowserModeRoute: () => ['/', recipeRouterHelper.VITEST_BROWSER_MODE],
};
