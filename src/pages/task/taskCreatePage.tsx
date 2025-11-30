import { useCallback } from 'react';
import { InputField } from '@/components/common';
import { useClipboardBridge } from '@/hooks/useClipboardBridge';

/**
 * 업무 생성 페이지
 * React Native WebView에서 클립보드를 통해 링크를 입력받습니다.
 */
function TaskCreatePage() {
  const {
    linkValue,
    setLinkValue,
    requestClipboard,
    isLoading,
    error,
    clearError,
  } = useClipboardBridge();

  /**
   * 붙여넣기 버튼 클릭 핸들러
   */
  const handlePasteClick = useCallback(() => {
    clearError();
    requestClipboard();
  }, [requestClipboard, clearError]);

  /**
   * 입력값 변경 핸들러
   */
  const handleChange = useCallback(
    (value: string) => {
      setLinkValue(value);
      clearError();
    },
    [setLinkValue, clearError]
  );

  /**
   * 에러 메시지 표시
   */
  const showErrorMessage = (): string | undefined => {
    if (!error) return undefined;

    const message =
      error.code === 'WEBVIEW_NOT_AVAILABLE'
        ? 'React Native WebView 환경이 아닙니다.'
        : error.code === 'MESSAGE_FAILED'
          ? `클립보드 읽기 실패: ${error.message}`
          : `오류: ${error.message}`;

    return message;
  };

  return (
    <div>
      {/* 에러 메시지 표시 (현재는 alert 대체 가능) */}
      {error && (
        <div
          style={{
            marginBottom: '12px',
            padding: '10px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          ⚠️ {showErrorMessage()}
        </div>
      )}

      {/* 입력 필드 */}
      <InputField.TextInputField
        state={error ? 'Error' : 'Link'}
        placeholder='링크를 입력해주세요.'
        errorMessage={error ? showErrorMessage() : undefined}
        buttonLabel={isLoading ? '로딩 중...' : '붙여넣기'}
        value={linkValue}
        onChange={handleChange}
        onButtonClick={handlePasteClick}
        width='w-[335px]'
      />
    </div>
  );
}

export default TaskCreatePage;
