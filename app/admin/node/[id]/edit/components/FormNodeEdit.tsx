"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NodeContent, NodeContentForm } from "../types";
import { yupResolver } from "@hookform/resolvers/yup";

import FormProvider from "@/components/FormProvider";
import { NodeUpdatePayload } from "@/services/types/node";
import { nodeFormSchema } from "../schema";
import { getNodeById, updateNode } from "@/services/node";
import CTextField from "@/components/FormProvider/Fields/CTextField";
import CImageUpload from "@/components/FormProvider/Fields/CImageUpload";
import CRichText from "@/components/FormProvider/Fields/CRichText";
import ButtonConfirm from "@/components/ButtonConfirm";
import { getItems, uploadFile } from "@/services/cms";
import { addToast } from "@heroui/toast";
import { SelectItem, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { COLLECTIONS } from "@/config/cms";
import { LookupContent } from "@/types/lookup";
import { LOOKUP_KEY } from "@/constant/lookupKey";
import CSelector from "@/components/FormProvider/Fields/CSelector";

interface FormNodeEditProps {
  nodeId?: string;
}
const defaultValues: NodeContent = {
  content: "",
  coverImage: undefined,
};

const FormNodeEdit: React.FC<FormNodeEditProps> = ({ nodeId }) => {
  const [suggestionLevels, setSuggestionLevels] = useState<LookupContent[]>([]);

  const methods = useForm<NodeContentForm>({
    resolver: yupResolver(nodeFormSchema),
    defaultValues,
  });
  const { handleSubmit } = methods;

  const fetchNode = async (id: string) => {
    const res = await getNodeById(id);
    if (res) {
      methods.reset({
        ...res,
      });
    }
  };

  const fetchLookup = async () => {
    const res = await getItems<LookupContent>(COLLECTIONS.Lookup, {
      filter: {
        type: {
          _eq: LOOKUP_KEY.SuggestionLevel,
        },
      },
    });
    if (res && res.length) {
      setSuggestionLevels(res);
    }
  };

  const fetchContent = async () => {
    
  }

  useEffect(() => {
    if (nodeId) {
      fetchNode(nodeId);
      fetchLookup();
    }
  }, [nodeId]);

  const uploadCoverImage = async (file: File) => {
    const fileId = await uploadFile(file);

    if (fileId) {
      return fileId;
    }
    return null;
  };

  const onSubmit = async (data: NodeContentForm) => {
    const coverImage = await uploadCoverImage(data.coverImage as File);

    if (!coverImage) {
      addToast({
        title: "Error uploading cover image",
        description: "Failed to upload cover image. Please try again.",
        color: "danger",
      });

      return;
    }

    const payload: NodeUpdatePayload = {
      title: data.title,
      description: data.description,
      coverImage: coverImage,
      suggestionLevel: data.suggestionLevel
    };

    const res = await updateNode(nodeId as string, payload);

    if (res) {
      addToast({
        title: "Node updated successfully",
        description: "Your node has been updated successfully.",
        color: "success",
      });
      methods.reset({
        ...res,
      });
    } else {
      addToast({
        title: "Error updating node",
        description: "Failed to update the node. Please try again.",
        color: "danger",
      });
    }
  };
  return (
    <div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col sm:flex-row gap-4 w-full pt-2">
          <div className="flex-1">
            <CTextField
              title="Node Title"
              disabled={Boolean(nodeId)}
              name="title"
              label="Title"
              isRequired
              placeholder="Enter your title of node"
              labelPlacement="outside"
              endContent={
                <Tooltip
                  content="Title must be update on the node flow"
                  color="warning"
                >
                  <Icon icon="lucide:info" className="text-warning-500" />
                </Tooltip>
              }
            />
          </div>
          <div className="flex-1">
            <CTextField
              name="description"
              placeholder="Description"
              label="Description"
              labelPlacement="outside"
            />
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

export default FormNodeEdit;
