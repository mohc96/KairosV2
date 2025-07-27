import IntroductionContainer from './IntroductionContainer';
import MorningPulse from './MorningPulse';
import SidebarAdvice from './Advice';
import CreateProject from './CreateProject';
import SidebarBreakTimer from './Break';
import AboutMe from './AboutMe';
import ExpertSearchComponent from './WhoCanHelp';

export default function StudentDashboard({ email }) {
  return (
    <div>
      <IntroductionContainer />
      <AboutMe />
      <MorningPulse />
      <SidebarAdvice />
      <CreateProject />
      <SidebarBreakTimer />
      <ExpertSearchComponent />
    </div>
  );
}
