import { IChatRecord, Role } from "../../redux/slices/input.slicer";
import { extractNonUrlText, extractUrl } from "../../utils";
import "./messageDisplay.css";

interface MessageDisplayProps {
    chatRecord: IChatRecord;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ chatRecord }) => {
    if (chatRecord.role === Role.Assistant) {
        const url = extractUrl(chatRecord.message);
        let text = chatRecord.message;
        if (url) {
            text = extractNonUrlText(chatRecord.message);
        }
        return (
            <div className="assistant-message">
                {text}
                {url && <img src={url} alt="Cat"></img>}
            </div>
        );
    } else {
        return <div className="user-message">{chatRecord.message}</div>;
    }
};

export default MessageDisplay;
