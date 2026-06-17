import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import conversationRoutes from "./routes/conversation.route.js";
import notificationRoutes from "./routes/notification.route.js";
import messageRoutes from "./routes/message.route.js";

import connectMongoDB from "./db/connectMongoDB.js";
import Message from "./models/message.model.js";
import Notification from "./models/notification.model.js";
import Conversation from "./models/conversation.model.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);


  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });


  socket.on("sendMessage", async (data) => {
    try {
      if (data.img) {
        const uploadedResponse = await cloudinary.uploader.upload(data.img);
        data.img = uploadedResponse.secure_url;
      }

      const message = new Message({
        conversationId: data.conversationId,
        content: data.content,
        sender: data.sender,
        sentAt: new Date(),
        img: data.img || null,
      });
      await message.save();


      const conversation = await Conversation.findById(data.conversationId).lean();
      if (conversation) {
        for (const participant of conversation.participants) {
          if (participant.toString() === data.sender) continue;
          await Notification.create({
            from: data.sender,
            to: participant,
            type: "message",
            read: false,
            messageId: message._id,
          });
        }
      }

      io.to(data.conversationId).emit("receiveMessage", message);
      console.log("Message sent in conversation", data.conversationId);
    } catch (error) {
      console.error("Error in sendMessage socket event:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
