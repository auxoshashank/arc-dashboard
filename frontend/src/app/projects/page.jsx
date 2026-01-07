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
import Testimonials from './Testimonials';
import Link from 'next/link'
import CreateProject from './CreateProject';

export default function SegmentPage() {
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
            <span>Home</span>
            <span>&gt;</span>
            <span>Projects</span>                      
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
                  <Link href={`/segments`}>
                    <div class="navLink arc_text">
                      Business Discovery
                    </div>
                  </Link>
              </li>
              <li class="divider">
              </li>
              <li>
                <Link href={`/studies`}>           
                  <div class="navLink arc_text">
                    Deep Researcher
                  </div>                
                </Link>
              </li>
              <li class="divider">
              </li>             
              <li>
                <Link href={`/personas`}>
                  <div class="navLink arc_text">
                    EDA Engine                    
                  </div>                 
                </Link>
              </li>
              <li class="divider">
              </li>             
              <li>
                <Link href={`/activities`}>
                  <div class="navLink arc_text">
                    ML Engine                    
                  </div>                  
                </Link>
              </li>   
              <li class="divider">
              </li>               
            </ul>
          </div>
          <div className="w-[300px] leftPanel fixedPanel px-6">
            <div class="flexRow">
              <h1 className="featureHeading m-top-20">Projects</h1>
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

          <div className="flex-1 w-[1150px] px-8 mainPanel">    

            <div className="sectionHeading p-4">New Project</div>

            <CreateProject></CreateProject>

            {/*<Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 mt-6">

              <div class="flexRow">
                <div className="chartHeading">
                {selectedSegment.display_name}
                </div>     
                <TabsList>
                  <TabsTrigger value="details">Overview</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="details">
                    <div className="flex items-center gap-2">                    
                      <div className="flex flex-col">
                        <div className="flex p-4 gap-8 items-start fixedPanel">                              
                          <div className="flex-1">
                            <div className="sectionHeading">{selectedSegment.display_name}</div>
                            <p className="text-base leading-relaxed text-foreground">                      
                              {selectedSegment.display_name}
                            </p>
                            
                          </div>
                        </div>
                      </div>
                    </div>
              </TabsContent>
            </Tabs>*/}
          </div>
        </div>
      </div>
    </div>
  );
}

function PieChartComponent({ pieData , displayTitle}) {
  // Options are used to customize aspects like the title and legend position
  const options = {
    plugins: {
      title: {
        display: true,
        text: displayTitle,
      },
      legend: {
        position: 'top', // 'top', 'bottom', 'left', or 'right'
      },
    },
    responsive: true,
  };

  return (
    <div className="chart-container" style={{ width: '400px', margin: 'auto' }}>
      <Pie data={pieData} options={options} />
    </div>
  );
}

function BarChart({ chartData }) {
  // Chart options can be defined here or passed as props
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Age group classification",
      },
      legend: {
        position: 'top',
      },
    },
    responsive: true,
  };

  return (
    <div className="chart-container" style={{ width: '600px', margin: 'auto' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}