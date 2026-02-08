import { useState } from 'react';
import ExternalLink from '@/components/link/externalLink';

export default function LinkTestPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );

  const handleOpen = () => setIsVisible(true);
  const handleClose = () => setIsVisible(false);

  const handleSelect = (id: string) => {
    console.log('Selected collection ID:', id);
    setSelectedCollection(id);
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-100 p-10 font-sans'>
      <div className='w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Link Component Test
          </h1>
          <p className='mt-2 text-gray-500'>
            Refactored React Native components test
          </p>
        </div>

        <div className='space-y-4'>
          <section className='rounded-xl border border-gray-100 bg-gray-50 p-4'>
            <h2 className='mb-2 text-sm font-semibold uppercase tracking-wider text-gray-700'>
              Status
            </h2>
            <div className='flex items-center space-x-2'>
              <div
                className={`h-3 w-3 rounded-full ${isVisible ? 'animate-pulse bg-green-500' : 'bg-gray-300'}`}
              />
              <span className='text-sm font-medium text-gray-600'>
                Bottom Sheet: {isVisible ? 'Open' : 'Closed'}
              </span>
            </div>
            {selectedCollection && (
              <div className='mt-2 text-sm text-gray-600'>
                Last Selected ID:{' '}
                <span className='font-mono font-bold text-blue-600'>
                  {selectedCollection}
                </span>
              </div>
            )}
          </section>

          <button
            onClick={handleOpen}
            className='flex w-full items-center justify-center rounded-xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98]'
          >
            Open Collection Bottom Sheet
          </button>
        </div>

        <div className='grid grid-cols-1 gap-4 text-xs text-gray-400'>
          <p>• Test Search functionality</p>
          <p>• Test "Add Collection" view transition</p>
          <p>• Test Category selection in add view</p>
          <p>• Test Responsive layout and animations</p>
        </div>
      </div>

      <ExternalLink
        visible={isVisible}
        onClose={handleClose}
        onClickAddCollection={() => console.log('Add clicked')}
        onSelect={handleSelect}
      />
    </div>
  );
}
