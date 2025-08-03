import React from 'react';
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
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { PersonalLearning } from '@/services/types/workspace';

interface PersonalLearningPreviewProps {
  personalLearning: PersonalLearning;
}

export const PersonalLearningPreview: React.FC<
  PersonalLearningPreviewProps
> = ({ personalLearning }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{personalLearning.title}</h2>
        <p className="text-gray-600">{personalLearning.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalLearning?.vocabs?.map((vocab, index) => (
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
                  {/* <Button
                    isIconOnly
                    color="warning"
                    variant="light"
                    aria-label="Play audio"
                    onPress={() => new Audio(vocab.audioUrl).play()}
                  >
                    <Icon icon="lucide:ellipsis" className="text-xl" />
                  </Button> */}
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
                      >
                        Upload Image
                      </DropdownItem>
                      <DropdownItem key="copy" startContent={<Icon icon="lucide:bot" />}>
                        AI Regenenate Image
                      </DropdownItem>
              
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </CardHeader>
              <CardBody className="space-y-2">
                <Image
                  src={vocab.imageUrl}
                  alt={vocab.word}
                  className="w-full h-40 object-cover rounded-lg"
                />
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
    </div>
  );
};
