import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Send } from 'lucide-react';
import Dropdown from './Dropdown';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Skeleton from "react-loading-skeleton";
import CardSkeleton from './CardSkeleton';
import { faArrowPointer, faBars, faBell, faCoffee, faFolder, faSearch, faUser, faBackspace, faCalendarAlt, faPaperclip, faAnchor, faAlarmClock, faUmbrella, faPaintbrush, faHand, faHandPointer, faTree, faCaretDown, faCode, faChartBar, faSquareRootVariable, faHandPointDown, faCaretUp, faCaretRight, faArrowRight, faArrowDown, faAngleRight, faAngleDown, faList, faFile, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import housing_final_report from './housing_results/eda_final_report.json';
import YearBuiltVsSalePriceChart from './YearBuiltVsSalePriceChart.jsx';
import PCAComponentsChart from './PCAComponentsChart';

import JsonList from './JsonList';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import hyp_00bda110_13_yearbuilt_line from './housing_results/my_eda_analysis/plots/hyp_00bda110_13_yearbuilt_line.png';                          
import hyp_a85e0dfc_6_LotArea_zscore from './housing_results/my_eda_analysis/plots/hyp_a85e0dfc_6_LotArea_zscore.png';  
import hyp_00bda110_13_yearbuilt_scatter from './housing_results/my_eda_analysis/plots/hyp_00bda110_13_yearbuilt_scatter.png'; 
import hyp_dc548a64_4_missing_values_heatmap from './housing_results/my_eda_analysis/plots/hyp_dc548a64_4_missing_values_heatmap.png'; 
import hyp_0434c56d_14_neighborhood_density from './housing_results/my_eda_analysis/plots/hyp_0434c56d_14_neighborhood_density.png'; 
import hyp_ee4016c6_1_saleprice_distribution from './housing_results/my_eda_analysis/plots/hyp_ee4016c6_1_saleprice_distribution.png'; 
import hyp_0434c56d_14_overallqual_density from './housing_results/my_eda_analysis/plots/hyp_0434c56d_14_overallqual_density.png'; 
import hyp_fc5f160f_10_interaction_heatmap from './housing_results/my_eda_analysis/plots/hyp_fc5f160f_10_interaction_heatmap.png'; 
import hyp_19507431_19_lotfrontage_scatter from './housing_results/my_eda_analysis/plots/hyp_19507431_19_lotfrontage_scatter.png'; 
import hyp_fc5f160f_10_interaction_scatter from './housing_results/my_eda_analysis/plots/hyp_fc5f160f_10_interaction_scatter.png'; 
import hyp_1c6b14fc_3_neighborhood_vs_price_boxplot from './housing_results/my_eda_analysis/plots/hyp_1c6b14fc_3_neighborhood_vs_price_boxplot.png'; 
import hyp_iter1_0aa2b533_4_garage_propertytype_scatter from './housing_results/my_eda_analysis/plots/hyp_iter1_0aa2b533_4_garage_propertytype_scatter.png'; 
import hyp_1c6b14fc_3_neighborhood_vs_price_mean from './housing_results/my_eda_analysis/plots/hyp_1c6b14fc_3_neighborhood_vs_price_mean.png'; 
import hyp_iter1_244d5358_3_lotarea_boxplot from './housing_results/my_eda_analysis/plots/hyp_iter1_244d5358_3_lotarea_boxplot.png'; 
import hyp_3c6d450d_2_overallqual_vs_saleprice from './housing_results/my_eda_analysis/plots/hyp_3c6d450d_2_overallqual_vs_saleprice.png'; 
import hyp_iter1_244d5358_3_lotarea_outliers_scatter from './housing_results/my_eda_analysis/plots/hyp_iter1_244d5358_3_lotarea_outliers_scatter.png'; 
import hyp_3cc6e749_12_neighborhood_vs_saleprice from './housing_results/my_eda_analysis/plots/hyp_3cc6e749_12_neighborhood_vs_saleprice.png'; 
import hyp_iter1_42394ae8_6_lotfrontage_missing_boxplot from './housing_results/my_eda_analysis/plots/hyp_iter1_42394ae8_6_lotfrontage_missing_boxplot.png'; 
import hyp_4b95706b_7_garagearea_vs_saleprice from './housing_results/my_eda_analysis/plots/hyp_4b95706b_7_garagearea_vs_saleprice.png'; 
import hyp_iter1_567884d7_2_yearbuilt_neighborhood_interaction from './housing_results/my_eda_analysis/plots/hyp_iter1_567884d7_2_yearbuilt_neighborhood_interaction.png'; 
import hyp_4b95706b_7_garageyr_vs_saleprice from './housing_results/my_eda_analysis/plots/hyp_4b95706b_7_garageyr_vs_saleprice.png'; 
import hyp_iter1_641060e2_1_interaction_plot from './housing_results/my_eda_analysis/plots/hyp_iter1_641060e2_1_interaction_plot.png'; 
import hyp_4dead2a8_20_partial_dependence_fixed from './housing_results/my_eda_analysis/plots/hyp_4dead2a8_20_partial_dependence_fixed.png'; 
import hyp_iter1_6a7008a0_9_pool_quality_high_price_boxplot from './housing_results/my_eda_analysis/plots/hyp_iter1_6a7008a0_9_pool_quality_high_price_boxplot.png'; 
import hyp_585dfc61_18_polynomial_relation from './housing_results/my_eda_analysis/plots/hyp_585dfc61_18_polynomial_relation.png'; 
import hyp_iter1_8bda13e7_10_rooms_aboveground_relationship from './housing_results/my_eda_analysis/plots/hyp_iter1_8bda13e7_10_rooms_aboveground_relationship.png'; 
import hyp_5ba87c39_15_isolation_forest from './housing_results/my_eda_analysis/plots/hyp_5ba87c39_15_isolation_forest.png'; 
import hyp_iter1_b2bc09a4_5_totalbsmt_polynomial_relationship from './housing_results/my_eda_analysis/plots/hyp_iter1_b2bc09a4_5_totalbsmt_polynomial_relationship.png'; 
import hyp_5ba87c39_15_zscore_anomalies from './housing_results/my_eda_analysis/plots/hyp_5ba87c39_15_zscore_anomalies.png'; 
import hyp_iter1_f210c4b0_8_functional_saleprice_boxplot from './housing_results/my_eda_analysis/plots/hyp_iter1_f210c4b0_8_functional_saleprice_boxplot.png'; 
import hyp_6697ef0d_11_exterqual_boxplot from './housing_results/my_eda_analysis/plots/hyp_6697ef0d_11_exterqual_boxplot.png'; 
import hyp_iter2_2d350b0c_6_totalbsmt_outliers_boxplot from './housing_results/my_eda_analysis/plots/hyp_iter2_2d350b0c_6_totalbsmt_outliers_boxplot.png'; 
import hyp_683b1dd4_8_kitchenqual_boxplot from './housing_results/my_eda_analysis/plots/hyp_683b1dd4_8_kitchenqual_boxplot.png'; 
import hyp_iter2_2d350b0c_6_totalbsmt_outliers_scatter from './housing_results/my_eda_analysis/plots/hyp_iter2_2d350b0c_6_totalbsmt_outliers_scatter.png'; 
import hyp_6f49f677_16_bsmtcond_boxplot from './housing_results/my_eda_analysis/plots/hyp_6f49f677_16_bsmtcond_boxplot.png'; 
import hyp_iter2_3af2fc9a_1_neighborhood_yearbuilt_interaction from './housing_results/my_eda_analysis/plots/hyp_iter2_3af2fc9a_1_neighborhood_yearbuilt_interaction.png'; 
import hyp_6f49f677_16_bsmtqual_boxplot from './housing_results/my_eda_analysis/plots/hyp_6f49f677_16_bsmtqual_boxplot.png'; 
import hyp_iter2_44de524b_4_functional_neighborhood_saleprice from './housing_results/my_eda_analysis/plots/hyp_iter2_44de524b_4_functional_neighborhood_saleprice.png'; 
import hyp_93542f5a_9_pca_variance_explained from './housing_results/my_eda_analysis/plots/hyp_93542f5a_9_pca_variance_explained.png'; 
import hyp_iter2_5eaf0f91_10_pool_quality_boxplot from './housing_results/my_eda_analysis/plots/hyp_iter2_5eaf0f91_10_pool_quality_boxplot.png'; 
import hyp_97293e07_17_feature_clusters from './housing_results/my_eda_analysis/plots/hyp_97293e07_17_feature_clusters.png'; 
import hyp_iter2_9a6a0f9a_2_lotarea_neighborhood_saleprice_boxplot from './housing_results/my_eda_analysis/plots/hyp_iter2_9a6a0f9a_2_lotarea_neighborhood_saleprice_boxplot.png'; 
import hyp_a5ec488f_5_correlation_heatmap from './housing_results/my_eda_analysis/plots/hyp_a5ec488f_5_correlation_heatmap.png'; 
import hyp_iter2_d6de097a_7_neighborhood_trends_plot from './housing_results/my_eda_analysis/plots/hyp_iter2_d6de097a_7_neighborhood_trends_plot.png'; 
import hyp_a85e0dfc_6_GrLivArea_iqr from './housing_results/my_eda_analysis/plots/hyp_a85e0dfc_6_GrLivArea_iqr.png'; 
import hyp_iter2_dce26856_3_garagearea_relationship from './housing_results/my_eda_analysis/plots/hyp_iter2_dce26856_3_garagearea_relationship.png'; 
import hyp_a85e0dfc_6_GrLivArea_zscore from './housing_results/my_eda_analysis/plots/hyp_a85e0dfc_6_GrLivArea_zscore.png'; 
import hyp_iter2_f6815b97_9_garage_missing_boxplot from './housing_results/my_eda_analysis/plots/hyp_iter2_f6815b97_9_garage_missing_boxplot.png'; 
import hyp_a85e0dfc_6_LotArea_iqr from './housing_results/my_eda_analysis/plots/hyp_a85e0dfc_6_LotArea_iqr.png';

export default function EDAEngine({applyActiveLink}) {
  const [details, setDetails] = useState({});
  const [jsonData, setJsonData] = useState({});

  const [heading, setHeading] = useState('Description');
  const [showMarkdown, setShowMarkdown] = useState(true);
  const [mrkdown, setMrkdown] = useState('');
  const [isLoaded, setIsLoaded] = useState(1);

  const [etlimages, setEtlimages] = useState([]);
  const [currentChart, setCurrentChart] = useState(null);
  const [showChart, setShowChart] = useState(false);

const compMapping = [
{"data":'hyp_00bda110_13_yearbuilt_vs_saleprice.csv', "component": <YearBuiltVsSalePriceChart/>},
{"data":'hyp_93542f5a_9_pca_components.csv', "component": <PCAComponentsChart/>}
];

  applyActiveLink('eda');

 function loadData(report_fl) {
    setJsonData(report_fl);
    setIsLoaded(false);
    setTimeout(() => {
      setIsLoaded(true);
    },1000);
    /*fetch(fl_name).then((response) => response.text()).then((text) => {
        setMrkdown(text);       
    });*/
  }

  return (
    <>
      {/*<SimpleSnackbar></SimpleSnackbar>*/}
      <div class="flexVertical">
        <div class="flexAround">
          <div className="projectPanel margin-10">
          <Card style={{width:"calc(100%)"}}>           
            <CardContent>          
            {           
            <>    
              <h5 style={{fontWeight:300, marginLeft: 10}}> 
                <FontAwesomeIcon icon={faCode} /> EDA Engine
              </h5>
              <SimpleTreeView expandedItems={["grid"]}>   
                <TreeItem itemId="grid" label="Projects">
                  {['Housing Data'].map((each) => {                  
                     return (
                      <div>
                        <TreeItem itemId={each.split(' ').join('_')} label={each} onClick={()=>{loadData(housing_final_report);}} />
                      </div>
                    );                  
                  })}   
                </TreeItem>
              </SimpleTreeView>                     
            </>           
            }
</CardContent>
</Card>
</div>

<div class="flexVertical">
    {/*<div class="margin-10 flexRow">            
            <div style={{width:"33%"}}>
             {
             (Object.keys(jsonData).length>0) ? 
              <ExpandableCard txt={jsonData[Object.keys(jsonData)[0]]} heading={Object.keys(jsonData)[0]} myheight={500}></ExpandableCard>
              : null
            }
            </div>
            <div style={{width:"66%"}}>
              <div class="flexRow">
                <div style={{width:"49%"}}>
                  {(Object.keys(jsonData).length >1) ? <ExpandableCard txt={jsonData[Object.keys(jsonData)[1]]} heading={Object.keys(jsonData)[1]}></ExpandableCard>
                  :null}
                </div>
                <div style={{width:"49%"}}>
                  {(Object.keys(jsonData).length >2) ? <ExpandableCard txt={jsonData[Object.keys(jsonData)[2]]}  heading={Object.keys(jsonData)[2]}></ExpandableCard>
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
           </div>*/}
          <div class="cardLong margin-10">
            <Card style={{width:"calc(100% - 10px)"}}>           
                  <CardContent>
                      {(isLoaded && Object.keys(jsonData).length >1)  ? (
                        <>
                        <div class="flexRow fullWidth fullHeight">
                          <div style={{"marginRight":"20px", "background":"#f9f9f9", "width":"20%", "paddingTop":20, "maxHeight":800, "overflow":"scroll"}}>                       
                          <SimpleTreeView>
                            <TreeItem itemId="report" label="Report">
                              {Object.keys(jsonData).map(each => {
                              return (
                                <>
                                  <div class="flexRow flexStart">
                                    <TreeItem onClick={()=>{setShowMarkdown(false);setShowChart(false);setDetails(jsonData[each]);setHeading(each.split("_").length ? (each.split("_").map(txt => (txt.split("_")[0].charAt(0).toUpperCase() + txt.split("_")[0].slice(1))).join(' ')) : each);}} itemId={"finalReport_"+each} label={(each.split("_").length ? (each.split("_").map(txt => (txt.split("_")[0].charAt(0).toUpperCase() + txt.split("_")[0].slice(1))).join(' ')) : each)} />
                                  </div>                    
                                </>
                              );
                              })}
                            </TreeItem>
                          </SimpleTreeView>


                          <SimpleTreeView>
                            <TreeItem itemId="plots" label="Plots">
                              {
                              Object.keys(compMapping).map((each, idx) => {                          
                                
                                var csv = compMapping[each]["data"];
                                
                                var dataFile = csv.split('/')[csv.split('/').length-1];

                                var ls = dataFile.replace('.csv','').split('_');

                                var ttle = ls.slice(3, ls.length).join(' ');                                                              

                                return (
                                  <>
                                    <div class="flexRow flexStart">
                                      <TreeItem onClick={()=>{setCurrentChart(compMapping[each]["component"]);setShowChart(true);}} itemId={compMapping[each]["data"]} label={ttle} />
                                    </div>                    
                                  </>
                                );
                              })
                              }

                              {/*
                             jsonData["key_insights"].map((each, idx) => {                          
                                
                                var csv = each["files_created"][0];
                                
                                var dataFile = csv.split('/')[csv.split('/').length-1];

                                var ls = dataFile.replace('.csv','').split('_');

                                var ttle = ls.slice(ls.length-2, ls.length).join(' ');                                                              

                                return (
                                  <>
                                    <div class="flexRow flexStart">
                                      <TreeItem onClick={()=>{setCurrentChart(ttle);setShowChart(true);}} itemId={each["hypothesis_id"]} label={ttle} />
                                    </div>                    
                                  </>
                                );
                              })
                              */}
                              
                            </TreeItem>
                          </SimpleTreeView>
                        </div>

                        <div style={{"width":"80%", "textAlign":"left"}}>                          
                        {
                          showChart ? 
                          (
                            <>
                            <CardActions disableSpacing>
                              <h3 class="borderBottom">
                                <FontAwesomeIcon icon={faChartBar} />{heading}
                              </h3>
                            </CardActions>
                            {
                              currentChart
                            }
                            </>
                          ) :
                          (
                            <>     
                            <CardActions disableSpacing>  
                              <h3 class="borderBottom"> 
                                <FontAwesomeIcon icon={faPencil} />{heading}
                              </h3>             
                            </CardActions>
                            <JsonList data={details} />
                            </>
                          )                       
                        }
                        </div>
                        </div>
                        </>
              ) : ((isLoaded && Object.keys(jsonData).length <1) ? <><p style={{padding:10}}> <FontAwesomeIcon icon={faArrowPointer} />Please select a project</p></> : <><CardSkeleton amount={1} /></>)}
                  </CardContent>    
                </Card>
          </div>
          </div>
        </div>       
      </div>
    </>
  );
}


