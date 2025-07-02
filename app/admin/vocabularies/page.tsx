"use client";
import {
  addToast,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
} from "@heroui/react";
import { Key, Selection } from "@react-types/shared";
import React from "react";
import { useEffect, useState } from "react";

import CAudioUpload from "@/components/CAudioUpload";
import CTable from "@/components/CTable";
import BaseForm from "@/components/form/BaseForm";
import {
  VocabColumn,
  VocabData,
  VocabListResponse,
  VocabPayload,
  VocabSearchPayload,
  VocabSort,
} from "@/services/types/vocab";
import {
  searchListVocab,
  createVocab,
  deleteVocab,
  updateVocab,
} from "@/services/vocab";
import CImageUpload from "@/components/CImageUpload";
import { uploadFile } from "@/services/cms";
import { getFullPathFile } from "@/utils/expections";
import { CModal } from "@/components/CModal";

const vocabColumns = [
  { uid: "word", name: "Word", sortable: true },
  { uid: "meaning", name: "Meaning", sortable: false },
  { uid: "example", name: "Example", sortable: false },
  { uid: "actions", name: "Actions", sortable: false },
];

const nodes = [{ value: "cmcgnmgey0001ka8hzzzmyk50", label: "HTML" }];

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

const VocabularyListPage = () => {
  const [hydrated, setHydrated] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<Key>());
  const [vocabsList, setVocabsList] = useState<VocabListResponse>();
  const [vocabPayload, setVocabPayload] = useState<VocabSearchPayload>({
    page: 1,
    size: 10,
    sort: [
      {
        field: VocabColumn.created_at,
        order: "desc",
      } as VocabSort,
    ],
  });
  const [activeModal, setActiveModal] = useState<{
    type: 'create' | 'edit' | 'delete' | 'view';
    vocab?: VocabData;
    isOpen: boolean;
  }>({ type: 'view', isOpen: false });
  const [formState, setFormState] = useState<VocabPayload>({
    word: "",
    meaning: "",
    example: "",
    nodeId: "",
    is_know: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchListVocabs = async () => {
    const res = await searchListVocab(vocabPayload);

    if (res && typeof res === "object" && "content" in res) {
      setVocabsList(res as VocabListResponse);
    } else {
      setVocabsList(undefined);
    }
  };

  const getEmptyVocabData = (): VocabData => ({
    id: "",
    nodeId: "",
    word: "",
    meaning: "",
    example: "",
    imageUrl: "",
    audioUrl: "",
    is_know: false,
    is_deleted: false,
    created_at: "",
    updated_at: "",
  });

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    fetchListVocabs();
  }, [vocabPayload]);

  const renderCell = (item: VocabData, key: string) => {
    if (key === "actions") {
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
                  setActiveModal({
                    type: "view",
                    vocab: item,
                    isOpen: true
                  });
                }}
              >
                View
              </DropdownItem>
              <DropdownItem
                key="edit"
                onClick={async () => {
                  setActiveModal({
                    type: "edit",
                    vocab: item,
                    isOpen: true
                  });
                  setFormState({
                    audioUrl: item.audioUrl,
                    example: item.example,
                    imageUrl: item.imageUrl,
                    word: item.word,
                    meaning: item.meaning,
                    nodeId: item.nodeId,
                  });
                }}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                key="delete"
                onClick={() => setActiveModal({ type: "delete", vocab: item, isOpen: true })}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    }

    const value = item[key as keyof VocabData];

    return value === "" || value === undefined || value === null ? "--" : value;
  };
  const fields = [
    {
      id: "word",
      label: "Word",
      type: "text" as const,
      value: formState.word ?? "",
      onChange: (val: any) => setFormState((prev) => ({ ...prev, word: val })),
      required: true,
    },
    {
      id: "meaning",
      label: "Meaning",
      type: "text" as const,
      value: formState.meaning ?? "",
      onChange: (val: any) =>
        setFormState((prev) => ({ ...prev, meaning: val })),
      required: true,
    },
    {
      id: "example",
      label: "Example",
      type: "text" as const,
      value: formState.example ?? "",
      onChange: (val: any) =>
        setFormState((prev) => ({ ...prev, example: val })),
      required: true,
    },
    {
      id: "nodeId",
      label: "Node",
      type: "select" as const,
      value: formState.nodeId ?? "",
      onChange: (val: any) =>
        setFormState((prev) => ({ ...prev, nodeId: val })),
      options: nodes,
      required: true,
    },
  ];

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
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
    let res:VocabData;
    let imageUrl = "";
    let audioUrl = "";
    setIsSubmitting(true);
    try{
      if(activeModal.type === "delete") {
        if (!activeModal.vocab?.id) {
            addToast({
              title: "Error",
              description: `Vocabulary ID is missing!`,
              color: "danger",
            });
            return;
          }
        const isDelete = await deleteVocab(activeModal.vocab?.id);
        if(isDelete) {
          addToast({
              title: "Notification",
              description: `Deleted "${activeModal.vocab.word}" success!`,
              color: "success",
            });
          fetchListVocabs();
        }
        return;
      }
      if (imageFile) {
        const res = await uploadFile(imageFile);
        imageUrl = getFullPathFile(res);
      }

      if (audioFile) {
        const res = await uploadFile(audioFile);
        audioUrl = getFullPathFile(res);
      }
      const vocabPayload: VocabPayload = {
        ...formState,
        imageUrl,
        audioUrl,
      };
      switch(activeModal.type){
        case "create":
          res = await createVocab(vocabPayload);
          if (res) {
            addToast({
              title: "Notification",
              description: `Created "${vocabPayload.word}" success!`,
              color: "success",
            });
            fetchListVocabs();
          }
       
          break;
        case "edit":
          if (!activeModal.vocab?.id) {
            addToast({
              title: "Error",
              description: `Vocabulary ID is missing!`,
              color: "danger",
            });
            break;
          }
          res = await updateVocab(activeModal.vocab.id, vocabPayload);
          if (res) {
            addToast({
              title: "Notification",
              description: `Updated "${vocabPayload.word}" success!`,
              color: "success",
            });
            fetchListVocabs();
          }
          break;
      }
    }catch(e){
      addToast({
        title: "Error",
        description: `Something wrong! Could you please try again!`,
        color: "danger",
      });
    }
    finally{
      setIsSubmitting(false);
      handleClose();
    }
  }
  const handleClose = () => {
    setActiveModal({ type: 'view', vocab: getEmptyVocabData(), isOpen: false });
    setFormState({
      word: "",
      meaning: "",
      example: "",
      nodeId: "",
      audioUrl: "",
      imageUrl: "",
      is_know: false,
    });
  };
  if (!hydrated) return null;

  return (
    <div className="min-h-screen dark:bg-black-10 text-foreground p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vocabulary List</h1>
        <Button
          className="bg-gradient-to-r from-indigo-900 via-purple-900 to-gray-900 text-white"
          onClick={() =>
            setActiveModal({ type: "create", isOpen: true })
          }
        >
          + Add New Vocabulary
        </Button>
      </div>

      <CTable<VocabData>
        bottomContent={bottomContent}
        columns={vocabColumns}
        data={vocabsList?.content ?? []}
        renderCell={renderCell}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
      <CModal
        isOpen={activeModal.isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        type={activeModal.type}
        isSubmitting={isSubmitting}
        moduleTitle="Vocabulary"
      >
        {activeModal.type !== 'delete' ? (
          <div className="flex gap-6 mt-4">
          <div className="flex flex-col gap-4 w-1/2">
            <CImageUpload
              initialUrl={activeModal.vocab?.imageUrl}
              onSelect={(file) => setImageFile(file)}
            />
            <CAudioUpload onSelect={(file) => setAudioFile(file)} />
          </div>
          <div className="w-1/2">
            <BaseForm
              fields={fields}
              onSubmit={() => {}}
              isFooter={false}
            />
          </div>
        </div>
        ) : (
          <p>Are you sure you want to delete "<strong><i>{activeModal.vocab?.word}</i></strong>"</p>
        )}
      </CModal>
    </div>
  );
};

export default VocabularyListPage;
