import IntroductionContainer from './IntroductionContainer';
import MorningPulse from './MorningPulse';
import SidebarAdvice from './Advice';
import CreateProject from './CreateProject';
import SidebarBreakTimer from './Break';

export default function StudentDashboard({ email }) {
  return (
    <div>
      <IntroductionContainer />
      <MorningPulse />
      <SidebarAdvice />
      <CreateProject />
      <SidebarBreakTimer />
    </div>
  );
}
