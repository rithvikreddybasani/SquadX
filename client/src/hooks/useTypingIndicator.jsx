import { useEffect, useState } from "react";
import useAppContext from "@/hooks/useAppContext";
import useSocket from "@/hooks/useSocket";
import ACTIONS from "@/utils/actions";

function useTypingIndicator() {
    const { users, currentUser } = useAppContext();
    const [typingUsers, setTypingUsers] = useState([]);
    console.log(users)

    useEffect(() => {
        // Filter the users who are typing, including the current user if they are typing
        const typingUsersList = users.filter(user => user.typing === true);

        if (typingUsersList.length > 0) {
            //console.log("Users typing:", typingUsersList.map(user => user.username));
            setTypingUsers(typingUsersList.map(user => user.username));
        } else {
            //console.log("You users are typing.");
            setTypingUsers([]);
        }
    }, [users]);

    // Ensure current user is included if they are typing
    const typingMessage = typingUsers.length
        ? `${typingUsers.join(", ")} ${typingUsers.length > 1 ? "are" : "is"} typing...`
        : "";

    return typingMessage;
}

export default useTypingIndicator;
