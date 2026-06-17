import { useQuery } from "@tanstack/react-query";

const useConversations = (currentUserId) => {
  return useQuery({
    queryKey: ["conversations", currentUserId],
    queryFn: async () => {
      const res = await fetch(`/api/conversations/all?currentUserId=${currentUserId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
  });
};

export default useConversations;
