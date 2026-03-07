import { useEffect } from 'react';
import { LinkCapsuleButton } from '@/components/common/button/linkCapsuleButton';
import { ShareCapsuleButton } from '@/components/common/button/shareCapsuleButton';

import {
  openLink,
  addTypedMessageListener,
  isReactNativeWebView,
} from '@/utils/nativeBridge';

const Test3 = () => {
  // Native에서 테스트 메시지 수신 리스너 (예시)
  useEffect(() => {
    const cleanup = addTypedMessageListener('TEST_MESSAGE', (payload) => {
      console.log('Received from Native:', payload);
    });

    return cleanup;
  }, []);

  // Link 열기 핸들러 - openLink 함수를 사용하여 Native에 요청
  const handleLinkClick = (url: string, appName: string) => {
    if (isReactNativeWebView()) {
      console.log(`🔗 ${appName} 링크 열기 요청:`, url);
      openLink(url);
    } else {
      alert(`${appName} 링크 클릭 (Not in RN WebView)\nURL: ${url}`);
    }
  };

  return (
    <main className='min-h-screen w-full bg-grey-50 px-6 py-10 text-grey-900'>
      <div className='space-y-8'>
        {/* 유효한 URL 테스트 */}
        <section>
          <h2 className='mb-4 text-heading-sm font-semibold'>
            유효한 URL 테스트
          </h2>
          <div className='flex flex-wrap gap-2'>
            <LinkCapsuleButton
              label='Gemini로 이동'
              onClick={() =>
                handleLinkClick(
                  'https://gemini.google.com/app/d584eb509e80884f?hl=ko',
                  'Gemini'
                )
              }
            />
            <LinkCapsuleButton
              label='YouTube로 이동'
              onClick={() =>
                handleLinkClick(
                  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                  'YouTube'
                )
              }
            />
            <LinkCapsuleButton
              label='Google로 이동'
              onClick={() =>
                handleLinkClick(
                  'https://www.google.com/search?q=test',
                  'Google'
                )
              }
            />
            <LinkCapsuleButton
              label='한글 URL로 이동'
              onClick={() =>
                handleLinkClick(
                  'https://example.com/검색?query=테스트',
                  '한글 URL'
                )
              }
            />

            <LinkCapsuleButton
              label='instagram'
              onClick={() =>
                handleLinkClick(
                  'https://www.instagram.com/p/DP2rODxkhJk/',
                  'instagram'
                )
              }
            />
          </div>
        </section>

        {/* 유효하지 않은 URL 테스트 */}
        <section>
          <h2 className='mb-4 text-heading-sm font-semibold'>
            유효하지 않은 URL 테스트
          </h2>
          <div className='flex flex-wrap gap-2'>
            <LinkCapsuleButton
              label='잘못된 URL (not-a-url)'
              onClick={() => handleLinkClick('not-a-url', 'Invalid URL')}
            />
            <LinkCapsuleButton
              label='빈 문자열'
              onClick={() => handleLinkClick('', 'Empty String')}
            />
            <LinkCapsuleButton
              label='불완전한 URL (http://)'
              onClick={() => handleLinkClick('http://', 'Incomplete URL')}
            />
          </div>
        </section>

        {/* 기타 컴포넌트 */}
        <section>
          <h2 className='mb-4 text-heading-sm font-semibold'>기타 컴포넌트</h2>
          <div className='flex gap-2'>
            <ShareCapsuleButton />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Test3;
