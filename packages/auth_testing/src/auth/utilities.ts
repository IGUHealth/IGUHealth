const CODE_REGEX = /[?&]code=[^&]+/;
const STATE_REGEX = /[?&]state=[^&]+/;
const ERROR_REGEX = /[?&]error=[^&]+/;

export const hasAuthQueryParams = (
  searchParams = window.location.search,
): boolean =>
  (CODE_REGEX.test(searchParams) || ERROR_REGEX.test(searchParams)) &&
  STATE_REGEX.test(searchParams);
