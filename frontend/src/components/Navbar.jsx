import { useState } from "react";
import { Link } from "react-router-dom";
import { IoNotifications } from "react-icons/io5";
import { FaFacebookMessenger, FaUser, FaSearch } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useFrendships from "../hooks/useFrendships";
const Navbar = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const [searchTerm, setSearchTerm] = useState("");
    const { data: searchResults, isLoading: isSearchLoading } = useFrendships(searchTerm);

    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-2.5 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <span className="text-xl font-semibold text-gray-800">Social Community</span>
                </Link>

                <div className="hidden sm:block flex-1 mx-6 max-w-md relative">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm"
                            className="w-full bg-gray-100 text-gray-800 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>


                    {searchTerm.length >= 1 && (
                        <div className="absolute z-50 mt-2 w-full bg-white text-black shadow-lg rounded-md max-h-60 overflow-y-auto">
                            {isSearchLoading ? (
                                <div className="p-4 text-center">Đang tìm...</div>
                            ) : searchResults && searchResults.length > 0 ? (
                                searchResults.map((user) => (

                                    <div
                                        key={user._id}
                                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100"
                                    >
                                        <Link
                                            to={`/profile/${user.username}`}
                                            className="w-10 h-10 rounded-full overflow-hidden"
                                            onClick={() => setSearchTerm("")}
                                        >
                                            <img
                                                src={user.profileImg || "/avatar-placeholder.png"}
                                                alt={user.username}
                                                className="w-full h-full object-cover"
                                            />
                                        </Link>
                                        <Link
                                            to={`/profile/${user.username}`}
                                            className="text-gray-800"
                                            onClick={() => setSearchTerm("")}
                                        >
                                            @{user.username}
                                        </Link>
                                    </div>

                                ))
                            ) : (
                                <div className="p-4 text-center">Không tìm thấy người dùng</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-4 text-black">
                    <Link to={`/messages/${authUser?._id}`} className="hover:text-gray-800">
                        <FaFacebookMessenger size={20} />
                    </Link>
                    <Link to="/notifications" className="hover:text-gray-800">
                        <IoNotifications size={22} />
                    </Link>
                    <Link to={`/profile/${authUser?.username}`} className="hover:text-gray-800">
                        <FaUser size={20} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
