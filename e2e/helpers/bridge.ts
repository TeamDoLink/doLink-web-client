/**
 * Native Bridge Mock 헬퍼
 *
 * DoLink 웹앱은 React Native WebView와 postMessage로 통신합니다.
 * Playwright 테스트에서는 실제 RN이 없으므로, window에 가짜 ReactNativeWebView를 주입하고
 * auth:login 요청이 들어오면 즉시 mock 응답을 dispatch합니다.
 *
 * 앱의 platform 감지: iOS → window listen, Android/Web → document listen
 * Playwright(Chromium)에서는 document에 이벤트를 dispatch합니다.
 */

/** 브라우저에 주입할 스크립트: 미인증(게스트) mock */
export const GUEST_BRIDGE_SCRIPT = `
  window.__dolinkBridgeMocked = true;
  window.ReactNativeWebView = {
    postMessage: function(raw) {
      var msg;
      try { msg = JSON.parse(raw); } catch(e) { return; }

      if (msg.type === 'auth:login') {
        // 인증 없음 → auth:error 즉시 dispatch
        var event = new MessageEvent('message', {
          data: JSON.stringify({ type: 'auth:error', payload: { message: 'not authenticated' } }),
          bubbles: true,
        });
        document.dispatchEvent(event);
        window.dispatchEvent(event);
      }
    }
  };
`;

/** 브라우저에 주입할 스크립트: 인증(로그인) mock */
export function authenticatedBridgeScript(accessToken = 'mock-access-token') {
  return `
    window.__dolinkBridgeMocked = true;
    window.ReactNativeWebView = {
      postMessage: function(raw) {
        var msg;
        try { msg = JSON.parse(raw); } catch(e) { return; }

        if (msg.type === 'auth:login' || msg.type === 'auth:reissue') {
          var event = new MessageEvent('message', {
            data: JSON.stringify({
              type: 'auth:token',
              payload: { accessToken: '${accessToken}' }
            }),
            bubbles: true,
          });
          document.dispatchEvent(event);
          window.dispatchEvent(event);
        }

        if (msg.type === 'app:getInfo') {
          var event = new MessageEvent('message', {
            data: JSON.stringify({
              type: 'app:info',
              payload: { version: '9.9.9-test', runtimeVersion: '9.9.9-runtime' }
            }),
            bubbles: true,
          });
          document.dispatchEvent(event);
          window.dispatchEvent(event);
        }
      }
    };
  `;
}
