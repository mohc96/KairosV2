import IntroductionContainer from './IntroductionContainer';
import MorningPulse from './MorningPulse';
import SidebarAdvice from './Advice';
import CreateProject from './CreateProject/CreateProject';
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
<<<<<<< HEAD
      <StudentProjects />
||||||| b9f5cb3
=======
      <AboutMe />
      <SidebarBreakTimer />
>>>>>>> staging
    </div>
  );
}
