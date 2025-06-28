import '../styles/LogoContainer.css'
import logo from "../assets/logo.png"
export default function LogoContainer() {
    return (
        <div className="LogoContainer">
            <div className="quotebox">
                <p>Get Sparked!</p>
            </div>
            <div className="logobox">
                <img src={logo} alt="Logo" className="logo" />
            </div>
        </div>
    );
  }