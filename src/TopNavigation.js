import { orange } from "@mui/material/colors";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from 'react-router-dom';

const TopNavigation = ({ activeLink, setActiveLink }) => {
  return (
        <div class="topNavigation">
            <ul>
                {activeLink !== 'business' ? 
                  <li>              
                    <Link to="/business">Business Discovery</Link>                
                  </li> : <li><span style={{"fontWeight": 500, "color": "#7d5204"}}>Business Discovery</span></li>
                }
                {
                  activeLink !== 'researcher' ? 
                  <li><Link to="/researcher">Deep Researcher</Link></li>
                  : <li><span style={{"fontWeight": 500, "color": "#7d5204"}}>Deep Researcher</span></li>
                }
                {
                  activeLink !== 'eda' ? 
                  <li><Link to="/eda">EDA Engine</Link></li>
                  : <li><span style={{"fontWeight": 500, "color": "#7d5204"}}>EDA Engine</span></li>
                }
                {
                 activeLink !== 'ml' ? 
                  <li><Link to="/ml">ML Engine</Link></li>
                  : <li><span style={{"fontWeight": 500, "color": "#7d5204"}}>ML Engine</span></li>
                }
              {/*<li><Link to="/memory">Memory Bank</Link></li>*/}
            </ul>
        </div>
  );
};

export default TopNavigation;