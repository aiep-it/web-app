"use client";
import {
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
import { toast } from "react-hot-toast";

import CAudioUpload from "@/components/CAudioUpload";
import CModal from "@/components/CModal";
import CTable from "@/components/CTable";
import BaseForm from "@/components/form/BaseForm";
import {
  VocabCMS,
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
import { createItemCMS, getItem } from "@/services/cms";
import { COLLECTIONS } from "@/config/cms";

const vocabColumns = [
  { uid: "word", name: "Word", sortable: true },
  { uid: "meaning", name: "Meaning", sortable: false },
  { uid: "example", name: "Example", sortable: false },
  { uid: "imageUrl", name: "Image URL", sortable: false },
  { uid: "audioUrl", name: "Audio URL", sortable: false },
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
    type: "edit" | "delete" | "view" | "add" | null;
    vocab?: VocabData;
  }>({ type: null });
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

  const fetchVocabCMS = async (id: string) => {
    const res = await getItem(COLLECTIONS.Vocab, {
      filter: { vocabId: { _eq: id } },
    });

    if (!res || !Array.isArray(res) || res.length === 0) return null;

    return res[0] as VocabCMS;
  };

  const createVocabCMSItem = async (payload: VocabCMS) => {
    const res = await createItemCMS(COLLECTIONS.Vocab, payload);

    console.log(res);
    if (!res || !Array.isArray(res) || res.length === 0) return null;

    return res[0] as VocabCMS;
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
                  const res = await fetchVocabCMS(item.id);

                  setActiveModal({
                    type: "view",
                    vocab: {
                      ...item,
                      imageUrl: `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/assets/${res?.imageId}`,
                    },
                  });
                }}
              >
                View
              </DropdownItem>
              <DropdownItem
                key="edit"
                onClick={async () => {
                  const res = await fetchVocabCMS(item.id);

                  setActiveModal({
                    type: "edit",
                    vocab: {
                      ...item,
                      imageUrl: `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/assets/${res?.imageId}`,
                    },
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
                onClick={() => setActiveModal({ type: "delete", vocab: item })}
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
  const handleSubmitForm = async () => {
    setIsSubmitting(true);
    try {
      let imageUrl = "";
      let audioUrl = "";

      if (imageFile) {
        // process CMS save image
      }

      if (audioFile) {
        // process CMS save audio
      }
      const vocabPayload: VocabPayload = {
        ...formState,
        imageUrl,
        audioUrl,
      };
      const res = await createVocab(vocabPayload);

      if (res) {
        toast.success(`${res.word} added successfully!`);
        setFormState({
          word: "",
          meaning: "",
          example: "",
          nodeId: "",
          is_know: false,
        });
      }
      setActiveModal({ type: null });
      fetchListVocabs();
    } catch (e) {
      toast.error(`Add vocabulary failed!`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEditVocab = async () => {
    setIsSubmitting(true);
    try {
      let imageUrl = "";
      let audioUrl = "";

      if (imageFile) {
        // process CMS save image
      }

      if (audioFile) {
        // process CMS save audio
      }
      const vocabPayload: VocabPayload = {
        ...formState,
        imageUrl,
        audioUrl,
      };

      const id = activeModal.vocab?.id;

      if (!id) {
        toast.error("Vocabulary ID is missing!");
        setIsSubmitting(false);

        return;
      }

      const res = await updateVocab(id, vocabPayload);

      if (res) {
        toast.success(`${res.word} added successfully!`);
        setFormState({
          word: "",
          meaning: "",
          example: "",
          nodeId: "",
          is_know: false,
        });
      }
      setActiveModal({ type: null });
      fetchListVocabs();
    } catch (e) {
      toast.error(`Add vocabulary failed!`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteVocab = async () => {
    try {
      const id = activeModal.vocab?.id;

      if (!id) {
        toast.error("Vocabulary ID is missing!");

        return;
      }
      const res = await deleteVocab(id);

      if (res) {
        toast.success(`Deleted successfully!`);
        fetchListVocabs();
        setActiveModal({ type: null });
      }
    } catch (e) {
      toast.error(`Add vocabulary failed!`);
    }
  };
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

  if (!hydrated) return null;

  return (
    <div className="min-h-screen dark:bg-black-10 text-foreground p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vocabulary List</h1>
        <Button
          className="bg-gradient-to-r from-indigo-900 via-purple-900 to-gray-900 text-white"
          onClick={() =>
            setActiveModal({ type: "add", vocab: getEmptyVocabData() })
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
        footer
        isOpen={activeModal.type === "add"}
        size="3xl"
        title="Create Vocabulary"
        onClose={() => setActiveModal({ type: null })}
      >
        <div className="flex gap-6 mt-4">
          <div className="flex flex-col gap-4 w-1/2">
            <CImageUpload onSelect={(file) => setImageFile(file)} />
            <CAudioUpload onSelect={(file) => setAudioFile(file)} />
          </div>
          <div className="w-1/2">
            <BaseForm
              fields={fields}
              isSubmitting={isSubmitting}
              submitLabel="Save"
              onSubmit={handleSubmitForm}
            />
          </div>
        </div>
      </CModal>
      <CModal
        footer={
          <div className="flex flex-row gap-2">
            <Button onClick={() => setActiveModal({ type: null })}>No</Button>
            <Button color="danger" onClick={handleDeleteVocab}>
              Yes
            </Button>
          </div>
        }
        isOpen={activeModal.type === "delete"}
        size="3xl"
        title="Delete Vocabulary"
        onClose={() => setActiveModal({ type: null })}
      >
        <div className="flex gap-6 mt-4">
          <p>
            Do you want delete <strong>{activeModal.vocab?.word}</strong>?
          </p>
        </div>
      </CModal>
      <CModal
        footer
        isOpen={activeModal.type === "edit"}
        size="3xl"
        title="Edit Vocabulary"
        onClose={() => setActiveModal({ type: null })}
      >
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
              isSubmitting={isSubmitting}
              submitLabel="Save"
              onSubmit={handleEditVocab}
            />
          </div>
        </div>
      </CModal>
    </div>
  );
};

export default VocabularyListPage;
