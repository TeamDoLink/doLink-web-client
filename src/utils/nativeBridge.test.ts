import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isReactNativeWebView,
  sendMessageToRN,
  addMessageListener,
  addTypedMessageListener,
  openLink,
  canOpenLink,
  osShareTask,
} from './nativeBridge';

describe('nativeBridge', () => {
  beforeEach(() => {
    // Reset window.ReactNativeWebView before each test
    delete (window as any).ReactNativeWebView;
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  afterEach(() => {
    // Clean up event listeners
    const listeners = (window as any)._messageListeners || [];
    listeners.forEach((listener: any) => {
      window.removeEventListener('message', listener);
    });
  });

  describe('isReactNativeWebView', () => {
    it('returns true when ReactNativeWebView is available', () => {
      (window as any).ReactNativeWebView = { postMessage: vi.fn() };
      expect(isReactNativeWebView()).toBe(true);
    });

    it('returns false when ReactNativeWebView is not available', () => {
      expect(isReactNativeWebView()).toBe(false);
    });

    it('returns false when window is undefined', () => {
      const originalWindow = global.window;
      (global as any).window = undefined;
      expect(isReactNativeWebView()).toBe(false);
      global.window = originalWindow;
    });
  });

  describe('sendMessageToRN', () => {
    it('sends message when ReactNativeWebView is available', () => {
      const postMessage = vi.fn();
      (window as any).ReactNativeWebView = { postMessage };

      sendMessageToRN({ type: 'test', payload: { data: 'hello' } });

      expect(postMessage).toHaveBeenCalledWith(
        JSON.stringify({ type: 'test', payload: { data: 'hello' } })
      );
    });

    it('logs warning when ReactNativeWebView is not available', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      sendMessageToRN({ type: 'test' });

      expect(consoleSpy).toHaveBeenCalledWith(
        'ReactNativeWebView is not available'
      );
      consoleSpy.mockRestore();
    });

    it('handles messages without payload', () => {
      const postMessage = vi.fn();
      (window as any).ReactNativeWebView = { postMessage };

      sendMessageToRN({ type: 'test' });

      expect(postMessage).toHaveBeenCalledWith(
        JSON.stringify({ type: 'test' })
      );
    });
  });

  describe('addMessageListener', () => {
    it('adds event listener and returns cleanup function', () => {
      const handler = vi.fn();
      const cleanup = addMessageListener(handler);

      // Dispatch a message event
      const event = new MessageEvent('message', { data: 'test' });
      window.dispatchEvent(event);

      expect(handler).toHaveBeenCalledWith(event);

      // Test cleanup
      handler.mockClear();
      cleanup();
      window.dispatchEvent(event);
      expect(handler).not.toHaveBeenCalled();
    });

    it('returns empty cleanup function when window is undefined', () => {
      const originalWindow = global.window;
      (global as any).window = undefined;

      const handler = vi.fn();
      const cleanup = addMessageListener(handler);

      expect(cleanup).toBeInstanceOf(Function);
      cleanup(); // Should not throw

      global.window = originalWindow;
    });
  });

  describe('addTypedMessageListener', () => {
    it('calls handler when message type matches', () => {
      const handler = vi.fn();
      const cleanup = addTypedMessageListener('test:type', handler);

      const event = new MessageEvent('message', {
        data: JSON.stringify({ type: 'test:type', payload: { value: 42 } }),
      });
      window.dispatchEvent(event);

      expect(handler).toHaveBeenCalledWith({ value: 42 });
      cleanup();
    });

    it('does not call handler when message type does not match', () => {
      const handler = vi.fn();
      const cleanup = addTypedMessageListener('test:type', handler);

      const event = new MessageEvent('message', {
        data: JSON.stringify({ type: 'other:type', payload: { value: 42 } }),
      });
      window.dispatchEvent(event);

      expect(handler).not.toHaveBeenCalled();
      cleanup();
    });

    it('handles already parsed object data', () => {
      const handler = vi.fn();
      const cleanup = addTypedMessageListener('test:type', handler);

      const event = new MessageEvent('message', {
        data: { type: 'test:type', payload: { value: 42 } },
      });
      window.dispatchEvent(event);

      expect(handler).toHaveBeenCalledWith({ value: 42 });
      cleanup();
    });

    it('handles invalid JSON gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const handler = vi.fn();
      const cleanup = addTypedMessageListener('test:type', handler);

      const event = new MessageEvent('message', {
        data: 'invalid json{',
      });
      window.dispatchEvent(event);

      expect(handler).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to parse message from RN:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
      cleanup();
    });

    it('handles messages without payload', () => {
      const handler = vi.fn();
      const cleanup = addTypedMessageListener('test:type', handler);

      const event = new MessageEvent('message', {
        data: JSON.stringify({ type: 'test:type' }),
      });
      window.dispatchEvent(event);

      expect(handler).toHaveBeenCalledWith(undefined);
      cleanup();
    });
  });

  describe('openLink', () => {
    it('sends link:open message to RN', () => {
      const postMessage = vi.fn();
      (window as any).ReactNativeWebView = { postMessage };

      openLink('https://example.com');

      expect(postMessage).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'link:open',
          payload: { url: 'https://example.com' },
        })
      );
    });

    it('handles special characters in URL', () => {
      const postMessage = vi.fn();
      (window as any).ReactNativeWebView = { postMessage };

      openLink('https://example.com/path?query=value&foo=bar#hash');

      expect(postMessage).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'link:open',
          payload: { url: 'https://example.com/path?query=value&foo=bar#hash' },
        })
      );
    });
  });

  describe('canOpenLink', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('resolves with link:response from native', async () => {
      const postMessage = vi.fn();
      (window as any).ReactNativeWebView = { postMessage };

      const promise = canOpenLink('https://example.com');

      // Simulate native response
      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'link:response',
          success: true,
          url: 'https://example.com',
          canOpen: true,
        }),
      });
      window.dispatchEvent(event);

      const result = await promise;
      expect(result).toEqual({
        type: 'link:response',
        success: true,
        url: 'https://example.com',
        canOpen: true,
      });
    });

    it('rejects with link:error from native', async () => {
      const postMessage = vi.fn();
      (window as any).ReactNativeWebView = { postMessage };

      const promise = canOpenLink('https://example.com');

      // Simulate native error response
      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'link:error',
          error: 'Cannot open URL',
          url: 'https://example.com',
        }),
      });
      window.dispatchEvent(event);

      await expect(promise).rejects.toEqual({
        type: 'link:error',
        error: 'Cannot open URL',
        url: 'https://example.com',
      });
    });

    it('rejects with timeout error when no response received', async () => {
      const postMessage = vi.fn();
      (window as any).ReactNativeWebView = { postMessage };

      const promise = canOpenLink('https://example.com', 1000);

      // Fast-forward time to trigger timeout
      vi.advanceTimersByTime(1000);

      await expect(promise).rejects.toEqual({
        type: 'link:error',
        error: 'Request timeout',
        url: 'https://example.com',
      });
    });

    it('uses default timeout of 3000ms', async () => {
      const postMessage = vi.fn();
      (window as any).ReactNativeWebView = { postMessage };

      const promise = canOpenLink('https://example.com');

      vi.advanceTimersByTime(2999);
      // Should not timeout yet

      vi.advanceTimersByTime(1);
      // Now it should timeout

      await expect(promise).rejects.toEqual({
        type: 'link:error',
        error: 'Request timeout',
        url: 'https://example.com',
      });
    });

    it('handles multiple concurrent requests', async () => {
      const postMessage = vi.fn();
      (window as any).ReactNativeWebView = { postMessage };

      const promise1 = canOpenLink('https://example1.com');
      const promise2 = canOpenLink('https://example2.com');

      // Respond to second request first
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            type: 'link:response',
            success: true,
            url: 'https://example2.com',
            canOpen: true,
          }),
        })
      );

      const result2 = await promise2;
      expect(result2.url).toBe('https://example2.com');

      // Respond to first request
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            type: 'link:response',
            success: true,
            url: 'https://example1.com',
            canOpen: false,
          }),
        })
      );

      const result1 = await promise1;
      expect(result1.url).toBe('https://example1.com');
    });

    it('clears timeout after receiving response', async () => {
      const postMessage = vi.fn();
      (window as any).ReactNativeWebView = { postMessage };

      const promise = canOpenLink('https://example.com', 5000);

      // Respond immediately
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            type: 'link:response',
            success: true,
            url: 'https://example.com',
            canOpen: true,
          }),
        })
      );

      await promise;

      // Advance timers - should not cause timeout
      vi.advanceTimersByTime(5000);
      // If timeout wasn't cleared, this would throw
    });

    it('warns when response received for unknown URL', () => {
      const postMessage = vi.fn();
      (window as any).ReactNativeWebView = { postMessage };
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Send response without making a request
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            type: 'link:response',
            success: true,
            url: 'https://unknown.com',
            canOpen: true,
          }),
        })
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('No pending request found'),
        'URL:',
        'https://unknown.com',
        expect.any(String),
        expect.any(Array)
      );
      consoleSpy.mockRestore();
    });
  });

  describe('osShareTask', () => {
    it('sends os:share message with task deeplink', () => {
      const postMessage = vi.fn();
      (window as any).ReactNativeWebView = { postMessage };

      osShareTask(123);

      expect(postMessage).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'os:share',
          payload: { url: 'dolink://task/detail/123' },
        })
      );
    });

    it('handles different task IDs', () => {
      const postMessage = vi.fn();
      (window as any).ReactNativeWebView = { postMessage };

      osShareTask(456);

      expect(postMessage).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'os:share',
          payload: { url: 'dolink://task/detail/456' },
        })
      );
    });

    it('handles zero task ID', () => {
      const postMessage = vi.fn();
      (window as any).ReactNativeWebView = { postMessage };

      osShareTask(0);

      expect(postMessage).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'os:share',
          payload: { url: 'dolink://task/detail/0' },
        })
      );
    });
  });

  // Edge cases and integration tests
  describe('edge cases', () => {
    it('handles message event without MessageEvent instance', () => {
      const handler = vi.fn();
      addTypedMessageListener('test:type', handler);

      // Dispatch non-MessageEvent
      const event = new Event('message');
      window.dispatchEvent(event);

      expect(handler).not.toHaveBeenCalled();
    });

    it('canOpenLink handles response with missing URL in error', async () => {
      vi.useFakeTimers();
      const postMessage = vi.fn();
      (window as any).ReactNativeWebView = { postMessage };

      const promise = canOpenLink('https://example.com');

      // Send error response without url field
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            type: 'link:error',
            error: 'Some error',
          }),
        })
      );

      // This should timeout because empty string won't match
      vi.advanceTimersByTime(3000);

      await expect(promise).rejects.toEqual({
        type: 'link:error',
        error: 'Request timeout',
        url: 'https://example.com',
      });

      vi.useRealTimers();
    });

    it('sendMessageToRN handles undefined payload gracefully', () => {
      const postMessage = vi.fn();
      (window as any).ReactNativeWebView = { postMessage };

      sendMessageToRN({ type: 'test', payload: undefined });

      expect(postMessage).toHaveBeenCalledWith(
        JSON.stringify({ type: 'test', payload: undefined })
      );
    });
  });
});