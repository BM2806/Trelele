/** The simulator is a development tool; published app routes use the real viewport. */
export const isSimulator = new URLSearchParams(window.location.search).get('preview') === '1' || (import.meta.env.DEV && new URLSearchParams(window.location.search).get('standalone') !== '1' && new URLSearchParams(window.location.search).get('app') !== '1');
