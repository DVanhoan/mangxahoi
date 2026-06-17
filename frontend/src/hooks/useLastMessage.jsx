import { useMutation } from "@tanstack/react-query";

const useLastMessage = () => {
  const { mutate: useLastMessage } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/conversations/lastMessage");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  return { useLastMessage };
};

export default useLastMessage;
