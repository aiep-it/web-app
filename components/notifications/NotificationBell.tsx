// "use client";

// import { useNotifications } from "@/hooks/useNotifications";
// import { useRouter } from "next/navigation";
// import { Icon } from "@iconify/react";
// import { useState } from "react";
// import { Spinner, Badge, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";

// function timeAgo(dateStr: string) {
//   const d = new Date(dateStr).getTime();
//   const diff = Date.now() - d;
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return "vừa xong";
//   if (mins < 60) return `${mins} phút trước`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs} giờ trước`;
//   const days = Math.floor(hrs / 24);
//   return `${days} ngày trước`;
// }

// export default function NotificationBell() {
//   const router = useRouter();
//   const { notifications, unreadCount, isLoading, markAsRead } = useNotifications();
//   const [open, setOpen] = useState(false);

//   const content = (
//     <div className="w-80 max-h-[70vh] overflow-auto">
//       <div className="px-3 py-2 border-b sticky top-0 bg-white z-10">
//         <div className="text-sm font-semibold">Thông báo</div>
//       </div>

//       {isLoading ? (
//         <div className="flex items-center justify-center py-8">
//           <Spinner size="sm" />
//         </div>
//       ) : notifications.length === 0 ? (
//         <div className="py-8 text-center text-sm text-gray-500">Chưa có thông báo</div>
//       ) : (
//         <ul className="divide-y">
//           {notifications.map((n) => (
//             <li
//               key={n.id}
//               className={`px-3 py-3 cursor-pointer hover:bg-gray-50 transition ${
//                 !n.read ? "bg-gray-50/60" : ""
//               }`}
//               onClick={async () => {
//                 if (!n.read) await markAsRead(n.id);
//                 if (n.link) router.push(n.link);
//                 setOpen(false);
//               }}
//             >
//               <div className="flex items-start gap-3">
//                 <div className="mt-1">
//                   <Icon icon="mdi:bell-ring-outline" width={20} height={20} />
//                 </div>
//                 <div className="flex-1">
//                   <div className="text-sm font-medium">{n.title}</div>
//                   <div className="text-xs text-gray-600">{n.message}</div>
//                   <div className="text-[11px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</div>
//                 </div>
//                 {!n.read && <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500" />}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );

//   return (
//     <Popover isOpen={open} onOpenChange={setOpen} placement="bottom-end" offset={8}>
//       <PopoverTrigger>
//         <button
//           className="relative rounded-full p-2 hover:bg-gray-100 transition"
//           aria-label="Notifications"
//         >
//           <Badge content={unreadCount} isInvisible={unreadCount === 0} color="primary" shape="circle">
//             <Icon icon="mdi:bell-outline" width={22} height={22} />
//           </Badge>
//         </button>
//       </PopoverTrigger>
//       <PopoverContent className="p-0 shadow-xl rounded-xl">{content}</PopoverContent>
//     </Popover>
//   );
// }
