import '../styles/IntroductionContainer.css'
import playLessonIcon from '../assets/play_lesson_37dp_BLACK_FILL0_wght400_GRAD0_opsz40.png';

export default function IntroductionContainer()
{
    return(
        <div className="IntroductionContainer">
            <p>Welcome to your personalized learning experience!</p>
            <h4>Get started by selecting any of the options below!  Need help?
                Watch this video introduction</h4>
                <div className="introductionVideo">
                <img src={playLessonIcon}  alt="Play Lesson Icon" />
                <p>Watch video now</p>
                </div>
        </div>
    );
};