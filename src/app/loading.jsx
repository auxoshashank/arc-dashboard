import LoaderSpinner from "@/components/Loader";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center w-full">
      <LoaderSpinner />
    </div>
  );
}
