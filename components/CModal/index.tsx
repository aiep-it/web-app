"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@heroui/react";
import React from "react";

interface CModalProps extends Omit<ModalProps, "children"> {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  width?: string; // custom width
  children?: React.ReactNode; // content as children
  footer?: React.ReactNode; // custom footer
}

const CModal = ({
  title,
  isOpen,
  onClose,
  children,
  footer,
  ...otherProps
}: CModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} {...otherProps} size="3xl">
      <ModalContent>
        {(onClose) => (
          <>
            {title && (
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            )}
            <ModalBody className="flex flex-col gap-1">{children}</ModalBody>
            {footer !== null && (
              <ModalFooter>
                {footer ?? (
                  <Button color="primary" onClick={onClose}>
                    Close
                  </Button>
                )}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CModal;
