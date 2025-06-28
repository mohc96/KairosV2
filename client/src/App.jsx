import Title from './components/Title';
import Credentials from './components/Credentials';
import LogoContainer from './components/LogoContainer';
import IntroductionContainer from './components/IntroductionContainer';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <div className='App-container'>
      <Title/>
      <Credentials/>
      <LogoContainer/>
      <IntroductionContainer/>
    </div>
  );
}
