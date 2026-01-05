"use client";
import React from 'react';
import { useState } from "react";
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
import { motion } from "motion/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
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

const testimonials = [
  {
    text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Saman Malik",
    role: "Customer Support Lead",
  },
  {
    text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "Our business functions improved with a user-friendly design and positive customer feedback.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Sana Sheikh",
    role: "Sales Manager",
  },
  {
    text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
];


const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);


export const pieData = {
  labels: ['With Kids Unknown', 'Without Kids Single', 'With Kids Single', 'Without Kids Married', 'With Kids Married', 'Without Kids Unknown'],
  datasets: [
    {
      label: 'FAMILY STRUCTURE',
      data: [0.04, 68.6, 11.31, 16.22, 2.93, 0.9],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }
  ]
};

export const homeownershipData = {
  labels: ['First Time Buyer', 'Unknown', 'Renter', 'Homeowner'],
  datasets: [
    {
      label: 'HOME OWNERSHIP',
      data: [8.77, 18.92, 21.87, 59.21],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }
  ]
};

export const educationData = {
  labels: ['High School Diploma', 'Less Than High School', 'Bachelors Degree', 'Some College', 'Graduates Degree'],
  datasets: [
    {
      label: 'HOME OWNERSHIP',
      data: [11.86,3.77,32.74,29.26,22.36],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }
  ]
};

export const incomeData= {
  labels: ['Less than $15K', '$250K+', '$100K - $124.999K', '$125K - $149.999K', '$175K - $199.999K','$200K - $249.999K','$15K - $24.999K', '$150K - $174.999K', '$50K - $74.999K', '$75K - $99.999K','$25K - $34.999K', '$35K - $49.999K'],
  datasets: [
    {
      label: 'HOME OWNERSHIP',
      data: [1.88, 6.77, 11.34, 15.83, 5.54, 4.54, 1.47, 5.43, 18.9, 20.13, 2.37, 5.8],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }
  ]
};

const initialData = {
  labels: ['19-24', '25-30', '31-35', '36-45', '46-50', '51-65', '66-75', '76+'],
  datasets: [{
    label: 'Age Groups (in percentage)',
    data: ['8.88', '19.01', '27.88', '26.39', '8.77', '6.71', '2.15', '0.22'],
    backgroundColor: 'rgba(75, 192, 192, 0.6)',
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 1,
  }],
};

export const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

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
  const [activeTabChart, setActiveTabChart] = useState("agegroup");
  const [showNotification, setShowNotification] = useState(true);

  const [chartData, setChartData] = useState(initialData);

  const filteredSegments = segmentsData.filter((segment) =>
    segment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Home</span>
            <span>&gt;</span>
            <span>Services</span>
            <span>&gt;</span>
            <span>Segments</span>           
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-8 main">
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
            </ul>
          </div>
          <div className="w-[300px] leftPanel fixedPanel px-6">
            <h1 className="p-4 featureHeading">Segments</h1>
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

          <div className="flex-1 w-[1050px] px-8 mainPanel">           
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 mt-6">

              <div class="flexRow">
                <div className="chartHeading">
                {selectedSegment.name} households
                </div>     
                <TabsList>
                  <TabsTrigger value="details">Overview</TabsTrigger>
                  <TabsTrigger value="analysis">Deep Dive</TabsTrigger>
                  <TabsTrigger value="personas">Personas</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="details">
                  <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10" >
                    <div className="flex items-center gap-2">                    
                      <div className="flex flex-col">
                        <div className="sectionHeading">{selectedSegment.name}</div>
                        <div className="flex p-4 gap-8 items-start fixedPanel">   
                            <div className="text-center">
                              <div className="text-8xl mb-4">
                                <img 
                                  src="http://localhost:3000/images/segment1.png"
                                  width="300"
                                />
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Illustration
                              </div>
                            </div>

                          <div className="flex-1">
                            <p className="text-base leading-relaxed text-foreground">                      
                              {selectedSegment.fullDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </TabsContent>

              <TabsContent value="analysis">
  
                  <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10" >
                    <div className="flex items-center gap-2">                    
                      <div className="flex flex-col">
                  <Tabs value={activeTabChart} onValueChange={setActiveTabChart} className="mb-6">
                  <TabsList>
                    <TabsTrigger value="agegroup">Age Group</TabsTrigger>
                    <TabsTrigger value="familystructure">Family Structure</TabsTrigger>
                    <TabsTrigger value="homeownership">Home Ownership</TabsTrigger>
                    <TabsTrigger value="education">Education </TabsTrigger>
                    <TabsTrigger value="incomeLevels">Income Levels </TabsTrigger>
                  </TabsList>

                  <TabsContent value="agegroup">  
                    {/*showNotification && "d-lg p-4 mb-6 flex items-start justify-between">
                   <p className="text-sm text-gray-700">
wing                      page, which you can find from the sidebar. 
                   </p>}
                    <Button variant="link" y-900 whitespace-nowrap ml-4"
                    onClick={() => setShowNotification(false)}
 >
-                      Okay, got it
-                    </Button>
-                  </div>
-                )*/}                  
                      {/*<div className="text-center text-muted-foreground fixedPanel">
                        <div className="chart-container standard-chart">*/}
                       
                              <BarChart chartData={chartData} />
                            
                      {/*</div>
                    </div>*/}
                  </TabsContent>

                  <TabsContent value="familystructure">
                    {/*<div className="flex p-4 gap-8 items-start fixedPanel">                                                      
                      <div className="chart-container standard-chart">*/}
                        <PieChartComponent pieData={pieData} displayTitle={"Family Structure"}/>
                      {/*</div>
                    </div>*/}
                  </TabsContent>

                   <TabsContent value="homeownership">
                    {/*<div className="flex p-4 gap-8 items-start fixedPanel">                                                      
                      <div className="chart-container standard-chart">*/}
                        <PieChartComponent pieData={homeownershipData} displayTitle={"Home Ownership"}/>
                      {/*</div>
                    </div>*/}
                    </TabsContent>

                    <TabsContent value="education">
                      {/*<div className="flex p-4 gap-8 items-start fixedPanel">                                                      
                        <div className="chart-container standard-chart">*/}
                          <PieChartComponent pieData={educationData} displayTitle={"Education Data"}/>
                        {/*</div>
                      </div>*/}
                    </TabsContent>

                    <TabsContent value="incomeLevels">
                      {/*<div className="flex p-4 gap-8 items-start fixedPanel">                                                      
                        <div className="chart-container standard-chart">*/}
                          <PieChartComponent pieData={incomeData} displayTitle={"Income Levels"}/>
                        {/*</div>
                      </div>*/}
                    </TabsContent>
                  </Tabs>
               </div>
                          </div>
                        </div>
              </TabsContent>

              <TabsContent value="personas">
                <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10" >
                    <div className="flex items-center gap-2">                    
                      <div className="flex flex-col">
                        <div className="flex p-4 gap-8 items-start fixedPanel">      
                          <Testimonials></Testimonials>              
                        </div>
                      </div>
                    </div>
                </div>
              </TabsContent>
            </Tabs>
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



const Testimonials = () => {
  return (
    <section className="relative">

      <div className="z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >         
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 sectionHeading">
            300+ Personas
          </h2>
          <p className="text-center mt-5 opacity-75">
            Our AI generated personas behave just like humans.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          {/*<TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />*/}
        </div>
      </div>
    </section>
  );
};

const TestimonialsColumn = (props) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full" key={i}>
                  <div>{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5">{name}</div>
                      <div className="leading-5 opacity-60 tracking-tight">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};