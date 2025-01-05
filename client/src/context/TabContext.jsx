import ChatsTab from "../components/tabs/ChatsTab"
import FilesTab from "../components/tabs/FilesTab"
import RunTab from "../components/tabs/RunTab"
import Debuggerrr from "@/components/tabs/Fuckyou"
import Fuckyou from "@/components/tabs/Fuckyou"
import SettingsTab from "../components/tabs/SettingsTab"
import UsersTab from "../components/tabs/UsersTab"
import ScreenShareTab from "@/components/tabs/ScreenShareTab"
import useWindowDimensions from "../hooks/useWindowDimensions"
import TABS from "../utils/tabs"
import { AiOutlineScan } from "react-icons/ai";
import PropTypes from "prop-types"
import { FaChartSimple } from "react-icons/fa6";
import Fucks from "@/components/tabs/Fucks"
import { IoCalculator } from "react-icons/io5";
import AiCalculator from "@/components/tabs/AiCalculator"
import Testing from "@/components/tabs/Testing"
import { VscDebugConsole } from "react-icons/vsc";
import { createContext, useState } from "react"
import { IoSettingsOutline } from "react-icons/io5"
import { BiVideoRecording } from "react-icons/bi";
import AiChatbot from "@/components/tabs/AiChatbot"
import { LuFiles } from "react-icons/lu";
import { MdBarChart } from "react-icons/md";
import { FcFlowChart } from "react-icons/fc";
import { SiGooglegemini } from "react-icons/si";
import { PiChats, PiPlay, PiUsers } from "react-icons/pi"
import Fuck from "@/components/tabs/Fuck"
import { FaRegFileCode } from "react-icons/fa";
import Conversation from "@/components/tabs/Conversation"
import { MdSpatialAudioOff } from "react-icons/md";
import BasicFile from "@/components/tabs/BasicFile"

const TabContext = createContext()

function TabContextProvider({ children }) {
    const { isMobile } = useWindowDimensions()
    const [activeTab, setActiveTab] = useState(TABS.FILES)
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile)
    const [tabComponents, setTabComponents] = useState({
        [TABS.CONVERSATION]:<Conversation/>,
        [TABS.FILESBRO]:<BasicFile/>,
        [TABS.FUCKYOU]:<Fuckyou/>,
        [TABS.FUCK]:<Fuck/>,
        [TABS.FILES]: <FilesTab />,
        [TABS.CLIENTS]: <UsersTab />,
        [TABS.SETTINGS]: <SettingsTab />,
        [TABS.CHATS]: <ChatsTab />,
        [TABS.RUN]: <RunTab />,
        [TABS.SCREENSHARE]:<ScreenShareTab/>,
        [TABS.AICHAT]:<AiChatbot/>,
        [TABS.AICALCULATOR]:<AiCalculator/>,
        [TABS.TESTING]:<Testing/>,
        [TABS.FUCKS]:<Fucks/>
    }) 
    const tabIcons = {
        [TABS.FUCKYOU]: <VscDebugConsole size={28} />,
        [TABS.FUCK]: <AiOutlineScan size={28} />,
        [TABS.FILES]: <LuFiles size={28} />,
        [TABS.CLIENTS]: <PiUsers size={30} />,
        [TABS.SETTINGS]: <IoSettingsOutline size={28} />,
        [TABS.CHATS]: <PiChats size={30} />,
        [TABS.RUN]: <PiPlay size={28} />,
        [TABS.SCREENSHARE]:<BiVideoRecording size={28}/>,
        [TABS.FILESBRO]:<FaRegFileCode size={25}/>,
        [TABS.CONVERSATION]:<MdSpatialAudioOff size={28}/>,
        [TABS.AICHAT]:<SiGooglegemini size={28}/>,
        [TABS.AICALCULATOR]:<FcFlowChart size={28}/>,
        [TABS.TESTING]:<IoCalculator size={28}/>,
        [TABS.FUCKS]:<MdBarChart size={28}/>
    }

    return (
        <TabContext.Provider
        
            value={{
                activeTab,
                setActiveTab,
                isSidebarOpen,
                setIsSidebarOpen,
                tabComponents,
                setTabComponents,
                tabIcons,
            }}
        >
            {children}
        </TabContext.Provider>
    )
}

TabContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { TabContextProvider }
export default TabContext
