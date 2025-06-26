import { Button, ButtonProps } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";

interface IProps {
  title?: string;
  message?: string;
  saveButtonText?: string;
  cancelButtonText?: string;
  onSave: () => Promise<void> | void;
  previousValidate?: () => Promise<boolean> | boolean;
}

interface ConfirmModalProps extends IProps, ButtonProps {}
const ButtonConfirm: React.FC<ConfirmModalProps> = ({
  title = "Confirm Save?",
  message = "Are you sure you want to save these changes?",
  saveButtonText = "Save",
  cancelButtonText = "Cancel",
  onSave,
  previousValidate = null,
  ...btnProps
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
      onOpenChange();
    }
  };

  const handleOpenModal = async () => {
    let validated = true;
    if (previousValidate) {
      validated = await previousValidate();
    }
    if (validated) {
      onOpen();
    }
  };

  return (
    <>
      <Button onPress={handleOpenModal} {...btnProps}>
        {saveButtonText}
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                <p>{message}</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isSaving}
                
                >
                  {cancelButtonText}
                </Button>
                <Button onPress={handleSave} isLoading={isSaving}  {...btnProps}>
                  {isSaving ? "Saving..." : saveButtonText}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ButtonConfirm;
