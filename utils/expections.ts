import { addToast } from "@heroui/react";

interface ExceptionAgrs {
  status: number;
  message?: string;
}

export const handleExpection = ({ status, message = "" }: ExceptionAgrs) => {
  //TODO add more exception
  switch (status) {
    case 401:
      addToast({
        title: message || "Chưa đăng nhập",
        color: "danger",
      });
      break;

    default:
      addToast({
        title: message || "Vui lòng kiểm tra lại",
        color: "danger",
      });
      break;
  }
};

export const getFullPathFile = (id: string) => {
  return `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/assets/${id}`;
}
