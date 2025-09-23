import Chat from "./components/Chat/Chat";
import { mockConversation } from "./utils/mockData";

function App() {
    return (
        <>
            <section style={{
                position: "fixed",
                zIndex: 9999,
                width: "400px",
                height: "600px",
                borderRadius: "8px",
                overflow: "hidden",
                bottom: "20px",
                right: "20px"
            }}>
                <Chat initialMessages={mockConversation} />
            </section>
        </>
    );
}

export default App;
