import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "@heroui/react";
import { Icon } from "@iconify/react";

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;              // parent set isOpen=false
  title: string;
  description?: string;
  targetName: string;
  onConfirmDelete: () => void | Promise<void>;
  isDeleting: boolean;
  /** Nếu true: chặn đóng bằng overlay/Escape khi đang xóa */
  lockWhileDeleting?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  targetName,
  onConfirmDelete,
  isDeleting,
  lockWhileDeleting = true,
}) => {
  // Đóng/mở qua onOpenChange để chắc chắn đồng bộ với parent
  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable={!(lockWhileDeleting && isDeleting)} // chặn overlay/Escape khi xóa
      hideCloseButton={lockWhileDeleting && isDeleting}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex items-center gap-2 text-danger">
            <Icon icon="lucide:alert-triangle" className="text-xl" />
            {title}
          </ModalHeader>

          <ModalBody>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-default-800">{targetName}</span>?
            </p>
            {description && (
              <p className="text-sm text-default-500">{description}</p>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={onClose}
              isDisabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={onConfirmDelete}
              isLoading={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
