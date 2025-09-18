import IntroductionContainer from './IntroductionContainer';
import MorningPulse from './MorningPulse';
import SidebarAdvice from './Advice';
import CreateProject from './CreateProject/CreateProject';
import SidebarBreakTimer from './Break';
import AboutMe from './AboutMe';
import ExpertSearchComponent from './WhoCanHelp';
<<<<<<< HEAD
import StudentProjects from './StudentProjects';
import SidebarMorningPulse from './MorningPulse';
=======
import StudentProjects from './StudentProjects/StudentProjects';
>>>>>>> 01e5e0eb500df4c365905bb41ccc81f8b2a766fe

export default function StudentDashboard({ email }) {
  return (
    <div>
      <IntroductionContainer />
      <SidebarMorningPulse />
      <CreateProject />
      <StudentProjects />
      <SidebarAdvice />
      <ExpertSearchComponent />
      <AboutMe />
      <SidebarBreakTimer />
    </div>
  );
}
