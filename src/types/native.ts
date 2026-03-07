/**
 * Native Bridge Message Types
 */

// ============================================
// Link Message Types
// ============================================

/**
 * Link payload - URL to open
 */
export interface LinkPayload {
  url: string;
}

/**
 * Link response from native - success case
 */
export interface LinkResponse {
  type: 'link:response';
  success: boolean;
  url: string;
  canOpen?: boolean;
}

/**
 * Link error response from native
 */
export interface LinkError {
  type: 'link:error';
  error: string;
  url?: string;
}

/**
 * Can open URL check payload
 */
export interface LinkCanOpenPayload {
  url: string;
}

// ============================================
// Auth Message Types
// ============================================

/**
 * Auth token payload from native - accessToken issued by app
 */
export interface AuthTokenPayload {
  accessToken: string;
}

/**
 * Auth error payload from native - reissue failed (e.g. no refreshToken)
 */
export interface AuthErrorPayload {
  message: string;
}

// ============================================
// OS Share Message Types
// ============================================

/**
 * OS Share Intent payload - triggers native system share sheet
 */
export interface OsSharePayload {
  url: string;
}

// ============================================
// Message Type Union
// ============================================

/**
 * All possible messages from Web to Native
 */
export type WebToNativeMessage =
  | { type: 'link:open'; payload: LinkPayload }
  | { type: 'link:canOpen'; payload: LinkCanOpenPayload }
  | { type: 'os:share'; payload: OsSharePayload }
  | { type: 'auth:login'; payload: Record<string, never> }
  | { type: 'auth:logout'; payload: Record<string, never> };

/**
 * All possible messages from Native to Web
 */

export type NativeToWebMessage =
  | LinkResponse
  | LinkError
  | { type: 'auth:token'; payload: AuthTokenPayload }
  | { type: 'auth:login'; payload: AuthTokenPayload }
  | { type: 'auth:error'; payload: AuthErrorPayload };

export interface ReactNativeWebView {
  postMessage: (message: string) => void;
  addEventListener?: (event: string, handler: (event: Event) => void) => void;
  removeEventListener?: (
    event: string,
    handler: (event: Event) => void
  ) => void;
}
