import Title from './components/Title';
import Credentials from './components/Credentials';
import LogoContainer from './components/LogoContainer';
import IntroductionContainer from './components/IntroductionContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import SidebarBreakTimer from './components/Break';
import SidebarAdvice from './components/Advice';

export default function App() {
  return (
    <div className='App-container'>
      <Title/>
      <Credentials/>
      <LogoContainer/>
      <IntroductionContainer/>
      <SidebarAdvice/>
      <SidebarBreakTimer />
    </div>
  );
}
