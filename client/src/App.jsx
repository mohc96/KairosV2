
import Credentials from './components/Credentials';
import LogoContainer from './components/LogoContainer';
import IntroductionContainer from './components/IntroductionContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import SidebarBreakTimer from './components/Break';
import SidebarAdvice from './components/Advice';
import NewDocCreator from './components/NewDocCreator';
import MorningPulse from './components/MorningPulse';
import CreateProject from './components/CreateProject';


export default function App() {
  return (
    <div className='App-container'>
      <Credentials/>
      <LogoContainer/>
      <IntroductionContainer/>
      <MorningPulse/>
      <SidebarAdvice/>
      <CreateProject/>
      <SidebarBreakTimer />
      
    </div>
  );
}
