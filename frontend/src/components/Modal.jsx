import React from "react";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";

const Modal = ({
  isOpen,
  onClose,
  title = "Modal Title",
  children,
  onSubmit,
  submitLabel = "Submit",
  showCloseButton = true,
  titleColor,
  showDualButtons = false,
  secondaryLabel = "Cancel",
  onSecondary = null,
  closeIcon = "/images/cross.svg",
  disabled,
}) => {
  if (!isOpen) return null;

  // Close Modal on Click Outside
  // const handleBackdropClick = (e) => {
  //   if (e.target === e.currentTarget) {
  //     onClose();
  //   }
  // };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.50)]"
      // onClick={handleBackdropClick}
    >
      {/* Modal Content */}
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Header Section */}
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="text-[20px] font-semibold"
            style={{ color: titleColor }}
          >
            {title}
          </h2>

          {/* Custom Close Button */}
          {showCloseButton && (
            <Icons.modalClose
              onClick={onClose}
              className="h-6 w-6 cursor-pointer"
            />
          )}
        </div>

        {/* Modal Body */}
        <div className="my-4">{children}</div>

        {/* Submit Button */}
        {showDualButtons ? (
          <div className="mt-6 flex justify-between gap-4">
            <Button
              className="border-primary text-primary hover:bg-primary flex w-[187px] items-center justify-center gap-[5.39px] self-stretch rounded-[4.312px] border bg-white px-[8.624px] py-[9.702px] hover:text-white"
              onClick={onSecondary || onClose} // fallback to onClose
            >
              {secondaryLabel}
            </Button>
            <Button
              className="flex w-[187px] cursor-pointer items-center justify-center gap-[5.39px] self-stretch rounded-[4.312px] bg-[#E80048] px-[8.624px] py-[9.702px] text-white hover:bg-[#c5003b]"
              onClick={onSubmit}
            >
              {submitLabel}
            </Button>
          </div>
        ) : (
          <Button
            className="w-full cursor-pointer rounded-md py-2"
            onClick={onSubmit}
            disabled={disabled}
          >
            {submitLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Modal;
