'use client';
import {
  addToast,
  Avatar,
  Badge,
  Button,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Spinner,
  Tooltip,
  useDisclosure,
  User,
} from '@heroui/react';
import { Key, Selection } from '@react-types/shared';
import React from 'react';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useAuth } from '@clerk/nextjs';
import { useUserRole } from '@/hooks/useUserRole';
import CAudioUpload from '@/components/CAudioUpload';
import CTable from '@/components/CTable';
import BaseForm from '@/components/form/BaseForm';
import {
  VocabColumn,
  VocabData,
  VocabListResponse,
  VocabPayload,
  VocabSearchPayload,
  VocabSort,
} from '@/services/types/vocab';
import {
  fetchVocabsByTopicId,
  searchListVocab,
  createVocab,
  deleteVocab,
  updateVocab,
  aiGenerate,
  bulkVocabs,
  genImageFromText,
} from '@/services/vocab';
import CImageUpload from '@/components/CImageUpload';
import { uploadFile } from '@/services/cms';
import { CModal } from '@/components/CModal';
import { TopicData } from '@/services/types/topic';
import { get } from 'http';
import AudioPlayButton from '@/components/AudioPlayButton';
import { getCmsAssetUrl } from '@/utils';
import { set } from 'react-hook-form';

interface VocabularyListPageProps {
  topic?: TopicData;
}
const vocabColumns = [
  { uid: 'word', name: 'Word', sortable: true },
  { uid: 'meaning', name: 'Meaning', sortable: false },
  { uid: 'example', name: 'Example', sortable: false },
  { uid: 'image', name: 'Image', sortable: false },
  { uid: 'audio', name: 'Audio', sortable: false },

  { uid: 'actions', name: 'Actions', sortable: false },
];

const vocabColumnAIs = [
  { uid: 'word', name: 'Word', sortable: true },
  { uid: 'meaning', name: 'Meaning', sortable: false },
  { uid: 'example', name: 'Example', sortable: false },
  { uid: 'image', name: 'Image', sortable: false },
  { uid: 'audio', name: 'Audio', sortable: false },
];

export const VerticalDotsIcon = ({ size = 24, ...props }) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      role="presentation"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  );
};

