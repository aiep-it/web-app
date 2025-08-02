import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";

interface CModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  type: 'create' | 'edit' | 'delete' | 'view';
  children: React.ReactNode;
  isSubmitting? :boolean;
  moduleTitle: string
}

export const CModal: React.FC<CModalProps> = ({ isOpen, onClose, onSubmit, type, children, isSubmitting, moduleTitle }) => {
  const modalConfig = {
    create: { title: `Create ${moduleTitle}`, icon: 'lucide:plus-circle', color: 'primary' as const },
    edit: { title: `Edit ${moduleTitle}`, icon: 'lucide:edit', color: 'secondary' as const },
    delete: { title: `Delete ${moduleTitle}`, icon: 'lucide:trash-2', color: 'danger' as const },
    view: { title: `View ${moduleTitle}`, icon: 'lucide:eye', color: 'default' as const },
  };

  const config = modalConfig[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon icon={config.icon} className="text-2xl" />
                <span>{config.title}</span>
              </div>
            </ModalHeader>
            <ModalBody>
              {children}
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onClose}>
                Close
              </Button>
              {type !== 'view' && (
                <Button
                  disabled={isSubmitting}
                  onPress={onSubmit}
                  color={type === 'delete' ? 'danger' : config.color}
                >
                  {isSubmitting ? "Đang xử lý..." :  (type === 'delete' ? 'Delete' : 'Submit')}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};