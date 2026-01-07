import logo from './logo.svg';
import './App.css';
import { useState , Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell,faArrowUp, faCoffee, faFolder, faSearch, faUser, faBackspace, faCalendarAlt, faPaperclip, faAnchor, faAlarmClock, faUmbrella, faPaintbrush, faHand, faHandPointer, faTree, faCaretDown, faCode, faChartBar, faSquareRootVariable, faHandPointDown, faCaretUp, faCaretRight, faArrowRight, faArrowDown, faAngleRight, faAngleDown, faList, faPlus, faMessage, faComment, faComments } from '@fortawesome/free-solid-svg-icons';
import ChatGPTInterface from './ChatGPTInterface';
import 'react-loading-skeleton/dist/skeleton.css'
import UserLogin from './UserLogin';
import BusinessDiscovery from './BusinessDiscovery';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dropdown from './Dropdown';
import { counter } from '@fortawesome/fontawesome-svg-core';
import DeepResearcher from './DeepResearcher';
import MLEngine from './MLEngine';
import EDAEngine from './EDAEngine';
import CreateProject from './CreateProject';
import TopNavigation from './TopNavigation';

function MainPanel({toggleExpand, count, isExpanded, toggleDropDown}){
  const [isLoaded, setIsLoaded] = useState(0);
  
  function toggleLoaded(isLoad){
     setIsLoaded(isLoad => !isLoad);
  };

  return (
    <>
    <div class="dashboardPanel">
      <div style={{width:"100%", borderRadius:50}}>
          <div style={{paddingBottom:0, cursor: "pointer", paddingRight:10, paddingTop:10,marginTop:10, paddingBottom:10, paddingLeft:20 }}>
            {(isExpanded ? <FontAwesomeIcon style={{fontSize:18}} icon={faAngleDown} /> : <FontAwesomeIcon style={{fontSize:18}} icon={faAngleRight} /> )}
            <span onClick={() => toggleExpand(isExpanded)} class="borderBottom" style={{fontWeight: 100}}> 
              Click here to begin
            </span>
          </div>
          {
          <div>
            {isExpanded ? (
            <>
              <div style={isExpanded ? {height:"unset"} : {height:0}} id="textBox">
                <ChatGPTInterface toggleDropDown={toggleDropDown} count = {count} toggleLoaded={toggleLoaded} isLoaded = {isLoaded}></ChatGPTInterface>   
              </div>
              <div style={{width:"98%",  paddingTop:0, textAlign: "center"}}>
                <span className="hint-text">
                  &nbsp;&nbsp;Start a conversation by typing a message below. Press Enter to send, Shift + Enter for new line
                </span>
              </div>
            </>
            ) : ""}
          </div>
          }
      </div>
    </div>
    </>
  )
}

function Header({toggleDropDown, count}){
  return <div>
    <div class="appHeader flexRow">
      <div class="flexRow">
      <button class="btn"><FontAwesomeIcon icon={faBars} style={{fontSize:30, marginTop:0}}/></button>
      <div class="logo"></div> 
      </div>
      {/*<div class="searchBox">
        <input type="search" id="search_query" name="q" placeholder="Enter your search terms"></input>
        <button class="searchBtn"><FontAwesomeIcon icon={faSearch} /></button>
      </div>*/}
      <div>
        <button class="btn bellIcon"><FontAwesomeIcon style={{fontSize:22, marginTop: 8}} icon={faBell}/></button>
        <UserLogin count={count} toggleDropDown={toggleDropDown}/>
      </div>

    </div>  
  </div>
}

function LeftPanel(){
  return <div class="leftPanel">
    {<ul class="navMenu">
      <li>
        <div class="addAction">
        <Link to="/create"><FontAwesomeIcon style={{"color" : '#fff', fontSize: 18, marginTop:5}} icon={faPlus} /></Link>
        </div>
      </li>
      {/*<li class="iconMenu">
        <Link to="/"><FontAwesomeIcon style={{"color" : 'rgba(0, 0, 0, 0.5)',  marginLeft:5, fontSize: 24}}  icon={faComments} /></Link>
      </li>*/}
      <li class="iconMenu">
        <Link to="/business"><FontAwesomeIcon style={{"color" : 'rgba(0, 0, 0, 0.5)',  marginLeft:5, fontSize: 24}}  icon={faList} /></Link>
      </li>
    </ul>}
  </div>
}

export default function App() {
  const [isExpanded, setIsExpanded] = useState(1);
  const [countUser, setCountUser] = useState(false);
  const [count, setCount] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  function toggleDropDown(val) {
    setCount(val);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function scrollToBottom() {
    window.scrollTo(0, (window.document.body.scrollHeight - window.innerHeight));
  }


  function toggleDropDownUser(val) {
    setCountUser(val);
  }

  function toggleExpanded(isExpanded){
    setIsExpanded(isExpanded => !isExpanded);
  };

  function applyActiveLink(myLink){
    setActiveLink(myLink);
  };

  const [menuIcons, setMenuIcons] = useState([{
    'name':'Home',
    'url':'./folder.png'
  }, {
    'name':'Action',
    'url':'./folder.png'
  }, {
    'name':'Action',
    'url':'./folder.png'
  }, {
    'name':'Action',
    'url':'./folder.png'
  }, {
    'name':'Action',
    'url':'./folder.png'
  }, {
    'name':'Action',
    'url':'./folder.png'
  }, {
    'name':'Action',
    'url':'./folder.png'
  }]);  

  return (
    <>
    <Header toggleDropDown={toggleDropDownUser} count={countUser} />
    <BrowserRouter>
    <TopNavigation activeLink={activeLink}></TopNavigation>                    
    <div class="flexRow margin-top-1">
     <LeftPanel />
     <div className="main" onClick={(event) => {
          if (event.target.className!=="dropdown-item" && event.target.className!=="userLogin" && event.target.className!=="dropdown-btn"){
            toggleDropDown(false);
            toggleDropDownUser(false);
          };
          event.stopPropagation();
        }}>       
        <div class="flexRow">
            <Routes>
                <Route path="/" element={<MainPanel toggleExpand={toggleExpanded} toggleDropDown={toggleDropDown} count={count} isExpanded = {isExpanded} />} />                
                <Route path="/create" element={<CreateProject />} />
                <Route path="/auxo-dashboard" element={<MainPanel toggleExpand={toggleExpanded} toggleDropDown={toggleDropDown} count={count} isExpanded = {isExpanded} />} />
                <Route path="/business" element={<BusinessDiscovery applyActiveLink={applyActiveLink} />} />
                <Route path="/researcher" element={<DeepResearcher  applyActiveLink={applyActiveLink} />} />
                <Route path="/eda" element={<EDAEngine applyActiveLink={applyActiveLink} />} />
                <Route path="/ml" element={<MLEngine applyActiveLink={applyActiveLink} />} />                
            </Routes>                         
        </div>
      </div>      
    </div>
    </BrowserRouter>

      <button class="go-to-top" onClick={scrollToTop}>
        <FontAwesomeIcon icon={faArrowUp} /> 
      </button>

      <button class="go-to-bottom" onClick={scrollToBottom}>
        <FontAwesomeIcon icon={faArrowDown} /> 
      </button>
    </>    
  );
}