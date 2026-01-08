"use client";
import React from 'react';
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Chart as ChartJS, CategoryScale, ArcElement, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
//import { motion } from "motion/react";
import Link from 'next/link'
import DeepResearcher from './DeepResearcher';

export default function Business() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState({});
  const [activeTab, setActiveTab] = useState("details");
  const [activeTabChart, setActiveTabChart] = useState("agegroup");
  const [showNotification, setShowNotification] = useState(true);

  const [chartData, setChartData] = useState({});
  const [projectsData, setProjectsData] = useState([]);

  const filteredSegments = projectsData.filter((segment) =>
    segment.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    var loadProjects = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/projects', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Something went wrong');
        }
        //setIsSuccess(true);
        const result = await response.json();
        setProjectsData(result.projects);
      } catch (error) {
      }
    };
    loadProjects();
  }, []);


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">        
            <span style={{fontWeight:400, fontSize:18}}>ARC</span>
            <span>Home</span>
            <span>&gt;</span>
            <span>Projects</span> 
            <span>&gt;</span>
            <span>Deep Researcher</span>                              
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-8 main">
          <div className="menuButtons">
            <ul>    
              <li>      
                  <Link href={`/projects`}>
                    <div class="navLink arc_text">
                      Current Projects
                    </div>
                  </Link>
              </li>
              <li class="divider">
              </li>
              <li>      
                  <Link href={`/business`}>
                    <div class="navLink arc_text">
                      Business Discovery
                    </div>
                  </Link>
              </li>
              <li class="divider">
              </li>
              <li>
                <Link href={`/researcher`}>           
                  <div class="navLink arc_text">
                    Deep Researcher
                  </div>                
                </Link>
              </li>
              <li class="eda">
              </li>             
              <li>
                <Link href={`/eda`}>
                  <div class="navLink arc_text">
                    EDA Engine                    
                  </div>                 
                </Link>
              </li>
              <li class="divider">
              </li>             
              <li>
                <Link href={`/ml`}>
                  <div class="navLink arc_text">
                    ML Engine                    
                  </div>                  
                </Link>
              </li>   
              <li class="divider">
              </li>               
            </ul>
          </div>
          <div className="w-[200px] leftPanel fixedPanel px-6">
            <div class="flexRow">
              <h1 className="featureHeading m-top-20">Deep Researcher</h1>
              {/*<Button className="plusButton m-top-20" onClick={() => setShowNotification(false)}>+</Button>*/}
            </div>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 searchBox"
              />
            </div>

            <div>
              {filteredSegments.map((segment) => (
                <div
                  key={segment.project_id}
                  onClick={() => setSelectedSegment(segment)}
                  className={`flex items-start p-4 gap-4 rounded-lg cursor-pointer transition-colors ${
                    selectedSegment.project_id === segment.project_id
                      ? "selectedHighlight"
                      : "hover:bg-muted/50"
                  }`}
                >
                  {/*<div className="w-12 h-12 rounded-full bg-background border flex items-center justify-center text-2xl flex-shrink-0 illustrationIcon">
                  <div
                  className={segment.illustration}
                  ></div>
                  </div>*/}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1 listHeading">
                      {segment.display_name}
                    </h3>
                    <p className="text-sm line-clamp-2">
                      {segment.display_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-[1250px] mainPanel">    

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 mt-1">
              <div class="flexRow">
                <div className="sectionHeading p-4">{selectedSegment.display_name}</div>               
                <div>              
                <TabsList>
                  <TabsTrigger value="details">List View</TabsTrigger>
                </TabsList>
                <TabsList>
                  <TabsTrigger value="card">Card View</TabsTrigger>
                </TabsList>
                </div>
              </div>

              <TabsContent value="details">
                  <DeepResearcher view="list" />
              </TabsContent>
              <TabsContent value="card">
                  <DeepResearcher view="card" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}