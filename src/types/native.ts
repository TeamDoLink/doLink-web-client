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
// Message Type Union
// ============================================

/**
 * All possible messages from Web to Native
 */
export type WebToNativeMessage =
  | { type: 'link:open'; payload: LinkPayload }
  | { type: 'link:canOpen'; payload: LinkCanOpenPayload };

/**
 * All possible messages from Native to Web
 */
export type NativeToWebMessage = LinkResponse | LinkError;
