import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaSearch, FaArrowLeft } from "react-icons/fa";

import LoadingSpinner from "../../components/LoadingSpinner";
import ChatWindow from "../../components/ChatWindow";

import useConversations from "../../hooks/useConversations";
import useFrendships from "../../hooks/useFrendships";

const MessagesPage = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);

  const { data: frendships, isLoading: loadingFriends } = useFrendships();
  const { id: currentUserId } = useParams();

  const {
    data: conversations,
    isLoading: loadingConversations,
    refetch,
  } = useConversations(currentUserId);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSelectFriend = async (friend) => {
    const existConversation = conversations?.find((conv) => {
      if (conv.isGroup) return false;
      const ids = conv.participants.map((p) => p._id);
      return ids.includes(friend._id) && ids.includes(currentUserId);
    });

    if (existConversation) {
      setSelectedConversation(existConversation);
    } else {
      try {
        const response = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participants: [currentUserId, friend._id],
            isGroup: false,
          }),
        });
        const newConversation = await response.json();
        setSelectedConversation(newConversation);
        refetch();
      } catch (error) {
        console.error("Error tạo cuộc trò chuyện", error);
      }
    }
  };


  const handleBack = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden text-black">

      <div
        className={`
          md:w-1/3 border-r border-l flex flex-col
          ${selectedConversation ? "hidden md:block" : "block"}
        `}
      >

        <div className="flex justify-between items-center p-4 border-b shrink-0">
          <p className="font-bold text-lg">Nhắn tin</p>
        </div>


        <div className="flex items-center gap-2 border-b p-2 shrink-0">
          <FaSearch className="text-gray-500 w-6 h-6" />
          <input
            type="text"
            className="w-full p-2 text-lg resize-none border-none focus:outline-none bg-transparent"
            placeholder="Tìm kiếm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>


        <div className="flex-1 overflow-y-auto">
          {(loadingFriends || loadingConversations) && (
            <div className="flex justify-center h-full items-center">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {conversations &&
            conversations
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
              .map((conv) => (
                <div
                  key={conv._id}
                  className="border-b border-gray-300 p-4 hover:bg-gray-200 cursor-pointer"
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={
                        conv.participants.find((p) => p._id !== currentUserId)
                          ?.profileImg || "/avatar-placeholder.png"
                      }
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold">
                        {
                          conv.participants.find((p) => p._id !== currentUserId)
                            ?.fullName || "Unknown"
                        }
                      </span>
                      <span className="text-gray-400 truncate">
                        {conv.lastMessage?.content || ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

          {frendships &&
            frendships.map((friend) => (
              <div
                key={friend._id}
                className="border-b p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelectFriend(friend)}
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={friend.profileImg || "/avatar-placeholder.png"}
                    alt={`${friend.fullName}'s profile`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-base">{friend.fullName}</span>
                    <span className="text-gray-500 truncate">Nhấn để chat</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>



      <div
        className={`
          flex-1 border-r flex flex-col
          ${selectedConversation ? "block" : "hidden md:block"}
        `}
      >

        <div className="md:hidden p-4 border-b flex items-center shrink-0">
          <button onClick={handleBack} className="mr-2">
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold">
            {selectedConversation
              ? selectedConversation.participants.find(
                (p) => p._id !== currentUserId
              )?.fullName
              : "Chat"}
          </span>
        </div>

        {selectedConversation ? (
          <ChatWindow
            conversationId={selectedConversation._id}
            currentUserId={currentUserId}
          />
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">
              Chọn một cuộc trò chuyện để bắt đầu chat
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
