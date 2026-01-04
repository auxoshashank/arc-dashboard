"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

// Mock data for segments
const segmentsData = [
  {
    id: 1,
    name: "Aspirational Fusion",
    description: "Aspirational Fusion households are young, diverse, and urban...",
    icon: "👤",
    fullDescription:
      "Aspirational Fusion households are young, diverse, and urban - over 80% are under 36, and most are renters living in city apartments. Many are single or single parents, with incomes in the lower tiers and limited formal education. Still, they work hard in service, retail, and healthcare, striving for a better future. Heavily multilingual and racially mixed, they move frequently, hustle constantly, and bring cultural depth to their neighborhoods. They may be starting from modest means, but their outlook is hopeful, energetic, and persistently forward-looking.",
    illustration: "illustration1"
  },
  {
    id: 2,
    name: "Blue Sky Boomers",
    description: "Aspirational Fusion households are young, diverse, and urban...",
    icon: "👨",
    fullDescription:
      "Blue Sky Boomers represents established professionals enjoying their prime years with financial stability and career success.",
    illustration: "illustration2"
  },
  {
    id: 3,
    name: "Autumn Years",
    description: "Aspirational Fusion households are young, diverse, and urban...",
    icon: "👤",
    fullDescription:
      "Autumn Years captures retirees and near-retirees focusing on leisure, health, and family connections.",
    illustration: "illustration3"
  },
  {
    id: 4,
    name: "Booming with Confidence",
    description: "Aspirational Fusion households are young, diverse, and urban...",
    icon: "👴",
    fullDescription:
      "Booming with Confidence represents affluent, educated professionals with high earning potential and investment portfolios.",
    illustration: "illustration4"
  },
  {
    id: 5,
    name: "Cultural Connections",
    description: "Aspirational Fusion households are young, diverse, and urban...",
    icon: "👤",
    fullDescription:
      "Cultural Connections encompasses diverse, multicultural households that bridge traditions with modern urban living.",
    illustration: "illustration5"
  },
];

// Mock data for personas/testimonials
const personas = [
  {
    id: 1,
    name: "Bilal Ahmed",
    role: "IT Manager",
    text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
    avatar: "/avatars/bilal.jpg",
  },
  {
    id: 2,
    name: "Zainab Hussain",
    role: "Project Manager",
    text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
    avatar: "/avatars/zainab.jpg",
  },
  {
    id: 3,
    name: "Sana Sheikh",
    role: "Sales Manager",
    text: "Its robust features and quick support have transformed our workflow, making it significantly more efficient.",
    avatar: "/avatars/sana.jpg",
  },
  {
    id: 4,
    name: "Briana Patton",
    role: "Operations Manager",
    text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
    avatar: "/avatars/briana.jpg",
  },
  {
    id: 5,
    name: "Aliza Khan",
    role: "Business Analyst",
    text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
    avatar: "/avatars/aliza.jpg",
  },
  {
    id: 6,
    name: "Hassan Ali",
    role: "E-commerce Manager",
    text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
    avatar: "/avatars/hassan.jpg",
  },
  {
    id: 7,
    name: "Farhan Siddiqui",
    role: "Business Manager",
    text: "Our business functions improved with a user-friendly design and positive customer feedback.",
    avatar: "/avatars/farhan.jpg",
  },
];

