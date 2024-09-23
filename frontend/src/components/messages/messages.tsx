import { useAppSelector } from "../../redux/hook";
import { Role, selectChatHistory } from "../../redux/slices/input.slicer";
import MessageDisplay from "../messageDisplay/messageDisplay";
import "./messages.css";

const Messages: React.FC = () => {
    const selector = useAppSelector();
    const chatHistory = selector(selectChatHistory);

    return (
        <div className="message-container">
            {chatHistory.map((chat, index) => {
                if (chat.role === Role.Assistant) {
                    return (
                        <div className="assistant-display">
                            <MessageDisplay key={index} chatRecord={chat} />
                        </div>
                    );
                } else {
                    return (
                        <div className="user-display">
                            <MessageDisplay key={index} chatRecord={chat} />
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default Messages;
