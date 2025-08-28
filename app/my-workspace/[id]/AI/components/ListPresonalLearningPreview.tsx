import {
  PersonalLearning,
  PersonalLearningCreatePayload,
} from '@/services/types/workspace';
import { getCmsAssetUrl } from '@/utils';
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import React, { useRef } from 'react';
import {
  PersonalLearningPreview,
  PersonalLearningPreviewHandle,
} from './PersonalLearningPreview';
import { updatePersonalLearning } from '@/services/personalLearning';

interface ListPresonalLearningPreviewProps {
  personalLearning: PersonalLearning;
  onRefresh?: () => void;
}

const ListPresonalLearningPreview: React.FC<
  ListPresonalLearningPreviewProps
> = ({ personalLearning, onRefresh }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const previewRef = useRef<PersonalLearningPreviewHandle>(null);

  const [showUpdate, setShowUpdate] = React.useState(false);

  const onUpdate = async () => {
    if (
      previewRef.current &&
      personalLearning &&
      personalLearning.id &&
      personalLearning.topicId
    ) {
      const vocabs = previewRef.current.getData();

      const payload: PersonalLearningCreatePayload = {
        ...personalLearning,
        vocabs: vocabs,
        topicId: personalLearning.topicId || '', // Provide a default value if topicId is undefined
      };

      const res = await updatePersonalLearning(payload, personalLearning.id);
      if (res) {
        setShowUpdate(false);
        onOpenChange();
        addToast({
          title: 'Personal Learning updated successfully',
          color: 'success',
        });
        onRefresh && onRefresh();
      }
      return vocabs;
    }
    return [];
  };

  return (
    <>
      <Card
        isPressable
        onPress={onOpen}
        className="border-none bg-content1/50 hover:bg-content1 w-full "
      >
        <div className="flex">
          <CardBody className="p-0">
            <div className="w-full h-full flex items-center justify-center">
              <Image
                isBlurred
                alt="HeroUI Album Cover"
                src={
                  personalLearning.image
                    ? getCmsAssetUrl(personalLearning.image)
                    : 'https://heroui.com/images/album-cover.png'
                }
                className="m-5 w-full h-40 object-cover rounded-lg"
              />
            </div>
          </CardBody>
          <CardFooter className="flex flex-col items-start gap-2 p-3 justify-center">
            <div className="flex flex-col w-full justify-center content-center justify-items-center">
              <h3 className="text-lg font-semibold">
                {personalLearning.title}
              </h3>
              <p className="text-sm text-gray-600">
                {personalLearning.description}
              </p>
              <p className="text-sm mt-2">
                <strong>Words:</strong>{' '}
                {personalLearning?.vocabs?.map((v) => v.word).join(', ')}
              </p>
            </div>
          </CardFooter>
        </div>
      </Card>

      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        size="5xl"
        scrollBehavior="inside"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Detail</ModalHeader>
              <ModalBody>
                <PersonalLearningPreview
                  ref={previewRef}
                  personalLearning={personalLearning}
                  checkUpdate={() => setShowUpdate(true)}
                />
              </ModalBody>
              <ModalFooter className="gap-2">
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {showUpdate && (
                  <Button
                    color="primary"
                    onPress={() => {
                      onUpdate();
                    }}
                  >
                    Update
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ListPresonalLearningPreview;
