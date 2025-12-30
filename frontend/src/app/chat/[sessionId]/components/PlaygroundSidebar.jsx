import { useEffect, useRef, useState, useMemo } from "react";
import { Icons } from "@/components/Icons";
import TabSwitch from "@/components/TabSwitch";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoaderSpinner from "@/components/Loader";
import { cn } from "@/lib/utils";
import EllipsisTooltip from "@/components/EllipsisTooltip";
import { API_ENDPOINTS, getApiEndpoint } from "@/config/apiEndpoints";
import { api } from "@/lib/api";
import Modal from "@/components/Modal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { CustomSelect } from "@/components/CustomSelect";

const TABS = [
  {
    id: "history",
    Icon: Icons.historyDark,
    label: "History",
  },
  // {
  //   id: "inputs",
  //   Icon: Icons.inputsDark,
  //   label: "Inputs",
  // },
];

export default function PlaygroundSidebar({
  onStartNewChat,
  userSessionsLoading,
  userSessions,
  onSelectSession,
  disableNewChat,
  onDeleteSession,
  onClearAllSessions,
  isCollapsed,
}) {
  const selectedBtnRef = useRef(null);
  const { data: session } = useSession();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSessionDeleteModal, setShowSessionDeleteModal] = useState(false);
  const [sessionIdToDelete, setSessionIdToDelete] = useState(null);
  const { sessionId: selectedSessionId } = useParams();

  useEffect(() => {
    selectedBtnRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [selectedSessionId, userSessions]);

  const sessionToDelete = userSessions?.find((s) => s.id === sessionIdToDelete);
  const sessionNameToDelete = sessionToDelete?.name || "this chat";

  return (
    <aside className="bg-grey flex h-full w-65 flex-col border-r bg-[#F5F6F8] p-4">
      {!isCollapsed && (
        <div className="mb-3 flex items-center justify-between">
          {/* <TabSwitch
          onSelectTab={setSelectedTabIdx}
          selectedTabIdx={selectedTabIdx}
          tabs={TABS}
        /> */}
          <p className="font-inter text-left text-[12px] leading-[130%] font-bold tracking-[1.2px] text-black uppercase">
            Chat history
          </p>
          <p
            className="font-inter text-right text-[10px] cursor-pointer leading-[130%] font-bold tracking-[1.2px] text-black"
            onClick={() => {
              setShowDeleteModal(true);
            }}
          >
            Clear
          </p>
        </div>
      )}

      <div className="flex h-full flex-col justify-between overflow-hidden">
        {userSessionsLoading ? (
          <LoaderSpinner className="h-full" />
        ) : (
          <ScrollArea className="h-full flex-1 overflow-auto">
            <div className="mb-4 space-y-2 px-1">
              {!isCollapsed &&
                userSessions?.map((session) => (
                  <div
                    key={session.id}
                    className="group relative flex items-center justify-between gap-1"
                  >
                    <Button
                      ref={
                        session.id === selectedSessionId ? selectedBtnRef : null
                      }
                      variant={session.id === selectedSessionId ? "" : "ghost"}
                      className={cn(
                        "w-full cursor-pointer justify-start pr-8",
                        session.id === selectedSessionId &&
                          "bg-white text-black hover:bg-gray-400"
                      )}
                      onClick={() => onSelectSession(session.id)}
                    >
                      <EllipsisTooltip
                        className="w-40 max-w-80 cursor-pointer truncate text-left"
                        text={session.name}
                      >
                        {session?.name}
                      </EllipsisTooltip>
                    </Button>
                    {session.name !== "New Chat" && (
                      <div className="absolute right-2">
                        <CustomSelect
                          options={[
                            // {
                            //   value: "edit",
                            //   label: (
                            //     <div className="flex items-center gap-2">
                            //       <Icons.edit className="h-4 w-4" />
                            //       Edit
                            //     </div>
                            //   ),
                            // },
                            // {
                            //   value: "duplicate",
                            //   label: (
                            //     <div className="flex items-center gap-2">
                            //       <Icons.elementIcon className="h-4 w-4" />
                            //       Duplicate
                            //     </div>
                            //   ),
                            // },
                            {
                              value: "delete",
                              label: (
                                <div className="flex items-center gap-2 text-red-600">
                                  <Icons.trash className="h-4 w-4 text-red-600" />
                                  Delete
                                </div>
                              ),
                            },
                          ]}
                          onChange={(value) => {
                            if (value === "edit") {
                              console.log("Edit clicked");
                            } else if (value === "duplicate") {
                              console.log("Duplicate clicked");
                            } else if (value === "delete") {
                              setSessionIdToDelete(session.id);
                              setShowSessionDeleteModal(true);
                            }
                          }}
                        >
                          <Icons.dotsIcon className="h-4 w-4 cursor-pointer" />
                        </CustomSelect>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </ScrollArea>
        )}
        <Button
          className="mt-4 w-full cursor-pointer"
          onClick={() => onStartNewChat()}
          disabled={disableNewChat}
        >
          <Icons.newChat className="h-6 w-6" />
          {!isCollapsed && "Start new chat"}
        </Button>
      </div>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Clear All Chat History"
        titleColor="#131955"
        submitLabel="Delete"
        secondaryLabel="Cancel"
        onSubmit={async () => {
          await onClearAllSessions();
          setShowDeleteModal(false);
        }}
        onSecondary={() => setShowDeleteModal(false)}
        showDualButtons={true}
      >
        <p className="font-inter text-[14px] leading-[130%] font-normal text-black">
          Are you sure you want to clear all chat data? This action cannot be
          undone and will permanently remove all associated data.
          <br />
          <br />
          Please confirm to proceed.
        </p>
      </Modal>
      <Modal
        isOpen={showSessionDeleteModal}
        onClose={() => setShowSessionDeleteModal(false)}
        title="Delete Chat?"
        titleColor="#131955"
        submitLabel="Delete"
        secondaryLabel="Cancel"
        onSubmit={async () => {
          await onDeleteSession(sessionIdToDelete);
          setShowSessionDeleteModal(false);
          setSessionIdToDelete(null);
        }}
        onSecondary={() => setShowSessionDeleteModal(false)}
        showDualButtons={true}
      >
        <p className="font-inter text-[14px] leading-[130%] font-normal text-black">
          Are you sure you want to delete "
          <strong>{sessionNameToDelete}</strong>" chat? This action cannot be
          undone and will permanently remove all associated data.
          <br />
          <br />
          Please confirm to proceed.
        </p>
      </Modal>
    </aside>
  );
}
