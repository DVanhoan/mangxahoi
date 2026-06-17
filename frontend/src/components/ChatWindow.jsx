import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatWindow = ({ conversationId, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [imageData, setImageData] = useState(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!conversationId) return;
        fetch(`/api/messages/${conversationId}`)
            .then((res) => res.json())
            .then((data) => setMessages(data))
            .catch((err) => console.error("Lỗi tải tin nhắn:", err));
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId) return;

        socket.emit("joinConversation", conversationId);

        const handleReceiveMessage = (message) => {
            if (message.conversationId === conversationId) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [conversationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageData(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSend = () => {
        if (text.trim() === "" && !imageData) return;

        const data = {
            conversationId,
            content: text,
            sender: currentUserId,
            img: imageData,
        };

        socket.emit("sendMessage", data);

        setText("");
        setImageData(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Nếu muốn có header riêng cho chat, để ở đây, còn không thì bỏ qua */}
            {/* <div className="p-4 border-b">
        <h2>Đây là header của khung chat (tuỳ ý)</h2>
      </div> */}

            {/* Khu vực tin nhắn, cho phép cuộn */}
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`mb-2 ${msg.sender === currentUserId ? "text-right" : "text-left"
                            }`}
                    >
                        <div className="inline-block p-2 rounded-lg bg-gray-200">
                            {msg.content && <div>{msg.content}</div>}
                            {msg.img && (
                                <div className="mt-2">
                                    <img
                                        src={msg.img}
                                        alt="Attached"
                                        className="max-w-xs rounded"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            {/* Footer (nhập tin nhắn, đính kèm ảnh) */}
            <div className="p-2 border-t flex flex-col gap-2">
                {imageData && (
                    <div className="flex items-center gap-2">
                        <img
                            src={imageData}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded"
                        />
                        <button
                            onClick={() => setImageData(null)}
                            className="text-red-500 underline"
                        >
                            Xóa ảnh
                        </button>
                    </div>
                )}
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 p-2 rounded border bg-gray-100 border-gray-500"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <button
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        className="p-2 bg-gray-500 text-white rounded"
                    >
                        Chọn ảnh
                    </button>
                    <button
                        onClick={handleSend}
                        className="p-2 bg-blue-500 text-white rounded"
                    >
                        Gửi
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
