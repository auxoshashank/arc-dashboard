import { logos } from "@/assets/logos";
import { ArrowRight, Info } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const POPUP_WIDTH = 288;
const POPUP_HEIGHT = 220;

export default function AppCard({
  title,
  logoKey,
  description,
  onLaunch,
  metrics,
}) {
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".floating-popup")) {
        setPopupVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInfoClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let top = rect.top + 20 + window.scrollY;
    let left = rect.left + window.scrollX;

    if (left + POPUP_WIDTH > window.innerWidth) {
      left = window.innerWidth - POPUP_WIDTH - 16;
    }
    if (top + POPUP_HEIGHT > window.innerHeight + window.scrollY) {
      top = window.innerHeight + window.scrollY - POPUP_HEIGHT - 16;
    }
    if (left < 8) left = 8;
    if (top < 8) top = 8;

    setPopupPosition({ top, left });
    setPopupVisible(true);
  };

  return (
    <div className="relative flex h-full max-w-[300px] min-w-[200px] flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start space-x-2">
        <div className="h-12 flex-shrink-0">
          {logoKey && logos[logoKey] && (
            <Image
              src={logos[logoKey]?.src}
              alt={title}
              height={50}
              width={100}
              className="h-12 max-h-[50px] object-contain object-left"
            />
          )}
        </div>
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-900">{title}</div>
      </div>

      <p className="mb-6 line-clamp-2 text-sm text-gray-500">{description}</p>

      <div className="text-primary mt-auto flex items-center justify-between text-sm">
        {metrics && (
          <button
            onClick={handleInfoClick}
            className="text-gray-500 hover:text-black"
          >
            <Info className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={onLaunch}
          className="flex cursor-pointer items-center gap-1 font-medium text-primary hover:underline"
        >
          Launch
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {popupVisible && (
        <div
          className="floating-popup fixed z-50 w-72 rounded-md border bg-white p-4 shadow-lg"
          style={{
            top: popupPosition.top,
            left: popupPosition.left,
          }}
        >
          <p className="text-sm text-gray-500">{description}</p>
          <div className="mt-3">
            <h4 className="mb-2 text-sm font-semibold">Agent Metrics</h4>
            <div className="space-y-1 text-xs text-gray-500">
              {metrics?.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p>{metric.label}</p>
                  <div className="text-black">{metric.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
