import IntroductionContainer from './IntroductionContainer';
import MorningPulse from './MorningPulse';
import SidebarAdvice from './Advice';
import CreateProject from './CreateProject';
import SidebarBreakTimer from './Break';
import AboutMe from './AboutMe';

export default function StudentDashboard({ email }) {
  return (
    <div>
      <IntroductionContainer />
      <AboutMe />
      <MorningPulse />
      <SidebarAdvice />
      <CreateProject />
      <SidebarBreakTimer />
    </div>
  );
}
