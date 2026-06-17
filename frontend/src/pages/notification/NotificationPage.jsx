import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../../components/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";


const NotificationPage = () => {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/notifications", {
          method: "DELETE",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Notifications deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r text-black min-h-screen w-full lg:w-4/5 mx-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <p className="font-bold">Thông báo</p>
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="p-2 md:p-3 cursor-pointer rounded-md hover:bg-gray-200"
            >
              <IoSettingsOutline className="w-5 h-5 md:w-6 md:h-6" />
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-gray-100 rounded-box w-44 md:w-52"
              style={{ right: "0", left: "auto" }}
            >
              <li>
                <a onClick={deleteNotifications}>Xóa tất cả thông báo</a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">Không có thông báo nào</div>
        )}
        {notifications?.map((notification) => (
          <div className="border-b" key={notification._id}>
            <div className="flex gap-2 p-4">

              <Link to={`/profile/${notification.from.username}`}>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        notification.from.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="font-bold">
                    @{notification.from.username}
                  </span>{" "}
                  {notification.type === "follow"
                    ? "đã theo dõi bạn"
                    : "đã thích bài viết của bạn"}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default NotificationPage;
