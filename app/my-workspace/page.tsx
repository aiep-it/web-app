'use client';

import { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
} from '@heroui/react';

import { Icon } from '@iconify/react';
import { CustomButton } from '@/shared/components';
import { LoadingSpinner } from '@/shared/components/spinner/CustomSpinner';
import {
  Workspace,
  WorkspaceCreateTopicPayload,
} from '@/services/types/workspace';
import { createTopicWorkspace, getMyWorkspace } from '@/services/wordspace';
import toast from 'react-hot-toast';
import { TopicCard } from '@/components/vocabulary/TopicCard';
import { OverallProgress } from '@/components/vocabulary/OverallProgress';
import { ReportPage } from '@/services/types/report';

export default function MyWorkspacePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [description, setDescription] = useState('');
  const [myWorkspace, setMyWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  const handleClose = () => {
    setIsModalOpen(false);
    setFolderName('');
    setDescription('');
  };

  const handleCreateTopic = async () => {
    if (!folderName.trim()) {
      toast.error('Folder name is required');
      return;
    }

    setIsCreatingTopic(true);
    try {
      const payload: WorkspaceCreateTopicPayload = {
        title: folderName,
        description: description,
      };

      const res = await createTopicWorkspace(payload);

      if (res) {
        // Optionally, you can add a success message or redirect
        toast.success('Folder created successfully!');
        setIsModalOpen(false);
        // Reload workspace data after creating topic
        loadWorkspace();
      }
    } catch (error) {
      toast.error('Failed to create folder');
    } finally {
      setIsCreatingTopic(false);
      setFolderName('');
      setDescription('');
    }
  };

  const loadWorkspace = async () => {
    setIsLoading(true);
    try {
      const workspace = await getMyWorkspace();
      if (workspace) {
        setMyWorkspace(workspace);
      }
    } catch (error) {
      toast.error('Failed to load workspace');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, []);

  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">My Workspace</h1>
        <p className="text-gray-600 mb-6">
          Manage your vocabulary and learning resources here.
        </p>

        {/* New Folder Button using CustomButton */}
        <CustomButton
          preset="primary"
          icon="lucide:folder-plus"
          iconSize={20}
          onPress={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-sm"
        >
          New Topic
        </CustomButton>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        placement="center"
        className="max-w-md"
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-3 pb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon icon="lucide:folder" width={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Create New Folder</h3>
              <p className="text-sm text-gray-500">
                Add a new folder to organize your resources
              </p>
            </div>
          </ModalHeader>

          <ModalBody className="py-4">
            <div className="space-y-4">
              {/* Folder Name Input */}
              <div>
                <Input
                  placeholder="Enter folder name"
                  label="Folder Name"
                  value={folderName}
                  onValueChange={setFolderName}
                  variant="bordered"
                  size="md"
                  className="w-full"
                />
              </div>

              {/* Description Input */}
              <div>
                <Textarea
                  placeholder="Enter folder description (optional)"
                  label="Description"
                  value={description}
                  onValueChange={setDescription}
                  variant="bordered"
                  size="md"
                  minRows={3}
                  className="w-full"
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="pt-4">
            <CustomButton preset="ghost" onPress={handleClose} disabled={isCreatingTopic}>
              Cancel
            </CustomButton>
            <CustomButton
              preset="primary"
              icon={isCreatingTopic ? undefined : "lucide:folder-plus"}
              iconSize={16}
              onPress={handleCreateTopic}
              disabled={isCreatingTopic}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-sm"
            >
              {isCreatingTopic ? (
                <>
                  <LoadingSpinner.Button />
                  Creating...
                </>
              ) : (
                'Create Folder'
              )}
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Main Content */}
      <div className="w-full px-6 pb-8">
        <div className="space-y-6">
          {/* Header Section */}
          <OverallProgress page={ReportPage.WORK_SPACE} />
          <div className="mb-6 text-center mt-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your Topics
            </h2>
            <p className="text-gray-600">Select topic and start learning.</p>
          </div>

          <div className="space-y-8">
            {isLoading ? (
              <LoadingSpinner.Page 
                label="Loading your workspace..."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myWorkspace?.topics?.length ? (
                  myWorkspace?.topics?.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} isWorkspace={true} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Icon
                      icon="material-symbols:quiz-outline"
                      className="text-gray-300 text-6xl mb-4 mx-auto"
                    />
                    <p className="text-gray-500">
                      No topics available in this category
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
