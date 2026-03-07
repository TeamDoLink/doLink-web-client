import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { useNativeNavigate } from './useNativeNavigate';
import * as webviewUtils from '@/utils/webview';
import * as nativeBridge from '@/utils/nativeBridge';

// Mock dependencies
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/utils/webview', () => ({
  detectPlatform: vi.fn(),
}));

vi.mock('@/utils/nativeBridge', () => ({
  isReactNativeWebView: vi.fn(),
  sendMessageToRN: vi.fn(),
}));

describe('useNativeNavigate', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(MemoryRouter, null, children);

  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(webviewUtils.detectPlatform).mockReturnValue('ios');
    vi.mocked(nativeBridge.isReactNativeWebView).mockReturnValue(true);
    vi.mocked(nativeBridge.sendMessageToRN).mockImplementation(() => {});

    // Reset history state
    window.history.replaceState({ idx: 0 }, '');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('setup and cleanup', () => {
    it('sets up message listener on iOS platform', () => {
      vi.mocked(webviewUtils.detectPlatform).mockReturnValue('ios');
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'message',
        expect.any(Function)
      );

      unmount();
    });

    it('sets up message listener on Android platform', () => {
      vi.mocked(webviewUtils.detectPlatform).mockReturnValue('android');
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'message',
        expect.any(Function)
      );

      unmount();
    });

    it('cleans up listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'message',
        expect.any(Function)
      );
    });
  });

  describe('navigate:deeplink message handling', () => {
    it('navigates to path from deeplink message', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
          payload: { path: '/some/path' },
        }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).toHaveBeenCalledWith('/some/path');
      unmount();
    });

    it('normalizes path without leading slash', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
          payload: { path: 'some/path' },
        }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).toHaveBeenCalledWith('/some/path');
      unmount();
    });

    it('extracts path from full URL', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
          payload: { path: 'https://example.com/some/path?query=value#hash' },
        }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).toHaveBeenCalledWith('/some/path?query=value#hash');
      unmount();
    });

    it('ignores empty path', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
          payload: { path: '' },
        }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).not.toHaveBeenCalled();
      unmount();
    });

    it('ignores whitespace-only path', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
          payload: { path: '   ' },
        }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).not.toHaveBeenCalled();
      unmount();
    });

    it('ignores root path', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
          payload: { path: '/' },
        }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).not.toHaveBeenCalled();
      unmount();
    });

    it('handles path with query parameters', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
          payload: { path: '/search?q=test&category=all' },
        }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).toHaveBeenCalledWith('/search?q=test&category=all');
      unmount();
    });

    it('handles path with hash fragment', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
          payload: { path: '/page#section' },
        }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).toHaveBeenCalledWith('/page#section');
      unmount();
    });

    it('ignores message when path is not a string', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
          payload: { path: 123 },
        }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).not.toHaveBeenCalled();
      unmount();
    });

    it('ignores message when path is missing', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
          payload: {},
        }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).not.toHaveBeenCalled();
      unmount();
    });

    it('ignores message when payload is missing', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
        }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).not.toHaveBeenCalled();
      unmount();
    });

    it('handles invalid URL gracefully', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
          payload: { path: 'http://[invalid url' },
        }),
      });
      window.dispatchEvent(event);

      // Should normalize as regular path
      expect(mockNavigate).toHaveBeenCalledWith('/http://[invalid url');
      unmount();
    });
  });

  describe('navigate:back message handling', () => {
    it('navigates back when browser history is available (idx > 0)', () => {
      window.history.replaceState({ idx: 1 }, '');
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({ type: 'navigate:back' }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).toHaveBeenCalledWith(-1);
      expect(nativeBridge.sendMessageToRN).not.toHaveBeenCalled();
      unmount();
    });

    it('navigates back when history.length > 1', () => {
      // Mock history.length
      Object.defineProperty(window.history, 'length', {
        value: 2,
        writable: true,
        configurable: true,
      });
      window.history.replaceState({}, ''); // No idx

      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({ type: 'navigate:back' }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).toHaveBeenCalledWith(-1);
      expect(nativeBridge.sendMessageToRN).not.toHaveBeenCalled();
      unmount();
    });

    it('sends exit message when no browser history (idx = 0)', () => {
      window.history.replaceState({ idx: 0 }, '');
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({ type: 'navigate:back' }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(nativeBridge.sendMessageToRN).toHaveBeenCalledWith({
        type: 'navigate:back:exit',
      });
      unmount();
    });

    it('sends exit message when history.length = 1 and no idx', () => {
      Object.defineProperty(window.history, 'length', {
        value: 1,
        writable: true,
        configurable: true,
      });
      window.history.replaceState({}, ''); // No idx

      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({ type: 'navigate:back' }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(nativeBridge.sendMessageToRN).toHaveBeenCalledWith({
        type: 'navigate:back:exit',
      });
      unmount();
    });
  });

  describe('message parsing and validation', () => {
    it('handles string data that needs JSON parsing', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: '{"type":"navigate:deeplink","payload":{"path":"/test"}}',
      });
      window.dispatchEvent(event);

      expect(mockNavigate).toHaveBeenCalledWith('/test');
      unmount();
    });

    it('handles already parsed object data', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: { type: 'navigate:deeplink', payload: { path: '/test' } },
      });
      window.dispatchEvent(event);

      expect(mockNavigate).toHaveBeenCalledWith('/test');
      unmount();
    });

    it('ignores invalid JSON', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: 'invalid json{',
      });
      window.dispatchEvent(event);

      expect(mockNavigate).not.toHaveBeenCalled();
      unmount();
    });

    it('ignores non-MessageEvent events', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new Event('message');
      window.dispatchEvent(event);

      expect(mockNavigate).not.toHaveBeenCalled();
      unmount();
    });

    it('ignores messages with unknown type', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({ type: 'unknown:type' }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).not.toHaveBeenCalled();
      unmount();
    });

    it('ignores null data', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', { data: null });
      window.dispatchEvent(event);

      expect(mockNavigate).not.toHaveBeenCalled();
      unmount();
    });

    it('ignores messages from different origin in non-RN environment', () => {
      vi.mocked(nativeBridge.isReactNativeWebView).mockReturnValue(false);
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({ type: 'navigate:deeplink', payload: { path: '/test' } }),
        origin: 'https://evil.com',
      });
      Object.defineProperty(window, 'location', {
        value: { origin: 'https://example.com' },
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(event);

      expect(mockNavigate).not.toHaveBeenCalled();
      unmount();
    });

    it('allows messages from same origin in non-RN environment', () => {
      vi.mocked(nativeBridge.isReactNativeWebView).mockReturnValue(false);
      Object.defineProperty(window, 'location', {
        value: { origin: 'https://example.com' },
        writable: true,
        configurable: true,
      });
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({ type: 'navigate:deeplink', payload: { path: '/test' } }),
        origin: 'https://example.com',
      });
      window.dispatchEvent(event);

      expect(mockNavigate).toHaveBeenCalledWith('/test');
      unmount();
    });

    it('allows messages without origin in RN environment', () => {
      vi.mocked(nativeBridge.isReactNativeWebView).mockReturnValue(true);
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({ type: 'navigate:deeplink', payload: { path: '/test' } }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).toHaveBeenCalledWith('/test');
      unmount();
    });
  });

  describe('edge cases', () => {
    it('handles HTTPS URL in uppercase', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
          payload: { path: 'HTTPS://example.com/path' },
        }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).toHaveBeenCalledWith('/path');
      unmount();
    });

    it('handles HTTP URL', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
          payload: { path: 'http://example.com/path' },
        }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).toHaveBeenCalledWith('/path');
      unmount();
    });

    it('handles URL with empty pathname', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
          payload: { path: 'https://example.com' },
        }),
      });
      window.dispatchEvent(event);

      // Empty pathname becomes "/" which is ignored
      expect(mockNavigate).not.toHaveBeenCalled();
      unmount();
    });

    it('preserves all URL components (path, search, hash)', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
          payload: {
            path: 'https://example.com/path/to/page?foo=bar&baz=qux#section',
          },
        }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).toHaveBeenCalledWith(
        '/path/to/page?foo=bar&baz=qux#section'
      );
      unmount();
    });

    it('does not add multiple leading slashes', () => {
      const { unmount } = renderHook(() => useNativeNavigate(), { wrapper });

      const event = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'navigate:deeplink',
          payload: { path: '//already/has/slash' },
        }),
      });
      window.dispatchEvent(event);

      expect(mockNavigate).toHaveBeenCalledWith('//already/has/slash');
      unmount();
    });
  });
});