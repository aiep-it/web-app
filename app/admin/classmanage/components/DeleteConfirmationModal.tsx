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

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  targetName: string;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  targetName,
  onConfirmDelete,
  isDeleting,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2 text-danger">
              <Icon icon="lucide:alert-triangle" className="text-xl" />
              {title}
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete <span className="font-semibold text-default-800">{targetName}</span>?
              </p>
              {description && (
                <p className="text-sm text-default-500">
                  {description}
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onClose} isDisabled={isDeleting}>
                Cancel
              </Button>
              <Button color="danger" onPress={onConfirmDelete} isLoading={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
