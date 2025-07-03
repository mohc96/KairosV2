
import Credentials from './components/Credentials';
import LogoContainer from './components/LogoContainer';
import IntroductionContainer from './components/IntroductionContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import SidebarBreakTimer from './components/Break';

export default function App() {
  return (
    <div className='App-container'>
      <Credentials/>
      <LogoContainer/>
      <IntroductionContainer/>
      <SidebarBreakTimer />
    </div>
  );
}
