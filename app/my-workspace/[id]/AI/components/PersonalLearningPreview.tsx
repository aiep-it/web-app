import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Image,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { PersonalLearning } from '@/services/types/workspace';
import { genImageFromText } from '@/services/vocab';
import { getCmsAssetUrl } from '@/utils';
import CImageUpload from '@/components/CImageUpload';
import { uploadFile } from '@/services/cms';

interface PersonalLearningPreviewProps {
  personalLearning: PersonalLearning;
}

export const PersonalLearningPreview: React.FC<
  PersonalLearningPreviewProps
> = ({ personalLearning }) => {
  const [vocabs, setVocabs] = useState(personalLearning.vocabs || []);
  const [loadingMap, setLoadingMap] = useState<{ [key: string]: boolean }>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedVocabUploadImage, setSelectedVocabUploadImage] =
    useState<any>(null);

  const handleAIGenImg = async (word: string, text: string) => {
    setLoadingMap((prev) => ({ ...prev, [word]: true }));
    try {
      const res = await genImageFromText(text);
      if (res) {
        setVocabs((prevVocabs) =>
          prevVocabs.map((v) =>
            v.word === word
              ? { ...v, imageUrl: getCmsAssetUrl(res.directusFileId) }
              : v,
          ),
        );
      }
    } finally {
      setLoadingMap((prev) => ({ ...prev, [word]: false }));
    }
  };

  const handleUploadImage = async (word: string) => {
    if (!imageFile) return;
    setLoadingMap((prev) => ({ ...prev, [word]: true }));
    try {
      const res = await uploadFile(imageFile);

      if (res) {
        setVocabs((prevVocabs) =>
          prevVocabs.map((v) =>
            v.word === word ? { ...v, imageUrl: getCmsAssetUrl(res) } : v,
          ),
        );
      }
    } finally {
      setLoadingMap((prev) => ({ ...prev, [word]: false }));
      setImageFile(null);
      setSelectedVocabUploadImage(null);
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{personalLearning.title}</h2>
        <p className="text-gray-600">{personalLearning.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vocabs?.map((vocab, index) => (
          <motion.div
            key={vocab.word}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{vocab.word}</h3>
                <div>
                  <Button
                    isIconOnly
                    color="primary"
                    variant="light"
                    aria-label="Play audio"
                    onPress={() => new Audio(vocab.audioUrl).play()}
                  >
                    <Icon icon="lucide:play" className="text-xl" />
                  </Button>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly color="warning" variant="light">
                        <Icon icon="lucide:ellipsis" className="text-xl" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                      <DropdownItem
                        key="upload"
                        startContent={<Icon icon="lucide:upload" />}
                        onPress={() => {
                          setSelectedVocabUploadImage(vocab);
                          onOpen();
                        }}
                      >
                        Upload Image
                      </DropdownItem>
                      <DropdownItem
                        key="copy"
                        startContent={<Icon icon="lucide:bot" />}
                        onClick={() => {
                          handleAIGenImg(
                            vocab.word,
                            vocab.example || vocab.word,
                          );
                        }}
                      >
                        AI Regenenate Image
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </CardHeader>
              <CardBody className="space-y-2">
                {loadingMap[vocab.word] ? (
                  <div className="flex justify-center items-center h-40">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <Image
                    src={vocab.imageUrl}
                    alt={vocab.word}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}
                <p>
                  <strong>Meaning:</strong> {vocab.meaning}
                </p>
                <p>
                  <strong>Example:</strong> {vocab.example}
                </p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Change Image For {selectedVocabUploadImage?.word}
              </ModalHeader>
              <ModalBody>
                <CImageUpload
                  initialUrl={selectedVocabUploadImage?.imageUrl}
                  onSelect={(file) => setImageFile(file)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleUploadImage(selectedVocabUploadImage?.word);
                    onClose();
                  }}
                  isDisabled={!imageFile}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
