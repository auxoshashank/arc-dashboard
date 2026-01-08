import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { faBars, faBell, faCoffee, faFolder, faSearch, faUser, faBackspace, faCalendarAlt, faPaperclip, faAnchor, faAlarmClock, faUmbrella, faPaintbrush, faHand, faHandPointer, faTree, faCaretDown, faCode, faChartBar, faSquareRootVariable, faHandPointDown, faCaretUp, faCaretRight, faArrowRight, faArrowDown, faAngleRight, faAngleDown, faList, faFile, faArrowPointer, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import housing_final_report from './deepresearch_report.json';
//import housing_descriptionFile from './housing_04_11/description.md';

import JsonList from '../business/JsonList';
import ReactMarkdown from 'react-markdown';
import ExpandableCard from '../business/ExpandableCard';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

export default function DeepResearcher(view) {
  const [details, setDetails] = useState({});
  const [jsonData, setJsonData] = useState(housing_final_report);
  const [mrkdown, setMrkdown] = useState('');
  const [heading, setHeading] = useState('Description');
  const [showMarkdown, setShowMarkdown] = useState(true);
  const [isView, setIsView] = useState('list');
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    setIsView(view["view"]);
  }, [view]);

  return (
    <>
        <div class="flexAround">         
        <div class="flexVertical">
          {isView == 'list' ? 
          <div class="cardLong margin-10">                   
                      {
                      (isLoaded && Object.keys(jsonData).length >1) ? (
                        <>
                        <div class="flexRow fullWidth fullHeight">
                          <div style={{"marginRight":"10px", "width":"20%", "paddingTop":10}}>
                            <SimpleTreeView>
                              <TreeItem itemId="report" label="Report" expandedItems>
                                {Object.keys(jsonData).map(each => {
                                return (
                                  <>
                                    <div class="flexRow flexStart">
                                      <TreeItem onClick={()=>{setShowMarkdown(false);setDetails(jsonData[each]);setHeading(each.split("_").length ? (each.split("_").map(txt => (txt.split("_")[0].charAt(0).toUpperCase() + txt.split("_")[0].slice(1))).join(' ')) : each);}} itemId={"finalReport_"+each} label={(each.split("_").length ? (each.split("_").map(txt => (txt.split("_")[0].charAt(0).toUpperCase() + txt.split("_")[0].slice(1))).join(' ')) : each)} />
                                    </div>                    
                                  </>
                                );
                                })}
                              </TreeItem>
                            </SimpleTreeView>
                          </div>

                          <div style={{"width":"80%", "textAlign":"left"}}>
                          <>     
                          <CardActions disableSpacing>  
                            <h3 class="borderBottom"> 
                                <FontAwesomeIcon icon={faChartBar} />{heading}
                            </h3>             
                          </CardActions>
                          {!showMarkdown ? <>
                            <JsonList data={details} keyId="main"/>
                          </> : 
                            <ReactMarkdown children={mrkdown} />            
                          }
                          </>                        
                          </div>
                        </div>
                        </>
                      ) : ((isLoaded && Object.keys(jsonData).length <1) ? <><p style={{padding:10, fontSize: 18}}> <FontAwesomeIcon icon={faArrowPointer} />Please select a project</p></> : <></>)}
                  
          </div> : 
            
              (Object.keys(jsonData).length>0) ? 
                (
                  <>
                    <div class="margin-10 flexRow">            
                      <div style={{width:"33%"}}>            
                        <ExpandableCard txt={jsonData["data_schema"]} heading={"Data Schema"} myheight={500}></ExpandableCard>            
                      </div>
                      <div style={{width:"66%"}}>
                        <div class="flexRow">
                          <div style={{width:"49%"}}>
                            {(Object.keys(jsonData).length >1) ? <ExpandableCard txt={jsonData["business_impact_tracking"]} heading={"Business Impact Tracking"}></ExpandableCard>
                            :null}
                          </div>
                          <div style={{width:"49%"}}>
                            {(Object.keys(jsonData).length >2) ? <ExpandableCard txt={jsonData["problem_overview"]}  heading={"Problem Overview"}></ExpandableCard>
                            :null}
                          </div>
                        </div>
                        <div class="margin-top-20 flexRow">              
                          <div style={{width:"49%"}}>
                            {(Object.keys(jsonData).length >3) ? <ExpandableCard txt={jsonData[Object.keys(jsonData)[3]]}  heading={Object.keys(jsonData)[3]}></ExpandableCard>
                            :null}
                          </div>
                          <div style={{width:"49%"}}>
                            {(Object.keys(jsonData).length >4) ? <ExpandableCard txt={jsonData[Object.keys(jsonData)[4]]}  heading={Object.keys(jsonData)[4]}></ExpandableCard>
                            :null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )
                : null
             }
          </div>
        </div>       
    </>
  );
}