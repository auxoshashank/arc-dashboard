import { Dialog, DialogContent } from "./ui/dialog";

export default function CustomDialog({
  children,
  open,
  onOpenChange,
  className,
  ...props
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      className={className}
      modal={true}
      {...props}
    >
      <DialogContent className="!w-[900px] !max-w-none [&_svg.lucide-x]:hidden">
        {children}
      </DialogContent>
    </Dialog>
  );
}
