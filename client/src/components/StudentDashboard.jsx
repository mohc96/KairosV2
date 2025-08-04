import IntroductionContainer from './IntroductionContainer';
import MorningPulse from './MorningPulse';
import SidebarAdvice from './Advice';
import CreateProject from './CreateProject';
import SidebarBreakTimer from './Break';
import AboutMe from './AboutMe';
import ExpertSearchComponent from './WhoCanHelp';
import StudentProjects from './StudentProjects';

export default function StudentDashboard({ email }) {
  return (
    <div>
      <IntroductionContainer />
      <MorningPulse />
      <CreateProject />
      <StudentProjects />
      <SidebarAdvice />
      <ExpertSearchComponent />
      <AboutMe />
      <SidebarBreakTimer />
      
      
    </div>
  );
}
