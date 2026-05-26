import TabButton from "@/components/tabs/TabButton";
import useAppContext from "@/hooks/useAppContext";
import useResponsive from "@/hooks/useResponsive";
import useSocket from "@/hooks/useSocket";
import useTab from "@/hooks/useTabs";
import ACTIONS from "@/utils/actions";
import STATES from "@/utils/states";
import TABS from "@/utils/tabs";
import { IoCodeSlash } from "react-icons/io5";
import { MdOutlineDraw } from "react-icons/md";
import { TbMathIntegralX } from 'react-icons/tb'; // Import the new icon

function Sidebar() {
    const { activeTab, isSidebarOpen, tabComponents, tabIcons } = useTab();
    const { showSidebar } = useResponsive();
    const { state, setState } = useAppContext();
    const { socket } = useSocket();

    const changeState = () => {
        if (state === STATES.CODING) {
            setState(STATES.DRAWING);
            socket.emit(ACTIONS.REQUEST_DRAWING);
        } else {
            setState(STATES.CODING);
        }
    };

    return (
        <aside className="flex w-full md:h-full md:max-h-full md:min-h-full md:w-auto">
            <div
                className="fixed bottom-0 left-0 z-50 flex h-[50px] w-full gap-6 self-end overflow-auto border-t border-darkHover bg-dark p-3 md:static md:h-full md:w-[50px] md:min-w-[50px] md:flex-col md:border-r md:border-t-0 md:p-2 md:pt-4"
                style={showSidebar ? {} : { display: "none" }}
            >
                <TabButton tabName={TABS.FILES} icon={tabIcons[TABS.FILES]} title= {TABS.FILES}/>
                <TabButton tabName={TABS.RUN} icon={tabIcons[TABS.RUN]} title={TABS.RUN} />
                <TabButton tabName={TABS.SCREENSHARE} icon={tabIcons[TABS.SCREENSHARE]} />
                <TabButton tabName={TABS.CHATS} icon={tabIcons[TABS.CHATS]}  title={TABS.CHATS} />
                <TabButton tabName={TABS.FUCKYOU} icon={tabIcons[TABS.FUCKYOU]} title= {TABS.FUCKYOU}/>
                <TabButton tabName={TABS.CLIENTS} icon={tabIcons[TABS.CLIENTS]} title={TABS.CLIENTS} />
                <TabButton tabName={TABS.FUCK} icon={tabIcons[TABS.FUCK]} title= {TABS.FUCK}/>
                <TabButton tabName={TABS.SETTINGS} icon={tabIcons[TABS.SETTINGS]} />
                <TabButton tabName={TABS.TASK} icon={tabIcons[TABS.TASK]} />
                <TabButton tabName={TABS.CONVERSATION} icon={tabIcons[TABS.CONVERSATION]}/>
                <TabButton tabName={TABS.AICHAT} icon={tabIcons[TABS.AICHAT]}/>
                <TabButton tabName={TABS.AICALCULATOR} icon={tabIcons[TABS.AICALCULATOR]}/>
                <TabButton tabName={TABS.TESTING} icon={tabIcons[TABS.TESTING]}/>
                <TabButton tabName={TABS.FUCKS} icon={tabIcons[TABS.FUCKS]}/>
                <TabButton tabName={TABS.FILESBRO} icon={tabIcons[TABS.FILESBRO]}/>
                <button className="self-end" onClick={changeState}>
                    {state === STATES.CODING ? (
                        <MdOutlineDraw size={30} />
                    ) : (
                        <IoCodeSlash size={30} />
                    )}
                </button>
            </div>
            <div
                className="absolute left-0 top-0 z-20 w-full flex-grow flex-col bg-dark md:static md:w-[300px]"
                style={isSidebarOpen ? {} : { display: "none" }}
            >
                {tabComponents[activeTab]}
            </div>
        </aside>
    );
}

export default Sidebar;
