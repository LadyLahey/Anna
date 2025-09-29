type EventPayload = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(eventName: string, payload: EventPayload = {}): void {
	// Placeholder: wire to analytics backend later
	// For now, log to console to validate instrumentation points
	// eslint-disable-next-line no-console
	console.log('[metrics]', eventName, payload);
}

export function trackScreen(screenName: string): void {
	trackEvent('screen_view', { screenName });
}