const VocabularyListPage: React.FC<VocabularyListPageProps> = ({ topic }) => {
  const [hydrated, setHydrated] = useState(false);
  const { getToken, isLoaded } = useAuth();
  const { userRole, isSignedIn, isRoleLoading } = useUserRole();
  useEffect(() => setHydrated(true), []);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<Key>());
  const [vocabsList, setVocabsList] = useState<VocabListResponse>();
  const [vocabPayload, setVocabPayload] = useState<VocabSearchPayload>({
    page: 1,
    size: 10,
    sort: [
      {
        field: VocabColumn.created_at,
        order: 'desc',
      } as VocabSort,
    ],
  });
  const [activeModal, setActiveModal] = useState<{
    type: 'create' | 'edit' | 'delete' | 'view';
    vocab?: VocabData;
    isOpen: boolean;
  }>({ type: 'view', isOpen: false });
  const [formState, setFormState] = useState<VocabPayload>({
    word: '',
    meaning: '',
    example: '',
    topicId: '',
    is_know: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileToChange, setImageFileToChange] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLoading, setLoading] = useState(false);

  // for AI generation preview
  const [aiVocabs, setAiVocabs] = useState<VocabData[] | undefined>(undefined);
  const [selectedKeysAI, setSelectedKeysAI] = useState<Selection>(
    new Set<Key>(),
  );

  const [selectedVocabUploadImage, setSelectedVocabUploadImage] =
    useState<VocabData | null>(null);

  const vocabColumnsAI = [...vocabColumns];

  const [loadingImageIds, setLoadingImageIds] = useState<Set<number>>(
    new Set(),
  );

  const handleImageAI = async (vocab: VocabData) => {
    if (vocab._index !== undefined) {
      console.log('Generating image for vocab index:', vocab._index);
      setLoadingImageIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(vocab._index!);
        return newSet;
      });
    }
    try {
      const res = await genImageFromText(vocab.example || vocab.word);
      if (res && res.directusFileId) {
        setAiVocabs((prev) => {
          if (!prev) return prev;
          const newVocabs = prev.map((v) =>
            v._index === vocab._index
              ? { ...v, imageUrl: getCmsAssetUrl(res.directusFileId) }
              : v,
          );
          return newVocabs;
        });
      }
    } catch (e) {
      addToast({
        title: 'Error',
        description: `Failed to generate image! Please try again!`,
        color: 'danger',
      });
    } finally {
      setLoadingImageIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(vocab._index || 0);
        return newSet;
      });
    }
  };

  const fetchListVocabs = async () => {
    try {
      setLoading(true);
      // Get token from Clerk before making API call
      const token = await getToken();

      if (!token) {
        addToast({
          title: 'Authentication Error',
          description: 'Please log in to view vocabularies',
          color: 'danger',
        });
        return;
      }

      const res = topic?.id
        ? await fetchVocabsByTopicId(topic.id, vocabPayload)
        : await searchListVocab(vocabPayload);
      if (res && typeof res === 'object' && 'content' in res) {
        setVocabsList(res as VocabListResponse);
      } else {
        setVocabsList(undefined);
      }
    } catch (e) {
      addToast({
        title: 'Error',
        description: `Something wrong! Could you please try again!`,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const {
    isOpen: isOpenPreviewAI,
    onOpen: setOpenPreviewAI,
    onOpenChange: onAIOpenChange,
  } = useDisclosure();

  const {
    isOpen: openUploadImage,
    onOpen: setOpenUploadImage,
    onOpenChange: onUploadImageChange,
  } = useDisclosure();

  const getEmptyVocabData = (): VocabData => ({
    id: '',
    topicId: '',
    word: '',
    meaning: '',
    example: '',
    imageUrl: '',
    audioUrl: '',
    is_know: false,
    is_deleted: false,
    created_at: '',
    updated_at: '',
  });

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (
      isLoaded &&
      isSignedIn
    ) {
      fetchListVocabs();
    } else {
    }
  }, [vocabPayload, isLoaded, isSignedIn, isRoleLoading, userRole]);
  const checkMedia = async (mediaUrl: string) => {
    if (!mediaUrl) return;

    try {
      const response = await fetch(mediaUrl, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  const renderCell = (item: VocabData, key: string) => {
    if (key === 'actions') {
      return (
        <div className="relative flex justify-end items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <VerticalDotsIcon className="text-default-300" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key="view"
                onClick={async () => {
                  const imageUrl = !(await checkMedia(item.imageUrl))
                    ? ''
                    : item.imageUrl;
                  setActiveModal({
                    type: 'view',
                    vocab: { ...item, imageUrl: imageUrl },
                    isOpen: true,
                  });
                }}
              >
                View
              </DropdownItem>
              <DropdownItem
                key="edit"
                onClick={async () => {
                  setAudio(item.audioUrl ? new Audio(item.audioUrl) : null);
                  setActiveModal({
                    type: 'edit',
                    vocab: item,
                    isOpen: true,
                  });
                  setFormState({
                    audioUrl: item.audioUrl,
                    example: item.example,
                    imageUrl: item.imageUrl,
                    word: item.word,
                    meaning: item.meaning,
                    topicId: item.topicId,
                  });
                }}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                key="delete"
                onClick={() =>
                  setActiveModal({ type: 'delete', vocab: item, isOpen: true })
                }
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    }

    if (key === 'image') {
      const isLoading =
        item._index !== undefined && loadingImageIds.has(item._index);

      if (isLoading) {
        return (
          <Spinner
            classNames={{ label: 'text-foreground mt-4' }}
            variant="wave"
          />
        );
      }

      return (
        <div className="flex w-full items-center justify-center'">
          {item.imageUrl ? (
            <Badge
              color="danger"
              content={<Icon icon="lucide:x" />}
              size="sm"
              className="cursor-pointer"
              onClick={() => {
                setAiVocabs((prev) => {
                  if (!prev) return prev;
                  const newVocabs = prev.map((v) =>
                    v._index === item._index ? { ...v, imageUrl: '' } : v,
                  );
                  return newVocabs;
                });
              }}
            >
              {/* <Image
                alt="HeroUI hero Image"
                src={
                  item.imageUrl.startsWith('https')
                    ? item.imageUrl
                    : getCmsAssetUrl(item.imageUrl)
                }
                className="w-full h-16 object-cover rounded-lg shadow-sm border border-gray-200"
              /> */}
              <img
                src={
                  item.imageUrl.startsWith('https')
                    ? item.imageUrl
                    : getCmsAssetUrl(item.imageUrl)
                }
                alt={item.word}
                className="w-full h-16 object-cover rounded-lg shadow-sm"
              />
            </Badge>
          ) : (
            <div className="flex items-center justify-center">
              {/* <Tooltip content="Upload">
                <Button
                  isIconOnly
                  startContent={<Icon icon="lucide:upload" />}
                  size="sm"
                  onPress={() => {
                    setOpenUploadImage();
                    setSelectedVocabUploadImage(item);
                  }}
                  variant="light"
                />
              </Tooltip> */}
              <Tooltip content="AI Generate">
                <Button
                  isIconOnly
                  startContent={<Icon icon="lucide:bot" />}
                  size="sm"
                  variant="light"
                  onPress={() => handleImageAI(item)}
                />
              </Tooltip>
            </div>
          )}
        </div>
      );
    }

    if (key === 'audio') {
      const audioSrc = item.audioUrl?.startsWith('https')
        ? item.audioUrl
        : getCmsAssetUrl(item.audioUrl);
      return (
        <div className="flex">
          {item.audioUrl ? (
            <AudioPlayButton src={audioSrc} />
          ) : (
            <span className="text-default-400">No Audio</span>
          )}
        </div>
      );
    }

    const value = item[key as keyof VocabData];

    return value === '' || value === undefined || value === null ? '--' : value;
  };
  const fields = [
    {
      id: 'word',
      label: 'Word',
      type: 'text' as const,
      value: formState.word ?? '',
      onChange: (val: any) => setFormState((prev) => ({ ...prev, word: val })),
      required: true,
    },
    {
      id: 'meaning',
      label: 'Meaning',
      type: 'text' as const,
      value: formState.meaning ?? '',
      onChange: (val: any) =>
        setFormState((prev) => ({ ...prev, meaning: val })),
      required: true,
    },
    {
      id: 'example',
      label: 'Example',
      type: 'text' as const,
      value: formState.example ?? '',
      onChange: (val: any) =>
        setFormState((prev) => ({ ...prev, example: val })),
      required: true,
    },
    {
      id: 'topicId',
      label: 'Topic',
      type: 'select' as const,
      value: formState.topicId ?? '',
      onChange: (val: any) =>
        setFormState((prev) => ({ ...prev, topicId: val })),
      options: topic ? [{ label: topic.id, value: topic.id }] : [],
      required: true,
      disabled: !!topic,
    },
  ];

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${vocabsList?.totalElements} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          page={vocabsList?.page ?? 1}
          total={vocabsList?.totalPages ?? 1}
          onChange={(newPage) => {
            setVocabPayload((prev) => ({
              ...prev,
              page: newPage,
            }));
          }}
        />
      </div>
    );
  }, [selectedKeys, vocabsList?.page]);

  const handleSubmit = async () => {
    console.log('Submitting form with state:', formState);
    let res: VocabData;
    let imageUrl = formState.imageUrl || '';
    let audioUrl = formState.audioUrl || '';
    setIsSubmitting(true);
    try {
      if (activeModal.type === 'delete') {
        if (!activeModal.vocab?.id) {
          addToast({
            title: 'Error',
            description: `Vocabulary ID is missing!`,
            color: 'danger',
          });
          return;
        }
        const isDelete = await deleteVocab(activeModal.vocab?.id);
        if (isDelete) {
          addToast({
            title: 'Notification',
            description: `Deleted "${activeModal.vocab.word}" success!`,
            color: 'success',
          });
          fetchListVocabs();
        }
        return;
      }
      if (imageFile) {
        const res = await uploadFile(imageFile);
        imageUrl = getCmsAssetUrl(res);
      }

      if (audioFile) {
        const res = await uploadFile(audioFile);
        audioUrl = getCmsAssetUrl(res);
      }
      const vocabPayload: VocabPayload = {
        ...formState,
        imageUrl,
        audioUrl,
      };
      switch (activeModal.type) {
        case 'create':
          res = await createVocab(vocabPayload);
          if (res) {
            addToast({
              title: 'Notification',
              description: `Created "${vocabPayload.word}" success!`,
              color: 'success',
            });
            fetchListVocabs();
          }

          break;
        case 'edit':
          if (!activeModal.vocab?.id) {
            addToast({
              title: 'Error',
              description: `Vocabulary ID is missing!`,
              color: 'danger',
            });
            break;
          }
          res = await updateVocab(activeModal.vocab.id, vocabPayload);
          if (res) {
            addToast({
              title: 'Notification',
              description: `Updated "${vocabPayload.word}" success!`,
              color: 'success',
            });
            fetchListVocabs();
          }
          break;
      }
    } catch (e) {
      addToast({
        title: 'Error',
        description: `Something wrong! Could you please try again!`,
        color: 'danger',
      });
    } finally {
      setIsSubmitting(false);
      handleClose();
    }
  };
  const handleClose = () => {
    setActiveModal({ type: 'view', vocab: getEmptyVocabData(), isOpen: false });
    setFormState({
      word: '',
      meaning: '',
      example: '',
      topicId: topic?.id || '',
      audioUrl: '',
      imageUrl: '',
      is_know: false,
    });
  };

  const isVideo = (url: string): boolean => {
    return /\.(mp4|webm|ogg)$/i.test(url);
  };

  const handlePlay = () => {
    audio?.play();
  };

  if (!hydrated) return null;

  const handleAIGen = async () => {
    if (topic?.id) {
      setOpenPreviewAI();

      if (aiVocabs && aiVocabs.length > 0) {
        return;
      }

      setLoading(true);
      const res = await aiGenerate(topic.id);

      if (res && res.data) {
        const vocabs = res.data.map((item: any, index: number) => ({
          ...item,
          _index: index,
        })) as VocabData[];

        setAiVocabs(vocabs);
        setOpenPreviewAI();
        addToast({
          title: 'AI Generated',
          description: 'Vocabulary generated successfully!',
          color: 'success',
        });
      }
      setLoading(false);
    }
  };

  const onClearVocabsAI = () => {
    setAiVocabs([]);
    setSelectedKeysAI(new Set<Key>());
  };

  const handleInsertVocabs = async () => {
    let payloadInsert: VocabData[] = [];
    if (selectedKeysAI === 'all') {
      payloadInsert = aiVocabs ? [...aiVocabs] : [];
    } else if (selectedKeysAI.size > 0) {
      payloadInsert =
        aiVocabs?.filter((vocab) => {
          return selectedKeysAI.has(vocab._index?.toString() as Key);
        }) ?? [];
    }

    if (payloadInsert.length !== 0) {
      const payload = payloadInsert.map(({ _index, ...rest }) => ({
        ...rest,
        topicId: topic?.id || '',
      }));

      const res = await bulkVocabs(payload);

      if (res) {
        setAiVocabs((prev) =>
          prev?.filter(
            (vocab) => !payloadInsert.some((p) => p._index === vocab._index),
          ),
        );
        addToast({
          title: 'Notification',
          description: `Inserted ${payload.length} vocabularies successfully!`,
          color: 'success',
        });
        fetchListVocabs();
      } else {
        addToast({
          title: 'Error',
          description: `Failed to insert vocabularies!`,
          color: 'danger',
        });
      }
      onAIOpenChange();
    }
  };
  return (
    <div className="min-h-screen dark:bg-black-10 text-foreground p-6">
      {}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vocabulary List</h1>
        <div>
          <Button
            color="primary"
            onPress={() => setActiveModal({ type: 'create', isOpen: true })}
            startContent={<Icon icon="lucide:plus" />}
          >
            Add New Vocabulary
          </Button>

          {topic?.id && (
            <Button
              className="mx-3"
              color="secondary"
              onPress={() => handleAIGen()}
              startContent={<Icon icon="lucide:bot" />}
            >
              AI Generate
            </Button>
          )}
        </div>
      </div>

      <CTable<VocabData>
        key={Array.from(loadingImageIds).join(',')}
        bottomContent={bottomContent}
        columns={vocabColumns}
        data={vocabsList?.content ?? []}
        renderCell={renderCell}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        isLoading={isLoading}
      />
      <CModal
        isOpen={activeModal.isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        type={activeModal.type}
        isSubmitting={isSubmitting}
        moduleTitle="Vocabulary"
      >
        {activeModal.type === 'view' ? (
          <div className="p-4 flex flex-row gap-3">
            {activeModal.vocab?.imageUrl ? (
              <div className="flex flex-col w-1/3 shadow-xl rounded-2xl">
                {isVideo(activeModal.vocab?.imageUrl) ? (
                  <video
                    src={activeModal.vocab?.imageUrl}
                    controls
                    className="w-full h-auto object-cover shadow-xl rounded-2xl"
                  />
                ) : (
                  <img
                    src={activeModal.vocab?.imageUrl}
                    alt={activeModal.vocab?.word}
                    className="w-full h-auto object-cover shadow-xl rounded-2xl"
                  />
                )}
              </div>
            ) : (
              <></>
            )}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row gap-5 items-center">
                <h2 className="text-xl font-bold">{activeModal.vocab?.word}</h2>
                <Icon
                  className="cursor-pointer"
                  icon="lucide:speech"
                  style={{
                    color: `${audio === null ? 'rgb(144 144 144 / 25%)' : 'rgb(144 144 144)'}`,
                  }}
                  width="20"
                  height="20"
                  onClick={handlePlay}
                />
              </div>
              <Divider />
              <div className="flex flex-row justify-between items-center gap-2">
                <div className="flex flex-col">
                  <div className="text-gray-700 flex flex-row items-center gap-1">
                    <Icon icon="lucide:notebook-pen" width="16" height="16" />{' '}
                    Meaning: {activeModal.vocab?.meaning}
                  </div>
                  <div className="text-gray-600 italic flex flex-row items-center gap-1">
                    <Icon icon="lucide:badge-alert" width="16" height="16" />
                    Example: "{activeModal.vocab?.example}"
                  </div>
                </div>
                {activeModal.vocab?.is_know ? (
                  <Chip className="text-xs" size="sm" color="success">
                    Learned
                  </Chip>
                ) : (
                  <Chip className="text-xs" size="sm" color="warning">
                    Learning
                  </Chip>
                )}
              </div>
            </div>
          </div>
        ) : activeModal.type !== 'delete' ? (
          <div className="flex gap-6 mt-4">
            <div className="flex flex-col gap-4 w-1/2">
              <CImageUpload
                initialUrl={activeModal.vocab?.imageUrl}
                onSelect={(file) => setImageFile(file)}
              />
              <CAudioUpload
                currentAudioUrl={activeModal.vocab?.audioUrl}
                onSelect={(file) => setAudioFile(file)}
              />
            </div>
            <div className="w-1/2">
              <BaseForm fields={fields} onSubmit={() => {}} isFooter={false} />
            </div>
          </div>
        ) : (
          <p>
            Are you sure you want to delete "
            <strong>
              <i>{activeModal.vocab?.word}</i>
            </strong>
            "
          </p>
        )}
      </CModal>

      <Modal
        isOpen={isOpenPreviewAI}
        size="5xl"
        onOpenChange={onAIOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                AI Generation Preview
              </ModalHeader>
              <ModalBody>
                <div className="w-full">
                  <CTable<VocabData>
                    key={Array.from(loadingImageIds).join(',')}
                    columns={vocabColumnAIs}
                    data={aiVocabs ?? []}
                    isLoading={isLoading}
                    loadingContent="Loading AI generated vocabularies..."
                    renderCell={renderCell}
                    selectedKeys={selectedKeysAI}
                    onSelectionChange={setSelectedKeysAI}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="warning"
                  variant="light"
                  onPress={() => {
                    onClearVocabsAI();
                    onClose();
                  }}
                >
                  Clear
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleInsertVocabs();
                  }}
                >
                  Add Selected
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={openUploadImage} onOpenChange={onUploadImageChange}>
        <ModalContent>
          {(onCloseModal) => (
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
                <Button color="danger" variant="light" onPress={onCloseModal}>
                  Close
                </Button>
                <Button color="primary" onPress={onCloseModal}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default VocabularyListPage;
