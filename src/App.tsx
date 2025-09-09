import Chat from "./components/Chat/Chat";
import { mockConversation } from "./utils/mockData";

function App() {
    return (
        <>
            <Chat messages={mockConversation} />
        </>
    );
}

export default App;
