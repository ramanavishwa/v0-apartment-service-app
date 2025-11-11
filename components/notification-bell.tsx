"use client"

import { useState, useEffect } from "react"
import { Bell, X } from "lucide-react"
import { getNotifications, markNotificationAsRead } from "@/lib/storage-utils"

interface NotificationBellProps {
  userId: string
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchNotifications = () => {
      const notifs = getNotifications(userId)
      setNotifications(notifs)
      setUnreadCount(notifs.filter((n) => !n.read).length)
    }

    fetchNotifications()
    const interval = setInterval(fetchNotifications, 1000)
    return () => clearInterval(interval)
  }, [userId])

  const handleMarkAsRead = (notifId: string) => {
    markNotificationAsRead(notifId)
    const updated = notifications.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    setNotifications(updated)
    setUnreadCount(updated.filter((n) => !n.read).length)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? "bg-blue-50" : ""}`}
                  onClick={() => handleMarkAsRead(notif.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className={`text-sm ${!notif.read ? "font-bold" : ""}`}>{notif.message}</p>
                    {!notif.read && <span className="w-2 h-2 bg-blue-600 rounded-full mt-1 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-600">{new Date(notif.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
