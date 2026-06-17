// useFrendships.js
import { useQuery } from "@tanstack/react-query";

const useFrendships = (username) => {
    return useQuery({
        queryKey: ["searchUser", username],
        queryFn: async () => {
            try {
                const res = await fetch("/api/users/search/" + username);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Something went wrong");
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        enabled: username.length >= 1,
    });
};

export default useFrendships;
