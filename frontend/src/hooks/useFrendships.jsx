import { useQuery } from "@tanstack/react-query";

const useFrendships = () => {
  return useQuery({
    queryKey: ["frendships"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/frendships");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });
};

export default useFrendships;
