import { useEffect } from 'react';
import { CtaSecondButton } from '@/components/common/button/ctaSecondButton';
import { FlagLabel } from '@/components/common/label/flagLabel';
import { LinkCapsuleButton } from '@/components/common/button/linkCapsuleButton';
import { ShareCapsuleButton } from '@/components/common/button/shareCapsuleButton';
import { OptionMenu } from '@/components/common/menu/optionMenu';
import Test_yj1 from './test_yj1';
import {
  sendMessageToRN,
  addTypedMessageListener,
  isReactNativeWebView,
} from '@/utils/nativeBridge';

const Test3 = () => {
  // RN에서 메시지 수신 리스너 등록
  useEffect(() => {
    const cleanup = addTypedMessageListener('TEST_MESSAGE', (payload) => {
      console.log('Received from RN:', payload);
    });

    // 컴포넌트 언마운트 시 리스너 제거
    return cleanup;
  }, []);

  // 공통 클릭 핸들러
  const handleLinkClick = (url: string, appName: string) => {
    if (isReactNativeWebView()) {
      sendMessageToRN({
        type: 'LINK_BUTTON_CLICKED',
        payload: {
          url,
          timestamp: Date.now(),
        },
      });
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
