import { useState } from 'react';
import { List, InputField, Filter, FeedBack } from '@/components/common';
import searchIcon from '@/assets/icons/common/search-24.svg';

const TEST_URL_IMG =
  'https://item.kakaocdn.net/do/9d272c87ee51db09570db3d980fc2a124022de826f725e10df604bf1b9725cfd';

const TEST_URL_IMG_2 =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdLtukRRbGOKzlpuas1w85dPCClPYAx7O9YA&s';

// youtube thumbnail test image
const TEST_URL_IMG_3 =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi_8McCQneFJHdHmzTsFcZSh3MaTqBf2Q9rw&s';

// LinkItem 샘플 데이터
const SAMPLE_LINKS = [
  {
    id: 1,
    title: 'teseteststststststststststststststststststststststststststst',
    subtitle: '인스타그램 (Instagram)',
    thumbnail: TEST_URL_IMG,
  },
  {
    id: 2,
    title:
      '도쿄 맛집 추천 리스트 길게 적기 테스트용입니다.도쿄 맛집 추천 리스트 길게 적기 테스트용입니다.도쿄 맛집 추천 리스트 길게 적기 테스트용입니다.',
    subtitle: '인스타그램 (Instagram)',
    thumbnail: TEST_URL_IMG_3,
  },
  {
    id: 3,
    title: '도쿄 디즈니랜드 가이드',
    subtitle: '네이버 블로그',
    thumbnail: '',
  },
];

// TaskSearchItem 샘플 데이터
const SAMPLE_SEARCH_TASKS = [
  {
    id: 1,
    title: '도쿄 디즈니랜드 완벽 가이드',
    subtitle: '1일 전 · 인스타그램 (Instagram)',
    thumbnail: TEST_URL_IMG,
    isCompleted: true,
  },
  {
    id: 2,
    title: '도쿄 맛집 추천 리스트',
    subtitle: '2일 전 · 네이버 블로그',
    thumbnail: TEST_URL_IMG,
    isCompleted: false,
  },
  {
    id: 3,
    title: '서울 카페 투어',
    subtitle: '3일 전 · 카카오톡',
    thumbnail: '',
    isCompleted: true,
  },
  {
    id: 4,
    title: '부산 여행 코스',
    subtitle: '5일 전 · 인스타그램 (Instagram)',
    thumbnail: TEST_URL_IMG,
    isCompleted: false,
  },
  {
    id: 5,
    title: '제주도 렌트카 정보',
    subtitle: '1주 전 · 네이버 블로그',
    thumbnail: '',
    isCompleted: false,
  },
];

// 샘플 아카이브 데이터
const SAMPLE_ARCHIVES = [
  {
    id: 1,
    title:
      '2025 연말 도쿄 여행ㅓㅁ이ㅏㅓ마ㅣㄹㅇㄴ리ㅏㅁㄴ어ㅏㅣ러미ㅏㄴ어리ㅏㅁㄴ어ㅣㅏㄹㄴ머이ㅏ러ㅣ만어라ㅣ먼이ㅏ럼니ㅏㅓ리ㅏㅁ너이ㅏ런미ㅏ어리ㅏ넝라ㅣㅓㄴ',
    category: '여행',
    itemCount: 4,
    previewImages: [TEST_URL_IMG, TEST_URL_IMG_3, TEST_URL_IMG, TEST_URL_IMG],
  },
  {
    id: 2,
    title: '서울 맛집 탐방',
    category: '음식점',
    itemCount: 8,
    previewImages: [TEST_URL_IMG, TEST_URL_IMG_3],
  },
  {
    id: 3,
    title: '도서 추천 리스트',
    category: '공부',
    itemCount: 12,
    previewImages: [],
  },
  {
    id: 4,
    title: '파리 여행 계획',
    category: '여행',
    itemCount: 6,
    previewImages: [TEST_URL_IMG_2],
  },
  {
    id: 5,
    title: 'React 학습 로드맵',
    category: '공부',
    itemCount: 15,
    previewImages: [TEST_URL_IMG_2, TEST_URL_IMG_3, TEST_URL_IMG_2],
  },
  {
    id: 6,
    title: '주말 등산 코스',
    category: '운동',
    itemCount: 5,
    previewImages: [],
  },
  {
    id: 7,
    title: '도쿄 디즈니랜드 가이드',
    category: '여행',
    itemCount: 10,
    previewImages: [TEST_URL_IMG_2, TEST_URL_IMG_3],
  },
  {
    id: 8,
    title: '홈트레이닝 루틴',
    category: '운동',
    itemCount: 7,
    previewImages: [
      TEST_URL_IMG_2,
      TEST_URL_IMG_2,
      TEST_URL_IMG_2,
      TEST_URL_IMG_2,
    ],
  },
];

