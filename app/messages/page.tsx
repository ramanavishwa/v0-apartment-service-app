"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, MessageCircle, ArrowLeft } from "lucide-react"
import { getMessages, sendMessage } from "@/lib/storage-utils"
import type { Message } from "@/lib/data-models"

export default function MessagesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      setUser(userData)
      const allMessages = getMessages(userData.id)
      setMessages(allMessages)

      // Build conversation list
      const conversationMap = new Map()
      allMessages.forEach((msg) => {
        const otherId = msg.senderId === userData.id ? msg.receiverId : msg.senderId
        const otherName = msg.senderId === userData.id ? msg.receiverName || "Unknown" : msg.senderName
        if (!conversationMap.has(otherId)) {
          conversationMap.set(otherId, {
            userId: otherId,
            userName: otherName,
            lastMessage: msg.text,
            lastMessageTime: msg.createdAt,
            unread: !msg.read && msg.receiverId === userData.id,
          })
        }
      })
      setConversations(Array.from(conversationMap.values()))
    } else {
      router.push("/login")
    }
    setLoading(false)
  }, [router])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !selectedUserId || !messageText.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      receiverId: selectedUserId,
      issueId: "", // Can be set if replying to an issue
      text: messageText,
      createdAt: new Date().toISOString(),
      read: false,
    }

    sendMessage(newMessage)
    setMessages([...messages, newMessage])
    setMessageText("")

    // Update conversations
    const updated = conversations.map((conv) =>
      conv.userId === selectedUserId
        ? {
            ...conv,
            lastMessage: messageText,
            lastMessageTime: new Date().toISOString(),
          }
        : conv,
    )
    setConversations(updated)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const userMessages = selectedUserId
    ? messages.filter((m) => m.senderId === selectedUserId || m.receiverId === selectedUserId)
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Messages</h1>
        <p className="text-muted-foreground">Direct messaging with community members</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="p-4 overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Conversations</h2>
          {conversations.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No conversations yet</p>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.userId}
                  onClick={() => setSelectedUserId(conv.userId)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedUserId === conv.userId ? "bg-blue-100 border-l-4 border-blue-600" : "hover:bg-gray-100"
                  }`}
                >
                  <p className="font-semibold text-gray-900">{conv.userName}</p>
                  <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(conv.lastMessageTime).toLocaleDateString()}</p>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Messages Area */}
        <div className="md:col-span-2 flex flex-col">
          {selectedUserId ? (
            <>
              <Card className="flex-1 flex flex-col p-4 mb-4 overflow-hidden">
                <div className="flex items-center gap-2 pb-4 border-b">
                  <button onClick={() => setSelectedUserId(null)} className="md:hidden">
                    <ArrowLeft size={20} />
                  </button>
                  <h3 className="font-bold text-gray-900 flex-1">
                    {conversations.find((c) => c.userId === selectedUserId)?.userName}
                  </h3>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 py-4">
                  {userMessages.length === 0 ? (
                    <p className="text-center text-gray-600 py-8">No messages yet. Start a conversation!</p>
                  ) : (
                    userMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.senderId === user.id ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs mt-1 opacity-70">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!messageText.trim()}>
                  <Send size={20} />
                </Button>
              </form>
            </>
          ) : (
            <Card className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle size={48} className="text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">Select a conversation to start messaging</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