export default function SegmentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState(segmentsData[0]);
  const [activeTab, setActiveTab] = useState("details");
  const [showNotification, setShowNotification] = useState(true);

  const filteredSegments = segmentsData.filter((segment) =>
    segment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>Home</span>
            <span>&gt;</span>
            <span>Services</span>
            <span>&gt;</span>
            <span>Survey Simulation</span>
            <span>&gt;</span>
            <span>Activities</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-8 gap-3 main">
          {/* Left Section - Segments */}
          <div className="menuButtons">
            <ul>             
              <li class="navLink segments_text">
                Segments
                <div><span class="activeNumber">91</span> Active</div>
              </li>
              <li class="navLink segments">
              </li>
              <li class="divider">
              </li>
              <li class="navLink studies_text">
                Studies
                <div><span class="activeNumber">11</span> Active</div>
              </li>
              <li class="navLink studies">
                
              </li> 
              <li class="divider">
              </li>             

              <li class="navLink studies_text">
                Personas
                <div><span class="activeNumber">103</span> Active</div>
              </li>
              <li class="navLink personas">
                
              </li> 
              <li class="divider">
              </li>             

              <li class="navLink studies_text">
                Activities
                <div><span class="activeNumber">45</span> Active</div>
              </li>
              <li class="navLink activities">
                
              </li> 
              <li class="divider">
              </li>             
            </ul>
          </div>
          <div className="w-[350px]">
            <h1 className="p-4 featureHeading">Segments</h1>

            {/* Search */}
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

            {/* Segment List */}
            <div>
              {filteredSegments.map((segment) => (
                <div
                  key={segment.id}
                  onClick={() => setSelectedSegment(segment)}
                  className={`flex items-start p-4 gap-4 rounded-lg cursor-pointer transition-colors ${
                    selectedSegment.id === segment.id
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-background border flex items-center justify-center text-2xl flex-shrink-0 illustrationIcon">
                  <div
                  className={segment.illustration}
                  ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1 listHeading">
                      {segment.name}
                    </h3>
                    <p className="text-sm line-clamp-2">
                      {segment.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Content */}
          <div className="flex-1">
            {/* Title */}
            <h2 className="text-3xl font-bold mb-6 p-4 segmentHeading">
              {selectedSegment.name} households
            </h2>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="details">Overview</TabsTrigger>
                <TabsTrigger value="analysis">Deep Dive</TabsTrigger>
                <TabsTrigger value="personas">Personas</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="mt-8">
                {/* Notification Banner */}
                {/*showNotification && (
                  <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 mb-6 flex items-start justify-between">
                    <p className="text-sm text-gray-700">
                      "Following" and your topics are now part of the new Following
                      page, which you can find from the sidebar.
                    </p>}
                    <Button
                      variant="link"
                      className="text-sm underline text-gray-700 hover:text-gray-900 whitespace-nowrap ml-4"
                      onClick={() => setShowNotification(false)}
                    >
                      Okay, got it
                    </Button>
                  </div>
                )*/}

                <div className="flex gap-8 items-start">
                  {/* Illustration */}
                    {/* Placeholder for illustration - replace with actual image */}
                    <div className="text-center">
                      <div className="text-8xl mb-4">
                        <img 
                          src="http://localhost:3000/images/segment1.png"
                          width="400"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Illustration placeholder
                      </div>
                    </div>

                  {/* Description */}
                  <div className="flex-1">
                    <p className="text-base leading-relaxed text-foreground">
                      <span className="listHeading">
                        {selectedSegment.name} households
                      </span>{" "}<br />
                      {selectedSegment.fullDescription}
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Analysis Tab */}
              <TabsContent value="analysis" className="mt-8">
                <div className="text-center py-12 text-muted-foreground">
                  <p>Analysis content for {selectedSegment.name}</p>
                </div>
              </TabsContent>

              {/* Personas Tab */}
              <TabsContent value="personas" className="mt-8">
                {/* Personas Header */}
                <div className="text-center mb-8">
                  <h3 className="text-5xl font-bold mb-4">300+ Personas</h3>
                  <p className="text-muted-foreground">
                    Our human like personas are fully
                    <br />
                    AI Generated and behave like humans with high accuracy
                  </p>
                </div>

                {/* Personas Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {personas.map((persona) => (
                    <Card key={persona.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                          {persona.text}
                        </p>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={persona.avatar}
                              alt={persona.name}
                            />
                            <AvatarFallback className="bg-muted">
                              {persona.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">
                              {persona.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {persona.role}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