function ClearableSearchInputDemo() {
  const [val, setVal] = useState('');

  return (
    <div className='space-y-2'>
      <InputField.ClearableSearchInputField
        value={val}
        onChange={setVal}
        leadingIcon={<img src={searchIcon} alt='search' className='h-5 w-5' />}
        className='w-full'
      />

      <p className='text-sm text-grey-600'>
        현재 값:{' '}
        <span className='font-mono text-grey-800'>{val || '<빈 값>'}</span>
      </p>
    </div>
  );
}

const Test_yj1 = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLinkQuery, setSearchLinkQuery] = useState('');
  const [sortValue, setSortValue] = useState('latest');

  // LinkItem 상태 관리
  const [linkStates, setLinkStates] = useState<Record<number, boolean>>(
    SAMPLE_LINKS.reduce((acc, link) => ({ ...acc, [link.id]: false }), {})
  );
  const [linkEditModes, setLinkEditModes] = useState<Record<number, boolean>>(
    SAMPLE_LINKS.reduce((acc, link) => ({ ...acc, [link.id]: false }), {})
  );

  const handleLinkCheck = (id: number, checked: boolean) => {
    setLinkStates((prev) => ({ ...prev, [id]: checked }));
  };

  const handleEditModeChange = (id: number, isEditMode: boolean) => {
    setLinkEditModes((prev) => ({ ...prev, [id]: isEditMode }));
  };

  // 검색어로 필터링
  const filteredArchives = SAMPLE_ARCHIVES.filter((archive) =>
    archive.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 할일 검색 필터링
  const filteredSearchTasks = SAMPLE_SEARCH_TASKS.filter((task) =>
    task.title.toLowerCase().includes(searchLinkQuery.toLowerCase())
  );

  return (
    <main className='min-h-screen w-full bg-grey-50 px-6 py-10 text-grey-900'>
      <div className='mx-auto flex max-w-4xl flex-col gap-8'>
        {/* TaskSearchItem Demo Section */}
        <section className='rounded-2xl bg-white p-6 shadow-sm'>
          <div className='space-y-4'>
            <div>
              <h2 className='mb-2 text-xl font-semibold'>
                TaskSearchItem 데모
              </h2>
              <p className='text-sm text-grey-600'>
                할일 검색 결과 아이템 - 검색어 하이라이트 및 완료 상태 표시
              </p>
            </div>

            <div className='space-y-6'>
              <div className='rounded-lg bg-grey-50 p-4'>
                <h3 className='mb-3 font-semibold text-grey-900'>
                  💡 사용 방법
                </h3>
                <ul className='space-y-2 text-sm text-grey-700'>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1 text-point'>•</span>
                    <span>
                      <strong>검색어 입력:</strong> 제목에 포함된 텍스트가
                      파란색으로 하이라이트
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1 text-point'>•</span>
                    <span>
                      <strong>완료 배지:</strong> isCompleted가 true인 항목에
                      "완료" 표시
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1 text-point'>•</span>
                    <span>
                      <strong>썸네일:</strong> 없는 경우 no-img-data 아이콘 표시
                    </span>
                  </li>
                </ul>
              </div>

              <div className='space-y-3'>
                <h3 className='font-semibold text-grey-900'>검색 필드</h3>
                <InputField.ClearableSearchInputField
                  value={searchLinkQuery}
                  onChange={setSearchLinkQuery}
                  placeholder='할일을 검색해보세요 (예: 도쿄, 서울, 부산)'
                  leadingIcon={
                    <img src={searchIcon} alt='search' className='h-5 w-5' />
                  }
                  className='w-full'
                />

                {searchLinkQuery && (
                  <div className='rounded-lg bg-point/10 p-3'>
                    <p className='text-sm font-semibold text-grey-900'>
                      검색어:{' '}
                      <span className='text-point'>{searchLinkQuery}</span>
                    </p>
                    <p className='mt-1 text-sm text-grey-600'>
                      {filteredSearchTasks.length}개의 결과를 찾았습니다
                    </p>
                  </div>
                )}

                <div className='flex flex-wrap gap-2'>
                  <p className='w-full text-sm font-semibold text-grey-700'>
                    빠른 검색:
                  </p>
                  {['도쿄', '서울', '부산', '카페', '여행'].map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => setSearchLinkQuery(keyword)}
                      className='rounded-md bg-grey-200 px-3 py-1.5 text-sm font-medium text-grey-700 transition-colors hover:bg-point hover:text-white'
                    >
                      {keyword}
                    </button>
                  ))}
                  <button
                    onClick={() => setSearchLinkQuery('')}
                    className='rounded-md bg-grey-300 px-3 py-1.5 text-sm font-medium text-grey-700 transition-colors hover:bg-grey-400'
                  >
                    초기화
                  </button>
                </div>
              </div>

              <div className='space-y-3'>
                <h3 className='font-semibold text-grey-900'>
                  검색 결과 ({filteredSearchTasks.length}개)
                </h3>
                {filteredSearchTasks.length > 0 ? (
                  <div className='space-y-2'>
                    {filteredSearchTasks.map((task) => (
                      <div
                        key={task.id}
                        className='flex flex-col items-start gap-4 self-stretch'
                      >
                        <List.TaskSearchItem
                          title={task.title}
                          subtitle={task.subtitle}
                          thumbnail={task.thumbnail}
                          searchQuery={searchLinkQuery}
                          isCompleted={task.isCompleted}
                          onClick={() => {
                            console.log('Clicked:', task.title);
                            alert(`"${task.title}" 클릭됨!`);
                          }}
                          width='w-full'
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='rounded-lg border-2 border-dashed border-grey-300 bg-grey-100 p-8 text-center'>
                    <p className='text-sm font-semibold text-grey-600'>
                      검색 결과가 없습니다
                    </p>
                    <p className='mt-1 text-sm text-grey-500'>
                      다른 검색어를 입력해보세요
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className='rounded-2xl bg-white p-6 shadow-sm'>
          {/* Header */}
          <header className='space-y-3'>
            <h2 className='mb-2 text-xl font-semibold'>
              ArchiveSearchItem 데모
            </h2>
          </header>

          {/* Search Input Section */}
          <section className='rounded-2xl bg-white shadow-sm'>
            <div className='space-y-4'>
              <div>
                <p className='mb-2 text-xl font-semibold'>검색 필드</p>
                <p className='text-sm text-grey-600'>
                  원하는 아카이브를 검색해보세요 (예: "도쿄", "여행", "공부")
                </p>
              </div>

              <InputField.SearchInputField
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder='아카이브를 검색해보세요'
                width='w-full'
              />

              {searchQuery && (
                <div className='rounded-lg bg-point/10 p-4'>
                  <p className='text-sm font-semibold text-grey-900'>
                    검색어: <span className='text-point'>{searchQuery}</span>
                  </p>
                  <p className='mt-1 text-sm text-grey-600'>
                    {filteredArchives.length}개의 결과를 찾았습니다
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className='rounded-2xl bg-white p-6 shadow-sm'>
            <div className='space-y-4'>
              <div className='rounded-lg bg-grey-100 p-4'>
                <h3 className='mb-2 font-semibold text-grey-900'>
                  🎯 테스트 추천 검색어
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {[
                    '도쿄',
                    '여행',
                    '공부',
                    '운동',
                    '서울',
                    'React',
                    '리스트',
                  ].map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => setSearchQuery(keyword)}
                      className='rounded-md bg-white px-3 py-1.5 text-sm font-medium text-grey-700 transition-colors hover:bg-point hover:text-white'
                    >
                      {keyword}
                    </button>
                  ))}
                  <button
                    onClick={() => setSearchQuery('')}
                    className='rounded-md bg-grey-300 px-3 py-1.5 text-sm font-medium text-grey-700 transition-colors hover:bg-grey-400'
                  >
                    초기화
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Search Results Section */}
          <section className='rounded-2xl bg-white shadow-sm'>
            <div className='space-y-4'>
              <div className='mb-4'>
                <h2 className='text-xl font-semibold'>검색 결과</h2>
                <p className='text-sm text-grey-600'>
                  {searchQuery
                    ? `"${searchQuery}" 검색 결과 ${filteredArchives.length}개`
                    : '전체 아카이브'}
                </p>
              </div>

              {filteredArchives.length > 0 ? (
                <div className='flex flex-col gap-2'>
                  {filteredArchives.map((archive) => (
                    <div
                      key={archive.id}
                      className='flex flex-col items-start gap-4 self-stretch'
                    >
                      <List.ArchiveSearchItem
                        title={archive.title}
                        category={archive.category}
                        itemCount={archive.itemCount}
                        images={archive.previewImages}
                        searchQuery={searchQuery}
                        onClick={() => {
                          console.log('Clicked:', archive.title);
                          alert(`"${archive.title}" 클릭됨!`);
                        }}
                        width='w-full'
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className='rounded-lg border-2 border-dashed border-grey-300 bg-grey-100 p-12 text-center'>
                  <p className='text-lg font-semibold text-grey-600'>
                    검색 결과가 없습니다
                  </p>
                  <p className='mt-2 text-sm text-grey-500'>
                    다른 검색어를 입력해보세요
                  </p>
                </div>
              )}
            </div>
          </section>
        </section>

        {/* LinkItem Demo Section */}
        <section className='rounded-2xl bg-white p-6 shadow-sm'>
          <div className='space-y-4'>
            <div>
              <h2 className='mb-2 text-xl font-semibold'>LinkItem 데모</h2>
              <p className='text-sm text-grey-600'>
                링크 아이템 컴포넌트 - default, done, edit 상태 테스트
              </p>
            </div>

            <div className='space-y-6'>
              <div className='rounded-lg bg-grey-50 p-4'>
                <h3 className='mb-3 font-semibold text-grey-900'>
                  💡 사용 방법
                </h3>
                <ul className='space-y-2 text-sm text-grey-700'>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1 text-point'>•</span>
                    <span>
                      <strong>체크박스 클릭:</strong> default ↔ done 상태 전환
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1 text-point'>•</span>
                    <span>
                      <strong>수정 버튼 클릭:</strong> edit 모드 진입
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1 text-point'>•</span>
                    <span>
                      <strong>edit 모드에서 외부 클릭:</strong> 이전 상태로 복귀
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1 text-point'>•</span>
                    <span>
                      <strong>완료 상태:</strong> 제목에 취소선 표시
                    </span>
                  </li>
                </ul>
              </div>

              <div className='space-y-4'>
                {SAMPLE_LINKS.map((link) => (
                  <div
                    key={link.id}
                    className='rounded-lg border border-grey-200 bg-white p-4'
                  >
                    <div className='mb-3 flex items-center justify-between'>
                      <h4 className='text-sm font-semibold text-grey-900'>
                        링크 #{link.id}
                      </h4>
                      <button
                        onClick={() =>
                          handleEditModeChange(link.id, !linkEditModes[link.id])
                        }
                        className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                          linkEditModes[link.id]
                            ? 'bg-grey-200 text-grey-700 hover:bg-grey-300'
                            : 'bg-point text-white hover:bg-point/90'
                        }`}
                      >
                        {linkEditModes[link.id] ? '수정 완료' : '수정'}
                      </button>
                    </div>
                    <List.LinkItem
                      title={link.title}
                      subtitle={link.subtitle}
                      thumbnail={link.thumbnail}
                      checked={linkStates[link.id]}
                      isEditMode={linkEditModes[link.id]}
                      onChange={(checked) => handleLinkCheck(link.id, checked)}
                      onOriginalClick={() => {
                        console.log('원본 클릭:', link.title);
                        alert(`${link.title}의 원본 보기`);
                      }}
                      onShareClick={() => {
                        console.log('공유 클릭:', link.title);
                        alert(`${link.title} 공유하기`);
                      }}
                      onEditClick={() => {
                        console.log('편집 클릭:', link.title);
                        alert(`${link.title} 편집하기`);
                      }}
                      onDeleteClick={() => {
                        console.log('삭제 클릭:', link.title);
                        if (confirm(`${link.title}을(를) 삭제하시겠습니까?`)) {
                          alert('삭제됨');
                        }
                      }}
                      width='w-full'
                    />
                  </div>
                ))}
              </div>

              <div className='rounded-lg border border-grey-300 bg-white p-4'>
                <h3 className='mb-3 font-semibold text-grey-900'>
                  현재 상태 확인
                </h3>
                <div className='space-y-2'>
                  {SAMPLE_LINKS.map((link) => (
                    <div
                      key={link.id}
                      className='flex items-center justify-between rounded-md bg-grey-50 px-3 py-2'
                    >
                      <span className='text-sm text-grey-700'>
                        {link.title.substring(0, 20)}...
                      </span>
                      <div className='flex items-center gap-2'>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            linkEditModes[link.id]
                              ? 'bg-orange-500 text-white'
                              : 'bg-grey-200 text-grey-600'
                          }`}
                        >
                          {linkEditModes[link.id] ? 'Edit' : 'Normal'}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            linkStates[link.id]
                              ? 'bg-point text-white'
                              : 'bg-grey-200 text-grey-600'
                          }`}
                        >
                          {linkStates[link.id] ? 'Done' : 'Default'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OutlineBox Demo Section */}
        <section className='rounded-2xl bg-white p-6 shadow-sm'>
          <div className='space-y-4'>
            <div>
              <h2 className='mb-2 text-xl font-semibold'>
                피드백(데이터 없음) 데모
              </h2>
              <p className='text-sm text-grey-600'>
                저장된 항목이 없을 때 표시되는 컴포넌트 예시입니다.
              </p>
            </div>

            <div className='flex flex-col items-center gap-6'>
              <FeedBack.EmptyNotice />
            </div>
          </div>
        </section>

        {/* ClearableSearchInputField Demo Section */}
        <section className='rounded-2xl bg-white p-6 shadow-sm'>
          <div className='space-y-4'>
            <div>
              <h2 className='mb-2 text-xl font-semibold'>
                ClearableSearchInputField 테스트
              </h2>
              <p className='text-sm text-grey-600'>
                포커스 시 X(클리어) 버튼이 보이고 클릭하면 값이 초기화됩니다.
              </p>
            </div>

            <ClearableSearchInputDemo />
            <div>
              <div className='mt-4'>
                <h3 className='mb-2 font-semibold'>드롭다운 테스트</h3>
                <Filter.DropDownMenu
                  options={[
                    { label: '최신 순', value: 'latest' },
                    { label: '오래된 순', value: 'old' },
                  ]}
                  selectedValue={sortValue}
                  onSelect={(v) => setSortValue(v)}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Test_yj1;
