"use client";
import React from "react";
import Image from "next/image";

const CardComponent = ({ icon, title, description }) => {
  return (
    <div className="flex items-center gap-4 p-6 rounded-lg border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all">
      {/* Icon */}
      <Image src={icon} alt={title} width={40} height={40} />
      
      {/* Content */}
      <div>
        <h3 className="text-lg font-semibold text-[#131955]">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default CardComponent;
