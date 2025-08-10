"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TopicContent, TopicContentCMS, TopicContentForm } from "../types";
import { yupResolver } from "@hookform/resolvers/yup";

import FormProvider from "@/components/FormProvider";
import { TopicUpdatePayload } from "@/services/types/topic";
import { topicFormSchema } from "../schema";
import { getTopicId, updateTopic } from "@/services/topic";
import CTextField from "@/components/FormProvider/Fields/CTextField";
import CImageUpload from "@/components/FormProvider/Fields/CImageUpload";
import CRichText from "@/components/FormProvider/Fields/CRichText";
import ButtonConfirm from "@/components/ButtonConfirm";
import { createItemCMS, getItems, updateItemCMS, uploadFile } from "@/services/cms";
import { addToast } from "@heroui/toast";
import { SelectItem, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { COLLECTIONS } from "@/config/cms";
import { LookupContent } from "@/types/lookup";
import { LOOKUP_KEY } from "@/constant/lookupKey";
import CSelector from "@/components/FormProvider/Fields/CSelector";

interface FormTopicEditProps {
  topicId?: string;
  isMyWorkspace?: boolean;
}
const defaultValues: TopicContent = {
  content: "",
  coverImage: undefined,
};

const FormTopicEdit: React.FC<FormTopicEditProps> = ({ topicId, isMyWorkspace }) => {
  const [suggestionLevels, setSuggestionLevels] = useState<LookupContent[]>([]);
  const [topicContentCMS, setTopicContentCMS] = useState<TopicContentCMS | null>(null);

  const methods = useForm<TopicContentForm>({
    resolver: yupResolver(topicFormSchema),
    defaultValues,
  });
  const { handleSubmit } = methods;

  const updateContent = async (id: string, content: string) => {
    const cmsPayload = {
      nodeId: id,
      content: content,
    }
    let res;
    if (topicContentCMS) {
      res = await updateItemCMS(COLLECTIONS.NodeContent, topicContentCMS.id, cmsPayload);
    } else {
      res = await createItemCMS(COLLECTIONS.NodeContent, cmsPayload);
    }
    return res && res.content ? res.content : null;
  }


  useEffect(() => {
    const loadData = async () => {
      if (!topicId) return;
  
      const [topicData, contentRes, lookupRes] = await Promise.all([
        getTopicId(topicId),
        getItems<TopicContentCMS>(COLLECTIONS.NodeContent, {
          filter: { nodeId: { _eq: topicId } },
        }),
        getItems<LookupContent>(COLLECTIONS.Lookup, {
          filter: { type: { _eq: LOOKUP_KEY.SuggestionLevel } },
        }),
      ]);
  
      // Set suggestion levels
      if (lookupRes && lookupRes.length) {
        setSuggestionLevels(lookupRes);
      }
  
      // Set CMS content
      let content = "";
      if (contentRes && contentRes.length) {
        const cmsContent = contentRes[0];
        setTopicContentCMS(cmsContent);
        content = cmsContent.content || "";
      }
  
      // Reset form only once
      if (topicData) {
        methods.reset({
          ...topicData,
          content, // override if needed
        });
      }
    };
  
    loadData();
  }, [topicId]);

  const uploadCoverImage = async (file: File) => {
    const fileId = await uploadFile(file);

    if (fileId) {
      return fileId;
    }
    return null;
  };

  const onSubmit = async (data: TopicContentForm) => {
    let coverImage = data.coverImage instanceof File ? undefined : data.coverImage;
    if (data.coverImage instanceof File) {
      coverImage = await uploadCoverImage(data.coverImage);
    }

    if (!coverImage) {
      addToast({
        title: "Error uploading cover image",
        description: "Failed to upload cover image. Please try again.",
        color: "danger",
      });

    }

    const payload: TopicUpdatePayload = {
      title: data.title,
      description: data.description,
      coverImage: coverImage,
      suggestionLevel: data.suggestionLevel,
      isMyWorkspace: isMyWorkspace
    };

    const res = await updateTopic(topicId as string, payload);

    if (res) {
      let dataContent = data.content;
      if (data.content) {
        dataContent = await updateContent(res.id as string, data.content);
      }

      addToast({
        title: "Topic updated successfully",
        description: "Your topic has been updated successfully.",
        color: "success",
      });
      methods.reset({
        ...res,
        content: dataContent ||  "",
      });
    } else {
      addToast({
        title: "Error updating topic",
        description: "Failed to update the topic. Please try again.",
        color: "danger",
      });
    }
  };
  return (
    <div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col sm:flex-row gap-4 w-full pt-2">
          <div className="flex-1">
            <div className="flex flex-col gap-2">
              <CTextField
                title="Topic Title"
                disabled={Boolean(topicId)}
                isRequired
                label="Title"
                name="title"
                placeholder="Enter your title of topic"
                variant="bordered"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-2">
              <CTextField
                name="description"
                placeholder="Description"
                label="Description"
                variant="bordered"
              />
            </div>
          </div>
        </div>
        <div className="sm:flex-row gap-4 w-full pt-3 mt-4">
            <CSelector name="suggestionLevel" label="Suggestion Level">
              {suggestionLevels.map((suggestionLevel) => {
                return (
                  <SelectItem key={suggestionLevel.value}>
                    {suggestionLevel.label}
                  </SelectItem>
                );
              })}
            </CSelector>
        </div>
        <div className="sm:flex-row gap-4 w-full pt-3 mt-4">
          <CImageUpload name="coverImage" label="Cover Image" />
        </div>
        <div className="sm:flex-row gap-4 w-full pt-3 mt-4">
          <div className="h-[500px]">
            <CRichText name="content" label="Content" />
          </div>
        </div>
       
        <div className="flex gap-2 pt-10 justify-end mt-4">
          <ButtonConfirm
            color="primary"
            previousValidate={async () => {
              const isValid = await methods.trigger();

              console.log("state", methods.formState);

              return isValid;
            }}
            onSave={handleSubmit(onSubmit)}
          />
        </div>
      </FormProvider>
    </div>
  );
};

export default FormTopicEdit;
