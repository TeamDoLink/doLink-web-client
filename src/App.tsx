import { Routes, Route } from 'react-router-dom';
import Test from './pages/test';
import Test2 from './pages/test2';

const Home = () => (
  <div className='flex h-screen items-center justify-center'>
    <h1 className='text-4xl font-bold'>DoLink Web Client</h1>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />

      {/* 공통 컴포넌트 테스트용 페이지 */}
      <Route path='/test' element={<Test />} />
      <Route path='/test2' element={<Test2 />} />
    </Routes>
  );
}

export default App;
