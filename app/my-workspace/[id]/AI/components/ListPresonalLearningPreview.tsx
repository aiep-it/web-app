import { PersonalLearning } from '@/services/types/workspace';
import { getCmsAssetUrl } from '@/utils';
import {
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
import { get } from 'http';
import React from 'react';
import { PersonalLearningPreview } from './PersonalLearningPreview';

interface ListPresonalLearningPreviewProps {
  // Define any props if needed
  personalLearning: PersonalLearning;
}

const ListPresonalLearningPreview: React.FC<
  ListPresonalLearningPreviewProps
> = ({ personalLearning }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Card
        isPressable
        onPress={onOpen}
        className="border-none bg-content1/50 hover:bg-content1 w-full "
      >
        <div className={'flex'}>
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
                {' '}
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
        size='5xl'
        scrollBehavior='inside'
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Detail</ModalHeader>
              <ModalBody>
                <PersonalLearningPreview
                  personalLearning={personalLearning} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Ok
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ListPresonalLearningPreview;
